import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { isLoggedIn, getAccessToken } from './utils/auth';
import { ApolloProvider } from 'react-apollo';

import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
} from 'apollo-boost';

// import environment variables
import { GRAPHQL_ENDPOINT, WEBSOCKETS_ENDPOINT } from './utils/env';

// component imports
import App from './components/App';

// setup websockets
/* eslint-disable no-console, no-magic-numbers */
const connection = new WebSocket(WEBSOCKETS_ENDPOINT);
connection.onopen = () => {
	connection.send('something');
	console.log('opened connection');
};
connection.onerror = error => {
	console.log(error);
};
connection.onmessage = message => {
	console.log(message);
};
setInterval(() => {
	connection.send('cool');
}, 1000);
/* eslint-enbale no-console, no-magic-numbers */

// setup apollo client
const authLink = new ApolloLink((operation, forward) => {
	if (isLoggedIn()) {
		operation.setContext({
			headers: {
				authorization: 'Bearer ' + getAccessToken(),
			},
		});
	}

	return forward(operation);
});

const client = new ApolloClient({
	link: ApolloLink.from([
		authLink,
		new HttpLink({
			uri: GRAPHQL_ENDPOINT,
		}),
	]),
	// eslint-disable-next-line no-underscore-dangle
	cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

// render website
const render = Component => {
	const renderResult = (
		<ApolloProvider client={client}>
			<AppContainer>
				<BrowserRouter>
					<Component />
				</BrowserRouter>
			</AppContainer>
		</ApolloProvider>
	);

	// eslint-disable-next-line no-process-env, no-undef
	if (process.env.USE_WEBPACKDEV_SERVER === 'true') {
		ReactDOM.render(renderResult, document.getElementById('app'));
	} else {
		ReactDOM.hydrate(renderResult, document.getElementById('app'));
	}
};
render(App);

if (module.hot) {
	module.hot.accept('./components/App', () => {
		render(App);
	});
}
