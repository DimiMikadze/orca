import { ApolloClient, ApolloLink, Observable, split, InMemoryCache } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { createUploadLink } from 'apollo-upload-client';

/**
 * Creates a Apollo Link, that adds authentication token to request
 */
const createAuthLink = () => {
  const request = (operation) => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  };

  return new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );
};

/**
 * Helper functions that handles error cases
 */
const handleErrors = () => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });
};

/**
 * Creates a Apollo Client
 *
 * @param {string} apiUrl, GraphQL api url
 * @param {string} websocketApiUrl, GraphQL WebSocket api url
 */
export const createApolloClient = (apiUrl, websocketApiUrl) => {
  const cache = new InMemoryCache();

  const errorLink = handleErrors();
  const authLink = createAuthLink();
  const uploadLink = createUploadLink({ uri: apiUrl }); // Upload link also creates an HTTP link

  // Create WebSocket link
  const authToken = localStorage.getItem('token');
  const wsLink = new WebSocketLink({
    uri: websocketApiUrl,
    options: {
      timeout: 60000,
      reconnect: true,
      connectionParams: {
        authorization: authToken,
      },
    },
  });

  // Temporary fix for early websocket closure resulting in websocket connections not being instantiated
  // https://github.com/apollographql/subscriptions-transport-ws/issues/377
  wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
    wsLink.subscriptionClient.maxConnectTimeGenerator.max;

  // Split links, so we can send data to each link
  // depending on what kind of operation is being sent
  const terminatingLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    uploadLink
  );

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, terminatingLink]),
    cache,
  });
};
