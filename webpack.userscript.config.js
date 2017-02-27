const baseConfig = require('./webpack.base.config');
const {resolve} = require('path');
const packageJson = require('./package.json');
const {BannerPlugin} = require('webpack');

const DIST_USERSCRIPT = resolve(__dirname, './dist/userscript');
const SOURCE_USERSCRIPT = resolve(__dirname, './source/export/userscript');


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
 * Webpack config for Userscript
 */
const config = Object.assign({}, baseConfig, {
	context: SOURCE_USERSCRIPT,
	entry: {
		'the-tale-extension.user': './the-tale-extension.user',
	},
	output: {
		path: DIST_USERSCRIPT,
		filename: '[name].js',
		library: 'ext',
		libraryTarget: 'var',
	},
});

config.module.rules.push({
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
});

config.plugins.push(
	new BannerPlugin({
		banner: HEADER,
		raw: true,
		entryOnly: true,
	})
);

module.exports = config;
