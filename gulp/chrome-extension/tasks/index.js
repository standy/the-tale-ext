var gulp = require('gulp');

var tasks = ['styles', 'images', 'manifest', 'misc'];
var options = tasks.map(function(name) {
	return require('./' + name + '.js');
});

gulp.task('chrome:tasks', options.map(function(opt) { return opt.task; }));

gulp.task('watch-chrome:tasks', ['chrome:tasks'], function() {
	options.forEach(function(opts) {
		if (!opts.watchTask) { return; }
		gulp.watch(opts.watchSrc, [opts.watchTask]);
	});
});
