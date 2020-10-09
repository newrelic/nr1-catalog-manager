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
    // isSetup: PropTypes.bool
  };

  _filterCatalogApps(search) {
    return {
      ...search,
      nodes: search.nodes.filter(n => n.catalog)
    };
  }

  render() {
    // const { isSetup, userToken } = this.props;
    const { userToken } = this.props;

    const apClient = client(userToken);

    // if (!isSetup) {
    //   return <></>;
    // }

    return (
      <ApolloProvider client={apClient}>
        <Query query={CATALOG_REPOS_QUERY}>
          {({ data, loading, error }) => {
            if (error) {
              return <ErrorMessage error={error} />;
            }

            // const { viewer } = data;
            const { search, viewer } = data;

            if (loading || !search) {
              return <Spinner fillContainer style={{ height: '100vh' }} />;
            }

            // eslint-disable-next-line no-console
            console.debug(search);

            return (
              <Repositories
                search={this._filterCatalogApps(search)}
                viewer={viewer}
                userToken={userToken}
              />
            );
            // return <Spinner fillContainer />;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}
