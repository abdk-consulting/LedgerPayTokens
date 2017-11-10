/*
 * Test for Litecoin Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "LitecoinToken",
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
    { name: "Alice deploys LitecoinToken contract with Alice as owner",
      body: function (test) {
        test.litecoinTokenContract = loadContract ("LitecoinToken");
        var litecoinTokenCode = loadContractCode ("LitecoinToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.litecoinTokenContract.new (
          test.alice,
          {
            from: test.alice,
            data: litecoinTokenCode,
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

        test.litecoinToken = getDeployedContract (
          "LitecoinToken", 
          test.litecoinTokenContract,
          test.tx);

        assertEquals (
          "test.litecoinToken.name ()",
          "LitecoinToken",
          test.litecoinToken.name ());

        assertEquals (
          "test.litecoinToken.symbol ()",
          "LTCL",
          test.litecoinToken.symbol ());
      }},
    { name: "Alice creates 1000 tokens",
      body: function (test) {
        assertBNEquals (
          "test.litecoinToken.totalSupply ()",
          0,
          test.litecoinToken.totalSupply ());

        assertBNEquals (
          "test.litecoinToken.balanceOf (test.alice)",
          0,
          test.litecoinToken.balanceOf (test.alice));

        personal.unlockAccount (test.alice, "");
        test.tx = test.litecoinToken.createTokens (
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
          "test.litecoinToken.totalSupply ()",
          1000,
          test.litecoinToken.totalSupply ());

        assertBNEquals (
          "test.litecoinToken.balanceOf (test.alice)",
          1000,
          test.litecoinToken.balanceOf (test.alice));
      }}
  ]});
