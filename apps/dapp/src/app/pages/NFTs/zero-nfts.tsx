import { Button, InlineLink } from '@xfai-labs/ui-components';
import { useNavigate } from 'react-router-dom';
import inftsImageURL from '@dapp/assets/zeroINFTs.png';
import ZeroPage from '@dapp/components/Shared/ZeroPage';
import PageLayout from '@dapp/components/Shared/PageLayout';
import Localization from '@dapp/localization';
import PageMetaTags from '@dapp/components/Shared/PageTags';
import MainConfig from '@dapp/config/MainConfig';

const ZeroINFTsPage = () => {
  const navigate = useNavigate();

  return (
    <ZeroPage image={{ src: inftsImageURL, alt: 'Zero INFTs' }}>
      <PageMetaTags title={Localization.INFTs.PageInfo.TITLE} />
      <PageLayout.Title
        title={Localization.INFTs.PageInfo.TITLE}
        highlightedWords={[Localization.INFTs.PageInfo.HIGHLIGHT_TITLE]}
        highlightedNormalCase={true}
      >
        {Localization.INFTs.Message.NO_INFTS}
        <br />
        {Localization.INFTs.Message.NO_INFTS_STAKE_OR_IMPORT}
        <InlineLink target="_blank" href={MainConfig.INFTS_DOCUMENTATION_URL}>
          {Localization.INFTs.PageInfo.DOCUMENTATION_BUTTON}
        </InlineLink>
      </PageLayout.Title>
      <div className="flex gap-5 [&>*]:grow">
        <Button size="xxl" onClick={() => navigate('/stake')}>
          {Localization.INFTs.Button.GO_TO_STAKE}
        </Button>
      </div>
    </ZeroPage>
  );
};

export default ZeroINFTsPage;
