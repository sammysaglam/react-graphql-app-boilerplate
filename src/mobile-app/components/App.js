import React from 'react';
import styled from 'styled-components';
import { View } from 'react-native';

const Wrapper = styled.Text`
	color: red;
`;

const Photo = styled.Image`
	width: 100%;
	height: 100%;
`;

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends React.Component {
	render() {
		return (
			<View>
				<Wrapper>
					Open up App.js to start working on your app!
				</Wrapper>
				<Photo
					source={{
						uri:
							'http://izirider40.com/components/Pages/Home/img/hero.jpg',
					}}
				/>
			</View>
		);
	}
}
