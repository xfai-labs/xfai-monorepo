import { Navigate, useNavigate, useParams } from 'react-router-dom';
import DropdownRC from 'rc-dropdown';
import Localization from '@dapp/localization';
import PageLayout from '@dapp/components/Shared/PageLayout';
import {
  Button,
  ButtonIcon,
  DropdownList,
  DropdownItem,
  useScreenSizeChange,
  IconMore,
  IconArrowLeft,
  IconRound,
  IconRoundInfo,
  Tooltip,
  SkeletonWrapper,
} from '@xfai-labs/ui-components';
import useGetINFTOwnership, { NftOwnership } from '@dapp/hooks/inft/useGetINFTOwnership';
import AccumulatedFeesAccordion from '@dapp/components/NFTs/AccumulatedFeesAccordion';
import PageMetaTags from '@dapp/components/Shared/PageTags';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import { motion } from 'framer-motion';
import { INFT, getInftImage } from '@xfai-labs/sdk';
import { useMemo, useState } from 'react';
import { useInftDetails } from '@dapp/hooks/backend/inft/useInftDetails';
import { BigNumber } from 'ethers';
import { toggleAmount } from '@dapp/utils/formatting';

const INFTTransferControl = ({
  inft,
  ownership,
  isLoading,
}: {
  inft: INFT;
  ownership: NftOwnership;
  isLoading: boolean;
}) => {
  const navigate = useNavigate();
  const { showModal } = useGlobalModalContext();
  const { isMobile } = useScreenSizeChange();

  const options = (
    <DropdownList arrow={!isMobile}>
      <DropdownItem
        disabled={!isLoading && ownership && !ownership.isOwner}
        onClick={() => {
          showModal('INFTTransferModal', {
            inft,
          });
        }}
      >
        {Localization.INFTs.Button.TRANSFER}
      </DropdownItem>
    </DropdownList>
  );

  return (
    <div className="flex justify-between">
      <Button
        size="medium"
        className="!font-normal"
        bgColor="bg-70 hover:bg-60"
        color="text-10 dark:text-5 hover:text-white-blue fill-20 dark:fill-10 hover:fill-white-blue"
        icon={IconArrowLeft}
        onClick={() => navigate('/inft')}
      >
        {Localization.INFTs.Label.INFTS}
      </Button>

      {ownership?.isOwner && (
        <DropdownRC
          trigger={['click']}
          placement={!isMobile ? 'bottom' : 'bottomRight'}
          overlay={options}
          prefixCls="dropdown"
          overlayClassName="!pointer-events-auto"
        >
          <ButtonIcon
            size="medium"
            bgColor="bg-70 hover:bg-60"
            color="fill-5 hover:fill-white-blue"
            skeleton={isLoading}
            icon={IconMore}
          />
        </DropdownRC>
      )}
    </div>
  );
};

const INFTView = () => {
  const navigate = useNavigate();
  const { inftId } = useParams();
  const inft = INFT(Number(inftId));
  const { data: estimatedValue, isLoading: estimatedValueIsLoading } = useInftDetails(inft);

  const estimatedValueSummed = useMemo(
    () =>
      estimatedValue
        ? Object.values(estimatedValue)
            .map(({ fiatValue }) => fiatValue)
            .reduce((a, b) => a.add(b), BigNumber.from(0))
        : undefined,
    [estimatedValue],
  );

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const { isMobile } = useScreenSizeChange();
  const { data: ownership, isLoading: ownershipIsLoading, isError } = useGetINFTOwnership(inft);

  if (isError) {
    return <Navigate to={`/inft/not-found`} replace />;
  }

  return (
    <PageLayout.Page pageKey="inftView">
      <PageMetaTags title={`${Localization.INFTs.Label.INFINITY_NFT} ${inft?.id}`} />
      <div className="flex w-full flex-col items-center justify-start gap-6 lg:flex-row lg:items-start lg:justify-center">
        <div className="flex w-11/12 flex-col gap-3.5 sm:w-8/12 md:w-7/12 lg:w-5/12 2xl:gap-4">
          {isMobile && (
            <INFTTransferControl ownership={ownership} isLoading={ownershipIsLoading} inft={inft} />
          )}
          <figure>
            <motion.img
              src={getInftImage(inft, 'lg')}
              alt={`INFT #${inft.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ opacity: { delay: 0.05, duration: 0.3 } }}
              onLoad={(e) => setImageLoaded(e.currentTarget.complete)}
              className="aspect-[15/17] w-full"
            />
          </figure>
        </div>
        <div className="flex w-11/12 flex-col gap-3.5 sm:w-8/12 md:w-7/12 lg:w-5/12 xl:w-4/12 2xl:gap-4">
          {!isMobile && (
            <INFTTransferControl ownership={ownership} isLoading={ownershipIsLoading} inft={inft} />
          )}
          <div className="flex flex-col gap-2.5 lg:mt-3">
            <h1 className="text-2xl lg:text-3xl 2xl:text-4xl">
              {Localization.INFTs.Label.INFINITY_NFT} #{inft?.id}
            </h1>
          </div>
          <PageLayout.Card className="rounded-lg">
            <PageLayout.CardSubGroup>
              <h4 className="text-10 text-xsm font-normal lg:text-sm">
                {Localization.INFTs.Label.CURRENT_ESTIMATED_VALUE}
              </h4>
              <div className="flex items-center gap-1.5">
                {!estimatedValueIsLoading ? (
                  <span className="text-white-blue text-base font-medium xl:text-xl">
                    {toggleAmount(estimatedValueSummed, 'fiat', { prefix: '$' })}
                  </span>
                ) : (
                  <SkeletonWrapper>
                    <span className="text-white-blue text-base font-medium xl:text-xl">
                      5,000,000.00
                    </span>
                  </SkeletonWrapper>
                )}
                <Tooltip text={Localization.INFTs.Tooltip.CURRENT_ESTIMATED_VALUE}>
                  <IconRound size="medium" icon={IconRoundInfo} />
                </Tooltip>
              </div>
            </PageLayout.CardSubGroup>
          </PageLayout.Card>
          <Button
            size="xl"
            loading={ownershipIsLoading}
            disabled={!!ownership && !ownership.isOwner}
            onClick={() => {
              navigate(`/stake/${inft.id}`);
            }}
          >
            {Localization.INFTs.Button.BOOST_INFT}
          </Button>
          <AccumulatedFeesAccordion inft={inft} canHarvest={!!ownership && ownership.isOwner} />
        </div>
      </div>
    </PageLayout.Page>
  );
};

export default INFTView;
