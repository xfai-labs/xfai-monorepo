import { Layout, LogoIconAnimated } from '@xfai-labs/ui-components';
import Pools, { Period, Order, PeriodsList } from '@analytics/components/Pools';
import TotalValueLockedLineChart from '@analytics/components/TotalValueLockedLineChart';
import TotalFeesBarChart from '@analytics/components/TotalFeesBarChart';
import XFIT from '@analytics/components/XFIT';
import { motion } from 'framer-motion';
import { TokenList } from '@uniswap/token-lists';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FeeMetricResponse,
  PoolAnalyticsResponse,
  TVLMetricResponse,
  XFitStatsResponse,
} from '@analytics/types/backend';
import Localization from '@analytics/localization';
type Response = {
  data: PoolAnalyticsResponse[];
  meta: {
    total: number;
    currentPage: number;
    prev: number | null;
    next: number | null;
    lastPage: number;
  };
};

const Home = ({ pools, tokenList, tvls, fees, xfit, api_base_url }) => {
  const [clientSide, setClientSide] = useState(false);
  const [page, setPageOriginal] = useState(1);

  const [search, setSearchOriginal] = useState('');
  const [period, setPeriod] = useState<Period>(PeriodsList[0]);
  const [order, setOrderOriginal] = useState<Order>({ orderby: 'tvl', order: 'desc' });

  useEffect(() => {
    setPageOriginal(1);
  }, [api_base_url]);

  const setPage = useCallback((page) => {
    setClientSide(true);
    setPageOriginal(page);
  }, []);

  const setSearch = useCallback((search) => {
    setClientSide(true);
    setPageOriginal(1);
    setSearchOriginal(search);
  }, []);

  const setOrder = useCallback((order) => {
    setClientSide(true);
    setPageOriginal(1);
    setOrderOriginal(order);
  }, []);

  const periodOrderQuery = useMemo(() => {
    return order.orderby === 'volume' ||
      order.orderby === 'fees' ||
      order.orderby === 'price_change'
      ? period.value
      : '';
  }, [order.orderby, period]);

  const { data: otherPages, isLoading } = useQuery({
    queryKey: ['pools', page, search, order, periodOrderQuery, api_base_url],
    queryFn: () =>
      fetch(
        `${api_base_url}/metrics/pools?page=${page}&search=${search}&orderby=${periodOrderQuery}${order.orderby}&order=${order.order}`,
      ).then((res) => res.json() as Promise<Response>),
    select: (page) => ({
      ...page,
      data: page.data.map((pool) => ({
        ...pool,
        token: tokenList.find(
          (token) => token.address.toLowerCase() === pool.tokenAddress.toLowerCase(),
        ),
      })),
    }),
    enabled: clientSide,
  });

  const updating = false;

  if (updating) {
    return (
      <motion.div
        key="homepage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
        className="flex h-full grow flex-col items-center justify-center gap-5 self-stretch text-center"
      >
        <LogoIconAnimated className="h-10 w-10" />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-light uppercase">
            {Localization.Message.WELL_BE_BACK_SOON}
          </h1>
          <p className="max-w-xs text-sm font-light leading-tight">
            {Localization.Message.UPDATING}
            <br />
            {Localization.Message.CHECK_BACK}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="homepage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
      className="flex w-full grow flex-col items-center gap-12 self-stretch lg:gap-16 2xl:gap-24"
    >
      <Layout.Section>
        <Layout.Row>
          <Layout.Column className="w-full">
            <XFIT xfit={xfit} />
          </Layout.Column>
        </Layout.Row>
        <Layout.Row className="grid grid-cols-1 lg:grid-cols-2">
          <Layout.Column>
            <TotalValueLockedLineChart tvls={tvls} />
          </Layout.Column>
          <Layout.Column>
            <TotalFeesBarChart fees={fees} api_base_url={api_base_url} />
          </Layout.Column>
        </Layout.Row>
      </Layout.Section>
      <Layout.Row>
        <Layout.Column className="w-full">
          <Pools
            loading={clientSide && isLoading}
            pools={!clientSide && pools ? pools : clientSide && otherPages ? otherPages : null}
            search={search}
            setPage={setPage}
            period={period}
            setPeriod={setPeriod}
            setSearch={setSearch}
            order={order}
            setOrder={setOrder}
          />
        </Layout.Column>
      </Layout.Row>
    </motion.div>
  );
};

export async function getStaticProps({ params }) {
  const { network } = params;

  const BACKEND_URL = `https://analytics.xfai.com/${network === 'ethereum' ? 'mapi' : 'api'}`;

  const [tokenList, page, tvls, fees, xfit] = await Promise.all([
    fetch(`${BACKEND_URL}/token-list`).then((res) => res.json() as Promise<TokenList['tokens']>),
    fetch(`${BACKEND_URL}/metrics/pools`).then((res) => res.json() as Promise<Response>),
    fetch(`${BACKEND_URL}/metrics/tvl`).then((res) => res.json() as Promise<TVLMetricResponse>),
    fetch(`${BACKEND_URL}/metrics/fees`).then((res) => res.json() as Promise<FeeMetricResponse>),
    fetch(`${BACKEND_URL}/metrics/xfit`).then((res) => res.json() as Promise<XFitStatsResponse>),
  ]);

  const pools = {
    ...page,
    data: page.data.map((pool) => ({
      ...pool,
      token: tokenList.find(
        (token) => token.address.toLowerCase() === pool.tokenAddress.toLowerCase(),
      ),
    })),
  };

  return {
    props: {
      tokenList: tokenList,
      pools,
      tvls,
      fees,
      xfit,
      api_base_url: BACKEND_URL,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 120, // In seconds
  };
}

export async function getStaticPaths() {
  return {
    paths: ['/linea'],
    fallback: false,
  };
}

export default Home;
