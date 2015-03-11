/**
 *  обработка изображений
 *  */

var gulp = require('gulp');
//var size = require('gulp-size');
//var cache = require('gulp-cache');
//var imagemin = require('gulp-imagemin');

var config = require('./config');

var SRC = ['./source/img/**/*.*'];
var DEST = config.dist + '/img';
var TASK = config.prefix + 'images';


gulp.task(TASK, function () {
	return gulp.src(SRC)
//		.pipe(/*cache*/(imagemin({
//			optimizationLevel: 5,
//			progressive: true,
//			interlaced: true
//		})))
//		.pipe(size({
//			title: 'size of images'
//		}))
		.pipe(gulp.dest(DEST));
});

module.exports = {
	task: TASK,
	watchSrc: SRC,
	watchTask: TASK
};
