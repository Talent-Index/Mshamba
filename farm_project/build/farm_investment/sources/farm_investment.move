module 0x0::farm_investment {


    /// A farm investment object
    public struct Farm has key {
        id: UID,
        owner: address,
        investment: u64,
    }

    /// Create a new farm with an initial investment
    public fun create_farm(initial_investment: u64, ctx: &mut TxContext) {
        let farm = Farm {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            investment: initial_investment,
        };
        transfer::transfer(farm, tx_context::sender(ctx));
    }

    /// Increase investment in an existing farm
    public fun invest(farm: &mut Farm, amount: u64) {
        farm.investment = farm.investment + amount;
    }

    /// Withdraw investment (reduce balance)
    public fun withdraw(farm: &mut Farm, amount: u64) {
        assert!(farm.investment >= amount, 1); // error code 1 = insufficient balance
        farm.investment = farm.investment - amount;
    }

    /// View function to check farm details
    public fun get_investment(farm: &Farm): u64 {
        farm.investment
    }

    public fun get_owner(farm: &Farm): address {
        farm.owner
    }
}
