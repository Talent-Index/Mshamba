module 0x0::farm_advanced {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance::{Self, Balance};
    use sui::object::{UID};
    use sui::transfer;
    use sui::tx_context::{TxContext};
    use sui::table::{Self, Table};
    use sui::clock::{Clock};
    use std::option;

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // The fungible token for a specific farm.
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public struct FARM_TOKEN<phantom T> has store, drop {}

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Vesting schedule for farmer and platform tokens.
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public struct VestingSchedule has store, copy, drop {
        start_time_ms: u64,
        duration_ms: u64,
        total_amount: u64,
        claimed_amount: u64,
    }

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // The main object for a single farm.
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public struct Farm<phantom T> has key {
        id: UID,
        owner: address,
        platform: address,
        treasury_cap: TreasuryCap<FARM_TOKEN<T>>,

        // IFO State
        ifo_active: bool,
        ifo_price_per_token: u64,
        ifo_tokens: Balance<FARM_TOKEN<T>>,

        // Staking & Dividend State
        staked_tokens: Table<address, Balance<FARM_TOKEN<T>>>,
        total_staked_amount: u64,
        rewards_pool: Balance<sui::sui::SUI>,
        reward_per_share: u128,
        claimed_rewards: Table<address, u128>,

        // Vesting State
        farmer_vesting_balance: Balance<FARM_TOKEN<T>>,
        platform_vesting_balance: Balance<FARM_TOKEN<T>>,
        farmer_vesting_schedule: VestingSchedule,
        platform_vesting_schedule: VestingSchedule,
    }

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // Errors
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const E_NOT_FARMER: u64 = 1;
    const E_IFO_NOT_ACTIVE: u64 = 2;
    const E_INSUFFICIENT_FUNDS: u64 = 3;
    const E_NO_TOKENS_TO_STAKE: u64 = 4;
    const E_NO_STAKED_TOKENS: u64 = 5;
    const E_NO_REWARDS_TO_CLAIM: u64 = 6;
    const E_NO_VESTED_TOKENS: u64 = 8;

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    //  Create Farm Function
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public fun create_farm<T: drop>(
        platform_address: address,
        ifo_price: u64,
        vesting_duration_ms: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();

        let (mut treasury_cap, metadata) = coin::create_currency<FARM_TOKEN<T>>(
            FARM_TOKEN<T> {},
            6,
            b"FARM",
            b"Farm Token",
            b"A fungible token representing a share in a farm.",
            option::none(),
            ctx
        );

        let total_supply = 1_000_000_000_000;

        let farmer_amount = (total_supply * 60) / 100;
        let platform_amount = (total_supply * 10) / 100;
        let ifo_amount = (total_supply * 30) / 100;

        let farmer_vesting_balance = coin::into_balance(coin::mint(&mut treasury_cap, farmer_amount, ctx));
        let platform_vesting_balance = coin::into_balance(coin::mint(&mut treasury_cap, platform_amount, ctx));
        let ifo_tokens = coin::into_balance(coin::mint(&mut treasury_cap, ifo_amount, ctx));

        let current_time = clock.timestamp_ms();

        let farm = Farm<T> {
            id: object::new(ctx),
            owner: sender,
            platform: platform_address,
            treasury_cap,
            ifo_active: true,
            ifo_price_per_token: ifo_price,
            ifo_tokens,
            staked_tokens: table::new(ctx),
            total_staked_amount: 0,
            rewards_pool: balance::zero(),
            reward_per_share: 0,
            claimed_rewards: table::new(ctx),
            farmer_vesting_balance,
            platform_vesting_balance,
            farmer_vesting_schedule: VestingSchedule {
                start_time_ms: current_time,
                duration_ms: vesting_duration_ms,
                total_amount: farmer_amount,
                claimed_amount: 0,
            },
            platform_vesting_schedule: VestingSchedule {
                start_time_ms: current_time,
                duration_ms: vesting_duration_ms,
                total_amount: platform_amount,
                claimed_amount: 0,
            },
        };

        transfer::share_object(farm);
        transfer::public_transfer(metadata, sender);
    }

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    //  IFO Functions
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public fun buy_tokens_ifo<T: drop>(
        farm: &mut Farm<T>,
        investment: Coin<sui::sui::SUI>,
        ctx: &mut TxContext
    ) {
        assert!(farm.ifo_active, E_IFO_NOT_ACTIVE);

        let amount_to_buy = coin::value(&investment) / farm.ifo_price_per_token;
        assert!(amount_to_buy > 0, E_INSUFFICIENT_FUNDS);

        let tokens_to_transfer = coin::take(&mut farm.ifo_tokens, amount_to_buy, ctx);

        transfer::public_transfer(tokens_to_transfer, ctx.sender());
        transfer::public_transfer(investment, farm.owner);
    }

    public fun end_ifo<T: drop>(
        farm: &mut Farm<T>,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == farm.owner, E_NOT_FARMER);
        farm.ifo_active = false;

        let amount = balance::value(&farm.ifo_tokens);
        if (amount > 0) {
            let unsold_balance = balance::split(&mut farm.ifo_tokens, amount);
            let unsold_tokens = coin::from_balance(unsold_balance, ctx);
            transfer::public_transfer(unsold_tokens, farm.owner);
        }
    }

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    //  Staking & Dividend Functions
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public fun stake_tokens<T: drop>(
        farm: &mut Farm<T>,
        tokens_to_stake: Coin<FARM_TOKEN<T>>,
        ctx: &mut TxContext
    ) {
        let staker = ctx.sender();
        let amount = coin::value(&tokens_to_stake);
        assert!(amount > 0, E_NO_TOKENS_TO_STAKE);

        update_rewards(farm, staker);

        if (table::contains(&farm.staked_tokens, staker)) {
            let staked_balance = table::borrow_mut(&mut farm.staked_tokens, staker);
            balance::join(staked_balance, coin::into_balance(tokens_to_stake));
        } else {
            table::add(&mut farm.staked_tokens, staker, coin::into_balance(tokens_to_stake));
        };

        farm.total_staked_amount = farm.total_staked_amount + amount;
    }

    public fun unstake_tokens<T: drop>(
        farm: &mut Farm<T>,
        amount_to_unstake: u64,
        ctx: &mut TxContext
    ) {
        let staker = ctx.sender();
        assert!(table::contains(&farm.staked_tokens, staker), E_NO_STAKED_TOKENS);

        update_rewards(farm, staker);

        let staked_balance = table::borrow_mut(&mut farm.staked_tokens, staker);
        assert!(balance::value(staked_balance) >= amount_to_unstake, E_INSUFFICIENT_FUNDS);

        let unstaked_tokens = coin::take(staked_balance, amount_to_unstake, ctx);
        transfer::public_transfer(unstaked_tokens, staker);

        farm.total_staked_amount = farm.total_staked_amount - amount_to_unstake;
    }

    public fun distribute_profit<T: drop>(
        farm: &mut Farm<T>,
        profit: Coin<sui::sui::SUI>,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == farm.owner, E_NOT_FARMER);

        let profit_value = coin::value(&profit);
        let investor_share = (profit_value * 30) / 100;
        let platform_share = (profit_value * 10) / 100;

        let investor_profit = coin::split(&mut profit, investor_share, ctx);
        balance::join(&mut farm.rewards_pool, coin::into_balance(investor_profit));

        let platform_profit = coin::split(&mut profit, platform_share, ctx);
        transfer::public_transfer(platform_profit, farm.platform);
        transfer::public_transfer(profit, farm.owner);

        if (farm.total_staked_amount > 0) {
            farm.reward_per_share = farm.reward_per_share + ((investor_share as u128 * 1_000_000_000) / (farm.total_staked_amount as u128));
        }
    }

    public fun claim_reward<T: drop>(
        farm: &mut Farm<T>,
        ctx: &mut TxContext
    ) {
        let staker = ctx.sender();
        update_rewards(farm, staker);

        let claimable_reward = *table::borrow_mut(&mut farm.claimed_rewards, staker);
        assert!(claimable_reward > 0, E_NO_REWARDS_TO_CLAIM);

        let reward_coin = coin::take(&mut farm.rewards_pool, (claimable_reward as u64), ctx);
        transfer::public_transfer(reward_coin, staker);

        *table::borrow_mut(&mut farm.claimed_rewards, staker) = 0;
    }

    fun update_rewards<T: drop>(farm: &mut Farm<T>, staker: address) {
        if (table::contains(&farm.staked_tokens, staker)) {
            let staked_amount = balance::value(table::borrow(&farm.staked_tokens, staker));
            let last_claimed_reward = if (table::contains(&farm.claimed_rewards, staker)) {
                *table::borrow(&farm.claimed_rewards, staker)
            } else {
                0
            };

            let new_reward = (staked_amount as u128 * farm.reward_per_share) / 1_000_000_000;
            let claimable = new_reward - last_claimed_reward;

            if (table::contains(&mut farm.claimed_rewards, staker)) {
                let current_claim = table::borrow_mut(&mut farm.claimed_rewards, staker);
                *current_claim = *current_claim + claimable;
            } else {
                table::add(&mut farm.claimed_rewards, staker, claimable);
            }
        }
    }

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    //  Vesting Functions
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public fun claim_vested_tokens<T: drop>(
        farm: &mut Farm<T>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let (vesting_schedule, vesting_balance) = if (sender == farm.owner) {
            (&mut farm.farmer_vesting_schedule, &mut farm.farmer_vesting_balance)
        } else if (sender == farm.platform) {
            (&mut farm.platform_vesting_schedule, &mut farm.platform_vesting_balance)
        } else {
            abort(E_NOT_FARMER)
        };

        let vested_amount = calculate_vested_amount(vesting_schedule, clock.timestamp_ms());
        let claimable_amount = vested_amount - vesting_schedule.claimed_amount;

        assert!(claimable_amount > 0, E_NO_VESTED_TOKENS);

        let vested_tokens = coin::take(vesting_balance, claimable_amount, ctx);
        transfer::public_transfer(vested_tokens, sender);

        vesting_schedule.claimed_amount = vesting_schedule.claimed_amount + claimable_amount;
    }

    public fun calculate_vested_amount(schedule: &VestingSchedule, current_time_ms: u64): u64 {
        if (current_time_ms < schedule.start_time_ms) {
            return 0
        };

        let elapsed_time = current_time_ms - schedule.start_time_ms;
        if (elapsed_time >= schedule.duration_ms) {
            return schedule.total_amount
        };

        ((schedule.total_amount as u128 * elapsed_time as u128) / schedule.duration_ms as u128) as u64
    }
}