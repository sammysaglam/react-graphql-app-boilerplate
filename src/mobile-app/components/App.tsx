import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.View`
	flex: 1;
	background-color: #fff;
	align-items: center;
	justify-content: center;
`;

/* eslint-disable react-intl/string-is-marked-for-translation */
// eslint-disable-next-line react/prefer-stateless-function
export class App extends React.Component {
	render() {
		return (
			<Wrapper>
				<Text>Open up App.js to start working on your app!</Text>
			</Wrapper>
		);
	}
}
