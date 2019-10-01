import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
const { createUploadLink } = require('apollo-upload-client');

/**
 * Creates a Apollo Link, that adds authentication token to request
 */
const createAuthLink = () => {
  const request = operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  };

  return new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle;
        Promise.resolve(operation)
          .then(oper => request(oper))
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
      console.log('graphQLErrors', graphQLErrors);
    }
    if (networkError) {
      console.log('networkError', networkError);
    }
  });
};

/**
 * Creates a Apollo Client
 *
 * @param {string} apiUrl, GraphQL api url
 */
export const createApolloClient = apiUrl => {
  const cache = new InMemoryCache();
  const authLink = createAuthLink();
  const uploadLink = createUploadLink({ uri: apiUrl });

  return new ApolloClient({
    link: ApolloLink.from([handleErrors(), authLink, uploadLink]),
    cache,
  });
};
