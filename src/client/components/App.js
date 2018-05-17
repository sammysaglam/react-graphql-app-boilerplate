import React from 'react';
import { injectGlobal } from 'styled-components';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { login, logout, isLoggedIn } from '../utils/auth';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
	* {
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}

	body,
	html {
		font-size: 100%;
		-webkit-font-smoothing: antialiased;
	}
`;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: 'sammy',
			password: 'cool',
			isLoggingIn: false,
		};
	}

	onChangeUsername = ({ target: { value } }) => {
		this.setState({
			username: value,
		});
	};

	onChangePassword = ({ target: { value } }) => {
		this.setState({
			password: value,
		});
	};

	onLogin = async () => {
		const { username, password } = this.state;

		this.setState({
			isLoggingIn: true,
		});

		await login({
			username,
			password,
		});
		this.setState({
			isLoggingIn: false,
		});
	};

	onLogout = () => {
		logout();
		this.forceUpdate();
	};

	render() {
		const { username, password, isLoggingIn } = this.state;
		const {
			onLogin,
			onLogout,
			onChangeUsername,
			onChangePassword,
		} = this;

		return (
			<div>
				<Query
					query={gql`
						{
							greeting
						}
					`}
				>
					{({ loading, error, data: { greeting } }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;
						return greeting;
					}}
				</Query>

				{isLoggedIn() ? (
					<React.Fragment>
						<div>Logged in!</div>
						<div>
							<button onClick={onLogout} type="button">
								Click to logout
							</button>
						</div>
						<div>
							<h3>Some sensitive data:</h3>
							<Query
								query={gql`
									{
										sensitiveData
									}
								`}
							>
								{({ loading, error, data: { sensitiveData } }) => {
									if (loading) return <p>Loading...</p>;
									if (error) return <p>Error :(</p>;
									return sensitiveData;
								}}
							</Query>
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div>
							<input
								onChange={onChangeUsername}
								placeholder="username = 'sammy'"
								value={username}
							/>
						</div>
						<div>
							<input
								onChange={onChangePassword}
								placeholder="password = 'cool'"
								type="password"
								value={password}
							/>
						</div>
						<div>
							<button
								disabled={isLoggingIn}
								onClick={onLogin}
								type="button"
							>
								Login
							</button>
						</div>
						<div>
							{isLoggedIn()
								? 'Successfuly logged in!'
								: 'Not logged in :('}
						</div>
					</React.Fragment>
				)}
			</div>
		);
	}
}

export default App;
