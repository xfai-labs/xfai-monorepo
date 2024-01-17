import { useNavigate } from 'react-router-dom';
import PageLayout from '@dapp/components/Shared/PageLayout';
import {
  ManageLiquidityTrigger,
  ManageLiquidityContent,
} from '@dapp/components/Liquidity/ManageLiquidityAccordion';
import {
  Button,
  AccordionGroup,
  AccordionItem,
  IconArrowLeft,
  IconThinPlus,
  InlineLink,
  Switch,
  IconRoundInfo,
  Tooltip,
  useScreenSizeChange,
  ButtonIcon,
  IconEye,
  DropdownList,
  DropdownItem,
} from '@xfai-labs/ui-components';
import DropdownRC from 'rc-dropdown';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import usePoolBalanceMulticall from '@dapp/hooks/pool/multicall/usePoolBalanceMulticall';
import { Token } from '@xfai-labs/sdk';
import { useMemo, useState } from 'react';
import usePoolLiquidityMulticall from '@dapp/hooks/pool/multicall/usePoolLiquidityMulticall';
import Localization from '@dapp/localization';
import PageMetaTags from '@dapp/components/Shared/PageTags';
import usePoolTokenBalanceMulticall from '@dapp/hooks/pool/multicall/usePoolTokenBalanceMulticall';
import { useSavedTokens } from '@dapp/context/SavedTokens';
import useTokenSearch from '@dapp/hooks/tokens/useTokenSearch';
import { BigNumber } from 'ethers';
import MainConfig from '@dapp/config/MainConfig';
import { useLocalStorage } from 'usehooks-ts';
const ManageLiquidity = () => {
  const navigate = useNavigate();
  const { tokens } = useTokenSearch({
    limit: 5,
    includeSavedLiquidityTokens: true,
    includeNativeTokens: 'none',
  });
  const { addLiquidityToken, removeLiquidityToken } = useSavedTokens();
  const { showModal, showSelectToken } = useGlobalModalContext();
  const { isMobile } = useScreenSizeChange();
  const [visible, setVisible] = useState(false);
  const [zeroVisible, setZeroVisible] = useLocalStorage('zero_pools_visible', false);

  const { data: poolBalances, isLoading } = usePoolBalanceMulticall(tokens);

  const nonZeroPoolsBalances = useMemo(
    () =>
      Object.entries(poolBalances ?? []).filter(([_, balance]) => balance && balance.gt(0)) as [
        string,
        BigNumber,
      ][],
    [poolBalances],
  );
  const { data: poolLiquidities, isLoading: isPoolLiquidityLoading } = usePoolLiquidityMulticall(
    nonZeroPoolsBalances.map(([addr]) => Token(addr)),
  );

  const { data: poolTokenBalances, isLoading: isPoolTokenBalanceLoading } =
    usePoolTokenBalanceMulticall(nonZeroPoolsBalances.map(([addr]) => Token(addr)));

  if (isLoading || isPoolLiquidityLoading || isPoolTokenBalanceLoading) return null;

  const options = (
    <DropdownList arrow={!isMobile}>
      <DropdownItem
        icon={IconThinPlus}
        iconClassName="fill-5"
        iconPlacement="right"
        className="text-5"
        onClick={() => {
          setVisible(false);
          showSelectToken({
            title: Localization.Label.IMPORT_TOKEN,
            needsLiquidityPool: true,
            onToken: (token) => addLiquidityToken(token),
            filter: (token) => !tokens.find((t) => t.address === token.address),
            popularTokens: false,
            includeNativeTokens: 'native',
          });
        }}
      >
        {Localization.Button.IMPORT_POOL}
      </DropdownItem>
      <hr className="border-60" />
      <div className="bg-70 flex !w-auto items-center gap-5 rounded-lg py-2 pl-3.5 pr-2">
        <div className="flex items-center gap-2">
          <h6 className="text-5 text-sm font-normal">{Localization.Label.ALL_POOLS}</h6>
          <Tooltip text={Localization.Tooltip.ALL_POOLS}>
            <IconRoundInfo className="fill-cyan h-3.5 w-3.5" />
          </Tooltip>
        </div>
        <Switch checked={zeroVisible} onChange={setZeroVisible} />
      </div>
    </DropdownList>
  );
  return (
    <PageLayout.Page pageKey="manageLiquidity" isLoading={isLoading}>
      <PageMetaTags title={Localization.Liquidity.Manage.PageInfo.TITLE} />

      <PageLayout.Title
        title={Localization.Liquidity.Manage.PageInfo.TITLE}
        highlightedWords={[Localization.Liquidity.Manage.PageInfo.HIGHLIGHT_TITLE]}
        description={Localization.Liquidity.Manage.PageInfo.DESCRIPTION}
      >
        <InlineLink target="_blank" href={MainConfig.MANAGE_LIQUIDITY_DOCUMENTATION_URL}>
          {Localization.Liquidity.Manage.PageInfo.DOCUMENTATION_BUTTON}
        </InlineLink>
      </PageLayout.Title>

      <PageLayout.Group>
        <div className="flex w-full justify-between">
          <Button
            size="medium"
            icon={IconArrowLeft}
            className="!font-normal"
            bgColor="bg-70 hover:bg-60 dark:bg-60 dark:hover:bg-50"
            color="text-10 fill-20 dark:fill-10"
            onClick={() => {
              navigate('/liquidity');
            }}
          >
            {Localization.Liquidity.Manage.Button.BACK_TO_ADD_LIQUIDITY}
          </Button>

          <DropdownRC
            trigger={['click']}
            placement={!isMobile ? 'bottom' : 'bottomRight'}
            overlay={options}
            prefixCls="dropdown"
            overlayClassName="!pointer-events-auto"
            visible={visible}
            onVisibleChange={(visible) => setVisible(visible)}
          >
            <ButtonIcon
              className="px-2"
              size="medium"
              bgColor="bg-70 hover:bg-60"
              color="fill-5 hover:fill-white-blue"
              skeleton={isLoading}
              icon={IconEye}
            />
          </DropdownRC>
        </div>
      </PageLayout.Group>

      <PageLayout.Group>
        <AccordionGroup>
          {tokens.map((token) => {
            const balance = poolBalances![token.address] ?? BigNumber.from(0);
            if ((!zeroVisible || !token.tags?.includes('imported')) && balance.isZero())
              return null;
            return (
              <AccordionItem
                key={token.address}
                header={<ManageLiquidityTrigger token={token} />}
                openSpace
                className="border-60/20 dark:border-60 border"
              >
                <ManageLiquidityContent
                  token={token}
                  balance={balance}
                  totalLiquidity={poolLiquidities![token.address] ?? BigNumber.from(0)}
                  poolTokenBalance={poolTokenBalances![token.address] ?? BigNumber.from(0)}
                  removeOnClick={() => {
                    showModal('LiquidityRedeemModal', {
                      token: token,
                    });
                  }}
                  hidePoolOnClick={
                    token.tags?.includes('imported')
                      ? () => removeLiquidityToken(token.address)
                      : undefined
                  }
                  addOnClick={() => {
                    navigate('/liquidity', {
                      state: {
                        token: token,
                      },
                    });
                  }}
                />
              </AccordionItem>
            );
          })}
        </AccordionGroup>
      </PageLayout.Group>
      <Button
        loading={isLoading}
        size="xl"
        bgColor="bg-70 hover:bg-60 border-60/20 dark:border-60"
        disabledBgColor="bg-70 border-60/20 dark:border-60"
        color="text-5 fill-10"
        disabledColor="text-20 fill-20"
        icon={IconThinPlus}
        className="!font-normal"
        onClick={() => {
          showSelectToken({
            title: Localization.Label.IMPORT_TOKEN,
            needsLiquidityPool: true,
            onToken: (token) => addLiquidityToken(token),
            filter: (token) =>
              !tokens.find((t) => t.address === token.address && t.tags?.includes('imported')),
            popularTokens: false,
            includeNativeTokens: 'none',
          });
        }}
      >
        {Localization.Button.IMPORT_TOKEN}
      </Button>
    </PageLayout.Page>
  );
};

export default ManageLiquidity;
