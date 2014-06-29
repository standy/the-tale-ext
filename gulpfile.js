//var lr = require('tiny-lr');// Минивебсервер для livereload
var gulp = require('gulp'); // Сообственно Gulp JS
//var livereload = require('gulp-livereload'); // Livereload для Gulp
//var myth = require('gulp-myth'); // Плагин для Myth - http://www.myth.io/
var csso = require('gulp-csso'); // Минификация CSS
var imagemin = require('gulp-imagemin'); // Минификация изображений
var concat = require('gulp-concat'); // Склейка файлов
//var connect = require('connect'); // Webserver
//var server = lr();
var include = require('gulp-include');
var rimraf = require('gulp-rimraf');
//var gzip = require('gulp-gzip');
var tar = require('gulp-tar');
var consolidate = require('gulp-consolidate');
var fs = require('fs');
var manifest = require('./source/manifest.json');



/* ===== extension ====== */
// Собираем CSS
gulp.task('css-ext', ['clean-ext'], function() {
	return gulp.src('./source/css/**/*')
		.pipe(gulp.dest('./build-ext/css'));
});

// Собираем JS
gulp.task('js-ext', ['clean-ext'], function() {
	return gulp.src(['./source/main-ext.js'])
		.pipe(include())
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./build-ext/'));
});

// Копируем и минимизируем изображения
gulp.task('images-ext', ['clean-ext'], function() {
	return gulp.src('./source/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./build-ext/img'));
});

// Копируем остальные файлы
gulp.task('misc-ext', ['clean-ext'], function() {
	return gulp.src(['./source/injector.js', './source/tables.js', './source/manifest.json'])
		.pipe(gulp.dest('./build-ext/'));
});


gulp.task('clean-ext', function () {
	return gulp.src(['./build-ext/**'])
		.pipe(rimraf());
});

gulp.task('build-ext', ['css-ext', 'images-ext', 'js-ext', 'misc-ext']);
/* ===== eo extension ====== */



/* ===== userscript ====== */
gulp.task('css-us', ['clean-us'], function() {
	return gulp.src(['./source/css/glyphicons.css', './source/css/global.css', './source/css/main.css'])
		.pipe(concat('compiled.min.css')) /* имя файла */
		.pipe(csso())
		.pipe(gulp.dest('./source/css/'));
});
gulp.task('js-us', ['clean-us', 'css-us'], function() {
	var config = manifest;
	config.css = fs.readFileSync('./source/css/compiled.min.css', 'utf-8');
	return gulp.src(['./source/main-us.js'])
		.pipe(consolidate('swig', manifest)) /* вставка данных из манифеста и css*/
		.pipe(include()) /* вставка инклудов*/
		.pipe(concat('the-tale-extended.user.js')) /* имя файла */
		.pipe(gulp.dest('./build-us/'));
});
gulp.task('clean-us', function () {
	return gulp.src(['./build-us/**'])
		.pipe(rimraf());
});
gulp.task('build-us', ['js-us']);
/* ===== eo userscript ====== */





gulp.task('pack', ['build-ext', 'build-us'], function() {
	gulp.src(['./build-ext/**/*.*'])
		.pipe(tar('the-tale-extended-'+ manifest.version +'.tar'))
		.pipe(gulp.dest('./pack/'));
	gulp.src(['./build-us/**/*.*'])
		.pipe(tar('the-tale-extended-'+ manifest.version +'.user.tar'))
		.pipe(gulp.dest('./pack/'));
});




gulp.task('default', ['build-ext', 'build-us']);




//// Локальный сервер для разработки
//gulp.task('http-server', function() {
//    connect()
//        .use(require('connect-livereload')())
//        .use(connect.static('./public'))
//        .listen('9000');
//
//    console.log('Server listening on http://localhost:9000');
//});
//
//
////Запуск сервера разработки gulp watch
//gulp.task('watch', function() {
//    // Предварительная сборка проекта
//    gulp.run('css');
//    gulp.run('images');
//    gulp.run('js');
//
//    // Подключаем Livereload
//    server.listen(35729, function(err) {
//        if (err) return console.log(err);
//
//        gulp.watch('source/css/**/*.css', function() {
//            gulp.run('css');
//        });
//        gulp.watch('source/img/**/*', function() {
//            gulp.run('images');
//        });
//        gulp.watch('source/*.js', function() {
//            gulp.run('js');
//        });
//    });
//    gulp.run('http-server');
//});