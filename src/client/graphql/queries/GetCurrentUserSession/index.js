// @flow
import React from 'react';
import type { QueryRenderPropFunction } from 'react-apollo';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import QUERY from './query.graphql';
import type { GetCurrentUserSession as CurrentUserSessionData } from './__generated__/GetCurrentUserSession';

type UserSessionQueryPropsType = {
	children: QueryRenderPropFunction<CurrentUserSessionData, void>,
};

export const UserSessionQuery = ({
	children,
}: UserSessionQueryPropsType) => (
	<Query query={QUERY}>{children}</Query>
);

UserSessionQuery.propTypes = {
	children: PropTypes.func.isRequired,
};
