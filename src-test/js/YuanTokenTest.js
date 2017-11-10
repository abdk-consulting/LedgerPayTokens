/*
 * Test for Yuan Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "YuanToken",
  steps: [
    { name: "Ensure there is at least one account: Alice",
      body: function (test) {
        while (web3.eth.accounts.length < 1)
          personal.newAccount ("");

        test.alice = web3.eth.accounts [0];
      }},
    { name: "Ensure Alice has at least 5 ETH",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getBalance (test.alice).gte (web3.toWei ("5", "ether"));
      },
      body: function (test) {
        miner.stop ();
      }},
    { name: "Alice deploys YuanToken contract with Alice as owner",
      body: function (test) {
        test.yuanTokenContract = loadContract ("YuanToken");
        var yuanTokenCode = loadContractCode ("YuanToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.yuanTokenContract.new (
          test.alice,
          {
            from: test.alice,
            data: yuanTokenCode,
            gas: 1000000
          }).
          transactionHash;
      }},
    { name: "Make sure contract was deployed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        test.yuanToken = getDeployedContract (
          "YuanToken", 
          test.yuanTokenContract,
          test.tx);

        assertEquals (
          "test.yuanToken.name ()",
          "YuanToken",
          test.yuanToken.name ());

        assertEquals (
          "test.yuanToken.symbol ()",
          "CNYL",
          test.yuanToken.symbol ());
      }},
    { name: "Alice creates 1000 tokens",
      body: function (test) {
        assertBNEquals (
          "test.yuanToken.totalSupply ()",
          0,
          test.yuanToken.totalSupply ());

        assertBNEquals (
          "test.yuanToken.balanceOf (test.alice)",
          0,
          test.yuanToken.balanceOf (test.alice));

        personal.unlockAccount (test.alice, "");
        test.tx = test.yuanToken.createTokens (
          1000,
          { from: test.alice, gas: 2000000 });
      }},
    { name: "Make sure transaction succeeded, 1000 tokens were created and given to Alice",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertBNEquals (
          "test.yuanToken.totalSupply ()",
          1000,
          test.yuanToken.totalSupply ());

        assertBNEquals (
          "test.yuanToken.balanceOf (test.alice)",
          1000,
          test.yuanToken.balanceOf (test.alice));
      }}
  ]});
