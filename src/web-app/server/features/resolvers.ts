import deepmerge from 'deepmerge';
import { resolvers as authResolvers } from './auth/auth.resolvers';
import { Resolvers } from '../types';

export const resolvers: Resolvers = deepmerge(authResolvers, {});
