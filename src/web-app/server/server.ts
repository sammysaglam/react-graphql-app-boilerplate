import './utils/load-env-vars';
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

const {
	DEV_API_PORT,
	JWT_SECRET,
	USE_WEBPACKDEV_SERVER,
	WEBPACKDEV_PORT,
} = process.env;

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
		secret: JWT_SECRET ? JWT_SECRET : '',
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
if (USE_WEBPACKDEV_SERVER === 'true') {
	require('graphql-import-node/register');
}
const schema = makeExecutableSchema({
	typeDefs: require('../../../build/schema/schema.graphql'),
	resolvers: resolvers as any,
});
const apolloServer = new ApolloServer({
	schema,
	context: ({ req }): Context => ({
		cookies: req.cookies,
		user: req.user,
	}),
});
apolloServer.applyMiddleware({ app });

// serve app
if (USE_WEBPACKDEV_SERVER === 'true') {
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

	// eslint-disable-next-line no-magic-numbers
	app.listen(3000, () =>
		// eslint-disable-next-line no-console
		console.log(`App running on port 3000`),
	);
}
