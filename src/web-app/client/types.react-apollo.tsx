/* eslint-disable */
import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
};

export type CurrentAuthSession = {
	__typename?: 'CurrentAuthSession';
	id: Scalars['ID'];
	user?: Maybe<User>;
};

export type Mutation = {
	__typename?: 'Mutation';
	login?: Maybe<CurrentAuthSession>;
};

export type MutationLoginArgs = {
	email: Scalars['String'];
	password: Scalars['String'];
};

export type Query = {
	__typename?: 'Query';
	currentAuthSession?: Maybe<CurrentAuthSession>;
};

export type User = {
	__typename?: 'User';
	email?: Maybe<Scalars['String']>;
	isAdmin?: Maybe<Scalars['Boolean']>;
};
export type GetAuthSessionQueryVariables = {};

export type GetAuthSessionQuery = { __typename?: 'Query' } & {
	currentAuthSession: Maybe<
		{ __typename?: 'CurrentAuthSession' } & Pick<CurrentAuthSession, 'id'> & {
				user: Maybe<{ __typename?: 'User' } & Pick<User, 'email' | 'isAdmin'>>;
			}
	>;
};

export const GetAuthSessionDocument = gql`
	query GetAuthSession {
		currentAuthSession {
			id
			user {
				email
				isAdmin
			}
		}
	}
`;
export type GetAuthSessionComponentProps = Omit<
	ApolloReactComponents.QueryComponentOptions<
		GetAuthSessionQuery,
		GetAuthSessionQueryVariables
	>,
	'query'
>;

export const GetAuthSessionComponent = (
	props: GetAuthSessionComponentProps,
) => (
	<ApolloReactComponents.Query<
		GetAuthSessionQuery,
		GetAuthSessionQueryVariables
	>
		query={GetAuthSessionDocument}
		{...props}
	/>
);

export function useGetAuthSessionQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		GetAuthSessionQuery,
		GetAuthSessionQueryVariables
	>,
) {
	return ApolloReactHooks.useQuery<
		GetAuthSessionQuery,
		GetAuthSessionQueryVariables
	>(GetAuthSessionDocument, baseOptions);
}
export type GetAuthSessionQueryHookResult = ReturnType<
	typeof useGetAuthSessionQuery
>;
export type GetAuthSessionQueryResult = ApolloReactCommon.QueryResult<
	GetAuthSessionQuery,
	GetAuthSessionQueryVariables
>;
