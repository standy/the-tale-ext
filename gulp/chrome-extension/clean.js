var gulp = require('gulp');
var rimraf = require('rimraf');

var TASK = 'chrome:clean';

gulp.task(TASK, function(cb) {
	rimraf('./dist/chrome/', cb);
});
