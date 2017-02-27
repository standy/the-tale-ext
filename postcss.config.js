/**
 * PostCSS config
 */
module.exports = {
	plugins: [
		require('postcss-nested'),
		require('postcss-custom-properties'),
		require('autoprefixer')({
			browsers: ['last 4 Chrome versions'],
		}),
	],
};
