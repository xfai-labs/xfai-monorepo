import { Xfai } from '@xfai-labs/sdk';

const chain = 'linea';

export const getClosestBlock = async (xfai: Xfai, timestamp: number) => {
  const data = await fetch(`https://coins.llama.fi/block/${chain}/${timestamp}`).then((r) =>
    r.json<{
      height: bigint;
      timestamp: number;
    }>(),
  );
  return Number(data.height);
};
