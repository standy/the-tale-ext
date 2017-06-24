const baseConfig = require('./webpack.base.config');

const {resolve} = require('path');
const {removeSync, copySync, outputFileSync} = require('fs-extra');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJson = require('./package.json');
const manifestJson = require('./source/export/chrome/manifest.json');

const DIST_CHROME = resolve(__dirname, './dist/chrome');
const SOURCE_CHROME = resolve(__dirname, './source/export/chrome');

const DIST_CHROME_ZIP = resolve(__dirname, `./dist/chrome.zip`);


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

/* archive plugin */
config.plugins.push(
	{
		apply: function(compiler) {
			compiler.plugin('after-emit', (stats, cb) => {
				zipDir(DIST_CHROME, DIST_CHROME_ZIP, cb);
			});
		},
	}
);

function zipDir(dir, dest, callback) {
	const fs = require('fs');
	const archiver = require('archiver');

	// create a file to stream archive data to.
	const output = fs.createWriteStream(dest);
	const archive = archiver('zip');

	// listen for all archive data to be written
	output.on('close', () => {
		console.log('[Archive] Total size:', archive.pointer() + ' bytes');
		callback();
	});

	// good practice to catch this error explicitly
	archive.on('error', err => {
		console.error('[Archive] Error:', err);
		throw err;
	});

	// pipe archive data to the file
	archive.pipe(output);


	archive.directory(dir, '/');

	// finalize the archive (ie we are done appending files but streams have to finish yet)
	archive.finalize();
}


module.exports = config;
