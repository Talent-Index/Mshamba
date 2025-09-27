#[test_only]
module 0x0::farm_advanced_tests {
    use sui::test_scenario;
    use sui::clock;
    use 0x0::farm_advanced as farm;

    struct TestFarm has drop {}

    #[test]
    fun test_create_farm() {
        let mut scenario = test_scenario::begin(@0x123);
        let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));

        let platform = @0x456;
        let farmer = @0x789;

        test_scenario::next_tx(&mut scenario, farmer);
        farm::create_farm<TestFarm>(platform, 100, 3600, &clock, test_scenario::ctx(&mut scenario));

        let farm_wrapper = test_scenario::take_shared<farm::Farm<TestFarm>>(&mut scenario);
        let farm_object = test_scenario::borrow_mut(&mut farm_wrapper);

        assert!(farm_object.owner == farmer, 0);
        assert!(farm_object.platform == platform, 0);
        assert!(farm_object.ifo_active, 0);

        test_scenario::return_shared(farm_wrapper);
        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }
}
