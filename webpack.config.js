const path = require( 'path' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const webpackConfig = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		main: './src/main.ts',
	},
	output: {
		path: path.join( __dirname, 'js' ),
		filename: 'admin-bar-publish.js'
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js' ]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			},
			{
				test: /\.js$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
		]
	},
	optimization: {
		minimizer: [ new OptimizeCSSAssetsPlugin( {} ), new UglifyJsPlugin() ],
	},
	plugins: [
		new MiniCssExtractPlugin( { filename: '../css/admin-bar-publish.css' } ),
	]
};
module.exports = webpackConfig;
