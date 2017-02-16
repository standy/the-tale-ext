const path = require('path');
const root = path.join(__dirname, '../../');
const sourceDir = path.join(root, 'source');

module.exports = {
	context: sourceDir, // исходная директория
	entry: {
		'chrome/js/ext': './export/chrome/ext.js',
	},

	output: {
		path: path.join(root, 'dist'), // выходная директория
		filename: '[name].js',
		chunkFilename: '[name].chunk.[id].js',
	},
	externals: {
		// require('jquery') is external and available
		//  on the global var jQuery
		jquery: 'window.jQuery',
		pgf: 'window.pgf',
	},
};
