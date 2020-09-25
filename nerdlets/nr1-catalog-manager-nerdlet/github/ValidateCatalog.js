import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, ApolloProvider } from 'react-apollo';
import { Spinner } from 'nr1';

import ErrorMessage from '../graphql/ErrorMessage';
import { client } from '../graphql/ApolloClientInstance';
import { CATALOG_VALIDATION_QUERY, VALIDATION_QUERY } from '../graphql/Queries';

export default class ValidateCatalog extends PureComponent {
  static propTypes = {
    version: PropTypes.string,
    repoName: PropTypes.string
  };

  // _filterCatalogApps(search) {
  //   return {
  //     ...search,
  //     nodes: search.nodes.filter(n => n.catalog)
  //   };
  // }

  onImgLoad({ target: img }) {
    console.log({
      dimensions: { height: img.offsetHeight, width: img.offsetWidth }
    });
  }

  render() {
    // const { isSetup, userToken } = this.props;
    const { version, repoName } = this.props;
    console.log('Props: ', this.props);

    // const apClient = client(userToken);

    // if (!isSetup) {
    //   return <></>;
    // }

    return (
      // <ApolloProvider client={apClient}>
      // <Query query={VALIDATION_QUERY}>
      <Query query={CATALOG_VALIDATION_QUERY} variables={{ repoName }}>
        {({ data, loading, error }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }
          const { repository } = data;
          // console.log('result: ', repository);
          // const { search, viewer } = data;

          if (loading || !repository) {
            return <Spinner fillContainer style={{ height: '100vh' }} />;
          }

          // eslint-disable-next-line no-console
          console.debug('Result: ', repository);

          return (
            <div className="project-screenshot-list">
              {repository.screenshots.entries.map((image, i) => {
                return (
                  <img
                    className="project-screenshot-list-item"
                    key={i}
                    onLoad={this.onImgLoad}
                    src={`https://raw.githubusercontent.com/newrelic/${repoName}/${version}/catalog/screenshots/${image.name}`}
                  />
                );
              })}
            </div>
          );
        }}
      </Query>
      // </ApolloProvider>
    );
  }
}
