var gulp = require('gulp'); // Сообственно Gulp JS
var csso = require('gulp-csso'); // Минификация CSS
//var imagemin = require('gulp-imagemin'); // Минификация изображений
var concat = require('gulp-concat'); // Склейка файлов
var rimraf = require('gulp-rimraf'); // Удаление файлов
var template = require('gulp-template'); // Шаблонизатор
var include = require('gulp-include'); // Шаблонизатор
var zip = require('gulp-zip');
var fs = require('fs');
//var shell = require('gulp-shell');

var es = require('event-stream');
var rseq = require('gulp-run-sequence');
var watch = require('gulp-watch'); // Слежка за кодом

var config = require('./config.json');

function pipe(src, transforms, dest) {
	if (typeof transforms === 'string') {
		dest = transforms;
		transforms = null;
	}

	var stream = gulp.src(src);
	transforms && transforms.forEach(function(transform) {
		stream = stream.pipe(transform);
	});

	if (dest) {
		stream = stream.pipe(gulp.dest(dest));
	}

	return stream;
}

/* ===== chrome ===== */
gulp.task('chrome', function() {
	return es.merge(
		pipe('./img/**/*', './build/chrome/img'),
		pipe('./css/**/*', './build/chrome/css'),
		pipe('./vendor/chrome/ext.js', [include()], './build/chrome/js'),
		pipe('./vendor/chrome/injector.js', './build/chrome/js'),
		pipe('./vendor/chrome/manifest.json', [template(config)], './build/chrome/')
	);
});
/* ===== eo chrome ===== */


/* ===== firefox ===== */
//gulp.task('firefox', function() {
//	return es.merge(
//		pipe('./img/**/*', './build/firefox/data/img'),
//		pipe('./css/**/*', './build/firefox/data/css'),
//		pipe('./vendor/firefox/ext.js', [include()], './build/firefox/data/js'),
//		pipe('./vendor/firefox/main.js', './build/firefox/data'),
//		pipe('./vendor/firefox/package.json', [template(config)], './build/firefox/')
//	);
//});
/* ===== eo firefox ===== */


/* ===== userscript ===== */
gulp.task('userscript-css-merge', function() {
	return gulp.src(['./css/global.css', './css/main.css', './css/glyphicons.css'])
		.pipe(concat('compiled.min.css')) /* имя файла */
		.pipe(csso())
		.pipe(gulp.dest('./build/userscript/temp/'));
});

gulp.task('userscript', ['userscript-css-merge'], function() {
	var data = config;
	data.css = fs.readFile('./build/userscript/temp/compiled.min.css')
	return es.merge(
		pipe('./vendor/userscript/main.js', [include(), template(data), concat('the-tale-extension.user.js')], './build/userscript')
	);
});
/* ===== eo userscript ===== */



/* ===== build ===== */
gulp.task('clean', function(cb) {
	return gulp.src(['./build'])
		.pipe(rimraf());
});
gulp.task('cleanup', function(cb) {
	return gulp.src(['./build/userscript/temp/'])
		.pipe(rimraf());
});
gulp.task('build', function(cb) {
	return rseq('clean', ['chrome', 'userscript'], 'cleanup',  cb);
});

gulp.task('watch', function() {
	gulp.watch(['./js/**/*', './css/**/*', './vendor/**/*', './img/**/*'], ['build']);
});
/* ===== eo build ===== */





/* ===== deploy ===== */
gulp.task('chrome-deploy', function () {
	gulp.src('./build/chrome/**/*')
		.pipe(zip('chrome-extension-' + config.version + '.zip'))
		.pipe(gulp.dest('./deploy/chrome'));
});
gulp.task('userscript-deploy', function () {
	gulp.src('./build/userscript/**/*')
		.pipe(zip('userscript-' + config.version + '.zip'))
		.pipe(gulp.dest('./deploy/userscript'));
});

//gulp.task('firefox-deploy', shell.task([
//	path('vendor/firefox/deploy.bat ' + config.version)
//]));
//function path(str) {
//	return str.replace(/\//g, '\\');
//}

gulp.task('deploy', ['chrome-deploy', 'userscript-deploy']);
/* ===== eo pack ===== */