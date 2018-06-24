import React from 'react';
import { Query, Mutation } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';

const Wrapper = styled.div`
	padding: 3rem;
`;

export const USER_SESSION_QUERY = gql`
	{
		currentUserSession {
			email
			isGuest
			isAdmin
		}
	}
`;

class LoginForm extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
		};
	}

	onChangeEmail = ({ target: { value: newValue } }) => {
		this.setState({
			email: newValue,
		});
	};

	onChangePassword = ({ target: { value: newValue } }) => {
		this.setState({
			password: newValue,
		});
	};

	onSubmit = authenticate => event => {
		event.preventDefault();

		authenticate().catch(() => {
			// eslint-disable-next-line no-console
			console.log('invalid creds');
		});
	};

	render() {
		const { email, password } = this.state;
		const { onChangeEmail, onChangePassword, onSubmit } = this;

		return (
			<Wrapper>
				<Mutation
					mutation={gql`
						mutation authenticateCredentials(
							$email: String!
							$password: String!
						) {
							authenticate(email: $email, password: $password)
						}
					`}
					update={(
						cache,
						{ data: { authenticate: responseJwt } },
					) => {
						const { sub, isAdmin } = jwt.decode(responseJwt);

						cache.writeQuery({
							query: USER_SESSION_QUERY,
							data: {
								currentUserSession: {
									__typename: 'UserSession',
									isGuest: false,
									isAdmin,
									email: sub,
								},
							},
						});
					}}
					variables={{
						email,
						password,
					}}
				>
					{authenticate => (
						<form onSubmit={onSubmit(authenticate)}>
							<input
								onChange={onChangeEmail}
								type="email"
								value={email}
							/>
							<input
								onChange={onChangePassword}
								type="password"
								value={password}
							/>
							<input type="submit" />
						</form>
					)}
				</Mutation>
				<Query query={USER_SESSION_QUERY}>
					{({
						data: { currentUserSession: { isAdmin } = {} } = {},
					} = {}) => <div>{isAdmin && 'is admin'}</div>}
				</Query>
			</Wrapper>
		);
	}
}

export default LoginForm;
