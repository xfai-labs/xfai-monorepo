// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.19;

import './libraries/Math.sol';
import './libraries/XfaiLibrary.sol';

import '../interfaces/IXfaiV0Core.sol';
import '../interfaces/IXfaiFactory.sol';
import '../interfaces/IXfaiPool.sol';
import '../interfaces/IXfaiV0FlashLoan.sol';
import '../interfaces/IERC20.sol';

/**
 * @title Xfai's Core Contract
 * @author Xfai
 * @notice XfaiV0Core manages the core AMM logic of Xfai. It does not store any pool state.
 */
contract XfaiV0Core is IXfaiV0Core {
  /**
   * @notice The factory address of Xfai
   */
  address private immutable factory;

  /**
   * @notice The INFT address of Xfai
   */
  address private immutable infinityNFT;

  /**
   * @notice The address of the wETH token
   */
  address private immutable wETH;

  /**
   * @notice The liquidity provider fee for swaps and burns
   */
  uint public override lpFee;

  /**
   * @notice The infinity NFT fee for swaps and burns
   */
  uint public override infinityNFTFee;

  uint private constant MAX_FEE = 100;
  uint private constant NOT_ENTERED = 1;
  uint private constant ENTERED = 2;
  uint private constant MINIMUM_LIQUIDITY = 10 ** 3;

  /**
   * @notice The code hash od XfaiPool
   * @dev keccak256(type(XfaiPool).creationCode)
   */
  bytes32 private immutable poolCodeHash;

  /**
   * @notice determines if swap/mint/burn functionality is paused or not
   */
  bool private paused;

  /**
   * @notice Mapping used to lock individual Xfai pools
   * @dev used to prevent reentrancy attacks
   */
  mapping(address => uint) private poolLock;

  modifier singleLock(address _token) {
    require(_token != wETH, 'XfaiV0Core: INVALID_TOKEN');
    require(poolLock[_token] != ENTERED, 'XfaiV0Core: REENTRANT_CALL');
    poolLock[_token] = ENTERED;
    _;
    poolLock[_token] = NOT_ENTERED;
  }

  modifier doubleLock(address _token0, address _token1) {
    require(poolLock[_token0] != ENTERED, 'XfaiV0Core: REENTRANT_CALL');
    require(poolLock[_token1] != ENTERED, 'XfaiV0Core: REENTRANT_CALL');
    require(_token0 != _token1, 'XfaiV0Core: IDENTICAL_POOLS');
    address _wETH = wETH;
    if (_token0 != _wETH) {
      poolLock[_token0] = ENTERED;
    }
    if (_token1 != _wETH) {
      poolLock[_token1] = ENTERED;
    }
    _;
    poolLock[_token0] = NOT_ENTERED;
    poolLock[_token1] = NOT_ENTERED;
  }

  modifier pausable() {
    require(paused == false, 'XfaiV0Core: PAUSED');
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == IXfaiFactory(factory).getOwner(), 'XfaiV0Core: NOT_OWNER');
    _;
  }

  /**
   * @notice Construct XfaiV0Core
   * @param _factory The factory contract address of the XfaiV0Core contract
   * @param _infinityNFT The INFT address of Xfai
   * @param _wETH The address of the wETH token
   * @param _lpFee The liquidity provider fee for swaps and burns
   * @param _infinityNFTFee The infinity staking / boosting fee for INFT holders
   */
  constructor(
    address _factory,
    address _infinityNFT,
    address _wETH,
    uint _lpFee,
    uint _infinityNFTFee
  ) {
    factory = _factory;
    infinityNFT = _infinityNFT;
    wETH = _wETH;
    lpFee = _lpFee;
    infinityNFTFee = _infinityNFTFee;
    poolCodeHash = IXfaiFactory(_factory).poolCodeHash();
  }

  /**
   * @notice Changes the lpFee of the XfaiV0Core contract
   * @dev Only the owner of the XfaiV0Core contract can call this function
   * @param _newLpFee The new lpFee
   */
  function changeLpFee(uint _newLpFee) external override onlyOwner {
    require(_newLpFee + infinityNFTFee <= MAX_FEE, 'XfaiV0Core: FEE_EXCEEDS_LIMIT');
    lpFee = _newLpFee;
    emit LpFeeChange(_newLpFee);
  }

  /**
   * @notice Changes the infinityNFTFee of the XfaiV0Core contract
   * @dev Only the owner of the XfaiV0Core contract can call this function
   * @param _newLnftFee The new infinityNFTFee
   */
  function changeInfinityNFTFee(uint _newLnftFee) external override onlyOwner {
    require(lpFee + _newLnftFee <= MAX_FEE, 'XfaiV0Core: FEE_EXCEEDS_LIMIT');
    infinityNFTFee = _newLnftFee;
    emit InfinityNFTFeeChange(_newLnftFee);
  }

  /**
   * @notice Returns the total fee of the XfaiV0Core contract for swaps and burns
   * @dev The total fee of the XfaiV0Core represents the sum of the infinityNFTFee and lpFee
   */
  function getTotalFee() public view override returns (uint) {
    return infinityNFTFee + lpFee;
  }

  function _swap0(
    address _pool,
    address _token,
    address _to
  ) private returns (uint amountIn, uint amountOut) {
    address _wETH = wETH; // gas saving
    IXfaiPool pool = IXfaiPool(_pool);
    (uint reserve, uint weight) = pool.getStates();
    uint tokenBalance = IERC20(_token).balanceOf(_pool);
    amountIn = tokenBalance - reserve;
    amountOut = XfaiLibrary.getAmountOut(reserve, weight, amountIn, getTotalFee());
    pool.linkedTransfer(_token, infinityNFT, (amountIn * infinityNFTFee) / 10000); // send infinityNFTFee to the INFT contract
    pool.linkedTransfer(_wETH, _to, amountOut); // optimistically transfer tokens
    uint wETHBalance = IERC20(_wETH).balanceOf(_pool);
    tokenBalance = IERC20(_token).balanceOf(_pool);
    pool.update(tokenBalance, wETHBalance);
  }

  function _swap1(
    address _pool,
    address _token,
    address _to,
    bool _withFee
  ) private returns (uint amountIn, uint amountOut) {
    address _wETH = wETH; // gas saving
    IXfaiPool pool = IXfaiPool(_pool);
    (uint reserve, uint weight) = pool.getStates();
    uint wETHBalance = IERC20(_wETH).balanceOf(_pool);
    amountIn = wETHBalance - weight;
    if (_withFee == true) {
      amountOut = XfaiLibrary.getAmountOut(weight, reserve, amountIn, getTotalFee());
      pool.linkedTransfer(_wETH, infinityNFT, (amountIn * infinityNFTFee) / 10000); // send infinityNFTFee to the INFT contract
    } else {
      amountOut = XfaiLibrary.getAdjustedOutput(amountIn, weight, reserve);
    }
    pool.linkedTransfer(_token, _to, amountOut); // optimistically transfer tokens
    wETHBalance = IERC20(_wETH).balanceOf(_pool);
    uint tokenBalance = IERC20(_token).balanceOf(_pool);
    pool.update(tokenBalance, wETHBalance);
  }

  function _swap(
    address _token0,
    address _token1,
    address _to
  ) private returns (uint amount0In, uint amount1Out) {
    address _wETH = wETH; // gas saving
    address _factory = factory; // gas saving
    require(_to != _token0, 'XfaiV0Core: INVALID_TO');
    require(_to != _token1, 'XfaiV0Core: INVALID_TO');
    if (_token0 != _wETH && _token1 != _wETH) {
      address pool0 = XfaiLibrary.poolFor(_token0, _factory, poolCodeHash);
      address pool1 = XfaiLibrary.poolFor(_token1, _factory, poolCodeHash);
      (amount0In, ) = _swap0(pool0, _token0, pool1);
      (, amount1Out) = _swap1(pool1, _token1, _to, false);
    } else if (_token0 == _wETH) {
      address pool1 = XfaiLibrary.poolFor(_token1, _factory, poolCodeHash);
      (amount0In, amount1Out) = _swap1(pool1, _token1, _to, true);
    } else {
      address pool0 = XfaiLibrary.poolFor(_token0, _factory, poolCodeHash);
      (amount0In, amount1Out) = _swap0(pool0, _token0, _to);
    }
  }

  /**
   * @notice Swaps one hosted ERC20 token for another hosted ERC20 token
   * @dev This low-level function should be called from a contract which performs important safety checks.
   * This function locks the pool of _token0 and _token1 to prevent reentrancy attacks.
   * @param _token0 An ERC20 token address. Token must have already a pool
   * @param _token1 An ERC20 token address. Token must have already a pool
   * @param _to The address of the recipient that receives the _amount1Out tokens
   */
  function swap(
    address _token0,
    address _token1,
    address _to
  )
    external
    override
    pausable
    doubleLock(_token0, _token1)
    returns (uint amount0In, uint amount1Out)
  {
    (amount0In, amount1Out) = _swap(_token0, _token1, _to);
    emit Swap(msg.sender, amount0In, amount1Out, _to);
  }

  /**
   * @notice Performs two-sided liquidity provisioning and mints in return liquidity tokens for a given pool. The amount of liquidity tokens minted depend on the amount of _token and wETH provided
   * @dev This low-level function should be called from a contract which performs important safety checks.
   * This function locks the pool of _token to prevent reentrancy attacks.
   * @param _token An ERC20 token address. Token must have already a pool
   * @param _to The address of the recipient that receives the minted liquidity tokens
   * @return liquidity The amount of liquidity tokens minted
   */
  function mint(
    address _token,
    address _to
  ) external override pausable singleLock(_token) returns (uint liquidity) {
    address pool = XfaiLibrary.poolFor(_token, factory, poolCodeHash);
    (uint reserve, uint weight) = IXfaiPool(pool).getStates();
    uint tokenBalance = IERC20(_token).balanceOf(pool);
    uint wETHBalance = IERC20(wETH).balanceOf(pool);
    uint tokenIn = tokenBalance - reserve;
    uint weightIn = wETHBalance - weight;
    uint _totalSupply = IERC20(pool).totalSupply();
    if (_totalSupply == 0) {
      liquidity = Math.sqrt(tokenIn * weightIn) - MINIMUM_LIQUIDITY;
      IXfaiPool(pool).mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
    } else {
      liquidity = Math.min((tokenIn * _totalSupply) / reserve, (weightIn * _totalSupply) / weight);
    }
    require(liquidity > 0, 'XfaiV0Core: INSUFFICIENT_LIQUIDITY_MINTED');
    IXfaiPool(pool).mint(_to, liquidity);
    IXfaiPool(pool).update(tokenBalance, wETHBalance);
    emit Mint(msg.sender, liquidity);
  }

  /**
   * @notice Burns existing liquidity tokens for a given pool. The amount of _token0 and _token1 returned depend on the amount of liquidity tokens burned and on the reserves & weights of pool0 and / or pool1
   * @dev This low-level function should be called from a contract which performs important safety checks.
   * This function locks the pool of _token0 and _token1 to prevent reentrancy attacks.
   * @param _token0 An ERC20 token address. Token must have already a pool
   * @param _token1 An ERC20 token address. Token must have already a pool
   * @param _to The address of the recipient that receives the redeemed liquidity
   * @return amount0Out The amount of tokens0 that one receives
   * @return amount1Out THe amount of tokens1 that one receives
   */
  function burn(
    address _token0,
    address _token1,
    address _to
  )
    external
    override
    pausable
    doubleLock(_token0, _token1)
    returns (uint amount0Out, uint amount1Out)
  {
    address _wETH = wETH; // gas saving
    require(_token0 != _wETH, 'XfaiV0Core: INVALID_PRIMARY_TOKEN');
    address pool0 = XfaiLibrary.poolFor(_token0, factory, poolCodeHash);
    address pool1 = XfaiLibrary.poolFor(_token1, factory, poolCodeHash);
    uint liquidity = IERC20(pool0).balanceOf(address(this));
    uint totalSupply = IERC20(pool0).totalSupply();
    amount0Out = (liquidity * IERC20(_token0).balanceOf(pool0)) / totalSupply; // using balances ensures pro-rata distribution
    amount1Out = (liquidity * IERC20(_wETH).balanceOf(pool0)) / totalSupply; // using balances ensures pro-rata distribution
    require(amount0Out > 0 && amount1Out > 0, 'XfaiV0Core: INSUFFICIENT_LIQUIDITY_BURNED');
    IXfaiPool(pool0).linkedTransfer(_token0, _to, amount0Out);
    if (_token1 == _wETH) {
      IXfaiPool(pool0).linkedTransfer(_wETH, _to, amount1Out);
      IXfaiPool(pool0).update(IERC20(_token0).balanceOf(pool0), IERC20(_wETH).balanceOf(pool0));
    } else {
      IXfaiPool(pool0).linkedTransfer(_wETH, pool1, amount1Out);
      IXfaiPool(pool0).update(IERC20(_token0).balanceOf(pool0), IERC20(_wETH).balanceOf(pool0));
      (, amount1Out) = _swap1(pool1, _token1, _to, true);
    }
    IXfaiPool(pool0).burn(address(this), liquidity);
    emit Burn(msg.sender, amount0Out, amount1Out, _to);
  }

  /**
   * @notice Enables users to request flash loans from Xfai
   * @dev The recipient _to of the flash loan needs to be a smart contract that supports the IDeXFaiV0FlashLoan functions.
   * This function locks the pool of _token to prevent reentrancy attacks.
   * @param _token An ERC20 token address. Token must have already a pool
   * @param _tokenAmount The token amount for the flash loan.
   * @param _wethAmount The weth amount for the flash loan.
   * @param _to The address of the recipient that receives the flash loan
   * @param _data the additional bytes data used for the flash loan
   */
  function flashLoan(
    address _token,
    uint _tokenAmount,
    uint _wethAmount,
    address _to,
    bytes calldata _data
  ) external override pausable singleLock(_token) {
    require(_to != address(0), 'XfaiV0Core INVALID_TO');
    address _weth = wETH;
    address pool = XfaiLibrary.poolFor(_token, factory, poolCodeHash);

    uint tokenBalance = IERC20(_token).balanceOf(pool);
    uint wethBalance = IERC20(_weth).balanceOf(pool);
    require(
      _tokenAmount <= tokenBalance && _wethAmount <= wethBalance,
      'XfaiV0Core: INSUFFICIENT_AMOUNT'
    );

    if (_tokenAmount > 0) IXfaiPool(pool).linkedTransfer(_token, _to, _tokenAmount); // optimistically transfer tokens
    if (_wethAmount > 0) IXfaiPool(pool).linkedTransfer(_weth, _to, _wethAmount); // optimistically transfer tokens

    IXfaiV0FlashLoan(_to).flashLoan(pool, _tokenAmount, _wethAmount, _data);

    require(
      IERC20(_token).balanceOf(pool) * IERC20(_weth).balanceOf(pool) >=
        (tokenBalance + ((_tokenAmount * getTotalFee()) / 10000)) *
          (wethBalance + ((_wethAmount * getTotalFee()) / 10000)),
      'XfaiV0Core: INSUFFICIENT_AMOUNT_RETURNED'
    );

    if (_tokenAmount > 0)
      IXfaiPool(pool).linkedTransfer(_token, infinityNFT, (_tokenAmount * infinityNFTFee) / 10000); // send lnft fee to fee collecting contract
    if (_wethAmount > 0)
      IXfaiPool(pool).linkedTransfer(_weth, infinityNFT, (_wethAmount * infinityNFTFee) / 10000); // send lnft fee to fee collecting contract

    IXfaiPool(pool).update(IERC20(_token).balanceOf(pool), IERC20(_weth).balanceOf(pool));
    emit FlashLoan(_to, _tokenAmount, _wethAmount);
  }

  /**
   * @notice Force the token balance of a pool to match its reserves
   * @dev This function locks the pool of _token to prevent reentrancy attacks.
   * @param _token An ERC20 token address. Token must have already a pool
   * @param _to The recipient of the skim
   */
  function skim(address _token, address _to) external override pausable singleLock(_token) {
    address _wETH = wETH; // gas saving
    address pool = XfaiLibrary.poolFor(_token, factory, poolCodeHash);
    (uint reserve, uint weight) = IXfaiPool(pool).getStates();
    uint tokenBalanceDif = IERC20(_token).balanceOf(pool) - reserve;
    uint wETHBalanceDif = IERC20(_wETH).balanceOf(pool) - weight;
    if (tokenBalanceDif > 0) {
      IXfaiPool(pool).linkedTransfer(_token, _to, tokenBalanceDif);
    }
    if (wETHBalanceDif > 0) {
      IXfaiPool(pool).linkedTransfer(_wETH, _to, wETHBalanceDif);
    }
  }

  /**
   * @notice Force the reserves of a pool to match its token balance
   * @dev This function locks the pool of _token to prevent reentrancy attacks.
   * @param _token An ERC20 token address. Token must have already a pool
   */
  function sync(address _token) external override pausable singleLock(_token) {
    address pool = XfaiLibrary.poolFor(_token, factory, poolCodeHash);
    uint tokenBalance = IERC20(_token).balanceOf(pool);
    uint wETHBalance = IERC20(wETH).balanceOf(pool);
    IXfaiPool(pool).update(tokenBalance, wETHBalance);
  }

  /**
   * @notice Pause any function that can change the state of a pool within Xfai
   * @dev Only the owner of the XfaiV0Core contract can call this function
   * @param _p the boolean to determine if XfaiV0Core is paused or not
   */
  function pause(bool _p) external override onlyOwner {
    paused = _p;
    emit Paused(_p);
  }
}
