const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET, JWT_EXPIRY } = process.env; // eslint-disable-line no-process-env, no-undef

const resolvers = {
	Query: {
		currentUserSession: (root, args, { user }) =>
			(user && {
				isGuest: false,
				isAdmin: user.isAdmin,
				email: user.sub,
			}) || {
				isGuest: true,
				isAdmin: false,
			},
		greeting: () => 'Hello World!',
		sensitiveData: (root, variables, { user }) => {
			if (!user) {
				throw new Error('Unauthorized');
			}

			return 'Top secret message here!';
		},
	},
	Mutation: {
		authenticate: (root, { email, password }, { req }) => {
			if (email === 'sami@saglam.tk' && password === '12345') {
				const token = jwt.sign(
					{ sub: email, isAdmin: true },
					JWT_SECRET,
					{
						...(Number(JWT_EXPIRY) ? { expiresIn: JWT_EXPIRY } : {}),
					},
				);

				req.cookies.set('accessToken', token);

				return token;
			}
			throw new Error('invalid creds');
		},
		logout: (root, args, { req }) => {
			req.cookies.set('accessToken');
			return true;
		},
	},
};

module.exports = resolvers;
