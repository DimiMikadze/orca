import { ApolloClient, ApolloLink, split, InMemoryCache } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { createUploadLink } from 'apollo-upload-client';

/**
 * Helper functions that handles error cases
 */
const handleErrors = () => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => /* eslint-disable-line array-callback-return */ {
        console.log('[GraphQL error]: Message', message);
        console.log('[GraphQL error]: Location', locations);
        console.log('[GraphQL error]: Path', path);
      });
    }

    if (networkError) {
      console.log('[Network error]:', networkError);
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
  const uploadLink = createUploadLink({ uri: apiUrl, credentials: 'include' }); // Upload link also creates an HTTP link

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
    link: ApolloLink.from([errorLink, terminatingLink]),
    cache,
  });
};
