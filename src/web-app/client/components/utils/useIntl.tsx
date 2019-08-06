import React, { useContext } from 'react';
import { injectIntl } from 'react-intl';

const InjectIntlContext = React.createContext<
	ReactIntl.InjectedIntl | { formatMessage: ({ id }: { id: string }) => string }
>({
	formatMessage: ({ id }: { id: string }) => id,
});

export const InjectIntlProvider = injectIntl(({ intl, children }) => (
	<InjectIntlContext.Provider value={intl}>
		{children}
	</InjectIntlContext.Provider>
));

export const useIntl = () => {
	const intl = useContext(InjectIntlContext);
	return intl;
};
