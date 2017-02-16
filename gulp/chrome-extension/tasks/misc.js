/**
 *  копирует все что не попало в сборку
 *  */

const gulp = require('gulp');

const config = require('./config');

const SRC = ['./source/export/chrome/injector.js'];
const DEST = config.dist;
const TASK = config.prefix + 'misc';

gulp.task(TASK, function() {
	return gulp.src(SRC)
		.pipe(gulp.dest(DEST));
});

module.exports = {
	task: TASK,
	watchSrc: SRC,
	watchTask: TASK
};
