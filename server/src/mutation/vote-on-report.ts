import { Request } from 'express';
import { GraphQLFieldConfig } from 'graphql';
import { Vote, voteOnReport as voteOnReportInDb } from '../app';
import { NonNullReportType, VoteType } from '../types';

export const voteOnReport: GraphQLFieldConfig<any, any, {
  vote: Vote,
}> = {
  type: NonNullReportType,
  args: {
    vote: { type: VoteType },
  },
  resolve(_, { vote }, { ip }: Request) {
    return voteOnReportInDb(ip, vote);
  },
};