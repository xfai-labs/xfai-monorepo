// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

library Math {
  function min(uint _a, uint _b) internal pure returns (uint) {
    return _a < _b ? _a : _b;
  }

  function sqrt(uint _y) internal pure returns (uint z) {
    if (_y > 3) {
      z = _y;
      uint x = _y / 2 + 1;
      while (x < z) {
        z = x;
        x = (_y / x + x) / 2;
      }
    } else if (_y != 0) {
      z = 1;
    }
  }
}
