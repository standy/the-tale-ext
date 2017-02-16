const gulp = require('gulp');

const tasks = ['styles', 'images', 'manifest', 'misc'];
const options = tasks.map(function(name) {
	return require('./' + name + '');
});

gulp.task('chrome:tasks', options.map(function(opt) { return opt.task; }));

gulp.task('watch-chrome:tasks', ['chrome:tasks'], function() {
	options.forEach(function(opts) {
		if (!opts.watchTask) { return; }
		gulp.watch(opts.watchSrc, [opts.watchTask]);
	});
});
