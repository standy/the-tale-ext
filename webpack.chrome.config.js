const baseConfig = require('./webpack.base.config');

const {resolve} = require('path');
const {removeSync, copySync, outputFileSync} = require('fs-extra');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJson = require('./package.json');
const manifestJson = require('./source/export/chrome/manifest.json');

const DIST_CHROME = resolve(__dirname, './dist/chrome');
const SOURCE_CHROME = resolve(__dirname, './source/export/chrome');


/**
 * Copy images & manifest.json
 */
removeSync(DIST_CHROME);
copySync(resolve(__dirname, './source/img'), resolve(DIST_CHROME, 'img'));
const manifest = Object.assign({}, manifestJson, {
	name: packageJson.fullName,
	description: packageJson.description,
	version: packageJson.version,
	author: packageJson.author,
});
outputFileSync(resolve(DIST_CHROME, 'manifest.json'), JSON.stringify(manifest, null, 2));



/**
 * Webpack config for Chrome Store
 */
const config = Object.assign({}, baseConfig, {
	context: SOURCE_CHROME,
	entry: {
		'injector': './injector',
		'ext': './ext',
	},
	output: {
		path: DIST_CHROME,
		filename: '[name].js',
		// library: 'ext',
		// libraryTarget: 'var',
	},
});

config.module.rules.push({
	test: /\.css$/,
	use: ExtractTextPlugin.extract({
		fallback: 'style-loader',
		use: [
			{
				loader: 'css-loader',
				options: {
					url: false,
				},
			},
			{
				loader: 'postcss-loader',
			},
		],
	}),
});
config.plugins.push(
	new ExtractTextPlugin('[name].css')
);

module.exports = config;
