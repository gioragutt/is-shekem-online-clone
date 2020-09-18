import supertest from 'supertest';
import { app } from '../src/app';
import { Report } from '../src/database';

const request = supertest(app);

async function makeRequest(query: string, variables?: object): Promise<any> {
  const res = await request.post('/graphql')
    .send({ query, variables })
    .expect(200);
  return res.body.data;
}

describe('Is Shekem Online', () => {
  it('should return empty array for `reports` before creating any', async () => {
    const { reports } = await makeRequest(`{ reports { reporter } }`);

    expect(reports.length).toBe(0);
  });

  it('should return a new report when calling `createReport`', async () => {
    const { createReport } = await makeRequest(`
      mutation {
        createReport(input: {reporter: "Giora", open: true}) {
          reporter
          timestamp
          open
          upvotes
          downvotes
          myVote
        }
      }
    `);

    expect(createReport).toEqual(jasmine.objectContaining<Report>({
      reporter: 'Giora',
      open: true,
      downvotes: 0,
      upvotes: 0,
      myVote: null,
    }));

    expect(Date.parse(createReport.timestamp)).not.toBe(NaN);
  });

  it('should return the previously created report', async () => {
    const { reports } = await makeRequest(`{ reports { reporter } }`);

    expect(reports[0].reporter).toBe('Giora');
  });
});

describe('Multiple Reports', () => {
  beforeAll(async () => {
    for (let i = 1; i <= 10; i++) {
      await makeRequest(`
        mutation CreateReport($reporter: String!) {
          createReport(input: {reporter: $reporter, open: true}) {
            reporter
            timestamp
            open
            upvotes
            downvotes
            myVote
          }
        }
      `, { reporter: `reporter-${i}` });
    }
  });

  it('should return latest 5 reports when count isnt specified', async () => {
    const { reports } = await makeRequest(`{ reports { reporter } }`);

    expect(reports.length).toBe(5);
    expect(reports[0].reporter).toBe('reporter-10');
  });

  it('should return request amount of reports when count is specified', async () => {
    const { reports } = await makeRequest(`{ reports(count: 7) { reporter } }`);

    expect(reports.length).toBe(7);
  });
});

describe('Voting', () => {
  const reporter = 'TheShekemIsClosed';

  beforeAll(async () => {
    await makeRequest(`
      mutation CreateReport($reporter: String!, $open: Boolean!) {
        createReport(input: {reporter: $reporter, open: $open}) {
          reporter
          timestamp
          open
          upvotes
          downvotes
          myVote
        }
      }
    `, { reporter, open: true });
  });

  it('should add to upvotes when upvoting for first time', async () => {
    const { voteOnReport } = await makeRequest(`
      mutation {
        voteOnReport(vote: UPVOTE) {
          reporter
          upvotes
          downvotes
          myVote
        }
      }
    `);

    expect(voteOnReport).toEqual({
      reporter,
      upvotes: 1,
      downvotes: 0,
      myVote: 'UPVOTE',
    });
  });

  it('should move vote to downvote correctly', async () => {
    const { voteOnReport } = await makeRequest(`
      mutation {
        voteOnReport(vote: DOWNVOTE) {
          reporter
          upvotes
          downvotes
          myVote
        }
      }
    `);

    expect(voteOnReport).toEqual({
      reporter,
      upvotes: 0,
      downvotes: 1,
      myVote: 'DOWNVOTE',
    });
  });

  it('should reset vote when vote is null', async () => {
    const { voteOnReport } = await makeRequest(`
      mutation {
        voteOnReport(vote: null) {
          reporter
          upvotes
          downvotes
          myVote
        }
      }
    `);

    expect(voteOnReport).toEqual({
      reporter,
      upvotes: 0,
      downvotes: 0,
      myVote: null,
    });
  });
});
