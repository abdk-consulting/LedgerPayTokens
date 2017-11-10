# LedgerPay Token Smart Contracts #

LedgerPay Token Ethereum smart contracts.  Copyright © 2017 by ABDK Consulting.

**Author:** Mikhail Vladimirov <mikhail.vladimirov@gmail.com>

## How to Deploy ##

In order to deploy LedgerPay Token Smart Contracts you need the following software
to be properly installed on your system:

1. Geth 1.6.5+ (https://geth.ethereum.org/)

Also, you need Ethereum node running on your system and synchronized with the
network.  If you do not have one, you may run it via one of the following
commands depending on whether you want to connect to PRODNET or TESTNET:

    geth
    geth --testnet

Also you need at least one account in your node.  If you do not have any
accounts, you may create one using the following commands:

    geth attach
    > personal.newAccount ();
    > exit

It will ask you to choose passphrase and enter it twice, and it will output an
address of your new created account.

You will also need some ether on your primary account.

In order to deploy LedgerPay Token Smart Contracts do the following:

1. Go to the directory containing deployment script, i.e. file named
   `XXXTokenDeploy.js`, where `XXX` is the name of base asset of the token, e.g.
   `Dollar`
2. Attach to your local Ethereum node: `geth attach`
3. Unlock your primary account:
   `personal.unlockAccount (web3.eth.accounts [0]);` (you will be
   asked for your passphrase here)
4. Run deployment script: `loadScript ("XXXTokenDeploy.js");`
5. If everything will go fine, after several seconds you will see message like
   the following: `Deployed at ... (tx: ...)`,
   which means that your contract was deployed (message shows address of the
   contract and hash of the transaction the contract was deployed by)
