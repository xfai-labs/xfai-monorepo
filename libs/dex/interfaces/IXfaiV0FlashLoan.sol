// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.19;

interface IXfaiV0FlashLoan {
  function flashLoan(
    address sender,
    uint tokenAmount,
    uint wethAmount,
    bytes calldata data
  ) external;
}
