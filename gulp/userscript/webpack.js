var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var gulpWebpack = require('gulp-webpack');
var fs = require('fs');

var webpackConfig = require('./webpack.config');

var SRC = [
	'./source/export/userscript/*.js',
	'./source/css/**/*.*',
	'./source/js/**/*.*'
];
var DEST = './dist/userscript/';


var outputOptions = {
	version:     false,
	hash:        false, //add the hash of the compilation
	timings:     true,  //add timing information
	assets:      false, //add assets information
	chunks:      false, //add chunk information
	chunkModule: false, //add built modules information to chunk information
	modules:     false, //add built modules information
	cached:      false, //add also information about cached (not built) modules
	reasons:     false, //add information about the reasons why modules are included
	source:      false, //add the source code of modules
	errorDetail: true,  //add details to errors (like resolving log)
	chunkOrigin: false, //add the origins of chunks and chunk merging info
//	modulesSort: false, //(string) sort the modules by that field
//	chunksSort:  false, //(string) sort the chunks by that field
//	assetsSort:  false, //(string) sort the assets by that field
	children:    false,
	verbose:     false,
	colors:      true
};


/**
* uglify нужен чтобы убрать мертвые ветки кода
* такие как if (false) { ... }
* */
var uglifyOptions = {
	mangle: false,
	output: {
		indent_start:   0,     // start indentation on every line (only when `beautify`)
		indent_level:   4,     // indentation level (only when `beautify`)
		quote_keys:     false, // quote all keys in object literals?
		space_colon:    true,  // add a space after colon signs?
//		ascii_only:     false, // output ASCII-safe? (encodes Unicode characters as ASCII)
//		inline_script:  false, // escape "</script"?
		width:          160,    // informative maximum line width (for beautified output)
//		max_line_len:   32000, // maximum line length (for non-beautified output)
//		ie_proof:       true,  // output IE-safe code?
		beautify:       true,  // beautify output?
		source_map:     null,  // output a source map
		bracketize:     true,  // use brackets every time?
		comments:       true,  // output comments?
		semicolons:     false  // use semicolons to separate statements? (otherwise, newlines)
	}
};


var HEADER_SRC = './source/export/userscript/header.js';
var DATA_SRC = './package.json';
var headerTemplate = fs.readFileSync(HEADER_SRC, 'utf8');
var headerData = JSON.parse(fs.readFileSync(DATA_SRC, 'utf8'));


gulp.task('userscript:webpack', function() {
	return gulp.src(SRC)
		.pipe(gulpWebpack(
			webpackConfig,
			null,
			function(err, stats) {
				gutil.log('[userscript:webpack]', stats.toString(outputOptions));
			}
		))
		.pipe(uglify(uglifyOptions))
		.pipe(header(headerTemplate, headerData))
		.pipe(gulp.dest(DEST));
});


gulp.task('watch-userscript:webpack', function() {
	return gulp.src(SRC)
		.pipe(gulpWebpack(
			webpackConfig,
			null,
			function(err, stats) {
				gutil.log('[watch-userscript:webpack]', stats.toString(outputOptions));
			}
		))
		.pipe(uglify(uglifyOptions))
		.pipe(header(headerTemplate, headerData))
		.pipe(gulp.dest(DEST));
});


