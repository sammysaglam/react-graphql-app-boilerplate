// @flow
import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { UserSessionQuery } from 'graphql/queries/getCurrentUserSession';
import USER_SESSION_QUERY from 'graphql/queries/getCurrentUserSession/getCurrentUserSession.graphql';

const Wrapper = styled.div`
	padding: 3rem;
`;

type LoginFormPropsType = {};

type LoginFormStateType = {
	email: string,
	password: string,
};

class LoginForm extends React.PureComponent<
	LoginFormPropsType,
	LoginFormStateType,
> {
	constructor(props: LoginFormPropsType) {
		super(props);

		this.state = {
			email: '',
			password: '',
		};
	}

	// $FlowFixMe
	onChangeEmail = ({ target: { value: newValue } }) => {
		this.setState({
			email: newValue,
		});
	};

	// $FlowFixMe
	onChangePassword = ({ target: { value: newValue } }) => {
		this.setState({
			password: newValue,
		});
	};

	// $FlowFixMe
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
						{ data: { authenticate: responseUserData } = {} },
					) => {
						const { sub, isAdmin } = JSON.parse(responseUserData);

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
				<UserSessionQuery>
					{({ data: { currentUserSession } = {} } = {}) => (
						<div>
							{currentUserSession &&
								currentUserSession.isAdmin &&
								'is admin'}
						</div>
					)}
				</UserSessionQuery>
			</Wrapper>
		);
	}
}

export default LoginForm;
