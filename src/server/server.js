const fetch = require('node-fetch');
const { ApolloClient, InMemoryCache } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const { readFileSync } = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers.js');
const expressWs = require('express-ws')(express());
const { app } = expressWs;

const {
	graphqlExpress,
	graphiqlExpress,
} = require('apollo-server-express');

require('dotenv').config();

const {
	JWT_SECRET,
	JWT_EXPIRY,
	DEV_API_PORT,
	WEBPACKDEV_PORT,
	USE_WEBPACKDEV_SERVER,
} = process.env; // eslint-disable-line no-process-env, no-undef

const typeDefs = readFileSync(
	// eslint-disable-next-line no-undef
	path.join(__dirname, './schema.graphql'),
	'utf-8',
);

const jwtSecret = JWT_SECRET;
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(
	helmet(),
	cors(),
	bodyParser.json(),
	expressJwt({
		secret: jwtSecret,
		credentialsRequired: false,
	}),
);

// authentication
app.post('/authenticate', (req, res) => {
	const { username, password } = req.body;
	if (username !== 'sammy' || password !== 'cool') {
		res.sendStatus(401); // eslint-disable-line no-magic-numbers
		return;
	}
	const token = jwt.sign({ sub: username }, jwtSecret, {
		...(Number(JWT_EXPIRY) ? { expiresIn: JWT_EXPIRY } : {}),
	});
	res.send({ token });
});

// web sockets
app.ws('/websocket', ws => {
	ws.on('message', () => {
		ws.send('wowo');
	});
});

// graphql
app.use(
	'/graphql',
	graphqlExpress(({ user }) => ({ schema, context: { user } })),
);

// disable favicon
// eslint-disable-next-line no-magic-numbers
app.get('favicon.ico', (req, res) => res.status(204));

if (USE_WEBPACKDEV_SERVER === 'true') {
	app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

	// redirect to webpack-dev-server
	app.all('/', (req, res) =>
		res.redirect(`http://localhost:${WEBPACKDEV_PORT}`),
	);

	app.listen(DEV_API_PORT, () =>
		// eslint-disable-next-line no-console
		console.log(`API running on port ${DEV_API_PORT}`),
	);
} else {
	app.use(compression());
	app.use(express.static('build/client'));
	app.use('*', express.static('build/client'));

	// html generator
	const html = require('../client/index.html.js');

	// ssr stuff
	const { default: ssr } = require('../client/entry.ssr');

	const apolloClient = new ApolloClient({
		ssrMode: true,
		link: createHttpLink({
			fetch,
			uri: 'http://localhost:3000/graphql',
		}),
		cache: new InMemoryCache(),
	});

	// send app to client
	app.get('*', async ({ originalUrl }, res) => {
		const { ssrStringAsync, stylesheet } = ssr({
			apolloClient,
			location: originalUrl,
		});

		const ssrString = await ssrStringAsync;

		return res.send(
			html({
				ssr: ssrString,
				defaultApolloState: apolloClient.extract(),
				styleTags: stylesheet.getStyleTags(),
			}),
		);
	});

	// eslint-disable-next-line no-magic-numbers
	app.listen(3000, () =>
		// eslint-disable-next-line no-console
		console.log(`App running on port 3000`),
	);
}
