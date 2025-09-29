/*
#[test_only]
module shambat::shambat_tests;
// uncomment this line to import the module
// use shambat::shambat;

const ENotImplemented: u64 = 0;

#[test]
fun test_shambat() {
    // pass
}

#[test, expected_failure(abort_code = ::shambat::shambat_tests::ENotImplemented)]
fun test_shambat_fail() {
    abort ENotImplemented
}
*/
module 0x0::shambat {
    use std::vector;
    use sui::object::{UID};
    use sui::tx_context::TxContext;
    use sui::balance;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    /// Investor struct
    public struct Investor has store, drop {
        id: address,
        amount: u64,
    }

    /// Farm struct
    public struct Farm has key {
        id: UID,
        farmer: address,
        investors: vector<Investor>,
        total_invested: u64,
        profits: balance::Balance<SUI>,
    }

    /// Create a new farm
    public fun create_farm(farmer: address, ctx: &mut TxContext): Farm {
        Farm {
            id: object::new(ctx),
            farmer,
            investors: vector::empty<Investor>(),
            total_invested: 0,
            profits: balance::zero<SUI>(),
        }
    }

    /// Allow an investor to add funds (track only, no actual coin transfer here)
    public fun invest(farm: &mut Farm, investor: address, amount: u64) {
        let inv = Investor { id: investor, amount };
        vector::push_back(&mut farm.investors, inv);
        farm.total_invested = farm.total_invested + amount;
    }

    /// Add profit to farm (coins go into farm balance)
    public fun add_profit(farm: &mut Farm, profit: Coin<SUI>) {
        let bal = coin::into_balance(profit);
        balance::join(&mut farm.profits, bal);
    }

    /// Distribute profit among farmer, platform, and investors
    public fun distribute(farm: &mut Farm, platform: address, ctx: &mut TxContext) {
        let total_value = balance::value(&farm.profits);
        if (total_value == 0) return;

        // Farmer 60%, Platform 10%, Investors 30%
        let farmer_share = total_value * 60 / 100;
        let platform_share = total_value * 10 / 100;
        let investor_pool = total_value * 30 / 100;

        // Split farmer share
        let farmer_balance = balance::split(&mut farm.profits, farmer_share);
        let farmer_coin = balance::into_coin(farmer_balance, ctx);
        coin::transfer(farmer_coin, farm.farmer);

        // Split platform share
        let platform_balance = balance::split(&mut farm.profits, platform_share);
        let platform_coin = balance::into_coin(platform_balance, ctx);
        coin::transfer(platform_coin, platform);

        // Distribute investor pool
        let n = vector::length(&farm.investors);
        let mut i = 0;
        while (i < n) {
            let inv = vector::borrow(&farm.investors, i);
            let weight = (inv.amount * 100) / farm.total_invested;
            let payout_amount = investor_pool * weight / 100;

            if (payout_amount > 0) {
                let payout_balance = balance::split(&mut farm.profits, payout_amount);
                let payout_coin = balance::into_coin(payout_balance, ctx);
                coin::transfer(payout_coin, inv.id);
            };
            i = i + 1;
        };

        // Any leftovers -> farmer
        if (balance::value(&farm.profits) > 0) {
            let dust = balance::take(&mut farm.profits);
            let dust_coin = balance::into_coin(dust, ctx);
            coin::transfer(dust_coin, farm.farmer);
        };
    }
}

