const gulp = require('gulp');
const gutil = require('gulp-util');
const header = require('gulp-header');
const gulpWebpack = require('gulp-webpack');
const fs = require('fs');

const webpackConfig = require('./webpack.config');

const SRC = [
	'./source/export/userscript/*.js',
	'./source/css/**/*.*',
	'./source/js/**/*.*',
];
const DEST = './dist/userscript/';


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
	colors: true,
};


const HEADER_SRC = './source/export/userscript/header.js';
const DATA_SRC = './package.json';
const headerTemplate = fs.readFileSync(HEADER_SRC, 'utf8');
const headerData = JSON.parse(fs.readFileSync(DATA_SRC, 'utf8'));


gulp.task('userscript:webpack', function() {
	return gulp.src(SRC)
		.pipe(gulpWebpack(
			webpackConfig,
			null,
			function(err, stats) {
				if (err) throw new gutil.PluginError('[chrome:webpack]', err);
				gutil.log('[userscript:webpack]', stats.toString(outputOptions));
			}
		))
		.pipe(header(headerTemplate, headerData))
		.pipe(gulp.dest(DEST));
});


gulp.task('watch-userscript:webpack', function() {
	webpackConfig.watch = true;
	return gulp.src(SRC)
		.pipe(gulpWebpack(
			webpackConfig,
			null,
			function(err, stats) {
				if (err) throw new gutil.PluginError('[chrome:webpack]', err);
				gutil.log('[watch-userscript:webpack]', stats.toString(outputOptions));
			}
		))
		.pipe(header(headerTemplate, headerData))
		.pipe(gulp.dest(DEST));
});


