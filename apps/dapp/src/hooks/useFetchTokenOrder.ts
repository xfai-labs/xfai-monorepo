import { useMemo } from 'react';
import useBackendQuery from './meta/useBackendQuery';
import { useLocalStorage } from 'usehooks-ts';

const useFetchTokenOrder = () => {
  const [tokenOrder, setTokenOrder] = useLocalStorage<{
    last_updated: number;
    data: Record<string, number>;
  }>('tokenOrder', {
    last_updated: 0,
    data: {},
  });

  useBackendQuery<Record<string, number>>(
    ['tvl'],
    () => ({
      url: '/tvl',
    }),
    {
      onSuccess: (response) => {
        setTokenOrder({
          last_updated: Date.now(),
          data: response.data,
        });
      },
      enabled: Date.now() - tokenOrder.last_updated > 1000 * 60 * 60 * 24,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => tokenOrder.data, [tokenOrder.last_updated]);
};

export default useFetchTokenOrder;
