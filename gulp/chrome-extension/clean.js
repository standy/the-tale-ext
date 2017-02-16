const gulp = require('gulp');
const rimraf = require('rimraf');

const TASK = 'chrome:clean';

gulp.task(TASK, function(cb) {
	rimraf('./dist/chrome/', cb);
});
