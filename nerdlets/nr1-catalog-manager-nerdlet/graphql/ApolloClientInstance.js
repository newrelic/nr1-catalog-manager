import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

/**
 * Instantiates a new ApolloClient that utilizes the userToken for authorization
 * @param {*} userToken A GitHub personal access token
 */
export const client = userToken => {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          console.error('GRAPHQL_ERR::>', graphQLErrors);
          console.error();
        }
        if (networkError) {
          console.error('NETWORK_ERR::>', networkError);
        }
      }),
      new HttpLink({
        uri: GITHUB_BASE_URL,
        headers: {
          authorization: `Bearer ${userToken}`
        }
      })
    ]),
    cache: new InMemoryCache()
  });
};
