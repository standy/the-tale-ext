var gulp = require('gulp');
var zip = require('gulp-zip');
var fs = require('fs');
var rimraf = require('rimraf');

var SRC = './dist/chrome/**/*';
var DEST = './dist';
var TASK = 'chrome:deploy';

var DATA_SRC = './package.json';
var data = JSON.parse(fs.readFileSync(DATA_SRC, 'utf8'));


gulp.task('chrome:deploy:clean', function(cb) {
	rimraf('./dist/chrome-extension-*.zip', cb);
});

gulp.task(TASK, ['chrome:deploy:clean'], function() {
	return gulp.src(SRC)
		.pipe(zip('chrome-extension-' + data.version + '.zip'))
		.pipe(gulp.dest(DEST));
});
