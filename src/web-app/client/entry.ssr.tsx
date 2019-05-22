import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { ApolloClient } from 'apollo-client';

import { App } from './components/App';

export const ssrBuilder = ({
	apolloClient,
	location,
}: {
	apolloClient: ApolloClient<any>;
	location: string;
}) => {
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
