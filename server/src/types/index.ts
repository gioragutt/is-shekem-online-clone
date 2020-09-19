import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

export const VoteType = new GraphQLEnumType({
  name: 'Vote',
  values: {
    UPVOTE: {
      value: 'UPVOTE',
    },
    DOWNVOTE: {
      value: 'DOWNVOTE',
    },
  },
});

export const ReportInputType = new GraphQLInputObjectType({
  name: 'ReportInput',
  fields: {
    reporter: { type: new GraphQLNonNull(GraphQLString) },
    open: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
})

export const ReportType = new GraphQLObjectType({
  name: 'Report',
  fields: {
    reporter: { type: new GraphQLNonNull(GraphQLString) },
    timestamp: { type: new GraphQLNonNull(GraphQLDateTime) },
    open: { type: new GraphQLNonNull(GraphQLBoolean) },
    upvotes: { type: new GraphQLNonNull(GraphQLInt) },
    downvotes: { type: new GraphQLNonNull(GraphQLInt) },
    myVote: { type: VoteType },
  },
});

export const NonNullReportType = new GraphQLNonNull(ReportType);