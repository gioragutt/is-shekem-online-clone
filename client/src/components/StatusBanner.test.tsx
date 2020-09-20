import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Report, Vote } from '../models';
import { expectMutation, letTheChangeSinkIn, expectPressed } from '../test-utils';
import { StatusBanner, VOTE_ON_REPORT } from './StatusBanner';
import { GraphQLError } from 'graphql';

const MOCK_REPORT: Report = {
  reporter: 'me',
  open: true,
  timestamp: new Date().toISOString(),
  upvotes: 1,
  downvotes: 1,
  myVote: null,
};

describe('ReportForm', () => {
  let downvoteButton: HTMLElement | null;
  let upvoteButton: HTMLElement | null;

  function renderUi({
    onVote = () => undefined,
    mock,
    loading = false,
    report = MOCK_REPORT,
  }: {
    onVote?: () => void;
    mock?: MockedResponse;
    loading?: boolean;
    report?: Report;
  } = {}) {
    const renderResult = render(
      <MockedProvider mocks={mock ? [mock] : []} addTypename={false}>
        <StatusBanner {...{ onVote, loading, report }} />
      </MockedProvider>
    );

    downvoteButton = renderResult.queryByTestId('downvote-button');
    upvoteButton = renderResult.queryByTestId('upvote-button');
    return renderResult;
  }

  test("shouldn't have functionality when loading", () => {
    renderUi({ loading: true });

    expect(downvoteButton).not.toBeInTheDocument();
    expect(upvoteButton).not.toBeInTheDocument();
  });

  test("shouldn't have functionality when not loading but no report is found", () => {
    renderUi({ report: (null as unknown) as Report });

    expect(downvoteButton).not.toBeInTheDocument();
    expect(upvoteButton).not.toBeInTheDocument();
  });

  test('should have functionality when not loading and report is found', () => {
    renderUi();

    expect(downvoteButton).toBeInTheDocument();
    expect(upvoteButton).toBeInTheDocument();
  });

  test('should have the name of the reporter', async () => {
    const { getByTestId } = renderUi();
    const reporterName = getByTestId('status-banner-reporter');
    expect(reporterName).toBeInTheDocument();
    expect(reporterName.textContent).toContain(MOCK_REPORT.reporter);
  });

  test('should not have selected button when myVote=null', () => {
    renderUi();

    expectPressed(downvoteButton, false);
    expectPressed(upvoteButton, false);
  });

  test('downvote button should be selected button when myVote=DOWNVOTE', () => {
    renderUi({ report: { ...MOCK_REPORT, myVote: 'DOWNVOTE' } });

    expectPressed(downvoteButton, true);
    expectPressed(upvoteButton, false);
  });

  test('upvote button should be selected button when myVote=UPVOTE', () => {
    renderUi({ report: { ...MOCK_REPORT, myVote: 'UPVOTE' } });

    expectPressed(downvoteButton, false);
    expectPressed(upvoteButton, true);
  });

  describe.each<[Vote | null, Vote, Vote | null]>([
    [null, 'DOWNVOTE', 'DOWNVOTE'],
    [null, 'UPVOTE', 'UPVOTE'],
    ['UPVOTE', 'DOWNVOTE', 'DOWNVOTE'],
    ['DOWNVOTE', 'UPVOTE', 'UPVOTE'],
    ['UPVOTE', 'UPVOTE', null],
    ['DOWNVOTE', 'DOWNVOTE', null],
  ])('when myVote=%s and pressing %s button', (myVote, button, expectedVote) => {
    let mutate: jest.Mock;
    let onVote: jest.Mock;

    beforeAll(async () => {
      onVote = jest.fn();

      const mock = expectMutation({
        query: VOTE_ON_REPORT,
        variables: {
          vote: expectedVote,
        },
      });

      mutate = mock.mutate;

      renderUi({ mock, onVote, report: { ...MOCK_REPORT, myVote } });

      await act(async () => {
        fireEvent.click(button === 'DOWNVOTE' ? downvoteButton! : upvoteButton!);
        await letTheChangeSinkIn();
      });
    });

    test(`should send ${expectedVote} mutation`, () => {
      expect(mutate).toHaveBeenCalled();
    });

    test('should trigger onVote', () => {
      expect(onVote).toHaveBeenCalled();
    });
  });

  test('should not call onVote when mutation fails', async () => {
    const onVote = jest.fn();

    const mock: MockedResponse = {
      request: {
        query: VOTE_ON_REPORT,
        variables: {
          vote: 'UPVOTE',
        },
      },
      error: new GraphQLError('...'),
    };

    renderUi({ mock, onVote });

    await act(async () => {
      fireEvent.click(upvoteButton!);
      await letTheChangeSinkIn();
    });

    expect(onVote).not.toHaveBeenCalled();
  });
});
