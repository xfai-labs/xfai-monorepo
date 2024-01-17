/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
// import svgr from 'vite-plugin-svgr';
import svgr from '@svgr/rollup';
import { faviconsPlugin as favIconsPlugin } from '@darkobits/vite-plugin-favicons';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { vitePluginVersionMark } from 'vite-plugin-version-mark';
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl';
import { checker } from 'vite-plugin-checker';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import modifyManifestPlugin from './vite-plugin-modify-manifest';
import { webUpdateNotice } from '@plugin-web-update-notification/vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig((context) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/dapp',
  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    context.command === 'serve' && checker({ typescript: true }),
    context.mode === 'production' && ViteWebfontDownload(),
    context.mode === 'development' &&
      nodePolyfills({
        include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
      }),
    svgr({
      icon: true,
    }),
    react(),
    webUpdateNotice({
      logVersion: true,
      checkOnLoadFileError: false,

      notificationProps: {
        title: 'New app version available',
        description: 'System update, please refresh the page',
        buttonText: 'Refresh',
        dismissButtonText: 'Dismiss',
      },
    }),
    viteTsConfigPaths(),
    // nxViteTsPaths(),
    favIconsPlugin({
      appName: 'Xfai',
      appDescription:
        "The ultimate automated trading platform for DeFi. Get the best swaps & rewards through Xfai's entangled liquidity pools.",
      icons: {
        favicons: {
          source: 'apps/dapp/assets/favicon/favicon.svg',
        },
        android: {
          source: 'apps/dapp/assets/favicon/favicon-android.png',
        },
        appleIcon: {
          source: 'apps/dapp/assets/favicon/favicon-apple.png',
          sizes: [
            {
              width: 192,
              height: 192,
            },
          ],
        },
        appleStartup: {
          source: 'apps/dapp/assets/favicon/startup-apple.png',
        },
      },
      background: '#080808',
      theme_color: '#080808',
      orientation: 'portrait',
      appleStatusBarStyle: 'black',
      files: {
        android: {
          manifestFileName: 'manifest.json',
        },
      },
    }),
    vitePluginVersionMark({
      name: 'xfai-dapp',
      version: '0.0.1',
      ifGitSHA: true,
      ifShortSHA: true,
      ifMeta: true,
      ifLog: true,
      ifGlobal: true,
    }),
    process.env.SENTRY_AUTH_TOKEN &&
      context.mode === 'production' &&
      sentryVitePlugin({
        telemetry: false,
        org: 'xfai',
        project: 'xfai-dapp',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: {
          cleanArtifacts: true,
          inject: true,
          setCommits: {
            auto: true,
          },
        },
      }),
    modifyManifestPlugin((current) => ({
      ...current,
      iconPath: current.icons[0].src,
      providedBy: {
        name: 'Xfai',
        url: 'https://www.xfai.com',
      },
    })),
  ],
  build: {
    sourcemap: true,
    outDir: '../../dist/apps/dapp',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
}));
