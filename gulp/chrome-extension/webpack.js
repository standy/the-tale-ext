const gulp = require('gulp');
const gutil = require('gulp-util');
require('es6-promise').polyfill(); //not required for iojs

const webpack = require('webpack');
const webpackConfig = require('./webpack.config');


const outputOptions = {
	version: false,
	hash: false, //add the hash of the compilation
	timings: true,  //add timing information
	assets: false, //add assets information
	chunks: false, //add chunk information
	chunkModule: false, //add built modules information to chunk information
	modules: false, //add built modules information
	cached: false, //add also information about cached (not built) modules
	reasons: false, //add information about the reasons why modules are included
	source: false, //add the source code of modules
	errorDetail: true,  //add details to errors (like resolving log)
	chunkOrigin: false, //add the origins of chunks and chunk merging info
//	modulesSort: false, //(string) sort the modules by that field
//	chunksSort:  false, //(string) sort the chunks by that field
//	assetsSort:  false, //(string) sort the assets by that field
	children: false,
	verbose: false,
	colors: true
};



gulp.task('chrome:webpack', function(callback) {
	const compiler = webpack(webpackConfig);
	compiler.run(function(err, stats) {
		if (err) throw new gutil.PluginError('[chrome:webpack]', err);
		gutil.log('[chrome:webpack]', stats.toString(outputOptions));
		callback();
	});
});

gulp.task('watch-chrome:webpack', function() {
	webpackConfig.watch = true;
	const compiler = webpack(webpackConfig);
	return new Promise(function(resolve, reject) {
		compiler.watch(200, function(err, stats) {
			if (err) return reject(new gutil.PluginError('[watch-chrome:webpack]', err));
			gutil.log('[watch-chrome:webpack]', stats.toString(outputOptions));
			resolve();
		});
	});
});

