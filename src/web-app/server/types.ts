import Cookies from 'cookies';

export interface JWTUser {
	sub: string;
	isAdmin: boolean;
}

export interface Context {
	user?: JWTUser;
	cookies: Cookies;
}

declare global {
	namespace Express {
		export interface Request {
			user?: JWTUser;
			cookies: Cookies;
		}
	}
}
