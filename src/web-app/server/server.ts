import './utils/load-env-vars';
import { JWT, ENV, DEV_TOOLS } from './utils/config';
import express from 'express';
import compression from 'compression';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { resolvers } from './features/resolvers';
import Cookies from 'cookies';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { Context } from './types';

const app = express();

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
		secret: JWT.SECRET ? JWT.SECRET : '',
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

// apollo server
if (process.env.USE_WEBPACKDEV_SERVER === 'true') {
	require('graphql-import-node/register');
}

const schema = makeExecutableSchema({
	typeDefs: require('../../../build/schema/schema.graphql'),
	resolvers,
});
const apolloServer = new ApolloServer({
	schema,
	context: ({ req }): Context => ({
		cookies: req.cookies,
		user: req.user,
	}),
	introspection: DEV_TOOLS.GRAPHQL_PLAYGROUND_ENABLED,
	playground: DEV_TOOLS.GRAPHQL_PLAYGROUND_ENABLED
		? {
				version: '1.7.30',
				settings: { 'request.credentials': 'include' },
		  }
		: false,
});
apolloServer.applyMiddleware({ app });

// serve app
if (process.env.USE_WEBPACKDEV_SERVER === 'true') {
	// redirect to webpack-dev-server
	app.all('/', (req, res) =>
		res.redirect(`http://localhost:${ENV.WEBPACKDEV_PORT}`),
	);

	app.listen(ENV.DEV_API_PORT, () =>
		// eslint-disable-next-line no-console
		console.log(`API running on port ${ENV.DEV_API_PORT}`),
	);
} else {
	app.use(compression());
	app.use(express.static('build/client'));
	app.use('*', express.static('build/client'));

	// html generator
	const { htmlGenerator } = require('../client/index.html.js');

	// ssr stuff
	const { ssrBuilder } = require('../client/entry.ssr');

	// send app to client
	app.get('*', async ({ originalUrl, cookies, user }, res) => {
		// const accessToken = cookies.get('accessToken');
		const apolloClient = new ApolloClient({
			ssrMode: true,
			link: new SchemaLink({
				schema,
				context: (): Context => ({
					user,
					cookies,
				}),
			}),
			cache: new InMemoryCache(),
		});

		const { ssrStringAsync, stylesheet } = ssrBuilder({
			apolloClient,
			location: originalUrl,
		});

		const ssrString = await ssrStringAsync;

		return res.send(
			htmlGenerator({
				ssr: ssrString,
				defaultApolloState: apolloClient.extract(),
				styleTags: stylesheet.getStyleTags(),
			}),
		);
	});

	app.listen(3000, () =>
		// eslint-disable-next-line no-console
		console.log(`App running on port 3000`),
	);
}
