import jwt from 'jsonwebtoken';
import { Resolvers } from '../../types';

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

				const token = jwt.sign(userData, process.env.JWT_SECRET || '', {
					...(Number(process.env.JWT_EXPIRY) ? { expiresIn: process.env.JWT_EXPIRY } : {}),
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
