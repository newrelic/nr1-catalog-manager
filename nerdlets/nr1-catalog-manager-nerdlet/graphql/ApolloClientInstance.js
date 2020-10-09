/* eslint-disable no-console */
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

/**
 * Instantiates a new ApolloClient that utilizes the userToken for authorization
 * @param {*} userToken A GitHub personal access token
 */
export const client = userToken => {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        }
        if (networkError) {
          console.error(`[Network error]: ${networkError}`);
        }
      }),
      new HttpLink({
        uri: GITHUB_BASE_URL,
        headers: {
          authorization: `Bearer ${userToken}`
        }
      })
    ]),
    cache: new InMemoryCache({
      fragmentMatcher
    })
  });
};
