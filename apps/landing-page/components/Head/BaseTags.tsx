import Head from 'next/head';
import { FunctionComponent } from 'react';
import MainConfig from '@landing/config/MainConfig';
import favIcon from '@landing/public/favicon/favicon.ico';
import favIcon16 from '@landing/public/favicon/favicon-16x16.png';
import favIcon32 from '@landing/public/favicon/favicon-32x32.png';
import favIcon48 from '@landing/public/favicon/favicon-48x48.png';
import favIcon192 from '@landing/public/favicon/favicon-192x192.png';
import favIconSafariTab from '@landing/public/favicon/favicon-safari-tab.svg';
import socialCover from '@landing/public/social/social-cover.jpg';

const BaseMetaTags: FunctionComponent = () => {
  const baseURL = 'https://xfai.com';
  return (
    <Head>
      <title>{MainConfig.SITE_NAME}</title>
      <meta name="description" content={MainConfig.SITE_DESCRIPTION} />
      <meta name="keywords" content={MainConfig.SITE_KEYWORDS} />

      {/* Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={MainConfig.SITE_NAME} />
      <meta property="og:title" content={MainConfig.SITE_NAME} />
      <meta property="og:description" content={MainConfig.SITE_DESCRIPTION} />
      <meta property="og:url" content={MainConfig.SITE_BASE_URL} />
      <meta property="og:image" content={`${baseURL}${socialCover.src}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={MainConfig.SITE_NAME} />
      <meta name="twitter:description" content={MainConfig.SITE_DESCRIPTION} />
      <meta name="twitter:site" content={MainConfig.SITE_TWITTER_HANDLE} />
      <meta name="twitter:image" content={`${baseURL}${socialCover.src}`} />
      <meta name="twitter:image:alt" content={MainConfig.SITE_DESCRIPTION} />

      {/* Canonical URLs - Add language specific urls */}
      <link rel="canonical" href={MainConfig.SITE_BASE_URL} />
      {/* Canonical URLs - Add language specific urls */}

      {/* Settings */}
      <meta
        name="viewport"
        content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"
      />
      <meta name="theme-color" content="#080808" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Xfai" />
      <meta name="apple-mobile-web-app-title" content="Xfai" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-orientations" content="portrait-any" />

      {/* Icons */}
      <link rel="icon" href={favIcon.src} />
      <link rel="icon" href={favIcon48.src} sizes="48x48" type="image/png" />
      <link rel="icon" href={favIcon32.src} sizes="32x32" type="image/png" />
      <link rel="icon" href={favIcon16.src} sizes="16x16" type="image/png" />
      <link rel="apple-touch-icon" href={favIcon192.src} />
      <link rel="mask-icon" href={favIconSafariTab} color="#080808" />
    </Head>
  );
};

export default BaseMetaTags;
