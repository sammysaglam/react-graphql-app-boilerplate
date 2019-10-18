import './polyfills';

import {
	InMemoryCache,
	IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import DebounceLink from 'apollo-link-debounce';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { App, HotApp } from './components/App';
import { defaultLocalState } from './local-state/local-state';
import { GRAPHQL_ENDPOINT } from './utils/env';

const introspectionQueryResultData = require('./fragmentTypes.json');

const AppToRender = process.env.USE_WEBPACKDEV_SERVER === 'true' ? HotApp : App;

const authLink = new ApolloLink((operation, forward) =>
	forward ? forward(operation) : null,
);
const fragmentMatcher = new IntrospectionFragmentMatcher({
	introspectionQueryResultData,
});

const apolloCache = new InMemoryCache({ fragmentMatcher }).restore(
	(window as any).__APOLLO_STATE__,
);

apolloCache.writeData({
	data: {
		...defaultLocalState,
	},
});

const DEFAULT_DEBOUNCE_TIMEOUT = 100;
const apolloClient = new ApolloClient({
	link: ApolloLink.from([
		new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT),
		authLink,
		new BatchHttpLink({
			uri: GRAPHQL_ENDPOINT,
			credentials: 'same-origin',
		}),
	]),
	cache: apolloCache,
	resolvers: {},
});

// render app
const render = (Component: React.ComponentType) => {
	const renderResult = (
		<ApolloProvider client={apolloClient}>
			<BrowserRouter>
				<Component />
			</BrowserRouter>
		</ApolloProvider>
	);

	if (process.env.USE_WEBPACKDEV_SERVER === 'true') {
		ReactDOM.render(renderResult, document.getElementById('app'));
	} else {
		ReactDOM.hydrate(renderResult, document.getElementById('app'));
	}
};
render(AppToRender);

if (module.hot) {
	module.hot.accept('./components/App', () => {
		render(AppToRender);
	});
}
