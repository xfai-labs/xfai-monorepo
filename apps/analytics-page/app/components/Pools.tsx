/* eslint-disable @next/next/no-img-element */
import { FunctionComponent } from 'react';
import Table from '@analytics/components/Table';
import Localization from '@analytics/localization';
import {
  Button,
  PresetItem,
  ButtonIcon,
  DropdownList,
  DropdownItem,
  IconArrowStemThickDown,
  IconArrowStemThickUp,
  IconSelectArrows,
  SkeletonWrapper,
  SearchBar,
  TokenUnknown,
} from '@xfai-labs/ui-components';
import { TokenInfo } from '@uniswap/token-lists';
import { PoolAnalyticsResponse } from '@analytics/types/backend';
import Change from './Change';
import Skeleton from 'react-loading-skeleton';
import DropdownRC from 'rc-dropdown';

export type Periods = 'daily_' | 'weekly_' | '';

type Columns = 'name' | 'price' | 'price_change' | 'change' | 'volume' | 'tvl' | 'fees';

export type Order = {
  orderby: Columns;
  order: 'asc' | 'desc';
};

export type Period = {
  shortLabel?: string;
} & PresetItem<Periods>;

export const PeriodsList: Period[] = [
  {
    label: Localization.Button.ONE_DAY,
    shortLabel: Localization.Label.ONE_DAY_SHORT,
    value: 'daily_',
  },
  {
    label: Localization.Button.ONE_WEEK,
    shortLabel: Localization.Label.ONE_WEEK_SHORT,
    value: 'weekly_',
  },
  { label: Localization.Button.ALL_TIME, value: '' },
];

type Column = {
  period?: Period;
} & PresetItem<Columns>;

type Props = {
  loading?: boolean;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  search?: string;
  pools?: {
    data: (PoolAnalyticsResponse & { token: TokenInfo | undefined })[];
    meta: {
      total: number;
      currentPage: number;
      prev: number | null;
      next: number | null;
      lastPage: number;
    };
  };
  period: Period;
  setPeriod: (period: Period) => void;
  order: Order;
  setOrder: (order: Order) => void;
};

const formatPrice = (priceString: string) => {
  const price = Number(priceString);
  if (price < 1e-3) {
    if (price >= 1e-7) {
      return Number(price).toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 7,
      });
    }
    return '$<0.0000001';
  }
  return Number(price).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3,
  });
};

