const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HTMLMinifier = require('html-minifier');
const jsonminify = require('jsonminify');
const DotenvWebpackPlugin = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

require('dotenv').config();

const htmlGenerator = require('./src/client/index.html.js');

module.exports = env => {
	// eslint-disable-next-line no-process-env, no-undef
	const { WEBPACKDEV_PORT, DEV_API_PORT } = process.env;

	const copyFiles = ({ isProduction }) =>
		new CopyWebpackPlugin(
			[
				{
					from: {
						glob:
							'**/*.+(html|json|png|svg|jpg|jpeg|gif|ttf|woff|eot)',
					},
					context: 'src/client',
					to: './[path]/[name].[ext]',
					transform: (fileContents, filepath) => {
						if (!isProduction) return fileContents;

						// get file extension
						const fileExt = filepath
							.split('.')
							.pop()
							.toLowerCase();

						// minify HTML
						switch (fileExt) {
							case 'html':
								return HTMLMinifier.minify(fileContents.toString(), {
									collapseWhitespace: true,
									collapseInlineTagWhitespace: true,
									minifyCSS: true,
									minifyJS: true,
									removeComments: true,
									removeRedundantAttributes: true,
								});
							case 'json':
								return jsonminify(fileContents.toString());

							default:
								return fileContents;
						}
					},
				},
			],
			{
				ignore: [
					{ glob: '**/_*/**' },
					{ glob: '**/_*' },
					'index.html',
				],
			},
		);

	const analyzeBuild = env && env.analyze === 'true';
	const isHotLoaderEnv = !analyzeBuild && env && env.hot === 'true';

	const isProduction =
		analyzeBuild ||
		(!isHotLoaderEnv && env && env.production === 'true');

	return [
		{
			...(isProduction
				? { mode: 'production' }
				: { mode: 'development', devtool: 'source-map' }),

			...(isHotLoaderEnv
				? {
						devServer: {
							// eslint-disable-next-line no-undef
							contentBase: path.join(__dirname, 'build/client'),
							hotOnly: true,
							compress: true,
							port: WEBPACKDEV_PORT,
							host: 'localhost',
							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods':
									'GET, POST, PUT, DELETE, PATCH, OPTIONS',
								'Access-Control-Allow-Headers':
									'X-Requested-With, content-type, Authorization',
							},
							proxy: {
								'/graphql/*': {
									target: 'http://0.0.0.0:' + DEV_API_PORT,
								},
								'/graphiql/*': {
									target: 'http://0.0.0.0:' + DEV_API_PORT,
								},
								'/websocket/*': {
									target: 'http://0.0.0.0:' + DEV_API_PORT,
								},
							},
						},
				  }
				: {}),

			entry: {
				bundle: isHotLoaderEnv
					? [
							'react-hot-loader/patch',
							'./src/client/entry.js',
							'./src/client/entry.scss',
					  ]
					: ['./src/client/entry.js', './src/client/entry.scss'],
			},

			output: {
				// eslint-disable-next-line no-undef
				path: path.join(__dirname, 'build/client'),
				filename: '[name].js',
				publicPath: `http://localhost:${WEBPACKDEV_PORT}/`,
			},

			plugins: [
				new DotenvWebpackPlugin(),
				copyFiles({ isProduction }),
				new webpack.DefinePlugin({
					'process.env': {
						USE_WEBPACKDEV_SERVER: isHotLoaderEnv
							? `'true'`
							: `'false'`,
					},
				}),
				...(isHotLoaderEnv
					? [
							new GenerateAssetPlugin({
								filename: 'index.html',
								fn: (compilation, callback) => {
									callback(null, htmlGenerator());
								},
							}),
					  ]
					: []),
				...(analyzeBuild ? [new BundleAnalyzerPlugin()] : []),
				...(isProduction
					? [
							new ImageminPlugin(),
							new OptimizeCssAssetsPlugin({
								assetNameRegExp: /\.(scss|css)$/g,
							}),
							new CleanWebpackPlugin('build/client'),
							new UglifyJSPlugin({
								uglifyOptions: {
									compress: true,
									output: {
										comments: false,
									},
								},
							}),
					  ]
					: []),
			],
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								plugins: isHotLoaderEnv
									? ['react-hot-loader/babel']
									: [],
							},
						},
					},
					{
						test: /\.md/,
						exclude: /node_modules/,
						loader: ['babel-loader', 'axe-markdown-loader'],
					},
					{
						test: /\.(png|jpg|jpeg|gif|ttf|woff|eot)$/,
						loader: 'url-loader',
						exclude: /node_modules/,
					},
					{
						test: /\.(svg)$/,
						loader: 'svg-react-loader',
						exclude: /node_modules/,
					},
					{
						test: /\.(css|scss)$/,
						loader: ['style-loader', 'css-loader', 'sass-loader'],
						exclude: /node_modules/,
					},
				],
			},
			resolve: {
				alias: {
					'prop-types$': path.resolve('node_modules/axe-prop-types'),
				},
			},
		},

		// compile server
		...(!isHotLoaderEnv && !analyzeBuild
			? [
					{
						mode: isProduction ? 'production' : 'development',
						entry: './src/server/server.js',
						output: {
							// eslint-disable-next-line no-undef
							path: path.resolve(__dirname, 'build/server'),
							filename: 'server.js',
							publicPath: '/',
						},
						module: {
							rules: [
								{
									test: /\.js$/,
									exclude: /node_modules/,
									use: {
										loader: 'babel-loader',
										options: {
											plugins: ['static-fs'],
										},
									},
								},
								{
									test: /\.(png|jpg|jpeg|gif|ttf|woff|eot)$/,
									loader: 'url-loader',
									exclude: /node_modules/,
								},
							],
						},
						target: 'node',
						externals: nodeExternals(),
						plugins: [
							new webpack.DefinePlugin({
								'process.env': 'process.env',
							}),
							...(isProduction
								? [
										new UglifyJSPlugin({
											uglifyOptions: {
												compress: true,
												output: {
													comments: false,
												},
											},
										}),
										new CleanWebpackPlugin('build/server'),
								  ]
								: []),
						],
					},
			  ]
			: []),
	];
};
