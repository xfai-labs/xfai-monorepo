import { Helmet } from 'react-helmet-async';
import MainConfig from '@dapp/config/MainConfig';
import { HTMLProps, FunctionComponent } from 'react';

type Props = {
  title: string;
  description?: string;
  keywords?: string;
} & Pick<HTMLProps<HTMLHeadElement>, 'children'>;

const PageMetaTags: FunctionComponent<Props> = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{`${title} - ${MainConfig.SITE_NAME}`}</title>
      <meta property="og:title" content={`${title} - ${MainConfig.SITE_NAME}`} />
      <meta name="twitter:title" content={`${title} - ${MainConfig.SITE_NAME}`} />

      {keywords && <meta name="keywords" content={keywords} />}

      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
    </Helmet>
  );
};

export default PageMetaTags;
