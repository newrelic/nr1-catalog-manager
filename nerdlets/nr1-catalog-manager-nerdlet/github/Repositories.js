import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { HeadingText, Button, Modal } from 'nr1';
import get from 'lodash.get';
import Deploy from '../deploy/Deploy';

import SearchTable from '../../shared/components/search-table';

export default class Repositories extends PureComponent {
  static propTypes = {
    userToken: PropTypes.string,
    catalogRepos: PropTypes.object,
    viewer: PropTypes.object,
    globals: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
  }

  _transformRepositories = (catalogRepos, versions) => {
    versions = JSON.parse(versions?.text);
    return catalogRepos.nodes
      .map(n => ({
        ...n,
        name_action: n.name,
        catalogVersion: versions[n.name]
      }))
      .sort((a, b) => (b.name < a.name ? 1 : -1));
  };

  _onClose = () => {
    this.setState({ hidden: true });
  };

  _openModal = (selectedRepo, action) => {
    const { catalogRepos } = this.props;
    const node = catalogRepos.nodes.find(n => {
      return n.name === selectedRepo;
    });
    // console.log(`[selectedRepo]: ${selectedRepo}`);
    // console.log('[node]', node);

    this.setState({ deploymentRepo: node, action: action, hidden: false });
  };

  _getColumns = globals => {
    const globalUUIDs = JSON.parse(globals?.globalUUIDs?.text);
    // console.log('globalUUIDs', globalUUIDs);

    return [
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
        dataField: 'catalogVersion',
        text: 'Current Catalog Version',
        formatter: cell => (!cell ? '-' : cell)
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
        dataField: 'name_action', // dataField is required, so just using the id field as a placeholder
        text: 'Action',
        formatter: cell =>
          cell in globalUUIDs ? (
            <Button
              type={Button.TYPE.PRIMARY}
              sizeType={Button.SIZE_TYPE.MEDIUM}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__REFRESH}
              onClick={() => this._openModal(cell, 'update')}
              style={{ width: '98px' }}
            >
              Update
            </Button>
          ) : (
            <Button
              type={Button.TYPE.PRIMARY}
              iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
              sizeType={Button.SIZE_TYPE.MEDIUM}
              onClick={() => this._openModal(cell, 'add')}
              style={{ width: '98px' }}
            >
              Add
            </Button>
          )
      }
    ];
  };

  render() {
    const { hidden, deploymentRepo, action } = this.state;
    const { userToken, globals, catalogRepos, viewer } = this.props;
    const { versions } = globals;

    // TODO: transform data before passing to BootstrapTable

    return (
      <>
        <div>
          <HeadingText
            spacingType={[HeadingText.SPACING_TYPE.OMIT]}
            className="heading"
          >
            Catalog Repository List for user:{' '}
            <strong style={{ color: '#008c99' }}>{viewer.login}</strong>
          </HeadingText>
        </div>
        <SearchTable
          data={this._transformRepositories(catalogRepos, versions)}
          columns={this._getColumns(globals)}
        />

        <Modal hidden={this.state.hidden} onClose={this._onClose}>
          {!hidden && (
            <Deploy
              githubUrl="https://api.github.com/"
              repo={deploymentRepo}
              action={action}
              user={viewer.login}
              userToken={userToken}
              closeModal={this._onClose}
            />
          )}
        </Modal>
      </>
    );
  }
}
