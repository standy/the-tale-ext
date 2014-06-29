var gulp = require('gulp'); // Сообственно Gulp JS
var csso = require('gulp-csso'); // Минификация CSS
//var imagemin = require('gulp-imagemin'); // Минификация изображений
var concat = require('gulp-concat'); // Склейка файлов
var rimraf = require('gulp-rimraf'); // Удаление файлов
//var tar = require('gulp-tar');
var template = require('gulp-template'); // Шаблонизатор
var fs = require('fs');
var watch = require('gulp-watch'); // Слежка за кодом

var cssList = ['./source/css/global.css', './source/css/main.css', './source/css/glyphicons.css'];
var jsList = ['./source/*.js'];
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
	var templateData = {};
	templateData['ext_core_js'] =      fs.readFileSync('./source/ext-core.js', 'utf-8');
	templateData['ext_parser_js'] =    fs.readFileSync('./source/ext-parser.js', 'utf-8');
	templateData['ext_print_js'] =     fs.readFileSync('./source/ext-print.js', 'utf-8');
	templateData['tables_js'] =        fs.readFileSync('./source/tables.js', 'utf-8');
	return gulp.src(['./source/main-ext.js'])
		.pipe(template(templateData))
		.pipe(concat('main.js')) //rename
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
gulp.task('clean-bak', function () {
	return gulp.src(['./source/bak/**'])
		.pipe(rimraf());
});

gulp.task('css-us', function() {
	return gulp.src(cssList)
		.pipe(concat('compiled.min.css')) /* имя файла */
		.pipe(csso())
		.pipe(gulp.dest('./source/bak/'));
});
gulp.task('js-us', ['css-us'], function() {
	var templateData = JSON.parse(fs.readFileSync('./source/manifest.json', 'utf-8'));
	templateData['compiled_min_css'] = fs.readFileSync('./source/bak/compiled.min.css', 'utf-8')/*.replace(/\s+/g, ' ')*/.replace(/\\/g, '\\\\');
	templateData['ext_core_js'] =      fs.readFileSync('./source/ext-core.js', 'utf-8');
	templateData['ext_parser_js'] =    fs.readFileSync('./source/ext-parser.js', 'utf-8');
	templateData['ext_print_js'] =     fs.readFileSync('./source/ext-print.js', 'utf-8');
	templateData['tables_js'] =        fs.readFileSync('./source/tables.js', 'utf-8');

	return gulp.src(['./source/main-us.js'])
		.pipe(template(templateData))
		.pipe(concat('the-tale-extended.user.js')) /* имя файла */
		.pipe(gulp.dest('./build-userscript/'));
});
gulp.task('build-userscript', ['js-us'], function() {
	gulp.start('clean-bak');
});
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


gulp.task('build', ['build-extension', 'build-userscript']);
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
