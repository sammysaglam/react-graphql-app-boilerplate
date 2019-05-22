import Cookies from 'cookies';
import { Resolvers as ResolversWithoutContext } from './schema.types';

export interface JWTUser {
	sub: string;
	isAdmin: boolean;
}

export interface Context {
	user?: JWTUser;
	cookies: Cookies;
}

export type Resolvers = ResolversWithoutContext<Context>;

declare global {
	namespace Express {
		export interface Request {
			user?: JWTUser;
			cookies: Cookies;
		}
	}
}
