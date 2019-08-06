import React from 'react';
import { hot } from 'react-hot-loader/root';
import styled, { ThemeProvider } from 'styled-components';
import { IntlProvider, FormattedMessage } from 'react-intl';

import { InjectIntlProvider } from './utils/useIntl';
import { theme as appTheme, GlobalStyle } from '../theme/theme';
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
				<InjectIntlProvider>
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
				</InjectIntlProvider>
			</IntlProvider>
		</ThemeProvider>
	);
};

const HotApp = hot(App);
export { HotApp, App };
