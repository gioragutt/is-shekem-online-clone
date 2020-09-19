import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders correctly', () => {
  const { getByText } = render(
    <MockedProvider>
      <App />
    </MockedProvider>
  );
  const linkElement = getByText(/תגיד\/י השק״ם פתוח?/i);
  expect(linkElement).toBeInTheDocument();
});
