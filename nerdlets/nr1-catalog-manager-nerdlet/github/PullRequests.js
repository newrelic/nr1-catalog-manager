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

    this.state = {
      // column_0: TableHeaderCell.SORTING_TYPE.ASCENDING
    };
  }

  // _onClickTableHeaderCell(key, event, sortingData) {
  //   this.setState({ [key]: sortingData.nextSortingType });
  // }

  render() {
    const { userToken } = this.props;
    const { SearchBar } = Search;
    const apClient = client(userToken);

    // if (!isSetup) {
    //   return <></>;
    // }

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

                      {/* <Table
                      items={repository.pullRequests.nodes}
                      // selected={({ item }) => item.selected}
                      onSelect={(evt, { item }) =>
                        (item.selected = evt.target.checked)
                      }
                    >
                      <TableHeader>
                        <TableHeaderCell
                          value={({ item }) => item.title}
                          sortable
                          sortingType={this.state.column_0}
                          sortingOrder={1}
                          onClick={this._onClickTableHeaderCell.bind(
                            this,
                            'column_0'
                          )}
                        >
                          Title
                        </TableHeaderCell>
                        <TableHeaderCell
                          value={({ item }) => item.author.login}
                          sortable
                          sortingType={this.state.column_1}
                          sortingOrder={2}
                          onClick={this._onClickTableHeaderCell.bind(
                            this,
                            'column_1'
                          )}
                        >
                          Author
                        </TableHeaderCell>
                        <TableHeaderCell
                          value={({ item }) => item.createdAt}
                          sortable
                          sortingType={this.state.column_2}
                          sortingOrder={3}
                          onClick={this._onClickTableHeaderCell.bind(
                            this,
                            'column_2'
                          )}
                        >
                          Created At
                        </TableHeaderCell>
                      </TableHeader>

                      {({ item }) => (
                        <TableRow>
                          <TableRowCell>{item.title}</TableRowCell>
                          <TableRowCell>{item.author.login}</TableRowCell>
                          <TableRowCell>{item.createdAt}</TableRowCell>
                        </TableRow>
                      )}
                    </Table> */}
                    </div>
                  </div>
                )}
              </>
              // <Repositories
              //   search={this._filterCatalogApps(search)}
              //   viewer={viewer}
              //   userToken={userToken}
              // />
            );
            // return <Spinner fillContainer />;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}