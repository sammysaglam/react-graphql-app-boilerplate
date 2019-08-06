import path from 'path';

export const ENV = {
	ROOT_DIR: path.join(__dirname, '../../../../'),
	DEV_API_PORT: process.env.DEV_API_PORT,
	USE_WEBPACKDEV_SERVER: process.env.USE_WEBPACKDEV_SERVER === 'true',
	WEBPACKDEV_PORT: process.env.WEBPACKDEV_PORT,
};

export const DEV_TOOLS = {
	GRAPHQL_PLAYGROUND_ENABLED: process.env.GRAPHQL_PLAYGROUND === 'enabled',
};

export const JWT = {
	SECRET: process.env.JWT_SECRET,
	EXPIRY: process.env.JWT_EXPIRY,
};
