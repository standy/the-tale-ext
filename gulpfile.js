var gulp = require('gulp');

require('./gulp/chrome-extension/index.js');
require('./gulp/userscript/index.js');


gulp.task('watch', ['watch-chrome', 'watch-userscript']);
gulp.task('dev', ['watch-chrome']);

gulp.task('default', ['chrome', 'userscript']);
