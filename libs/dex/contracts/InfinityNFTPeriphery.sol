// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.19;

import './libraries/TransferHelper.sol';
import './libraries/XfaiLibrary.sol';

import '../interfaces/IInfinityNFTPeriphery.sol';
import '../interfaces/IXfaiINFT.sol';
import '../interfaces/IXfaiV0Core.sol';
import '../interfaces/IXfaiFactory.sol';
import '../interfaces/IWETH.sol';

contract InfinityNFTPeriphery is IInfinityNFTPeriphery {
  /**
   * @notice The factory address of xfai
   */
  address private immutable factory;

  /**
   * @notice The old factory address of xfai
   */
  address private immutable optionalOldFactory;

  /**
   * @notice The INFT address of xfai
   */
  address private immutable infinityNFT;

  /**
   * @notice The address of the underlying ERC20 token used for infinity staking / boosting within the INFT contract
   */
  address private immutable xfit;

  /**
   * @notice The weth address.
   * @dev In the case of a chain ID other than Ethereum, the wrapped ERC20 token address of the chain's native coin
   */
  address private immutable weth;

  /**
   * @notice The XfaiV0Core address of Xfai
   */
  address private immutable core;

  /**
   * @notice The code hash od XfaiPool
   * @dev keccak256(type(XfaiPool).creationCode)
   */
  bytes32 private immutable poolCodeHash;

  modifier ensure(uint deadline) {
    require(deadline >= block.timestamp, 'InfinityNFTPeriphery: EXPIRED');
    _;
  }

  constructor(
    address _factory,
    address _optionalOldFactory,
    address _infinityNFT,
    address _xfit,
    address _weth
  ) {
    factory = _factory;
    optionalOldFactory = _optionalOldFactory;
    core = IXfaiFactory(_factory).getXfaiCore();
    infinityNFT = _infinityNFT;
    xfit = _xfit;
    weth = _weth;
    poolCodeHash = IXfaiFactory(_factory).poolCodeHash();
  }

  // **** Permanent Staking ****
  // requires the initial amount to have already been sent to the first pair

  /**
   * @notice Permanently stake liquidity within Xfai
   * @dev Requires _token0 approval. At the end of the function call, an INFT is minted. The share of witch depends on the exchange value of _amount0In in terms of xfit and the INFT's reserve.
   * @param _to The address of the recipient
   * @param _amount0In The amount of _token0 to be permanently staked
   * @param _shareMin The minimal amount of INFT shares that the user will accept for a given _amount0In
   * @param _deadline The UTC timestamp that if reached, causes the transaction to fail automatically
   * @return share The share of the minted INFT
   */
  function permanentStaking(
    address _to,
    uint _amount0In,
    uint _shareMin,
    uint _deadline
  ) external override ensure(_deadline) returns (uint share) {
    TransferHelper.safeTransferFrom(xfit, msg.sender, optionalOldFactory, _amount0In);
    (, share) = IXfaiINFT(infinityNFT).mint(_to);
    require(share >= _shareMin, 'InfinityNFTPeriphery: INSUFFICIENT_SHARE');
  }

  // **** Permanent Boosting ****
  // requires the initial amount to have already been sent to the first pair

  /**
   * @notice Permanently stake liquidity within Xfai
   * @dev Requires _token0 approval. At the end of the function call, the share value of an existing INFT is increased. The share of witch depends on the exchange value of _amount0In in terms of xfit and the INFT's reserve.
   * @param _amount0In The amount of _token0 to be permanently staked
   * @param _shareMin The minimal amount of INFT shares that the user will accept for a given _amount0In
   * @param _id The token ID of the INFT
   * @param _deadline The UTC timestamp that if reached, causes the swap transaction to fail automatically
   * @return share The new share of the INFT
   */
  function permanentBoosting(
    uint _amount0In,
    uint _shareMin,
    uint _id,
    uint _deadline
  ) external override ensure(_deadline) returns (uint share) {
    TransferHelper.safeTransferFrom(xfit, msg.sender, optionalOldFactory, _amount0In);
    share = IXfaiINFT(infinityNFT).boost(_id);
    require(share >= _shareMin, 'InfinityNFTPeriphery: INSUFFICIENT_SHARE');
  }
}
