// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.19;

interface IBorrower {
  function executeOnFlashMint(uint _amount) external;
}
