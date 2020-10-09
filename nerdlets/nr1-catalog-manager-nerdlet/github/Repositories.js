import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { HeadingText, Button, Modal } from 'nr1';
import get from 'lodash.get';
import Deploy from '../deploy/Deploy';

export default class Repositories extends PureComponent {
  static propTypes = {
    userToken: PropTypes.string,
    search: PropTypes.object,
    viewer: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      search: props.search,
      viewer: props.viewer,
      // searchValue: null,
      filteredRepositories: props.search.nodes.sort((a, b) =>
        b.name < a.name ? 1 : -1
      ),
      hidden: true
    };
  }

  /**
   * Helper function for setting the filtered table content used
   * with the name search field
   */
  // filterTable = event => {
  //   this.setState({
  //     searchValue: event.target.value,
  //     filteredRepositories: this.state.search.nodes.filter(curr => {
  //       return curr.name.includes(event.target.value);
  //     })
  //   });
  // };

  _onClose = () => {
    this.setState({ hidden: true });
  };

  _openModal = selectedRepo => {
    // console.log(selectedRepo);
    const { search } = this.state;
    const node = search.nodes.find(n => {
      return n.name === selectedRepo;
    });
    // console.log('node: ', node);
    this.setState({ deploymentRepo: node, hidden: false });
  };

  // onImgLoad({ target: img }) {
  //   console.log({
  //     dimensions: { height: img.offsetHeight, width: img.offsetWidth }
  //   });
  // }

  render() {
    const { viewer, filteredRepositories, hidden } = this.state;
    const { userToken } = this.props;

    const { SearchBar } = Search;

    // TODO: transform data before passing to BootstrapTable
    const columns = [
      {
        dataField: 'name',
        text: 'Name',
        formatter: cell => (
          <a href={cell.url} target="_blank" rel="noopener noreferrer">
            {cell}
          </a>
        )
      },
      {
        dataField: 'viewerPermission',
        text: 'Permisson'
      },
      {
        dataField: 'refs.nodes[0].name',
        text: 'Latest Release',
        formatter: cell => (!cell ? '-' : cell)
      },
      {
        dataField: 'refs.nodes[0].target',
        text: 'Commit SHA',
        formatter: cell => {
          const commitSha = get(cell, 'oid');
          const commitShaUrl = get(cell, 'commitUrl');

          return commitSha && commitShaUrl ? (
            <a
              href={commitShaUrl || ''}
              target="_blank"
              rel="noopener noreferrer"
            >
              {commitSha || ''}
            </a>
          ) : (
            ''
          );
        }
      },
      {
        dataField: 'refs.nodes[0].target.messageHeadline',
        text: 'Commit Message',
        formatter: cell => (!cell ? '-' : cell)
      },
      {
        dataField: 'name',
        text: 'Action',
        formatter: cell => (
          <Button
            type={Button.TYPE.NORMAL}
            sizeType={Button.SIZE_TYPE.SMALL}
            onClick={() => this._openModal(cell)}
          >
            Update
          </Button>
        )
      }
    ];

    return (
      <>
        {/* <img
          onLoad={this.onImgLoad}
          src="https://raw.githubusercontent.com/newrelic/nr1-browser-analyzer/v1.3.5/catalog/screenshots/nr1-browser-analyzer-01.png"
        /> */}
        {/* <img src="https://raw.githubusercontent.com/newrelic/nr1-browser-analyzer/v1.3.5/catalog/screenshots/nr1-browser-analyzer-01.png" /> */}
        <div>
          <HeadingText
            spacingType={[HeadingText.SPACING_TYPE.OMIT]}
            className="heading"
          >
            Catalog Repository List for user:{' '}
            <strong style={{ color: '#038b99' }}>{viewer.login}</strong>
          </HeadingText>
          {/* <TextField
            autofocus
            label="Name Search"
            placeholder="Type to filter repos by name"
            onChange={this.filterTable}
          />
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Permisson</th>
                  <th>Latest Release</th>
                  <th>Commit SHA</th>
                  <th>Commit Message</th>
                  <th>Deploy</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepositories.length > 0 ? (
                  filteredRepositories.map((node, i) => {
                    const releaseName = get(node, 'refs.nodes[0].name');
                    const commitSha = get(node, 'refs.nodes[0].target.oid');
                    const commitShaUrl = get(
                      node,
                      'refs.nodes[0].target.commitUrl'
                    );
                    const commitMessage = get(
                      node,
                      'refs.nodes[0].target.messageHeadline'
                    );

                    return (
                      <tr key={i}>
                        <td>
                          <a
                            href={node.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {node.name}
                          </a>
                        </td>
                        <td>{node.viewerPermission}</td>
                        <td>{releaseName || ''}</td>
                        <td>
                          {commitSha && commitShaUrl ? (
                            <a
                              href={commitShaUrl || ''}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {commitSha || ''}
                            </a>
                          ) : (
                            ''
                          )}
                        </td>
                        <td> {commitMessage}</td>
                        <td>
                          <Button
                            type={Button.TYPE.NORMAL}
                            sizeType={Button.SIZE_TYPE.SMALL}
                            onClick={() => this._openModal(node.name)}
                          >
                            Deploy
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr style={{ backgroundColor: 'fff' }}>
                    <td colSpan="6">No data to display</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> */}
        </div>
        {filteredRepositories.length > 0 ? (
          <ToolkitProvider
            wrapperClasses="table-responsive"
            keyField="id"
            data={filteredRepositories}
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
        ) : (
          <tr style={{ backgroundColor: 'fff' }}>
            <td colSpan="6">No data to display</td>
          </tr>
        )}

        <Modal hidden={this.state.hidden} onClose={this._onClose}>
          {!hidden && (
            <>
              <Deploy
                githubUrl="https://api.github.com/"
                // setUserToken={this._setUserToken}
                // isSetup
                repo={this.state.deploymentRepo}
                user={this.state.viewer.login}
                userToken={userToken}
                closeModal={this._onClose}
              />
            </>
          )}
        </Modal>
      </>
    );
  }
}
