const resolvers = {
	Query: {
		greeting: () => 'Hello World!',
		sensitiveData: (root, variables, { user }) => {
			if (!user) {
				throw new Error('Unauthorized');
			}

			return 'Top secret message here!';
		},
	},
};

module.exports = resolvers;
