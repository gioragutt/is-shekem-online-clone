import { NotFound } from 'http-errors';
import { v4 as uuid } from 'uuid';
import { ReportDocument, ReportModel } from './database';

type IP = string;

export type Vote = 'UPVOTE' | 'DOWNVOTE' | null;

export interface Report {
  reporter: string;
  timestamp: Date;
  open: boolean;
  upvotes: number;
  downvotes: number;
  myVote: Vote;
}

const entryToReport = (userIp: IP) => (fromDb: ReportDocument): Report => {
  const myVote: Vote =
    fromDb.downvotes.includes(userIp) ? 'DOWNVOTE' :
      fromDb.upvotes.includes(userIp) ? 'UPVOTE' :
        null;

  return {
    open: fromDb.open,
    reporter: fromDb.reporter,
    upvotes: fromDb.upvotes.length,
    downvotes: fromDb.downvotes.length,
    timestamp: fromDb.timestamp,
    myVote,
  }
}

export async function getLatestReports(userIp: IP, count: number = 5): Promise<Report[]> {
  const reports = await ReportModel.find().limit(count).sort('-timestamp')
  return reports.map(entryToReport(userIp));
}

export interface ReportInput {
  reporter: string;
  open: boolean;
}

export async function createReport(
  reportingIp: string,
  input: ReportInput,
): Promise<Report> {

  const report = new ReportModel({
    id: uuid(),
    reportingIp,
    ...input,
    upvotes: [],
    downvotes: [],
    timestamp: new Date(),
  })

  const createdDocument = await report.save();
  return entryToReport(reportingIp)(createdDocument);
}

export function updateVotes(
  report: { upvotes: string[], downvotes: string[] },
  reportingIp: string,
  vote: Vote,
): void {
  report.downvotes = report.downvotes.filter(ip => ip !== reportingIp);
  report.upvotes = report.upvotes.filter(ip => ip !== reportingIp);

  switch (vote) {
    case 'UPVOTE': report.upvotes.push(reportingIp); break;
    case 'DOWNVOTE': report.downvotes.push(reportingIp); break;
  }
}

export async function voteOnReport(
  reportingIp: string,
  vote: Vote,
): Promise<Report> {
  const report = await ReportModel.findOne().sort('-timestamp').limit(1);
  if (!report) {
    throw new NotFound('No report exists yet')
  }

  updateVotes(report, reportingIp, vote);

  await ReportModel.updateOne({ _id: report.id }, report);
  return entryToReport(reportingIp)(report);
}