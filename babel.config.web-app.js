module.exports = {
	presets: ['@babel/preset-typescript'],
	plugins: [
		'react-hot-loader/babel',
		'babel-plugin-styled-components',
		[
			'react-intl',
			{
				messagesDir: './build/messages/',
				enforceDescriptions: true,
			},
		],
	],
};
