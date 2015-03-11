var gulp = require('gulp');
var runSequence = require('run-sequence');

require('./clean');
require('./webpack');


gulp.task('userscript', function(callback) {
	runSequence('userscript:clean', 'userscript:webpack', callback);
});

gulp.task('watch-userscript', function(callback) {
	runSequence('userscript:clean', 'watch-userscript:webpack', callback);
});

