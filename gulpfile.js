var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require('webpack');
var rm = require('gulp-rm');
var runSequence = require('run-sequence');
var asar = require('asar');

gulp.task('default', ['dist']);

gulp.task('build', ['copy'], function (callback) {
  webpack(require('./webpack.config.js'), function (err, stats) {
    if (err) throw new gutil.PluginError('build', err);
    if (stats.hasErrors || stats.hasWarnings) {
      gutil.log('[webpack]', stats.toString({
        chunks: false,
        errorDetails: true,
        modules: false
      }));
    }
    callback();
  });
});

gulp.task('copy', function () {
  return gulp.src([
    'app/index.html',
    'app/main.js'
  ], { base: 'app/' })
    .pipe(gulp.dest('build/'));
});

gulp.task('dist', ['build'], function (callback) {
    asar.createPackage('build/', 'lpcflash.asar', function(err) {
      if (err) throw new gutil.PluginError('build', err);
      callback();
    });
});

gulp.task('clean', function () {
  return gulp.src([
    'build/**/*',
    '!build/node_modules/**/*',
    '!build/node_modules/',
    '!build/package.json'
  ], {
      read: false
    }).pipe(rm());
});

gulp.task('publish', function (callback) { runSequence('clean', 'dist', callback); });
