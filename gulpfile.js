const gulp = require('gulp');

require('./gulp/chrome-extension/');
require('./gulp/userscript/');


gulp.task('watch', ['watch-chrome', 'watch-userscript']);
gulp.task('dev', ['watch-chrome']);

gulp.task('default', ['chrome', 'userscript']);
