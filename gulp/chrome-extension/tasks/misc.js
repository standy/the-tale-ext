/**
 *  копирует все что не попало в сборку
 *  */

var gulp = require('gulp');

var config = require('./config');

var SRC = ['./source/export/chrome/injector.js'];
var DEST = config.dist;
var TASK = config.prefix + 'misc';

gulp.task(TASK, function () {
	return gulp.src(SRC)
		.pipe(gulp.dest(DEST));
});

module.exports = {
	task: TASK,
	watchSrc: SRC,
	watchTask: TASK
};
