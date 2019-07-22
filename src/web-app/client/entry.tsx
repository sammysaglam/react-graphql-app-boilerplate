import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';

import { App, HotApp } from './components/App';

// import environment variables
import { GRAPHQL_ENDPOINT } from './utils/env';

const AppToRender = process.env.USE_WEBPACKDEV_SERVER === 'true' ? HotApp : App;

// setup apollo client
const authLink = new ApolloLink((operation, forward) =>
	forward ? forward(operation) : null,
);

const client = new ApolloClient({
	link: ApolloLink.from([
		authLink,
		new HttpLink({
			uri: GRAPHQL_ENDPOINT,
			credentials: 'same-origin',
		}),
	]),
	// eslint-disable-next-line no-underscore-dangle
	cache: new InMemoryCache().restore((window as any).__APOLLO_STATE__),
});

// render website
const render = (Component: any) => {
	const renderResult = (
		<ApolloProvider client={client}>
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
