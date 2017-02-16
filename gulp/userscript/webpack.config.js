const path = require('path');

const root = path.join(__dirname, '../../');
const sourceDir = path.join(root, 'source');


module.exports = {
	context: sourceDir, // исходная директория
	entry: {
		'the-tale-extension.user': './export/userscript/the-tale-extension.user.js'
	},

	output: {
		path: path.join(root, 'dist'), // выходная директория
		filename: '[name].js',
		chunkFilename: '[name].chunk.[id].js'
	},

	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style!css'
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
