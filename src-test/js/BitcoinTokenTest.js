/*
 * Test for Bitcoin Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "BitcoinToken",
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
    { name: "Alice deploys BitcoinToken contract with Alice as owner",
      body: function (test) {
        test.bitcoinTokenContract = loadContract ("BitcoinToken");
        var bitcoinTokenCode = loadContractCode ("BitcoinToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.bitcoinTokenContract.new (
          test.alice,
          {
            from: test.alice,
            data: bitcoinTokenCode,
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

        test.bitcoinToken = getDeployedContract (
          "BitcoinToken", 
          test.bitcoinTokenContract,
          test.tx);

        assertEquals (
          "test.bitcoinToken.name ()",
          "BitcoinToken",
          test.bitcoinToken.name ());

        assertEquals (
          "test.bitcoinToken.symbol ()",
          "BTCL",
          test.bitcoinToken.symbol ());
      }},
    { name: "Alice creates 1000 tokens",
      body: function (test) {
        assertBNEquals (
          "test.bitcoinToken.totalSupply ()",
          0,
          test.bitcoinToken.totalSupply ());

        assertBNEquals (
          "test.bitcoinToken.balanceOf (test.alice)",
          0,
          test.bitcoinToken.balanceOf (test.alice));

        personal.unlockAccount (test.alice, "");
        test.tx = test.bitcoinToken.createTokens (
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
          "test.bitcoinToken.totalSupply ()",
          1000,
          test.bitcoinToken.totalSupply ());

        assertBNEquals (
          "test.bitcoinToken.balanceOf (test.alice)",
          1000,
          test.bitcoinToken.balanceOf (test.alice));
      }}
  ]});
