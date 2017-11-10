/*
 * Test for Dirham Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "DirhamToken",
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
    { name: "Alice deploys DirhamToken contract with Alice as owner",
      body: function (test) {
        test.dirhamTokenContract = loadContract ("DirhamToken");
        var dirhamTokenCode = loadContractCode ("DirhamToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.dirhamTokenContract.new (
          test.alice,
          {
            from: test.alice,
            data: dirhamTokenCode,
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

        test.dirhamToken = getDeployedContract (
          "DirhamToken", 
          test.dirhamTokenContract,
          test.tx);

        assertEquals (
          "test.dirhamToken.name ()",
          "DirhamToken",
          test.dirhamToken.name ());

        assertEquals (
          "test.dirhamToken.symbol ()",
          "AEDL",
          test.dirhamToken.symbol ());
      }},
    { name: "Alice creates 1000 tokens",
      body: function (test) {
        assertBNEquals (
          "test.dirhamToken.totalSupply ()",
          0,
          test.dirhamToken.totalSupply ());

        assertBNEquals (
          "test.dirhamToken.balanceOf (test.alice)",
          0,
          test.dirhamToken.balanceOf (test.alice));

        personal.unlockAccount (test.alice, "");
        test.tx = test.dirhamToken.createTokens (
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
          "test.dirhamToken.totalSupply ()",
          1000,
          test.dirhamToken.totalSupply ());

        assertBNEquals (
          "test.dirhamToken.balanceOf (test.alice)",
          1000,
          test.dirhamToken.balanceOf (test.alice));
      }}
  ]});
