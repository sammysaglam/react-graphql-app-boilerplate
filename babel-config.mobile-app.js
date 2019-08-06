/* eslint-disable func-names */
module.exports = function(api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'react-intl',
				{
					messagesDir: './build/messages/',
					enforceDescriptions: true,
				},
			],
		],
	};
};
