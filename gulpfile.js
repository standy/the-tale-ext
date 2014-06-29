var gulp = require('gulp'); // Сообственно Gulp JS
var csso = require('gulp-csso'); // Минификация CSS
//var imagemin = require('gulp-imagemin'); // Минификация изображений
var concat = require('gulp-concat'); // Склейка файлов
var include = require('gulp-include');
var rimraf = require('gulp-rimraf');
//var tar = require('gulp-tar');
var consolidate = require('gulp-consolidate');
var fs = require('fs');
var watch = require('gulp-watch');

var cssList = ['./source/css/glyphicons.css', './source/css/global.css', './source/css/main.css'];
var jsList = ['./source/*.js'];
var manifestList = ['./source/manifest.json'];
var imgList = ['./source/img/**/*'];


/* ===== extension ====== */
gulp.task('clean-ext', function () {
	return gulp.src(['./build-extension/**'])
		.pipe(rimraf());
});


// Собираем CSS
gulp.task('css-ext', function() {
	return gulp.src(cssList)
		.pipe(gulp.dest('./build-extension/css'));
});

// Собираем JS
gulp.task('js-ext', function() {
	return gulp.src(['./source/main-ext.js'])
		.pipe(include())
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./build-extension/'));
});

// Копируем и минимизируем изображения
gulp.task('img-ext', function() {
	return gulp.src(imgList)
//		.pipe(imagemin())
		.pipe(gulp.dest('./build-extension/img'));
});

// Копируем остальные файлы
gulp.task('misc-ext', function() {
	return gulp.src(['./source/manifest.json'])
		.pipe(gulp.dest('./build-extension/'));
});


gulp.task('build-extension', ['css-ext', 'img-ext', 'js-ext', 'misc-ext']);
/* ===== eo extension ====== */



/* ===== userscript ====== */
gulp.task('clean-us', function () {
	return gulp.src(['./build-userscript/**'])
		.pipe(rimraf());
});

gulp.task('css-us', function() {
	return gulp.src(cssList)
		.pipe(concat('compiled.min.css')) /* имя файла */
		.pipe(csso())
		.pipe(gulp.dest('./build-userscript/'));
});
gulp.task('js-us', ['css-us'], function() {
	var templateData = fs.readFileSync('./source/manifest.json', 'utf-8');
	templateData.css = fs.readFileSync('./build-userscript/compiled.min.css', 'utf-8');
	return gulp.src(['./source/main-us.js'])
		.pipe(consolidate('swig', templateData)) /* вставка данных из манифеста и css*/
		.pipe(include()) /* вставка инклудов*/
		.pipe(concat('the-tale-extended.user.js')) /* имя файла */
		.pipe(gulp.dest('./build-userscript/'));
});
gulp.task('build-userscript', ['js-us']);
/* ===== eo userscript ====== */





gulp.task('pack', ['build-extension', 'build-userscript'], function() {
	var manifestData = fs.readFileSync('./source/manifest.json', 'utf-8');
	gulp.src(['./build-extension/**/*.*'])
		.pipe(tar('the-tale-extended-'+ manifestData.version +'.tar'))
		.pipe(gulp.dest('./pack/'));
	gulp.src(['./build-userscript/**/*.*'])
		.pipe(tar('the-tale-extended-'+ manifestData.version +'.user.tar'))
		.pipe(gulp.dest('./pack/'));
});




gulp.task('default', ['build-extension', 'build-userscript']);


gulp.task('watch', function () {
	watch({
		glob: cssList,
		name: 'Css-watcher'
	}, ['css-ext', 'build-userscript']);

	watch({
		glob: jsList,
		name: 'Js-watcher'
	}, ['js-ext', 'build-userscript']);

	watch({
		glob: ['./source/manifest.json'],
		name: 'Manifest-watcher'
	}, ['build-extension', 'build-userscript']);

	watch({
		glob: imgList,
		name: 'Img-watcher'
	}, ['img-ext']);
});
