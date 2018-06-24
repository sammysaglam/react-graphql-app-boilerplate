import React from 'react';
import { injectGlobal } from 'styled-components';

import LoginForm from './LoginForm/LoginForm';
import LogoutButton from './LogoutButton/LogoutButton';

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

const App = () => (
	<div>
		<LoginForm />
		<LogoutButton />
	</div>
);

export default App;
