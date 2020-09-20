import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, fireEvent, render, RenderResult, wait } from '@testing-library/react';
import React from 'react';
import App, { REPORTS } from './App';
import { Report } from './models';
import { letTheChangeSinkIn, expectPressed } from './test-utils';
import { CREATE_REPORT } from './components/ReportForm';
import { VOTE_ON_REPORT } from './components/StatusBanner';

function createReport(index: number, overrides: Partial<Report> = {}): Report {
  return {
    reporter: `reporter-${index}`,
    open: true,
    timestamp: new Date().toISOString(),
    downvotes: 0,
    upvotes: 0,
    myVote: null,
    ...overrides,
  };
}

function mockReports(reports: Report[] = []): MockedResponse {
  return {
    request: {
      query: REPORTS,
    },
    result: {
      data: {
        reports,
      },
    },
  };
}

describe('App', () => {
  let historyItems: HTMLElement[];

  function queryHistoryItems(renderResult: RenderResult) {
    historyItems = renderResult.queryAllByTestId('reports-history-list-item');
  }

  async function renderUi(mocks?: MockedResponse | MockedResponse[]) {
    mocks = mocks || [];
    mocks = Array.isArray(mocks) ? mocks : [mocks];

    const renderResult = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );

    await wait();

    queryHistoryItems(renderResult);
    return renderResult;
  }

  test('should not show history when loading', async () => {
    await renderUi({
      request: {
        query: REPORTS,
      },
      delay: 9999,
      result: {
        data: {
          reports: [createReport(0)],
        },
      },
    });

    expect(historyItems).toHaveLength(0);
  });

  test('should show history when loaded', async () => {
    await renderUi(
      mockReports([
        createReport(0),
        createReport(1),
        createReport(2),
        createReport(3),
        createReport(4),
      ])
    );

    expect(historyItems).toHaveLength(5);
  });

  test('should pass the first report to StatusBanner', async () => {
    const { getByTestId } = await renderUi(
      mockReports([
        createReport(0, { reporter: 'me' }),
        createReport(1),
        createReport(2),
        createReport(3),
        createReport(4),
      ])
    );

    const statusBannerReporter = getByTestId('status-banner-reporter');
    expect(statusBannerReporter.textContent).toContain('me');
  });

  test('should refetch when report is created', async () => {
    const rr = await renderUi([
      mockReports(),
      {
        request: {
          query: CREATE_REPORT,
          variables: {
            reporter: 'giorag',
            open: true,
          },
        },
        result: {
          data: {},
        },
      },
      mockReports([createReport(0), createReport(1)]),
    ]);

    const reporterInput = rr.getByTestId('reporter-input');
    const openButton = rr.getByTestId('open-button');

    await act(async () => {
      fireEvent.change(reporterInput, { target: { value: 'giorag' } });
      await letTheChangeSinkIn();
      fireEvent.click(openButton);
      await letTheChangeSinkIn();
    });

    await wait();

    queryHistoryItems(rr);
    expect(historyItems).toHaveLength(2);
  });

  test('should refetch when voted on report', async () => {
    const { getByTestId } = await renderUi([
      mockReports([createReport(0)]),
      {
        request: {
          query: VOTE_ON_REPORT,
          variables: {
            vote: 'DOWNVOTE',
          },
        },
        result: {
          data: {},
        },
      },
      mockReports([createReport(0, { myVote: 'DOWNVOTE' })]),
    ]);

    const downvoteButton = getByTestId('downvote-button');

    await act(async () => {
      fireEvent.click(downvoteButton);
      await letTheChangeSinkIn();
    });

    await wait();

    expectPressed(downvoteButton, true);
  });
});
