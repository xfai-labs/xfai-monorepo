import { useCallback, useEffect, useState } from 'react';

const hostMappings = {
  'localhost:4300': 'http://localhost:4400',
  'xfai-page.pages.dev': 'https://xfai-analytics.pages.dev',
  'xfai.com': 'https://analytics.xfai.com',
  'www.xfai.com': 'https://analytics.xfai.com',
} as const;

const useAnalyticsLocation = () => {
  const [host, setHost] = useState('xfai.com');

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  return useCallback(
    (path = '/') => new URL(path, hostMappings[host] || `https://${host}`).toString(),
    [host],
  );
};

export default useAnalyticsLocation;
