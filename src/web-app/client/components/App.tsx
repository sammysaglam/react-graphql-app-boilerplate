import React from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { GetAuthSessionComponent } from '../types.react-apollo';

const Wrapper = styled.div`
	flex: 1;
	background-color: #fff;
	align-items: center;
	justify-content: center;
`;

/* eslint-disable react-intl/string-is-marked-for-translation */
// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component {
	render() {
		return (
			<Wrapper>
				<GetAuthSessionComponent>
					{({ data }) => (
						<span>
							Open{' '}
							{data &&
								data.currentAuthSession &&
								data.currentAuthSession.user &&
								data.currentAuthSession.user.email}{' '}
							up App.js to start working on your app!
						</span>
					)}
				</GetAuthSessionComponent>
			</Wrapper>
		);
	}
}

const Enhanced = hot(App);
export { Enhanced as App };
