var path = require('path');
var fs = require('fs');

var root = path.join(__dirname, '../../');
var sourceDir = path.join(root, 'source');

module.exports = {
	context: sourceDir, // исходная директория
	entry: {
		'chrome/js/ext': './export/chrome/ext.js'
	},

	output: {
		path: path.join(root, 'dist'), // выходная директория
		filename: '[name].js',
		chunkFilename: '[name].chunk.[id].js'
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'jshint-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'jscs-loader'
			}
		]
	},
	externals: {
		// require('jquery') is external and available
		//  on the global var jQuery
		jquery: 'window.jQuery',
		pgf: 'window.pgf'
	}
};
