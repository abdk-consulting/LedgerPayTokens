/*
 * Abstract LedgerPay Token Smart Contract.  Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.11;

import "./AbstractToken.sol";

/**
 * Abstract base contract for LedgePay Token Smart Contracts.
 */
contract AbstractLedgerPayToken is AbstractToken {
  /**
   * Maximum allowed number of tokens in circulation.
   */
  uint256 constant MAX_TOKEN_COUNT = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // 2^256 - 1

  /**
   * Address of the owner of this smart contract.
   */
  address owner;

  /**
   * Current number of tokens in circulation
   */
  uint256 tokenCount = 0;

  /**
   * True if tokens transfers are currently frozen, false otherwise.
   */
  bool frozen = false;

  /**
   * Create new LendgePay Token smart contract and make owner of given address
   * to be the owner of the smart contract.
   *
   * @param _owner address of the owner of the smart contract
   */
  function AbstractLedgerPayToken (address _owner) {
    owner = _owner;
  }

  /**
   * Get name of this token.
   *
   * @return name of this token
   */
  function name () constant returns (string name);

  /**
   * Get symbol of this token.
   *
   * @return symbol of this token
   */
  function symbol () constant returns (string symbol);

  /**
   * Get number of decimals for this token.
   *
   * @return number of decimals for this token
   */
  function decimals () constant returns (uint8 decimals) {
    return 8;
  }

  /**
   * Get total number of tokens in circulation.
   *
   * @return total number of tokens in circulation
   */
  function totalSupply () constant returns (uint256 supply) {
    return tokenCount;
  }

  /**
   * Transfer given number of tokens from message sender to given recipient.
   *
   * @param _to address to transfer tokens to the owner of
   * @param _value number of tokens to transfer to the owner of given address
   * @return true if tokens were transferred successfully, false otherwise
   */
  function transfer (address _to, uint256 _value) returns (bool success) {
    if (frozen) return false;
    else return AbstractToken.transfer (_to, _value);
  }

  /**
   * Transfer given number of tokens from given owner to given recipient.
   *
   * @param _from address to transfer tokens from the owner of
   * @param _to address to transfer tokens to the owner of
   * @param _value number of tokens to transfer from given owner to given
   *        recipient
   * @return true if tokens were transferred successfully, false otherwise
   */
  function transferFrom (address _from, address _to, uint256 _value)
  returns (bool success) {
    if (frozen) return false;
    else return AbstractToken.transferFrom (_from, _to, _value);
  }

  /**
   * Change how many tokens given spender is allowed to transfer from message
   * spender.  In order to prevent double spending of allowance, this method
   * receives assumed current allowance value as an argument.  If actual
   * allowance differs from an assumed one, this method just returns false.
   *
   * @param _spender address to allow the owner of to transfer tokens from
   *        message sender
   * @param _currentValue assumed number of tokens currently allowed to be
   *        transferred
   * @param _newValue number of tokens to allow to transfer
   * @return true if token transfer was successfully approved, false otherwise
   */
  function approve (address _spender, uint256 _currentValue, uint256 _newValue)
  returns (bool success) {
    if (allowance (msg.sender, _spender) == _currentValue)
      return approve (_spender, _newValue);
    else return false;
  }

  /**
   * Create _value new tokens and give new created tokens to msg.sender.
   * May only be called by smart contract owner.
   *
   * @param _value number of tokens to create
   * @return true if tokens were created successfully, false otherwise
   */
  function createTokens (uint256 _value)
  returns (bool success) {
    if (msg.sender != owner) throw;

    if (_value > 0) {
      if (_value > safeSub (MAX_TOKEN_COUNT, tokenCount)) return false;
      accounts [msg.sender] = safeAdd (accounts [msg.sender], _value);
      tokenCount = safeAdd (tokenCount, _value);
    }

    return true;
  }

  /**
   * Burn given number of tokens belonging to message sender.
   *
   * @param _value number of tokens to burn
   * @return true on success, false on error
   */
  function burnTokens (uint256 _value) returns (bool success) {
    if (_value > accounts [msg.sender]) return false;
    else if (_value > 0) {
      accounts [msg.sender] = safeSub (accounts [msg.sender], _value);
      tokenCount = safeSub (tokenCount, _value);
      return true;
    } else return true;
  }

  /**
   * Set new owner for the smart contract.
   * May only be called by smart contract owner.
   *
   * @param _newOwner address of new owner of the smart contract
   */
  function setOwner (address _newOwner) {
    if (msg.sender != owner) throw;

    owner = _newOwner;
  }

  /**
   * Freeze token transfers.
   * May only be called by smart contract owner.
   */
  function freezeTransfers () {
    if (msg.sender != owner) throw;

    if (!frozen) {
      frozen = true;
      Freeze ();
    }
  }

  /**
   * Unfreeze token transfers.
   * May only be called by smart contract owner.
   */
  function unfreezeTransfers () {
    if (msg.sender != owner) throw;

    if (frozen) {
      frozen = false;
      Unfreeze ();
    }
  }

  /**
   * Logged when token transfers were frozen.
   */
  event Freeze ();

  /**
   * Logged when token transfers were unfrozen.
   */
  event Unfreeze ();
}
