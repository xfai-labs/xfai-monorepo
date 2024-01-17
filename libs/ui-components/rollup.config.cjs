const getRollupOptions = require('@nx/react/plugins/bundle-rollup');
const svgr = require('@svgr/rollup');

module.exports = (options) => {
  return getRollupOptions({
    ...options,
    plugins: [...options.plugins, svgr({ icon: true })],
  });
};
