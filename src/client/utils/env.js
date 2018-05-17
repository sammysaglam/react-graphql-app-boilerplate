const { canUseDOM } = require('exenv');

export const IS_SSR = !canUseDOM;

/* eslint-disable no-process-env, no-undef */
const DEV_API_PORT = process.env.DEV_API_PORT;
const USE_WEBPACKDEV_SERVER =
	process.env.USE_WEBPACKDEV_SERVER === 'true';

const HOSTNAME = IS_SSR ? '' : window.location.hostname;
const PROTOCOL = IS_SSR ? '' : window.location.protocol;
const PORT = IS_SSR ? '' : window.location.port;

export const API_ENDPOINT = USE_WEBPACKDEV_SERVER
	? `${PROTOCOL}//${HOSTNAME}:${DEV_API_PORT}/`
	: '/';

export const WEBSOCKETS_ENDPOINT = USE_WEBPACKDEV_SERVER
	? `${
			PROTOCOL === 'https:' ? 'wss:' : 'ws:'
	  }//${HOSTNAME}:${DEV_API_PORT}/websocket/`
	: `${
			PROTOCOL === 'https:' ? 'wss:' : 'ws:'
	  }//${HOSTNAME}:${PORT}/websocket/`;

export const GRAPHQL_ENDPOINT = API_ENDPOINT + 'graphql';
