// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import '../../interfaces/IERC20.sol';
import '../../interfaces/IWETH.sol';

contract MockWETH is IERC20, IWETH {
  string public constant name = 'Wrapped Ether';
  string public constant symbol = 'WETH';
  uint8 public constant decimals = 18;
  uint public override totalSupply;
  mapping(address => uint) public override balanceOf;
  mapping(address => mapping(address => uint)) public override allowance;

  bytes32 public DOMAIN_SEPARATOR;
  // keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
  bytes32 public constant PERMIT_TYPEHASH =
    0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
  mapping(address => uint) public nonces;

  event Deposit(address indexed dst, uint wad);
  event Withdrawal(address indexed src, uint wad);

  constructor() {
    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        keccak256(
          'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
        ),
        keccak256(bytes(name)),
        keccak256('1'),
        block.chainid,
        address(this)
      )
    );
  }

  function _mint(address _dst, uint _amount) internal {
    totalSupply += _amount;
    balanceOf[_dst] += _amount;
    emit Transfer(address(0), _dst, _amount);
  }

  function _burn(address _dst, uint _amount) internal {
    totalSupply -= _amount;
    balanceOf[_dst] -= _amount;
    emit Transfer(_dst, address(0), _amount);
  }

  function approve(address _spender, uint _amount) external override returns (bool) {
    allowance[msg.sender][_spender] = _amount;

    emit Approval(msg.sender, _spender, _amount);
    return true;
  }

  function permit(
    address _owner,
    address _spender,
    uint _value,
    uint _deadline,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  ) external {
    require(_deadline >= block.timestamp, 'DexfaiPool: EXPIRED');
    bytes32 digest = keccak256(
      abi.encodePacked(
        '\x19\x01',
        DOMAIN_SEPARATOR,
        keccak256(
          abi.encode(PERMIT_TYPEHASH, _owner, _spender, _value, nonces[_owner]++, _deadline)
        )
      )
    );
    address recoveredAddress = ecrecover(digest, _v, _r, _s);
    require(
      recoveredAddress != address(0) && recoveredAddress == _owner,
      'DexfaiPool: INVALID_SIGNATURE'
    );
    allowance[_owner][_spender] = _value;

    emit Approval(_owner, _spender, _value);
  }

  function transfer(address _dst, uint _amount) external override(IERC20, IWETH) returns (bool) {
    _transferTokens(msg.sender, _dst, _amount);
    return true;
  }

  function transferFrom(address _src, address _dst, uint _amount) external override returns (bool) {
    address spender = msg.sender;
    uint spenderAllowance = allowance[_src][spender];

    if (spender != _src && spenderAllowance != type(uint).max) {
      uint newAllowance = spenderAllowance - _amount;
      allowance[_src][spender] = newAllowance;

      emit Approval(_src, spender, newAllowance);
    }

    _transferTokens(_src, _dst, _amount);
    return true;
  }

  function _transferTokens(address _src, address _dst, uint _amount) internal {
    balanceOf[_src] -= _amount;
    balanceOf[_dst] += _amount;

    emit Transfer(_src, _dst, _amount);
  }

  /// @dev mint tokens for sender based on amount of ether sent.
  function deposit() external payable override(IWETH) {
    _mint(msg.sender, msg.value);
    emit Deposit(msg.sender, msg.value);
  }

  /// @dev withdraw ether based on requested amount and user balance.
  function withdraw(uint _amount) external override(IWETH) {
    require(balanceOf[msg.sender] >= _amount, 'insufficient balance.');
    _burn(msg.sender, _amount);
    payable(msg.sender).transfer(_amount);
    emit Withdrawal(msg.sender, _amount);
  }
}
