import jwt from 'jsonwebtoken';
import { JWT } from '../../utils/config';
import { Resolvers } from '../../schema.types';

export const resolvers: Resolvers = {
	Query: {
		currentAuthSession: (root, args, { user }) =>
			(user && {
				id: 'current',
				user: { email: user.sub, isAdmin: user.isAdmin },
			}) || {
				id: 'current',
				user: null,
			},
	},
	Mutation: {
		login: (root, { email, password }, { cookies }) => {
			if (email === 'sammy@saglam.cc' && password === '12345') {
				const userData = { sub: email, isAdmin: true };

				const token = jwt.sign(userData, JWT.SECRET || '', {
					...(Number(JWT.EXPIRY) ? { expiresIn: JWT.EXPIRY } : {}),
				});

				cookies.set('accessToken', token);

				return {
					id: 'current',
					user: { email, isAdmin: userData.isAdmin },
				};
			}
			throw new Error('invalid creds');
		},
	},
};
