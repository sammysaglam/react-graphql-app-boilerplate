// @flow
import React from 'react';
import type { QueryRenderPropFunction } from 'react-apollo';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import USER_SESSION_QUERY from './getCurrentUserSession.graphql';
import type { getCurrentUserSession as CurrentUserSessionData } from './getCurrentUserSession';

type UserSessionQueryPropsType = {
	children: QueryRenderPropFunction<CurrentUserSessionData, void>,
};

export const UserSessionQuery = ({
	children,
}: UserSessionQueryPropsType) => (
	<Query query={USER_SESSION_QUERY}>{children}</Query>
);

UserSessionQuery.propTypes = {
	children: PropTypes.func.isRequired,
};
