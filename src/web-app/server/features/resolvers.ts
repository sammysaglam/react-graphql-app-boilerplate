import deepmerge from 'deepmerge';
import { Resolvers } from '../schema.types';

import { resolvers as authResolvers } from './auth/auth.resolvers';

export const resolvers: Resolvers = deepmerge.all([authResolvers]);
