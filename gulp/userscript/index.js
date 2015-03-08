var gulp = require('gulp');
var runSequence = require('run-sequence');

require('./clean.js');
require('./webpack.js');


gulp.task('userscript', function(callback) {
	runSequence('userscript:clean', 'userscript:webpack', callback);
});

gulp.task('watch-userscript', function(callback) {
	runSequence('userscript:clean', 'watch-userscript:webpack', callback);
});

