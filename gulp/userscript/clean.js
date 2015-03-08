var gulp = require('gulp');
var rimraf = require('rimraf');

var TASK = 'userscript:clean';

gulp.task(TASK, function (cb) {
	rimraf('./dist/userscript', cb);
});
