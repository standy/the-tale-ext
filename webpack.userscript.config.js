const {resolve} = require('path');
const packageJson = require('./package.json');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');

const DIST = resolve(__dirname, './dist/userscript');
const SOURCE = resolve(__dirname, './source');
const SOURCE_USERSCRIPT = resolve(SOURCE, './export/userscript');


const HEADER =
`// ==UserScript==
// @name        ${packageJson.fullName}
// @description ${packageJson.description}
// @author      ${packageJson.author}
// @version     ${packageJson.version}
// @include     http://the-tale.org/game/
// @run-at      document-end
// @license     MIT License
// @namespace   ${packageJson.name}
// ==/UserScript==
// @require     http://code.jquery.com/jquery-1.11.2.min.js
// @grant       GM_addStyle

`;



/**
 * Webpack config
 */
module.exports = {
	context: SOURCE_USERSCRIPT,
	entry: {
		'the-tale-extension.user': './the-tale-extension.user',
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
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
					},
				],
			},
		],
	},
	plugins: [
		new SmartBannerPlugin({
			banner: HEADER,
			raw: true,
			entryOnly: true,
		}),
	],
};
