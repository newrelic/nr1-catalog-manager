import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Query, ApolloProvider } from 'react-apollo';
import { Spinner, HeadingText } from 'nr1';

import ErrorMessage from '../graphql/ErrorMessage';
import { client } from '../graphql/ApolloClientInstance';
import { PULL_REQUESTS_QUERY } from '../graphql/Queries';

export default class PullRequests extends PureComponent {
  static propTypes = {
    userToken: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { userToken } = this.props;
    const { SearchBar } = Search;
    const apClient = client(userToken);

    const columns = [
      {
        dataField: 'title',
        text: 'Title'
      },
      {
        dataField: 'author.login',
        text: 'Author'
      },
      {
        dataField: 'createdAt',
        text: 'Created At'
      }
    ];

    return (
      <ApolloProvider client={apClient}>
        <Query query={PULL_REQUESTS_QUERY}>
          {({ data, loading, error }) => {
            if (error) {
              return <ErrorMessage error={error} />;
            }

            // console.log('PRs', data);
            const { repository } = data;

            if (loading || !repository) {
              return <Spinner fillContainer />;
            }

            // eslint-disable-next-line no-console
            console.debug('PRs2', repository);

            const { nodes } = repository.pullRequests;
            return (
              <>
                {nodes.length === 0 ? (
                  <div>No Pull Requests open</div>
                ) : (
                  <div>
                    <HeadingText
                      spacingType={[HeadingText.SPACING_TYPE.OMIT]}
                      className="heading"
                    >
                      Existing Open Pull Requests for <code>nr1-catalog</code>
                    </HeadingText>

                    <div style={{ overflowX: 'auto' }}>
                      <ToolkitProvider
                        wrapperClasses="table-responsive"
                        keyField="title"
                        data={nodes}
                        columns={columns}
                        search
                      >
                        {props => (
                          <>
                            <SearchBar {...props.searchProps} />
                            <BootstrapTable {...props.baseProps} />
                          </>
                        )}
                      </ToolkitProvider>
                    </div>
                  </div>
                )}
              </>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}
