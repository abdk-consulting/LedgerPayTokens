/*
 * Test for Ether Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "EtherToken",
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
    { name: "Alice deploys EtherToken contract with Alice as owner",
      body: function (test) {
        test.etherTokenContract = loadContract ("EtherToken");
        var etherTokenCode = loadContractCode ("EtherToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.etherTokenContract.new (
          test.alice,
          {
            from: test.alice,
            data: etherTokenCode,
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

        test.etherToken = getDeployedContract (
          "EtherToken", 
          test.etherTokenContract,
          test.tx);

        assertEquals (
          "test.etherToken.name ()",
          "EtherToken",
          test.etherToken.name ());

        assertEquals (
          "test.etherToken.symbol ()",
          "ETHL",
          test.etherToken.symbol ());
      }},
    { name: "Alice creates 1000 tokens",
      body: function (test) {
        assertBNEquals (
          "test.etherToken.totalSupply ()",
          0,
          test.etherToken.totalSupply ());

        assertBNEquals (
          "test.etherToken.balanceOf (test.alice)",
          0,
          test.etherToken.balanceOf (test.alice));

        personal.unlockAccount (test.alice, "");
        test.tx = test.etherToken.createTokens (
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
          "test.etherToken.totalSupply ()",
          1000,
          test.etherToken.totalSupply ());

        assertBNEquals (
          "test.etherToken.balanceOf (test.alice)",
          1000,
          test.etherToken.balanceOf (test.alice));
      }}
  ]});
