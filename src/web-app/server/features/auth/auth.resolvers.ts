import jwt from 'jsonwebtoken';
import { Resolvers } from '../../types';

const { JWT_SECRET, JWT_EXPIRY } = process.env;

export const resolvers: Resolvers = {
	Query: {
		currentAuthSession: (root, args, { user }) =>
			(user && {
				user: { email: user.sub, isAdmin: user.isAdmin },
			}) || {
				user: null,
			},
	},
	Mutation: {
		login: (root, { email, password }, { cookies }) => {
			if (email === 'sami@saglam.tk' && password === '12345') {
				const userData = { sub: email, isAdmin: true };

				const token = jwt.sign(userData, JWT_SECRET || '', {
					...(Number(JWT_EXPIRY) ? { expiresIn: JWT_EXPIRY } : {}),
				});

				cookies.set('accessToken', token);

				return {
					user: { email },
				};
			}
			throw new Error('invalid creds');
		},
	},
};
