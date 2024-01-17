import { INFT, getINFTOwnership, isParsedEthersError } from '@xfai-labs/sdk';
import useAccountQuery from '../meta/useAccountQuery';

export type NftOwnership = ReturnType<typeof useGetINFTOwnership>['data'];
export default function useGetINFTOwnership(inft: undefined | INFT) {
  return useAccountQuery(
    ['inftOwnership', inft?.id],
    async (xfai, account) => {
      const user = account.address.toLowerCase();
      // We can disable bc of the enabled check
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { owner } = await getINFTOwnership(xfai, inft!);
      const isOwner = owner === user;

      return {
        owner,
        isOwner,
      } as const;
    },
    {
      staleTime: 1000 * 60 * 5,
      enabled: !!inft,
      retry: (c, e) => {
        if (isParsedEthersError(e) && e.context.errorCode === 'CALL_REVERTED') {
          // NFT does not exist
          return false;
        }
        return c < 3;
      },
      retryDelay: 1000,
    },
  );
}
