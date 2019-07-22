/* eslint-disable */
import gql from 'graphql-tag';
import * as React from 'react';
import * as ReactApollo from 'react-apollo';
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
		{ __typename?: 'CurrentAuthSession' } & {
			user: Maybe<{ __typename?: 'User' } & Pick<User, 'email' | 'isAdmin'>>;
		}
	>;
};

export const GetAuthSessionDocument = gql`
	query GetAuthSession {
		currentAuthSession {
			user {
				email
				isAdmin
			}
		}
	}
`;
export type GetAuthSessionComponentProps = Omit<
	ReactApollo.QueryProps<GetAuthSessionQuery, GetAuthSessionQueryVariables>,
	'query'
>;

export const GetAuthSessionComponent = (
	props: GetAuthSessionComponentProps,
) => (
	<ReactApollo.Query<GetAuthSessionQuery, GetAuthSessionQueryVariables>
		query={GetAuthSessionDocument}
		{...props}
	/>
);
