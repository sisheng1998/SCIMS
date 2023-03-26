const rewire = require('rewire')
const webpack = require('webpack')
const defaults = rewire('react-scripts/scripts/start.js')
const webpackConfig = require('react-scripts/config/webpack.config')

defaults.__set__('configFactory', (webpackEnv) => {
  let config = webpackConfig(webpackEnv)

  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve('process/browser'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    buffer: require.resolve('buffer'),
    asset: require.resolve('assert'),
  }

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ]

  return config
})
