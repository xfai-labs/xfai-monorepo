const hostMappings = {
  'localhost:4200': 'http://localhost:4300',
  'xfai-dapp.pages.dev': 'https://xfai-page.pages.dev',
  'app.xfai.com': 'https://xfai.com',
} as const;

const landingLocation = (path = '/') => {
  const host = window.location.host;

  return new URL(
    path,
    hostMappings[host as keyof typeof hostMappings] || `https://${host}`,
  ).toString();
};

export default landingLocation;
