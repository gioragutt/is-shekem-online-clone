import { updateVotes } from '../src/app'

type ReportToUpdate = Parameters<typeof updateVotes>[0];

const REPORTING_IP = 'ip';
const OTHER_IP = 'existing-ip';

describe('updateVotes', () => {
  it('should add to correct vote when ip didn\t vote before', () => {
    const report: ReportToUpdate = {
      upvotes: [],
      downvotes: [OTHER_IP],
    };

    updateVotes(report, REPORTING_IP, 'UPVOTE');

    expect(report.upvotes).toEqual([REPORTING_IP]);
    expect(report.downvotes).toEqual([OTHER_IP]);
  })

  it('should not add duplicates', () => {
    const report: ReportToUpdate = {
      upvotes: [OTHER_IP],
      downvotes: [REPORTING_IP],
    };

    updateVotes(report, 'ip', 'DOWNVOTE');

    expect(report.upvotes).toEqual([OTHER_IP]);
    expect(report.downvotes).toEqual([REPORTING_IP]);
  })

  it('should move votes correctly', () => {
    const report: ReportToUpdate = {
      upvotes: ['existing-ip'],
      downvotes: ['ip'],
    };

    updateVotes(report, 'ip', 'UPVOTE');

    expect(report.upvotes).toEqual([OTHER_IP, REPORTING_IP]);
    expect(report.downvotes).toEqual([]);
  })

  it('should nullify votes', () => {
    const report: ReportToUpdate = {
      upvotes: [OTHER_IP],
      downvotes: [REPORTING_IP],
    };

    updateVotes(report, REPORTING_IP, null);

    expect(report.upvotes).toEqual([OTHER_IP]);
    expect(report.downvotes).toEqual([]);
  })
})