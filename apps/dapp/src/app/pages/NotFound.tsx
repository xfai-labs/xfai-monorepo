import NotFoundImageURL from '@dapp/assets/notFound.png';
import ZeroPage from '@dapp/components/Shared/ZeroPage';
import Localization from '@dapp/localization';
import PageMetaTags from '@dapp/components/Shared/PageTags';

const NotFound = () => {
  return (
    <ZeroPage image={{ src: NotFoundImageURL, alt: 'Zero INFTs' }}>
      <PageMetaTags title={Localization.NotFound.PageInfo.TITLE} />
      <h1 className="text-magenta text-4xl xl:text-6xl">{Localization.NotFound.PageInfo.TITLE}</h1>
      <h3 className="text-white-black px-4 text-center text-2xl font-light lg:px-16 xl:px-20">
        {Localization.NotFound.PageInfo.SUBTITLE}
      </h3>
    </ZeroPage>
  );
};

export default NotFound;
