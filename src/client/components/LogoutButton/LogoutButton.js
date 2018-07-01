import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import USER_SESSION_QUERY from 'graphql/queries/getCurrentUserSession/getCurrentUserSession.graphql';

const LOGOUT = gql`
	mutation {
		logout
	}
`;

const LogoutButton = () => (
	<Mutation
		mutation={LOGOUT}
		update={cache => {
			cache.writeQuery({
				query: USER_SESSION_QUERY,
				data: {
					currentUserSession: {
						__typename: 'UserSession',
						isGuest: true,
						isAdmin: false,
						email: null,
					},
				},
			});
		}}
	>
		{onLogout => (
			<div
				onClick={() => {
					onLogout();
				}}
			>
				Logout
			</div>
		)}
	</Mutation>
);

export default LogoutButton;
