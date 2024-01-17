import { AndroidManifest } from '@darkobits/vite-plugin-favicons/dist/etc/types';
import fs from 'fs';
import path from 'path';

function modifyManifestPlugin(
  manifestOptions: (manifest: AndroidManifest) => object,
): import('vite').Plugin {
  return {
    name: 'modify-manifest',
    async writeBundle(options, bundle) {
      const manifestFileName = 'manifest.json';

      // Find the manifest asset in the bundle
      const manifestAsset = Object.values(bundle).find((asset) =>
        /assets\/manifest-[a-z0-9]+\.json/.test(asset.fileName),
      );

      // If the manifest asset exists
      if (manifestAsset) {
        const manifestPath = path.join(options.dir!, manifestAsset.fileName);

        // Read the existing manifest file content
        const manifestContent = fs.readFileSync(manifestPath, 'utf-8');

        // Parse the content as JSON and modify it
        const manifestJson = JSON.parse(manifestContent);
        const newManifestJson = manifestOptions(manifestJson as AndroidManifest);

        // Write the modified content back to the manifest file
        fs.writeFileSync(
          path.join(options.dir!, manifestFileName),
          JSON.stringify(newManifestJson, null, 2),
        );
      }
    },
  };
}

export default modifyManifestPlugin;
