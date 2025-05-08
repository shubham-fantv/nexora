const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const moduleExports = {
  reactStrictMode: true,
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: [],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  // swcMinify: false,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (dev) {
    }

    config = {
      optimization: {
        splitChunks: {
          chunks: "async",
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      },
      ...config,
    };

    if (!isServer) {
      config.optimization.minimizer.push(new CssMinimizerPlugin());
    }

    return config;
  },
  poweredByHeader: false,
  compiler: {
    // removeConsole: false,
  },
  experimental: { optimizeCss: false },
};

module.exports = moduleExports;
