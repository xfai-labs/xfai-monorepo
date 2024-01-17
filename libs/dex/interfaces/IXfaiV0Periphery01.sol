// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.19;

interface IXfaiV0Periphery01 {
  function addLiquidity(
    address _to,
    address _token,
    uint _amountTokenDesired,
    uint _amountTokenMin,
    uint _amountETHMin,
    uint _deadline
  ) external payable returns (uint liquidity);

  function addLiquidityETH(address _to, uint _deadline) external payable returns (uint liquidity);

  function removeLiquidity(
    address _to,
    address _token0,
    address _token1,
    uint _liquidity,
    uint _amount0Min,
    uint _amount1Min,
    uint _deadline
  ) external returns (uint amount0, uint amount1);

  function swapExactTokensForTokens(
    address _to,
    address _token0,
    address _token1,
    uint _amount0In,
    uint _amount1OutMin,
    uint _deadline
  ) external returns (uint);

  function swapTokensForExactTokens(
    address _to,
    address _token0,
    address _token1,
    uint _amount1Out,
    uint _amount0InMax,
    uint _deadline
  ) external returns (uint);

  function swapExactETHForTokens(
    address _to,
    address _token1,
    uint _amount1OutMin,
    uint _deadline
  ) external payable returns (uint);

  function swapTokensForExactETH(
    address _to,
    address _token0,
    uint _amount1Out,
    uint _amount0InMax,
    uint _deadline
  ) external returns (uint amount0In);

  function swapExactTokensForETH(
    address _to,
    address _token0,
    uint _amount0In,
    uint _amount1OutMin,
    uint _deadline
  ) external returns (uint);

  function swapETHForExactTokens(
    address _to,
    address _token1,
    uint _amount1Out,
    uint _deadline
  ) external payable returns (uint input);
}
