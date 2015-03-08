var gulp = require('gulp');
var runSequence = require('run-sequence');

require('./clean.js');
require('./tasks/index.js');
require('./webpack.js');
require('./deploy.js');


gulp.task('chrome', function(callback) {
	runSequence('chrome:clean', ['chrome:tasks', 'chrome:webpack'], 'chrome:deploy', callback);
});

gulp.task('watch-chrome', function(callback) {
	runSequence('chrome:clean', ['watch-chrome:tasks', 'watch-chrome:webpack'], callback);
});

