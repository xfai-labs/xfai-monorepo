import { useCallback, useEffect, useState } from 'react';

const hostMappings = {
  'localhost:4400': 'http://localhost:4200',
  'xfai-analytics.pages.dev': 'https://xfai-dapp.pages.dev',
  'analytics.xfai.com': 'https://app.xfai.com',
  'www.analytics.xfai.com': 'https://app.xfai.com',
} as const;

const useDappLocation = () => {
  const [host, setHost] = useState('xfai.com');

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  return useCallback(
    (path = '/') => new URL(path, hostMappings[host] || `https://${host}`).toString(),
    [host],
  );
};

export default useDappLocation;
