import { INFT, getINFTBalance, AccountAddress, getINFTsForOwner } from '@xfai-labs/sdk';
import useAccountQuery from '../meta/useAccountQuery';

export function useINFTs() {
  const { data: balance } = useAccountQuery(['inftBalance'], (xfai, account) =>
    getINFTBalance(xfai, AccountAddress(account.address)),
  );

  return useAccountQuery(
    ['infts', balance],
    async (xfai, account) => {
      if (balance === 0) {
        return [];
      }

      const infts = await getINFTsForOwner(xfai, AccountAddress(account.address), balance!);

      return Object.values(infts).map((id) => INFT(id.toNumber()));
    },
    {
      enabled: balance !== undefined,
      staleTime: 1000 * 60 * 5,
    },
  );
}
