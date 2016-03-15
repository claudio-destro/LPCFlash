var gulp = require('gulp');
var gutil = require("gulp-util");
var merge2 = require('merge2');
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

function copy(base, files, dest) {
  if (!Array.isArray(files)) files = [files];
  for (var i = 0; i < files.length; i++) {
    files[i] = base + files[i];
  }
  return gulp.src(files, {base: base}).pipe(gulp.dest(dest));
}

gulp.task('copy', function () {
  return merge2([
    copy('src/', ['**/*.html', '**/*.js', '**/*.png'], 'build/'),
    copy('node_modules/bootstrap/dist/', ['css/bootstrap.min.css*', 'fonts/*'], 'build/styles')
  ]);
});

gulp.task('dist', ['build'], function (callback) {
  asar.createPackage('build/', 'lpcflash.asar', function (err) {
    if (err) throw new gutil.PluginError('build', err);
    callback();
  });
});

gulp.task('clean', function () {
  return gulp.src([
    'build/**/*',
    '!build/node_modules/**/*',
    '!build/node_modules/',
    '!build/package.json',
    'build/**/.DS_Store',
    'lpcflash.asar'
  ], {
      read: false
    }).pipe(rm());
});

gulp.task('publish', function (callback) { runSequence('clean', 'dist', callback); });
