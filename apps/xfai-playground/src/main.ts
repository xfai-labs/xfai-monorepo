import { StaticJsonRpcProvider } from '@ethersproject/providers';
import {
  Chains,
  Xfai,
  getPoolState,
  getPoolFromToken,
  getSwapOutputAmount,
  Token,
} from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';

const chain = Chains[5777];

const provider = new StaticJsonRpcProvider({
  url: chain.rpcUrl,
  skipFetchSetup: true,
});

const xfai = new Xfai(provider, chain);

async function bootstrap() {
  const weth_state = await getPoolState(xfai, getPoolFromToken(xfai, xfai.wrappedNativeToken));
  const usdc_state = await getPoolState(xfai, getPoolFromToken(xfai, xfai.usdc));

  const amountInput = BigNumber.from(10).pow(17);

  console.log({
    wethAmountInput: amountInput.toString(),
    usdcAmountOutput: getSwapOutputAmount(
      xfai,
      { token: xfai.wrappedNativeToken, state: weth_state },
      { token: xfai.usdc, state: usdc_state },
      amountInput,
    ).toString(),
  });

  console.log({
    xfEthAmountInput: amountInput.toString(),
    usdcAmountOutput: getSwapOutputAmount(
      xfai,
      {
        token: xfai.wrappedNativeToken,
        state: undefined,
      },
      { token: xfai.usdc, state: usdc_state },
      amountInput,
    ).toString(),
  });

  const xfit_state = await getPoolState(xfai, getPoolFromToken(xfai, xfai.underlyingToken));

  console.log({
    wethAmountInput: amountInput.toString(),
    usdcAmountOutput: getSwapOutputAmount(
      xfai,
      { token: xfai.underlyingToken, state: xfit_state },
      { token: xfai.usdc, state: usdc_state },
      amountInput,
    ).toString(),
  });

  const usdp = Token('0x8E870D67F660D95d5be530380D0eC0bd388289E1');

  const usdp_state = await getPoolState(xfai, getPoolFromToken(xfai, usdp));

  console.log({
    usdc_input: amountInput.toString(),
    usdcAmountOutput: getSwapOutputAmount(
      xfai,
      { token: xfai.usdc, state: usdc_state },
      { token: usdp, state: usdp_state },
      amountInput,
    ).toString(),
  });

  process.exit();
}

bootstrap().catch((e) => console.error(e));
