import { useCallback, useEffect, useState } from 'react';

const hostMappings = {
  'localhost:4300': 'http://localhost:4200',
  'xfai-page.pages.dev': 'https://xfai-dapp.pages.dev',
  'xfai.com': 'https://app.xfai.com',
  'www.xfai.com': 'https://app.xfai.com',
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
