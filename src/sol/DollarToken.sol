/*
 * Dollar Token Smart Contract.  Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.11;

import "./AbstractLedgerPayToken.sol";

/**
 * Dollar Token Smart Contract.
 */
contract DollarToken is AbstractLedgerPayToken {
  /**
   * Create new Dollar Token smart contract and make the owner of given address
   * to be the owner of the smart contract.
   *
   * @param _owner address of the owner of the smart contract
   */
  function DollarToken (address _owner) AbstractLedgerPayToken (_owner) {
    // Do nothing
  }

  /**
   * Get name of this token.
   *
   * @return name of this token
   */
  function name () constant returns (string name) {
    return "DollarToken";
  }

  /**
   * Get symbol of this token.
   *
   * @return symbol of this token
   */
  function symbol () constant returns (string symbol) {
    return "USDL";
  }
}
