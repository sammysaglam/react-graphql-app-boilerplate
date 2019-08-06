require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLMinifier = require('html-minifier');
const nodeExternals = require('webpack-node-externals');
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
const jsonminify = require('jsonminify');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

const babelConfig = require('./babel.config.web-app');

const copyFiles = ({ isProduction }) =>
	new CopyWebpackPlugin(
		[
			{
				from: {
					glob: '**/*.+(html|json|png|svg|jpg|jpeg|gif|ttf|woff|eot)',
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
			ignore: [{ glob: '**/_*/**' }, { glob: '**/_*' }, 'index.html'],
		},
	);

const { htmlGenerator } = require('./src/web-app/client/index.html.js');

module.exports = env => {
	const { WEBPACKDEV_PORT, DEV_API_PORT } = process.env;

	const analyzeBuild = env && env.analyze === 'true';
	const isHotLoaderEnv = !analyzeBuild && env && env.hot === 'true';
	const isProduction =
		analyzeBuild || (!isHotLoaderEnv && env && env.production === 'true');

	return [
		{
			...(isProduction
				? { mode: 'production' }
				: { mode: 'development', devtool: 'source-map' }),

			...(isHotLoaderEnv
				? {
						devServer: {
							historyApiFallback: true,
							hot: true,
							contentBase: path.join(__dirname, 'build/client'),
							compress: true,
							port: WEBPACKDEV_PORT,
							host: '0.0.0.0',
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
								'/websocket/*': {
									target: 'http://0.0.0.0:' + DEV_API_PORT,
									ws: true,
								},
							},
						},
				  }
				: {}),

			entry: {
				bundle: [
					'react-hot-loader/patch',
					'./src/web-app/client/entry.tsx',
					'./src/web-app/client/entry.scss',
				],
			},
			output: {
				path: path.join(__dirname, 'build/client'),
				filename: '[name].js',
				publicPath: '/',
			},

			plugins: [
				copyFiles({ isProduction }),

				...(analyzeBuild ? [new BundleAnalyzerPlugin()] : []),

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

				...(isProduction
					? [
							new ImageminPlugin(),
							new OptimizeCssAssetsPlugin({
								assetNameRegExp: /\.(scss|css)$/g,
							}),
							new CleanWebpackPlugin({
								cleanOnceBeforeBuildPatterns: 'build/client',
							}),
					  ]
					: []),

				new webpack.DefinePlugin({
					'process.env.USE_WEBPACKDEV_SERVER': isHotLoaderEnv
						? '"true"'
						: '"false"',
				}),
			],

			module: {
				rules: [
					{
						test: /\.(js|jsx|ts|tsx)$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: babelConfig,
						},
					},
					{
						test: /\.mjs$/,
						include: /node_modules/,
						type: 'javascript/auto',
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
					{
						test: /\.(graphql|gql)$/,
						exclude: /node_modules/,
						loader: 'graphql-tag/loader',
					},
				],
			},

			resolve: {
				extensions: ['.ts', '.js', '.jsx', '.tsx'],
				alias: {
					'react-dom': '@hot-loader/react-dom',
				},
			},
		},

		// compile server
		...(!isHotLoaderEnv && !analyzeBuild
			? [
					{
						mode: isProduction ? 'production' : 'development',
						entry: './src/web-app/server/server',
						output: {
							path: path.resolve(__dirname, 'build/server'),
							filename: 'server.js',
							publicPath: '/',
						},
						plugins: [
							new webpack.DefinePlugin({
								'process.env.USE_WEBPACKDEV_SERVER': '"false"',
							}),
							...(isProduction
								? [
										new CleanWebpackPlugin({
											cleanOnceBeforeBuildPatterns: 'build/server',
										}),
								  ]
								: []),
						],
						module: {
							rules: [
								{
									test: /\.(js|jsx|ts|tsx)$/,
									exclude: /node_modules/,
									use: {
										loader: 'babel-loader',
										options: {
											...babelConfig,
											plugins: [
												...babelConfig.plugins,
												'babel-plugin-static-fs',
											],
										},
									},
								},
								{
									test: /\.mjs$/,
									include: /node_modules/,
									type: 'javascript/auto',
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
									test: /\.(graphql|gql)$/,
									exclude: /node_modules/,
									loader: 'graphql-tag/loader',
								},
							],
						},
						target: 'node',
						node: {
							__dirname: true,
						},
						resolve: {
							extensions: ['.ts', '.js', '.jsx', '.tsx'],
						},
						optimization: {
							minimize: false,
						},
						externals: [nodeExternals()],
					},
			  ]
			: []),
	];
};
