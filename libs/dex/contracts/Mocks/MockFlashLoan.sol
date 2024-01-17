// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import '../../interfaces/IERC20.sol';

contract MockFlashLoan {
  address token;
  address weth;

  constructor(address _token, address _weth) {
    token = _token;
    weth = _weth;
  }

  function flashLoan(
    address _pool,
    uint _tokenAmount,
    uint _wethAmount,
    bytes calldata /*_data*/
  ) external {
    uint tokenBalance = IERC20(token).balanceOf(address(this)); // used only for testing purposes
    uint wethBalance = IERC20(weth).balanceOf(address(this)); // used only for testing purposes
    /*
      Insert here the lines of code that uses the flash loan.
    */
    if (_tokenAmount != 0) _safeTransfer(token, _pool, tokenBalance);
    if (_wethAmount != 0) _safeTransfer(weth, _pool, wethBalance);
  }

  function _safeTransfer(address _token, address _to, uint256 _value) internal {
    require(_token.code.length > 0);
    (bool success, bytes memory data) = _token.call(
      abi.encodeWithSelector(IERC20.transfer.selector, _to, _value)
    );
    require(success && (data.length == 0 || abi.decode(data, (bool))));
  }
}
