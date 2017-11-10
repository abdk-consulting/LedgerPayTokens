/*
 * Test for Euro Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "EuroToken",
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
    { name: "Alice deploys EuroToken contract with Alice as owner",
      body: function (test) {
        test.euroTokenContract = loadContract ("EuroToken");
        var euroTokenCode = loadContractCode ("EuroToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.euroTokenContract.new (
          test.alice,
          {
            from: test.alice,
            data: euroTokenCode,
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

        test.euroToken = getDeployedContract (
          "EuroToken", 
          test.euroTokenContract,
          test.tx);

        assertEquals (
          "test.euroToken.name ()",
          "EuroToken",
          test.euroToken.name ());

        assertEquals (
          "test.euroToken.symbol ()",
          "EURL",
          test.euroToken.symbol ());
      }},
    { name: "Alice creates 1000 tokens",
      body: function (test) {
        assertBNEquals (
          "test.euroToken.totalSupply ()",
          0,
          test.euroToken.totalSupply ());

        assertBNEquals (
          "test.euroToken.balanceOf (test.alice)",
          0,
          test.euroToken.balanceOf (test.alice));

        personal.unlockAccount (test.alice, "");
        test.tx = test.euroToken.createTokens (
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
          "test.euroToken.totalSupply ()",
          1000,
          test.euroToken.totalSupply ());

        assertBNEquals (
          "test.euroToken.balanceOf (test.alice)",
          1000,
          test.euroToken.balanceOf (test.alice));
      }}
  ]});
