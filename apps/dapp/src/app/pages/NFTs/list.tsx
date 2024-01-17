import ZeroINFTsPage from './zero-nfts';
import PageLayout from '@dapp/components/Shared/PageLayout';
import INFTThumbnail from '@dapp/components/NFTs/Thumbnail';
import Localization from '@dapp/localization';
import { useINFTs } from '@dapp/hooks/inft/useINFTs';
import PageMetaTags from '@dapp/components/Shared/PageTags';
import { AnimatePresence } from 'framer-motion';
import { InlineLink } from '@xfai-labs/ui-components';
import MainConfig from '@dapp/config/MainConfig';

const NFTsPage = () => {
  const { data: infts = [], isLoading } = useINFTs();

  if (!isLoading && infts.length === 0) {
    return <ZeroINFTsPage />;
  }

  return (
    <PageLayout.Page pageKey="infts" isLoading={isLoading}>
      <PageMetaTags title={Localization.INFTs.PageInfo.TITLE} />
      <PageLayout.Title
        title={Localization.INFTs.PageInfo.TITLE}
        highlightedWords={[Localization.INFTs.PageInfo.HIGHLIGHT_TITLE]}
        highlightedNormalCase={true}
        description={Localization.INFTs.PageInfo.DESCRIPTION}
      >
        <InlineLink target="_blank" href={MainConfig.INFTS_DOCUMENTATION_URL}>
          {Localization.INFTs.PageInfo.DOCUMENTATION_BUTTON}
        </InlineLink>
      </PageLayout.Title>

      <div className="grid w-full auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:w-10/12 xl:grid-cols-4 xl:gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <>
              {[...Array(4)].map((item, index) => (
                <INFTThumbnail.Grid to="#" key={index} loading={true} />
              ))}
            </>
          ) : (
            <>
              {infts.map((inft, index) => (
                <INFTThumbnail.Grid
                  to={`/inft/view/${inft.id}`}
                  key={index}
                  loading={isLoading}
                  inft={inft}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </PageLayout.Page>
  );
};

export default NFTsPage;
