/*
 * Test for Dollar Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "DollarToken",
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
    { name: "Alice deploys DollarToken contract with Alice as owner",
      body: function (test) {
        test.dollarTokenContract = loadContract ("DollarToken");
        var dollarTokenCode = loadContractCode ("DollarToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.dollarTokenContract.new (
          test.alice,
          {
            from: test.alice,
            data: dollarTokenCode,
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

        test.dollarToken = getDeployedContract (
          "DollarToken", 
          test.dollarTokenContract,
          test.tx);

        assertEquals (
          "test.dollarToken.name ()",
          "DollarToken",
          test.dollarToken.name ());

        assertEquals (
          "test.dollarToken.symbol ()",
          "USDL",
          test.dollarToken.symbol ());
      }},
    { name: "Alice creates 1000 tokens",
      body: function (test) {
        assertBNEquals (
          "test.dollarToken.totalSupply ()",
          0,
          test.dollarToken.totalSupply ());

        assertBNEquals (
          "test.dollarToken.balanceOf (test.alice)",
          0,
          test.dollarToken.balanceOf (test.alice));

        personal.unlockAccount (test.alice, "");
        test.tx = test.dollarToken.createTokens (
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
          "test.dollarToken.totalSupply ()",
          1000,
          test.dollarToken.totalSupply ());

        assertBNEquals (
          "test.dollarToken.balanceOf (test.alice)",
          1000,
          test.dollarToken.balanceOf (test.alice));
      }}
  ]});
