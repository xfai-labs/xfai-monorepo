import { getInftImage, INFT } from '@xfai-labs/sdk';

const fetch: ExportedHandlerFetchHandler = async (request) => {
  const match = request.url.match(/\/([0-9]+)\/?$/);
  if (!match) {
    return new Response(
      JSON.stringify({
        name: `Xfai INFT`,
        image: getInftImage(INFT(0)),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const inft = INFT(Number(match[1]));
  return new Response(
    JSON.stringify({
      name: `Xfai INFT ${inft.id}`,
      image: getInftImage(inft),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export default {
  fetch,
};