const Pools: FunctionComponent<Props> = ({
  loading = false,
  pools,
  setPage,
  period,
  setPeriod,
  search,
  setSearch,
  order,
  setOrder,
}) => {
  const columns: Column[] = [
    { label: Localization.Label.POOL, value: 'name' },
    { label: Localization.Label.PRICE, value: 'price' },
    { period: period, label: Localization.Label.PRICE_CHANGE, value: 'price_change' },
    { period: period, label: Localization.Label.VOLUME, value: 'volume' },
    { label: Localization.Label.TVL, value: 'tvl' },
    { period: period, label: Localization.Label.FEES_EARNED, value: 'fees' },
  ];

  const options = (
    <DropdownList arrow={false}>
      {columns.map((column, index) => (
        <DropdownItem
          key={column.value + index}
          onClick={() => {
            if (column.value === order.orderby) {
              setOrder({
                orderby: column.value,
                order: order.order === 'desc' ? 'asc' : 'desc',
              });
            } else {
              setOrder({
                orderby: column.value,
                order: 'desc',
              });
            }
          }}
          icon={
            column.value === order.orderby
              ? order.order === 'desc'
                ? IconArrowStemThickDown
                : IconArrowStemThickUp
              : undefined
          }
          iconPlacement="right"
          iconClassName="!h-3 !w-3 fill-10"
        >
          <span>
            {column.label}
            <span className="text-xs font-normal opacity-60">
              {column.period?.shortLabel ? ` (${column.period.shortLabel})` : ''}
            </span>
          </span>
        </DropdownItem>
      ))}
    </DropdownList>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <h2 className="text-xl font-semibold xl:text-2xl">{Localization.Label.LIQUIDITY_POOLS}</h2>

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <SearchBar
            placeholder={Localization.Label.SEARCH_POOL}
            size="small"
            defaultValue={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            {PeriodsList.map((filter) => (
              <Button
                key={filter.label}
                size="filter"
                bgColor="bg-70 dark:bg-50 hover:bg-50 dark:hover:bg-40"
                color="text-5 hover:text-white-blue"
                disabledBgColor="bg-60 dark:bg-30"
                disabledColor="text-white-blue"
                onClick={() => setPeriod(filter)}
                disabled={filter.value === period.value}
              >
                {filter.label}
              </Button>
            ))}
            <DropdownRC
              trigger={['click']}
              placement="topRight"
              overlay={options}
              prefixCls="dropdown"
              overlayClassName="!pointer-events-auto"
            >
              <ButtonIcon
                className="md:hidden"
                iconWrapperClassName="!rounded-md"
                size="filter"
                bgColor="bg-70 hover:bg-60"
                color="fill-5 hover:fill-white-blue"
                icon={IconSelectArrows}
              />
            </DropdownRC>
          </div>
        </div>
      </div>

      <Table.Wrapper>
        <Table.Row type="header" columns="pools">
          {columns.map((column, index) => (
            <Table.HeaderColumn
              align={column.value === 'name' ? 'left' : 'right'}
              order={column.value === order.orderby ? order.order : undefined}
              onClick={() => {
                if (column.value === order.orderby) {
                  setOrder({
                    orderby: column.value,
                    order: order.order === 'desc' ? 'asc' : 'desc',
                  });
                } else {
                  setOrder({
                    orderby: column.value,
                    order: 'desc',
                  });
                }
              }}
              key={column.value}
            >
              <span>
                {column.label}
                <span className="text-xs font-normal opacity-60">
                  {column.period?.shortLabel ? ` (${column.period.shortLabel})` : ''}
                </span>
              </span>
            </Table.HeaderColumn>
          ))}
        </Table.Row>

        {!loading ? (
          <>
            {pools && pools.data.length > 0 ? (
              <>
                {pools.data.map((pool, index) => {
                  const priceChange = parseFloat(pool[`${period.value}price_change`]);

                  return (
                    <Table.Row columns="pools" key={index}>
                      <Table.Column align="left">
                        <div className="flex items-center gap-2">
                          {pool.token ? (
                            pool.token?.logoURI ? (
                              <img
                                src={pool.token.logoURI}
                                alt={`${pool.token.name}(${pool.token.address})`}
                                width={28}
                                height={28}
                                className="rounded-full"
                              />
                            ) : (
                              <TokenUnknown
                                width={28}
                                height={28}
                                className={'rounded-full'}
                                alt={`${pool.token.name}(${pool.token.address})`}
                              />
                            )
                          ) : (
                            <Skeleton width={28} height={28} className="rounded-full" />
                          )}
                          {pool.token?.symbol ?? pool.name}
                          {/* {pool.token?.symbol === 'ETH' && (
                            <Tooltip text="Highlighted Bc">
                              <IconStar className="h-4 w-4 fill-orange-400" />
                            </Tooltip>
                          )} */}
                        </div>
                      </Table.Column>
                      <Table.Column name={Localization.Label.PRICE}>
                        {formatPrice(pool.price)}
                      </Table.Column>
                      <Table.Column name={Localization.Label.PRICE_CHANGE}>
                        <Change
                          change={
                            priceChange > 0
                              ? 'positive'
                              : priceChange === 0
                              ? 'neutral'
                              : 'negative'
                          }
                        >
                          ({priceChange.toFixed(2)}%)
                        </Change>
                      </Table.Column>
                      <Table.Column name={Localization.Label.VOLUME}>
                        {Number(pool[`${period.value}volume`]).toLocaleString(undefined, {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                        })}
                      </Table.Column>
                      <Table.Column name={Localization.Label.TVL}>
                        {Number(pool.tvl).toLocaleString(undefined, {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                        })}
                      </Table.Column>
                      <Table.Column name={Localization.Label.FEES_EARNED}>
                        {Number(pool[`${period.value}fees`]).toLocaleString(undefined, {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                        })}
                      </Table.Column>
                    </Table.Row>
                  );
                })}
              </>
            ) : (
              <div className="flex h-[560px] items-center justify-center p-4">
                <p className="text-10 text-center text-xl uppercase">
                  {Localization.Message.NO_POOLS_FOUND}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {[...new Array(10)].map((_, index) => (
              <Table.Row columns="pools" key={index}>
                <Table.Column align="left">
                  <div className="flex items-center gap-2">
                    <Skeleton width={28} height={28} className="rounded-full" />
                    <SkeletonWrapper>LOADING</SkeletonWrapper>
                  </div>
                </Table.Column>
                <Table.Column loading name={Localization.Label.PRICE} />
                <Table.Column loading name={Localization.Label.PRICE_CHANGE} />
                <Table.Column loading name={Localization.Label.VOLUME} />
                <Table.Column loading name={Localization.Label.TVL} />
                <Table.Column loading name={Localization.Label.FEES_EARNED} />
              </Table.Row>
            ))}
          </>
        )}
      </Table.Wrapper>
      <div className="flex justify-center gap-2 py-4 lg:py-8">
        {[...new Array(pools?.meta.lastPage ?? 7)].map((_, index) => (
          <Button
            key={index}
            size="filter"
            onClick={() => setPage(index + 1)}
            bgColor="bg-70 dark:bg-50 hover:bg-50 dark:hover:bg-40"
            color="text-5 hover:text-white-blue"
            disabledBgColor="bg-60 dark:bg-30"
            disabledColor="text-white-blue"
            disabled={index + 1 === pools?.meta.currentPage}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Pools;
