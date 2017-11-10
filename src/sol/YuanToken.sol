/*
 * Yuan Token Smart Contract.  Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.11;

import "./AbstractLedgerPayToken.sol";

/**
 * Yuan Token Smart Contract.
 */
contract YuanToken is AbstractLedgerPayToken {
  /**
   * Create new Yuan Token smart contract and make the owner of given address
   * to be the owner of the smart contract.
   *
   * @param _owner address of the owner of the smart contract
   */
  function YuanToken (address _owner) AbstractLedgerPayToken (_owner) {
    // Do nothing
  }

  /**
   * Get name of this token.
   *
   * @return name of this token
   */
  function name () constant returns (string name) {
    return "YuanToken";
  }

  /**
   * Get symbol of this token.
   *
   * @return symbol of this token
   */
  function symbol () constant returns (string symbol) {
    return "CNYL";
  }
}
