const gulp = require('gulp');
const zip = require('gulp-zip');
const fs = require('fs');
const rimraf = require('rimraf');

const SRC = './dist/chrome/**/*';
const DEST = './dist';
const TASK = 'chrome:deploy';

const DATA_SRC = './package.json';
const data = JSON.parse(fs.readFileSync(DATA_SRC, 'utf8'));


gulp.task('chrome:deploy:clean', function(cb) {
	rimraf('./dist/chrome-extension-*.zip', cb);
});

gulp.task(TASK, ['chrome:deploy:clean'], function() {
	return gulp.src(SRC)
		.pipe(zip('chrome-extension-' + data.version + '.zip'))
		.pipe(gulp.dest(DEST));
});
