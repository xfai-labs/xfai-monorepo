// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.19;

import './XfaiPool.sol';

import '../interfaces/IXfaiFactory.sol';
import '../interfaces/IXfaiPool.sol';

/**
 * @title Xfai's Factory contract
 * @author Xfai
 * @notice Besides creating Pools, XfaiFactory also manages the core address for XfaiPools
 */
contract XfaiFactory is IXfaiFactory {
  /**
   * @notice The owner address of the factory
   */
  address private owner;

  /**
   * @notice The XfaiV0Core address of Xfai
   */
  address private xfaiCore;

  /**
   * @notice The address of the wETH token
   */
  address private wETH;

  /**
   * @notice The address array of all deployed XfaiPool contracts
   */
  address[] public override allPools;

  /**
   * @notice The address mapping from hosted tokens to pool address
   */
  mapping(address => address) public override getPool;

  /**
   * @notice Functions with the onlyOwner modifier can be called only by the factory owner
   */
  modifier onlyOwner() {
    require(msg.sender == owner, 'XfaiFactory: NOT_OWNER');
    _;
  }

  /**
   * @notice Construct Xfai's Factory
   * @param _owner The owner of the XfaiFactory contract
   * @param _wETH The address of the wETH token
   */
  constructor(address _owner, address _wETH) {
    owner = _owner;
    wETH = _wETH;
  }

  /**
   * @notice Returns the length of the allPools array, representing the number of pools hosted on the DEX
   */
  function allPoolsLength() external view override returns (uint) {
    return allPools.length;
  }

  /**
   * @notice Computes the code hash of the XfaiPool contract
   */
  function poolCodeHash() external pure override returns (bytes32) {
    return keccak256(type(XfaiPool).creationCode);
  }

  /**
   * @notice Creates an XfaiPool for a given ERC20 token
   * @dev Notice, _token cannot be the wETH token address
   * @param _token The token address of an ERC20 token
   * @return pool The address of the created XfaiPool
   */
  function createPool(address _token) public override returns (address pool) {
    require(_token != address(0), 'XfaiFactory: ZERO_ADDRESS');
    require(getPool[_token] == address(0), 'XfaiFactory: POOL_EXISTS');
    require(_token != wETH, 'XfaiFactory: WETH_ADDRESS');
    bytes memory bytecode = type(XfaiPool).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(_token));
    assembly {
      pool := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
    IXfaiPool(pool).initialize(_token, address(this));
    getPool[_token] = pool;
    allPools.push(pool);
    emit PoolCreated(_token, pool, allPools.length);
  }

  /**
   * @notice Assigns a new Xfai Core to Xfai
   * @dev Can only be called by owner
   * @param _core The address of the new Xfai Core contract
   */
  function setXfaiCore(address _core) external override onlyOwner {
    xfaiCore = _core;
    emit ChangedCore(_core);
  }

  /**
   * @notice Used to receive the latest Xfai Core address
   */
  function getXfaiCore() external view override returns (address) {
    return xfaiCore;
  }

  /**
   * @notice Assigns a new owner to the factory
   * @dev Can only be called by owner
   * @param _owner The address of the new owner
   */
  function setOwner(address _owner) external override onlyOwner {
    owner = _owner;
    emit ChangedOwner(_owner);
  }

  /**
   * @notice Used to return the owner of the factory
   */
  function getOwner() external view override returns (address) {
    return owner;
  }
}
