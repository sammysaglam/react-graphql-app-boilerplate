import React from 'react';
import { hot } from 'react-hot-loader';
import { createGlobalStyle } from 'styled-components';

import LoginForm from './LoginForm/LoginForm';
import LogoutButton from './LogoutButton/LogoutButton';

// eslint-disable-next-line no-unused-expressions
const GlobalStyle = createGlobalStyle`
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

const App = hot(module)(() => (
	<React.Fragment>
		<GlobalStyle />
		<div>
			<LoginForm />
			<LogoutButton />
		</div>
	</React.Fragment>
));

export default App;
