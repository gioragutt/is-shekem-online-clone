import { GraphQLObjectType } from 'graphql';
import { createReport } from './create-report';
import { voteOnReport } from './vote-on-report';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createReport,
    voteOnReport,
  },
})