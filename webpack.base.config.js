/**
 * Base config
 */
module.exports = {
	externals: {
		pgf: 'pgf',
		jquery: 'jQuery',
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.ts/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
			{
				test: /\.svg$/,
				use: 'raw-loader',
			},
		],
	},
	plugins: [],
};
