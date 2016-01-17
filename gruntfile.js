module.exports = function(grunt) {

  var path = require('path');
  var asar = require('asar');
  var webpack = require('webpack');

  var webpackConfig = require('./webpack.config.js');
  var packageJson = require('./package.json');

  var appDir = path.dirname(webpackConfig.entry.app);
  var buildDir = webpackConfig.output.path;

  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.initConfig({
    webpack: {
      options: webpackConfig,
      build: {
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin({
            "process.env": {
              // This has effect on the react lib size
              "NODE_ENV": JSON.stringify("production")
            }
          }),
          new webpack.optimize.DedupePlugin()
          // new webpack.optimize.UglifyJsPlugin()
        )
      }
    },
    copy: {
      prepare: {
        files: [
          {
            src: path.resolve(appDir, 'index.html'),
            dest: path.resolve(buildDir, 'index.html')
          },
          {
            src: path.resolve(appDir, 'main.js'),
            dest: path.resolve(buildDir, 'main.js')
          }
        ]
      }
    }
  });

  grunt.registerTask('asar:dist', 'Make distribution.', function () {
    var done = this.async();
    asar.createPackage(buildDir, 'app.asar', function(err) {
      if (err) grunt.fail.warn(err);
      done(!err);
    });
  });

  grunt.registerTask('default', ['webpack:build', 'copy:prepare', 'asar:dist']);
};
