/*
 * Test for British Pound Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "BritishPoundToken",
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
    { name: "Alice deploys BritishPoundToken contract with Alice as owner",
      body: function (test) {
        test.britishPoundTokenContract = loadContract ("BritishPoundToken");
        var britishPoundTokenCode = loadContractCode ("BritishPoundToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.britishPoundTokenContract.new (
          test.alice,
          {
            from: test.alice,
            data: britishPoundTokenCode,
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

        test.britishPoundToken = getDeployedContract (
          "BritishPoundToken", 
          test.britishPoundTokenContract,
          test.tx);

        assertEquals (
          "test.britishPoundToken.name ()",
          "BritishPoundToken",
          test.britishPoundToken.name ());

        assertEquals (
          "test.britishPoundToken.symbol ()",
          "GBPL",
          test.britishPoundToken.symbol ());
      }},
    { name: "Alice creates 1000 tokens",
      body: function (test) {
        assertBNEquals (
          "test.britishPoundToken.totalSupply ()",
          0,
          test.britishPoundToken.totalSupply ());

        assertBNEquals (
          "test.britishPoundToken.balanceOf (test.alice)",
          0,
          test.britishPoundToken.balanceOf (test.alice));

        personal.unlockAccount (test.alice, "");
        test.tx = test.britishPoundToken.createTokens (
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
          "test.britishPoundToken.totalSupply ()",
          1000,
          test.britishPoundToken.totalSupply ());

        assertBNEquals (
          "test.britishPoundToken.balanceOf (test.alice)",
          1000,
          test.britishPoundToken.balanceOf (test.alice));
      }}
  ]});
