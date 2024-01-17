const endpoint =
  'https://api.cloudflare.com/client/v4/accounts/7c85d637863b94e96c754862535d0f05/pages/projects/dapp/deployments';
const expirationDays = 7;

export default {
  async scheduled(_, env) {
    const init = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // We recommend you store the API token as a secret using the Workers dashboard or using Wrangler as documented here: https://developers.cloudflare.com/workers/wrangler/commands/#secret
        Authorization: env.API_TOKEN,
      },
    };

    const response = await fetch(endpoint, init);
    const deployments = await response.json();

    for (const deployment of deployments.result) {
      // Check if the deployment was created within the last x days (as defined by `expirationDays` above)
      if ((Date.now() - new Date(deployment.created_on)) / 86400000 > expirationDays) {
        // Delete the deployment
        await fetch(`${endpoint}/${deployment.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: env.API_TOKEN,
          },
        });
      }
    }
  },
};
