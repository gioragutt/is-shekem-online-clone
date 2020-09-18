import { NotFound } from 'http-errors';
import { v4 as uuid } from 'uuid';

type IP = string;

interface ReportEntry {
  id: string;
  reporter: string;
  reportingIp: IP;
  timestamp: Date;
  open: boolean;
  upvotes: IP[];
  downvotes: IP[];
}
export type Vote = 'UPVOTE' | 'DOWNVOTE' | null;

export interface Report {
  reporter: string;
  timestamp: Date;
  open: boolean;
  upvotes: number;
  downvotes: number;
  myVote: Vote;
}

const entryToReport = (userIp: IP) => (entry: ReportEntry): Report => {
  const myVote: Vote =
    entry.downvotes.includes(userIp) ? 'DOWNVOTE' :
      entry.upvotes.includes(userIp) ? 'UPVOTE' :
        null;

  return {
    open: entry.open,
    reporter: entry.reporter,
    upvotes: entry.upvotes.length,
    downvotes: entry.downvotes.length,
    timestamp: entry.timestamp,
    myVote,
  }
}

const reports: ReportEntry[] = [];

export async function getLatestReports(userIp: IP, count: number = 5): Promise<Report[]> {
  return reports.slice(0, count).map(entryToReport(userIp));
}

export interface ReportInput {
  reporter: string;
  open: boolean;
}

export async function createReport(
  reportingIp: string,
  input: ReportInput,
): Promise<Report> {
  const entry: ReportEntry = {
    id: uuid(),
    reportingIp,
    ...input,
    upvotes: [],
    downvotes: [],
    timestamp: new Date(),
  }

  reports.unshift(entry);

  return entryToReport(reportingIp)(entry);
}

export async function voteOnReport(
  reportingIp: string,
  vote: Vote,
): Promise<Report> {
  const [report] = reports;
  if (!report) {
    throw new NotFound('No report exists yet')
  }

  report.downvotes.splice(report.downvotes.indexOf(reportingIp))
  report.upvotes.splice(report.upvotes.indexOf(reportingIp));

  switch (vote) {
    case 'UPVOTE': report.upvotes.push(reportingIp); break;
    case 'DOWNVOTE': report.downvotes.push(reportingIp); break;
  }

  return entryToReport(reportingIp)(report);
}