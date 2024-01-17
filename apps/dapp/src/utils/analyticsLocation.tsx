const hostMappings = {
  'localhost:4200': 'http://localhost:4400',
  'xfai-dapp.pages.dev': 'https://xfai-analytics.pages.dev',
  'app.xfai.com': 'https://analytics.xfai.com',
} as const;

const landingLocation = (path = '/') => {
  const host = window.location.host;

  return new URL(
    path,
    hostMappings[host as keyof typeof hostMappings] || `https://${host}`,
  ).toString();
};

export default landingLocation;
