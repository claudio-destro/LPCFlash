// webpack.config.js

var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  devtool: 'source-map',
  debug: true,

  entry: {
    'angular2': [
      'rxjs',
      'reflect-metadata',
      'es6-promise',
      'es6-shim',
      'angular2/core',
      'angular2/common',
      // 'angular2/http',
      'angular2/platform/browser',
      // 'angular2/router',
      'zone.js',
    ],
    'app': './app/boot'
  },

  output: {
    path: path.resolve(__dirname, 'build/'),
    publicPath: 'build/',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['','.ts','.js','.json', '.css', '.html']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [ /build/, /node_modules/, /src/, /test/, /typings/ ]
      }
    ]
  },

  externals: [{
    serialport: 'require("serialport")'
  }],

  plugins: [
    new CommonsChunkPlugin({ name: 'angular2', filename: 'angular2.js', minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'common', filename: 'common.js' })
  ]
};
