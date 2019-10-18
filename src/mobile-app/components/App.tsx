import React from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Text } from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.View`
	flex: 1;
	background-color: #fff;
	align-items: center;
	justify-content: center;
`;

export const App = () => (
	<IntlProvider locale="en" textComponent={Text}>
		<Wrapper>
			<Text>
				<FormattedMessage
					defaultMessage="hello world!"
					description="hello world!"
					id="demo.welcome"
				/>
			</Text>
		</Wrapper>
	</IntlProvider>
);
