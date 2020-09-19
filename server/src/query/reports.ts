import { Request } from 'express';
import { GraphQLFieldConfig, GraphQLInt, GraphQLList } from 'graphql';
import { getLatestReports } from '../app';
import { NonNullReportType } from '../types';

export const reports: GraphQLFieldConfig<any, any, {
  count: number,
}> = {
  type: new GraphQLList(NonNullReportType),
  args: {
    count: { type: GraphQLInt },
  },
  resolve(_, { count }, { ip }: Request) {
    return getLatestReports(ip, count);
  },
}