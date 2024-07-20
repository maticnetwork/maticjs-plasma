/* global __dirname, require, module */
const path = require('path')
const webpack = require('webpack')
const env = require('yargs').argv.env // use --env with webpack 2
const banner = require('./license.js');

const libraryName = 'matic-plasma'

let mode = 'development'

if (env === 'build') {
  mode = 'production'
}

const clientConfig = {
  mode,
  devtool: 'source-map',
  entry: `${__dirname}/src/index.ts`,
  target: 'web',
  output: {
    path: `${__dirname}/dist`,
    filename: `${libraryName}.umd.js`,
    library: libraryName,
    libraryTarget: 'umd',
    // libraryExport: 'default',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    web3: 'web3',
    '@maticnetwork/maticjs': '@maticnetwork/maticjs'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.json', '.js', '.ts', '.tsx'],
  }
}

const serverConfig = {
  ...clientConfig,
  target: 'node',
  output: {
    path: `${__dirname}/dist`,
    filename: `${libraryName}.node.js`,
    // globalObject: 'this',
    libraryTarget: 'commonjs2',
  },
}

const standaloneConfig = {
  ...clientConfig,
  output: {
    ...clientConfig.output,
    library: 'matic-plasma',
    filename: `${libraryName}`,
  },
  externals: {},
}

module.exports = [clientConfig, serverConfig, standaloneConfig]