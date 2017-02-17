const {resolve} = require('path');
const {removeSync, copySync, outputFileSync} = require('fs-extra');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJson = require('./package.json');
const manifestJson = require('./source/export/chrome/manifest.json');

const DIST = resolve(__dirname, './dist/chrome');
const SOURCE = resolve(__dirname, './source');
const SOURCE_CHROME = resolve(__dirname, './source/export/chrome');


/**
 * Copy images & manifest.json
 */
removeSync(DIST);
copySync(resolve(SOURCE, 'img'), resolve(DIST, 'img'));
const manifest = Object.assign({}, manifestJson, {
	name: packageJson.fullName,
	description: packageJson.description,
	version: packageJson.version,
	author: packageJson.author,
});
outputFileSync(resolve(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2));



/**
 * Webpack config
 */
module.exports = {
	context: SOURCE_CHROME,
	entry: {
		'injector': './injector',
		'ext': './ext',
	},
	output: {
		path: DIST,
		filename: '[name].js',
	},
	externals: {
		pgf: 'pgf',
		jquery: 'jQuery',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
						},
						{
							loader: 'postcss-loader',
						},
					],
				}),
			},
		],
	},
	plugins: [
		new ExtractTextPlugin('[name].css'),
	],
};
