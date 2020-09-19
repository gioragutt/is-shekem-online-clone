import { GraphQLObjectType } from 'graphql';
import { reports } from './reports';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    reports,
  },
});