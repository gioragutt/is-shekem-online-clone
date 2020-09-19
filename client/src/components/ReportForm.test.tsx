import { GraphQLRequest } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent } from '@testing-library/dom';
import { act, render, RenderResult } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import React from 'react';
import { CREATE_REPORT, ReportForm } from './ReportForm';

function letTheChangeSinkIn() {
  // https://github.com/apollographql/react-apollo/issues/1711#issuecomment-369511476
  // `render` instead of `mount`, and used in `act` instead of highest test scope.
  // 🤮
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function expectMutation(request: GraphQLRequest): MockedResponse & { mutate: jest.Mock } {
  const mutate = jest.fn(() => ({ data: {}}));
  return {
    request,
    result: mutate,
    mutate,
  };
}

describe('ReportForm', () => {
  let renderResult: RenderResult;
  let closeButton: HTMLElement;
  let openButton: HTMLElement;
  let reporterInput: HTMLElement;

  function renderUi({
    onCreateReport = () => undefined,
    mock,
  }: {
    onCreateReport?: () => void;
    mock?: MockedResponse;
  } = {}) {
    renderResult = render(
      <MockedProvider mocks={mock ? [mock] : []} addTypename={false}>
        <ReportForm onCreateReport={onCreateReport} />
      </MockedProvider>
    );

    closeButton = renderResult.getByTestId('close-button');
    openButton = renderResult.getByTestId('open-button');
    reporterInput = renderResult.getByTestId('reporter-input');
  }

  test('should have close/open buttons and input', () => {
    renderUi();

    expect(closeButton).toBeInTheDocument();
    expect(openButton).toBeInTheDocument();
    expect(reporterInput).toBeInTheDocument();
  });

  test('buttons should be disabled when the input is empty', () => {
    renderUi();

    expect(closeButton).toHaveAttribute('disabled');
    expect(openButton).toHaveAttribute('disabled');
  });

  test("buttons should be enabled when the input isn't empty", () => {
    renderUi();

    act(() => {
      fireEvent.change(reporterInput, { target: { value: 'kaki' } });
    });

    expect(closeButton).not.toHaveAttribute('disabled');
    expect(openButton).not.toHaveAttribute('disabled');
  });

  test('should fire mutation with open=false when clicking close button', async () => {
    const mock = expectMutation({
      query: CREATE_REPORT,
      variables: {
        reporter: 'giorag',
        open: false,
      },
    });

    renderUi({ mock });

    await act(async () => {
      fireEvent.change(reporterInput, { target: { value: 'giorag' } });
      await letTheChangeSinkIn();
      fireEvent.click(closeButton);
      await letTheChangeSinkIn();
    });

    expect(mock.mutate).toHaveBeenCalled();
  });

  test('should fire mutation with open=false when clicking open button', async () => {
    const mock = expectMutation({
      query: CREATE_REPORT,
      variables: {
        reporter: 'kobiz',
        open: true,
      },
    });

    renderUi({ mock });

    await act(async () => {
      fireEvent.change(reporterInput, { target: { value: 'kobiz' } });
      await letTheChangeSinkIn();
      fireEvent.click(openButton);
      await letTheChangeSinkIn();
    });

    expect(mock.mutate).toHaveBeenCalled();
  });

  test('should reset reporter name after mutation is fired', async () => {
    const mock = expectMutation({
      query: CREATE_REPORT,
      variables: {
        reporter: 'kobiz',
        open: true,
      },
    });

    renderUi({ mock });

    await act(async () => {
      fireEvent.change(reporterInput, { target: { value: 'kobiz' } });
      await letTheChangeSinkIn();
      fireEvent.click(openButton);
      await letTheChangeSinkIn();
    });

    expect(reporterInput).toHaveTextContent('');
  });

  test('should call onCreateReport after mutation succeeded', async () => {
    const mock = expectMutation({
      query: CREATE_REPORT,
      variables: {
        reporter: 'kobiz',
        open: true,
      },
    });

    const onCreateReport = jest.fn();

    renderUi({ mock, onCreateReport });

    await act(async () => {
      fireEvent.change(reporterInput, { target: { value: 'kobiz' } });
      await letTheChangeSinkIn();
      fireEvent.click(openButton);
      await letTheChangeSinkIn();
    });

    expect(onCreateReport).toHaveBeenCalled();
  });

  test('should not call onCreateReport after mutation failed', async () => {
    const mock: MockedResponse = {
      request: {
        query: CREATE_REPORT,
        variables: {
          reporter: 'kobiz',
          open: true,
        },
      },
      error: new GraphQLError('...'),
    };

    const onCreateReport = jest.fn();

    renderUi({ mock, onCreateReport });

    await act(async () => {
      fireEvent.change(reporterInput, { target: { value: 'kobiz' } });
      await letTheChangeSinkIn();
      fireEvent.click(openButton);
      await letTheChangeSinkIn();
    });

    expect(onCreateReport).not.toHaveBeenCalled();
  });
});
