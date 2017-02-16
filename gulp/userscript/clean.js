const gulp = require('gulp');
const rimraf = require('rimraf');

const TASK = 'userscript:clean';

gulp.task(TASK, function(cb) {
	rimraf('./dist/userscript', cb);
});
