/**
 * обработка монифеста шаблонизатором
 *  */

var gulp = require('gulp');
var template = require('gulp-template');

var config = require('./config');
var data = require('../../../package.json');

var SRC = ['./source/export/chrome/manifest.json'];
var DEST = config.dist;
var TASK = config.prefix + 'manifest';


gulp.task(TASK, function () {
	return gulp.src(SRC)
		.pipe(template(data))
		.pipe(gulp.dest(DEST));
});

module.exports = {
	task: TASK,
	watchSrc: SRC,
	watchTask: TASK
};
