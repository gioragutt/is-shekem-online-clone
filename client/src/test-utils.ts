import { GraphQLRequest } from "@apollo/client";
import { MockedResponse } from "@apollo/client/testing";

export function letTheChangeSinkIn() {
  // https://github.com/apollographql/react-apollo/issues/1711#issuecomment-369511476
  // `render` instead of `mount`, and used in `act` instead of highest test scope.
  // 🤮
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export function expectMutation(request: GraphQLRequest): MockedResponse & { mutate: jest.Mock } {
  const mutate = jest.fn(() => ({ data: {} }));
  return {
    request,
    result: mutate,
    mutate,
  };
}

export function expectPressed(element: HTMLElement | null, pressed: boolean) {
  expect(element).toHaveAttribute('aria-pressed', `${pressed}`);
}
