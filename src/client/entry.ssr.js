import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';

import App from './components/App';

const ssrBuilder = ({ apolloClient, location }) => {
	const stylesheet = new ServerStyleSheet();

	return {
		ssrStringAsync: renderToStringWithData(
			stylesheet.collectStyles(
				<ApolloProvider client={apolloClient}>
					<StaticRouter context={{}} location={location}>
						<App />
					</StaticRouter>
				</ApolloProvider>,
			),
		),
		stylesheet,
	};
};

export default ssrBuilder;
