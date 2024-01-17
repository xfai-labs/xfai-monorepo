import Head from 'next/head';
import { HTMLProps, FunctionComponent } from 'react';
import MainConfig from '@landing/config/MainConfig';

type Props = {
  title: string;
  description?: string;
  keywords?: string;
} & Pick<HTMLProps<HTMLHeadElement>, 'children'>;

const PageMetaTags: FunctionComponent<Props> = ({ title, description, keywords }) => {
  return (
    <Head>
      <title>{`${title} - ${MainConfig.SITE_NAME}`}</title>
      <meta property="og:title" content={`${title} - ${MainConfig.SITE_NAME}`} />
      <meta name="twitter:title" content={`${title} - ${MainConfig.SITE_NAME}`} />

      {keywords && <meta name="keywords" content={keywords} />}

      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image:alt" content={MainConfig.SITE_DESCRIPTION} />
        </>
      )}
    </Head>
  );
};

export default PageMetaTags;
