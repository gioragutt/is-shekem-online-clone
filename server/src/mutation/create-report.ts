import { Request } from 'express';
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { createReport as createReportInDb, ReportInput } from '../database';
import { NonNullReportType, ReportInputType } from '../types';

export const createReport: GraphQLFieldConfig<any, any, {
  input: ReportInput,
}> = {
  type: NonNullReportType,
  args: {
    input: { type: new GraphQLNonNull(ReportInputType) },
  },
  resolve(_, { input }, { ip }: Request) {
    return createReportInDb(ip, input);
  },
}