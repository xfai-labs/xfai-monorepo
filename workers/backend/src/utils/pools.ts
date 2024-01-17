import { BlockTag } from '@ethersproject/providers';
import { IERC20Metadata__factory, IXfaiINFT__factory } from '@xfai-labs/dex';
import { Xfai, Token, multicall } from '@xfai-labs/sdk';

export const getHarvestedFees = async (xfai: Xfai, tokens: Token[], blockTag: BlockTag) => {
  const harvestedBalances = await multicall(
    xfai,
    IXfaiINFT__factory,
    tokens.map((token) => ({
      contractAddress: xfai.inftAddress,
      arguments: [token.address],
      function_name: 'harvestedBalance',
    })),
    {
      key: ({ arguments: [tokenAddress] }) => tokenAddress,
      allowFailure: false,
      callOverrides: {
        blockTag,
      },
    },
  );

  return harvestedBalances;
};

export const getBalance = async (xfai: Xfai, tokens: Token[], blockTag: BlockTag) => {
  const currentBalances = await multicall(
    xfai,
    IERC20Metadata__factory,
    tokens.map((token) => ({
      contractAddress: token.address,
      arguments: [xfai.inftAddress],
      function_name: 'balanceOf',
    })),
    {
      callOverrides: {
        blockTag,
      },
    },
  );

  return currentBalances;
};
