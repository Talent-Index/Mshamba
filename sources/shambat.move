module shambat::farm {
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;


    /// Investor record
    public struct Investor has store, drop {
        investor: address,
        amount: u64,
    }

    /// Farm that manages investments and profit sharing  
    public struct Farm has key {
        id: UID,
        farmer: address,
        investors: vector<Investor>,
        total_invested: u64,
        vault: Balance<SUI>,
        is_open_for_investment: bool,
    }

    /// Error codes
    const ENotFarmer: u64 = 0;
    const ENoInvestors: u64 = 1;
    const EZeroAmount: u64 = 2;
    const EInvestmentNotOpen: u64 = 3;

    /// Create a new farm. It is not open for investment until launched.
    public fun create_farm(ctx: &mut TxContext) {
        let farmer_addr = tx_context::sender(ctx);
        let farm = Farm {
            id: object::new(ctx),
            farmer: farmer_addr,
            investors: vector::empty<Investor>(),
            total_invested: 0,
            vault: balance::zero<SUI>(),
            is_open_for_investment: false,
        };
        transfer::share_object(farm);
    }

    /// Farmer can launch the investment period, making the farm ready to accept investments.
    public fun launch_investment(farm: &mut Farm, ctx: &mut TxContext) {
        let farmer_addr = tx_context::sender(ctx);
        assert!(farm.farmer == farmer_addr, ENotFarmer);
        farm.is_open_for_investment = true;
    }

    /// Allow anyone to invest in the farm, if it's open for investment.
    public fun invest(farm: &mut Farm, coin_in: Coin<SUI>, ctx: &mut TxContext) {
        assert!(farm.is_open_for_investment, EInvestmentNotOpen);
        
        let investor_addr = tx_context::sender(ctx);
        let amount = coin::value(&coin_in);
        
        assert!(amount > 0, EZeroAmount);
        
        // Add to vault
        let bal_in = coin::into_balance(coin_in);
        balance::join(&mut farm.vault, bal_in);

        // Record investment
        let inv = Investor { investor: investor_addr, amount };
        vector::push_back(&mut farm.investors, inv);
        farm.total_invested = farm.total_invested + amount;
    }

    /// Farmer can add profit to the farm
    public fun add_profit(farm: &mut Farm, profit_coin: Coin<SUI>, ctx: &mut TxContext) {
        let farmer_addr = tx_context::sender(ctx);
        assert!(farm.farmer == farmer_addr, ENotFarmer);
        
        let bal = coin::into_balance(profit_coin);
        balance::join(&mut farm.vault, bal);
    }

    /// Distribute profits - only farmer can call this
    #[allow(lint(self_transfer))]
    public fun distribute(farm: &mut Farm, platform: address, ctx: &mut TxContext) {
        let farmer_addr = tx_context::sender(ctx);
        assert!(farm.farmer == farmer_addr, ENotFarmer);
        assert!(vector::length(&farm.investors) > 0, ENoInvestors);

        let total_balance = balance::value(&farm.vault);
        assert!(total_balance > 0, EZeroAmount);

        // Calculate shares: 60% farmer, 10% platform, 30% investors
        let farmer_share = total_balance * 60 / 100;
        let platform_share = total_balance * 10 / 100;
        let investor_pool = total_balance * 30 / 100;

        // Pay farmer
        let farmer_bal = balance::split(&mut farm.vault, farmer_share);
        let farmer_coin = coin::from_balance(farmer_bal, ctx);
        transfer::public_transfer(farmer_coin, farmer_addr);

        // Pay platform
        let platform_bal = balance::split(&mut farm.vault, platform_share);
        let platform_coin = coin::from_balance(platform_bal, ctx);
        transfer::public_transfer(platform_coin, platform);

        // Pay investors proportionally
        let n = vector::length(&farm.investors);
        let mut i = 0;
        while (i < n) {
            let inv = vector::borrow(&farm.investors, i);
            let payout_amount = (inv.amount * investor_pool) / farm.total_invested;
            
            if (payout_amount > 0) {
                let payout_bal = balance::split(&mut farm.vault, payout_amount);
                let payout_coin = coin::from_balance(payout_bal, ctx);
                transfer::public_transfer(payout_coin, inv.investor);
            };
            i = i + 1;
        };

        // Reset for next round and close for investment
        farm.investors = vector::empty<Investor>();
        farm.total_invested = 0;
        farm.is_open_for_investment = false;
    }
}
