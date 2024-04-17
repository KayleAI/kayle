/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/providers", "@repo/security", "@repo/service", "@repo/icons", "@repo/types", "@repo/ui", "@repo/editor", "@repo/layout"],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    })

    return config
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};
