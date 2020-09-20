import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import React from 'react';
import { expectMutation, letTheChangeSinkIn } from '../test-utils';
import { CREATE_REPORT, ReportForm } from './ReportForm';

describe('ReportForm', () => {
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
    const renderResult = render(
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
