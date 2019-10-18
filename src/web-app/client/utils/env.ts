import { canUseDOM } from 'exenv';

export const IS_SSR = !canUseDOM;

const HOSTNAME = IS_SSR ? '' : window.location.hostname;
const PROTOCOL = IS_SSR ? '' : window.location.protocol;
const PORT = IS_SSR ? '' : window.location.port;

export const API_ENDPOINT = '/';

export const WEBSOCKETS_ENDPOINT = `${
	PROTOCOL === 'https:' ? 'wss:' : 'ws:'
}//${HOSTNAME}:${PORT}/websocket/`;

export const GRAPHQL_ENDPOINT = `${API_ENDPOINT}graphql`;
