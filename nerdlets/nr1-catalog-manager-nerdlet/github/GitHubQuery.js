import React from 'react';
import PropTypes from 'prop-types';
import { Query, ApolloProvider } from 'react-apollo';
import { Spinner } from 'nr1';

import Repositories from './Repositories';
import ErrorMessage from '../graphql/ErrorMessage';
import { client } from '../graphql/ApolloClientInstance';
import { CATALOG_REPOS_QUERY } from '../graphql/Queries';

export default class GitHubQuery extends React.Component {
  static propTypes = {
    userToken: PropTypes.string
  };

  /**
   * Filters the nr1Repos to return only those that have a catalog directory
   * @param {*} nr1Repos The full set of repos returned from the CATALOG_REPOS_QUERY
   */
  _getCatalogRepos(nr1Repos) {
    return {
      ...nr1Repos,
      nodes: nr1Repos.nodes.filter(n => n.catalog)
    };
  }

  render() {
    const { userToken } = this.props;

    const apClient = client(userToken);

    return (
      <ApolloProvider client={apClient}>
        <Query query={CATALOG_REPOS_QUERY}>
          {({ data, loading, error }) => {
            if (error) {
              return <ErrorMessage error={error} />;
            }

            const { nr1Repos, viewer, globals } = data;

            if (loading || !nr1Repos || !viewer || !globals) {
              return <Spinner fillContainer style={{ height: '100vh' }} />;
            }

            // eslint-disable-next-line no-console
            console.debug('CATALOG_REPOS_QUERY', data);

            return (
              <Repositories
                catalogRepos={this._getCatalogRepos(nr1Repos)}
                viewer={viewer}
                globals={globals}
                userToken={userToken}
              />
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}
