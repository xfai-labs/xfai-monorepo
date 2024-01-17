// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.19;

interface IInfinityNFTPeriphery {
  event InfinityStake(address indexed sender, uint amount, uint share, uint id);
  event InfinityBoost(address indexed sender, uint amount, uint share, uint id);

  function permanentStaking(
    address _to,
    uint _amountIn,
    uint _shareMin,
    uint _deadline
  ) external returns (uint share);

  function permanentBoosting(
    uint _amountIn,
    uint _shareMin,
    uint _id,
    uint _deadline
  ) external returns (uint share);
}
