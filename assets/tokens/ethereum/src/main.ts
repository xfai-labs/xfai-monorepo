import { Chains, Xfai } from '@xfai-labs/sdk';
import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const chain = Chains[1];
const xfai = new Xfai(null, chain);

const tokenSymbolToAddress = Object.fromEntries(
  chain.defaultTokenList.tokens
    .concat(
      [xfai.wrappedNativeToken, xfai.nativeToken, xfai.usdc, xfai.underlyingToken].filter(Boolean),
    )
    .map((token) => [token.symbol, token.address]),
);

const allFiles = readdirSync(join(__dirname, 'svg'));

const svgFiles = allFiles
  .filter((logo) => logo.endsWith('.svg'))
  .map((logo) => [logo.replace('.svg', ''), logo]);

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

async function main() {
  for (const [symbol, fileName] of svgFiles) {
    let address = tokenSymbolToAddress[symbol];

    // Special case when filename is an address
    if (symbol.startsWith('0x')) {
      address = symbol;
    }

    // No random files
    if (!address) {
      console.error(`No address for ${symbol}`);
      process.exit();
    }

    console.log('Uploading', symbol, address);
    await S3.send(
      new PutObjectCommand({
        Bucket: 'tokens',
        Key: join(chain.label.toLocaleLowerCase(), `${address}.webp`),
        Body: await sharp(join(__dirname, 'svg', fileName))
          .resize(160, 160)
          .webp()
          .toBuffer(),
      }),
    );
  }
}

main();
