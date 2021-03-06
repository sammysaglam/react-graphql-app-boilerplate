import React from 'react';
import { hot } from 'react-hot-loader/root';
import { FormattedMessage, IntlProvider } from 'react-intl';
import styled, { ThemeProvider } from 'styled-components';

import { GlobalStyle, appTheme } from '../theme/theme';
import { useGetAuthSessionQuery } from '../types.react-apollo';

const Wrapper = styled.div`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.secondary};
	align-items: center;
	justify-content: center;
	color: ${({ theme }) => theme.colors.primary};
`;

const App = () => {
	const { data } = useGetAuthSessionQuery();

	return (
		<ThemeProvider theme={appTheme}>
			<IntlProvider locale="en">
				<>
					<GlobalStyle />
					<Wrapper>
						<FormattedMessage
							defaultMessage="hello {email}"
							description="hello world"
							id="demo.hello"
							values={{
								email: (data &&
									data.currentAuthSession &&
									data.currentAuthSession.user &&
									data.currentAuthSession.user.email) || (
									<FormattedMessage
										defaultMessage="guest"
										description="guest"
										id="demo.guest"
									/>
								),
							}}
						/>
					</Wrapper>
				</>
			</IntlProvider>
		</ThemeProvider>
	);
};

const HotApp = hot(App);
export { HotApp, App };
