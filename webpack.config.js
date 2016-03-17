// webpack.config.js

var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
  devtool: 'source-map',
  debug: false,

  entry: {
    'angular2': [
      'rxjs',
      'reflect-metadata',
      'es6-promise',
      'es6-shim',
      'angular2/core',
      'angular2/common',
      'angular2/platform/browser',
      'angular2/router',
      'zone.js',
    ],
    'app': './src/bootstrap.ts'
  },

  output: {
    path: path.resolve(__dirname, 'build/app/'),
    publicPath: 'build/app/',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.css', '.html'],
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [/build/, /test/, /typings/, /node_modules(?![/\\]ng2-bootstrap)/]
      },
      {
        test: /\.html$/,
        loader: 'raw'
      },
    ]
  },

  externals: [{
    fs: 'require("fs")',
    electron: 'require("electron")',
    serialport: 'require("serialport")'
  }],

  plugins: [
    new CommonsChunkPlugin({ name: 'angular2', filename: 'angular2.js', minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'common', filename: 'common.js' }),
    // new UglifyJsPlugin({ minimize: true, comments: false })
  ]
};
