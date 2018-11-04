const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { ApolloClient, InMemoryCache } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const expressJwt = require('express-jwt');
const bodyParser = require('body-parser');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers.js');
const expressWs = require('express-ws')(express());
const { app } = expressWs;
const Cookies = require('cookies');

const { ApolloServer } = require('apollo-server-express');

require('dotenv').config();

const {
	JWT_SECRET,
	DEV_API_PORT,
	WEBPACKDEV_PORT,
	USE_WEBPACKDEV_SERVER,
} = process.env;

const typeDefs = USE_WEBPACKDEV_SERVER
	? fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf-8')
	: require('./schema.graphql');

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use((req, res, next) => {
	const options = { keys: ['12334'] };
	req.cookies = new Cookies(req, res, options);
	next();
});

app.use(
	helmet(),
	cors(),
	bodyParser.json(),
	expressJwt({
		secret: JWT_SECRET,
		credentialsRequired: false,
		getToken: req => {
			if (
				req.headers.authorization &&
				req.headers.authorization.split(' ')[0] === 'Bearer'
			) {
				return req.headers.authorization.split(' ')[1];
			}

			return req.cookies.get('accessToken') || null;
		},
	}),
);

// web sockets
app.ws('/websocket', ws => {
	ws.on('message', () => {
		ws.send('wowo');
	});
});

const apolloServer = new ApolloServer({
	schema,
	context: ({ req, res }) => ({
		user: req.user,
		req,
		res,
	}),
	playground: process.env.NODE_ENV !== 'production',
});
apolloServer.applyMiddleware({ app });

// disable favicon
// eslint-disable-next-line no-magic-numbers
app.get('/favicon.ico', (req, res) => res.send(''));
app.get('/favicon.ico/', (req, res) => res.send(''));

if (USE_WEBPACKDEV_SERVER === 'true') {
	// redirect to webpack-dev-server
	app.all('/', (req, res) =>
		res.redirect(`http://0.0.0.0:${WEBPACKDEV_PORT}`),
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

	// send app to client
	app.get('*', async ({ originalUrl, cookies }, res) => {
		const accessToken = cookies.get('accessToken');
		const apolloClient = new ApolloClient({
			ssrMode: true,
			link: createHttpLink({
				fetch,
				uri: 'http://0.0.0.0:3000/graphql',
				headers: {
					...(accessToken
						? {
								Authorization: 'Bearer ' + accessToken,
						  }
						: {}),
				},
			}),
			cache: new InMemoryCache(),
		});

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

// error handing
app.use((err, req, res) => {
	if (err.name === 'UnauthorizedError') {
		req.cookies.set('accessToken');
	}
	// eslint-disable-next-line no-magic-numbers
	res.status(500).send('Something broke!');
});
