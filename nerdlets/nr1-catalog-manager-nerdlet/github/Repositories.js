import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { HeadingText, TextField, Button, BlockText, Modal } from 'nr1';
import get from 'lodash.get';
import Deploy from '../deploy/Deploy';

export default class Repositories extends PureComponent {
  static propTypes = {
    userToken: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      search: props.search,
      viewer: props.viewer,
      searchValue: null,
      filteredRepositories: props.search.nodes,
      hidden: true
    };
  }

  /**
   * Helper function for setting the filtered table content used
   * with the name search field
   */
  filterTable = event => {
    this.setState({
      searchValue: event.target.value,
      filteredRepositories: this.state.search.nodes.filter(curr => {
        return curr.name.includes(event.target.value);
      })
    });
  };

  _onClose = () => {
    this.setState({ hidden: true });
  };

  _openModal = selectedRepo => {
    console.log(selectedRepo);
    const node = this.state.search.nodes.find(n => {
      return n.name === selectedRepo;
    });
    console.log('node: ', node);
    this.setState({ deploymentRepo: node, hidden: false });
  };

  render() {
    const { search, viewer, filteredRepositories, hidden } = this.state;
    const { userToken } = this.props;
    console.log(`hidden: ${hidden}`, search);
    return (
      <>
        <div>
          <HeadingText spacingType={[HeadingText.SPACING_TYPE.OMIT]}>
            Repository List for user:{' '}
            <strong style={{ color: '#038b99' }}>{viewer.login}</strong>
          </HeadingText>
          <TextField
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
                  {/* <th>Private?</th>
                <th>Last Commit</th>
                <th>Commit Comments Total Count</th>
                <th>Total Commit Count</th> */}
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
                        {/* <td>{node.isPrivate ? 'Y' : 'N'}</td>
                      <td>
                        <a
                          href={node.defaultBranchRef.target.commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {node.defaultBranchRef.target.message}
                        </a>
                      </td>
                      <td>{node.commitComments.totalCount}</td>
                      <td>{node.defaultBranchRef.target.history.totalCount}</td> */}
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
          </div>
        </div>

        {/* <Button onClick={() => this.setState({ hidden: false })}>
          Open Modal
        </Button> */}
        <Modal hidden={this.state.hidden} onClose={this._onClose}>
          {/* <HeadingText type={HeadingText.TYPE.HEADING_1}>Modal</HeadingText>
          <BlockText type={BlockText.TYPE.PARAGRAPH}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictumst
            quisque sagittis purus sit amet.
          </BlockText> */}
          {!hidden && (
            <>
              <Deploy
                githubUrl="https://api.github.com/"
                // setUserToken={this._setUserToken}
                isSetup
                repo={this.state.deploymentRepo}
                user={this.state.viewer.login}
                userToken={userToken}
              />
              <Button onClick={this._onClose} style={{ marginTop: '10px' }}>
                Close
              </Button>
            </>
          )}
        </Modal>
      </>
    );
  }
}
