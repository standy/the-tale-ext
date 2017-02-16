/**
 * обработка монифеста шаблонизатором
 *  */

const gulp = require('gulp');
const template = require('gulp-template');

const config = require('./config');
const data = require('../../../package.json');

const SRC = ['./source/export/chrome/manifest.json'];
const DEST = config.dist;
const TASK = config.prefix + 'manifest';


gulp.task(TASK, function() {
	return gulp.src(SRC)
		.pipe(template(data))
		.pipe(gulp.dest(DEST));
});

module.exports = {
	task: TASK,
	watchSrc: SRC,
	watchTask: TASK
};
