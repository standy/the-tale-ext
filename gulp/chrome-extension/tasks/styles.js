/*
* обработка стилей
* */

const gulp = require('gulp');
//var less = require('gulp-less');
//var watchLess = require('gulp-watch-less');
const autoprefixer = require('gulp-autoprefixer');

const config = require('./config');

const SRC = [
	'./source/css/**/*.css'
];
const DEST = config.dist + '/css';
const TASK = config.prefix + 'styles';

gulp.task(TASK, function() {
	return gulp.src(SRC)
//		.pipe(watchLess(SRC))
//		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 4 Chrome versions']
		}))
//		.pipe(base64({
//			extensions: ['jpg', 'png'],
//			maxImageSize: 32*1024 // размер указывается в байтах, тут он 32кб потому и больше уже плохо для IE8
//		}))
//		.pipe(minifyCSS({
//			keepBreaks: false
//		}))
		.pipe(gulp.dest(DEST));
});

module.exports = {
	task: TASK,
	watchSrc: SRC,
	watchTask: TASK
};
