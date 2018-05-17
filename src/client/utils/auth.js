import { API_ENDPOINT, IS_SSR } from './env';

const accessTokenKey = 'accessToken';

export const getAccessToken = () =>
	localStorage.getItem(accessTokenKey);

export const login = async ({ username, password }) => {
	const response = await fetch(API_ENDPOINT + 'authenticate', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username, password }),
	});
	if (response.ok) {
		const { token } = await response.json();
		localStorage.setItem(accessTokenKey, token);
	}
	return response.ok;
};

export const isLoggedIn = () =>
	IS_SSR ? false : Boolean(localStorage.getItem(accessTokenKey));

export const logout = () => {
	if (IS_SSR) return false;
	localStorage.removeItem(accessTokenKey);
	return true;
};
