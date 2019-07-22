/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
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

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
	fragment: string;
	resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
	resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
	TResult,
	TParent = {},
	TContext = {},
	TArgs = {}
> =
	| ((
			...args: any[]
	  ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
	| SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
	parent: TParent,
	context: TContext,
	info: GraphQLResolveInfo,
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
	TResult = {},
	TParent = {},
	TContext = {},
	TArgs = {}
> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
	Query: ResolverTypeWrapper<{}>;
	CurrentAuthSession: ResolverTypeWrapper<CurrentAuthSession>;
	User: ResolverTypeWrapper<User>;
	String: ResolverTypeWrapper<Scalars['String']>;
	Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
	Mutation: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
	Query: {};
	CurrentAuthSession: CurrentAuthSession;
	User: User;
	String: Scalars['String'];
	Boolean: Scalars['Boolean'];
	Mutation: {};
};

export type CurrentAuthSessionResolvers<
	ContextType = any,
	ParentType = ResolversParentTypes['CurrentAuthSession']
> = {
	user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type MutationResolvers<
	ContextType = any,
	ParentType = ResolversParentTypes['Mutation']
> = {
	login?: Resolver<
		Maybe<ResolversTypes['CurrentAuthSession']>,
		ParentType,
		ContextType,
		MutationLoginArgs
	>;
};

export type QueryResolvers<
	ContextType = any,
	ParentType = ResolversParentTypes['Query']
> = {
	currentAuthSession?: Resolver<
		Maybe<ResolversTypes['CurrentAuthSession']>,
		ParentType,
		ContextType
	>;
};

export type UserResolvers<
	ContextType = any,
	ParentType = ResolversParentTypes['User']
> = {
	email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	isAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
	CurrentAuthSession?: CurrentAuthSessionResolvers<ContextType>;
	Mutation?: MutationResolvers<ContextType>;
	Query?: QueryResolvers<ContextType>;
	User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
