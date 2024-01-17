// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.19;

import './IERC20Metadata.sol';

interface IWETH is IERC20Metadata {
  function deposit() external payable;

  function transfer(address to, uint value) external returns (bool);

  function withdraw(uint) external;
}
