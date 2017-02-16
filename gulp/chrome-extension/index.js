const gulp = require('gulp');
const runSequence = require('run-sequence');

require('./clean');
require('./tasks/');
require('./webpack');
require('./deploy');


gulp.task('chrome', function(callback) {
	runSequence('chrome:clean', ['chrome:tasks', 'chrome:webpack'], 'chrome:deploy', callback);
});

gulp.task('watch-chrome', function(callback) {
	runSequence('chrome:clean', ['watch-chrome:tasks', 'watch-chrome:webpack'], callback);
});

