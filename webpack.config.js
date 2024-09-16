const path = require( 'path' );
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
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
		minimizer: [ new CssMinimizerPlugin(), new TerserPlugin() ],
	},
	plugins: [
		new MiniCssExtractPlugin( { filename: '../css/admin-bar-publish.css' } ),
	]
};
module.exports = webpackConfig;
