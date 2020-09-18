import { Request } from 'express';
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';
import { createReport, getLatestReports, voteOnReport } from './database';

import { GraphQLDateTime } from 'graphql-iso-date';

const VoteType = new GraphQLEnumType({
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

const ReportInputType = new GraphQLInputObjectType({
  name: 'ReportInput',
  fields: {
    reporter: { type: new GraphQLNonNull(GraphQLString) },
    open: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
})

const ReportType = new GraphQLObjectType({
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

const NonNullReportType = new GraphQLNonNull(ReportType);

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    reports: {
      type: new GraphQLList(NonNullReportType),
      args: {
        count: { type: GraphQLInt },
      },
      resolve(_, { count }, { ip }: Request) {
        return getLatestReports(ip, count);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createReport: {
      type: NonNullReportType,
      args: {
        input: { type: new GraphQLNonNull(ReportInputType) },
      },
      resolve(_, { input }, { ip }: Request) {
        return createReport(ip, input);
      },
    },
    voteOnReport: {
      type: NonNullReportType,
      args: {
        vote: { type: VoteType },
      },
      resolve(_, { vote }, { ip }: Request) {
        return voteOnReport(ip, vote);
      },
    },
  },
})

export const schema = new GraphQLSchema({
  query,
  mutation,
});