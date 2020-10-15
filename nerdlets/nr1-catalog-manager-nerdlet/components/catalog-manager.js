/* eslint-disable no-console */
import React from 'react';
import { Toast, Spinner, Tabs, TabsItem } from 'nr1';
import { UserSecretsMutation, UserSecretsQuery } from '@newrelic/nr1-community';

import Auth from '../auth/Auth';
import GitHubQuery from '../github/GitHubQuery';
import PullRequests from '../github/PullRequests';
import Workflows from '../github/Workflows';
import Status from '../constants/Status';
import Settings from '../auth/Settings';

export default class CatalogManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: Status.CATALOG_MANAGER.LOADING // default state of page is loading as we try to retrive the user's token
    };
  }

  componentDidMount() {
    this._loadState();
  }

  /**
   * Deletes userToken from NerdStorageVault and refreshes status of page.
   */
  _deleteUserToken = async () => {
    const mutation = {
      actionType: UserSecretsMutation.ACTION_TYPE.DELETE_SECRET,
      name: 'userToken'
    };

    await UserSecretsMutation.mutate(mutation);
    this.setState({
      userToken: null,
      status: Status.CATALOG_MANAGER.USER_TOKEN_EMPTY
    });
  };

  /**
   * Stores userToken to NerdStorageVault and refreshes status of page.
   */
  _setUserToken = async userToken => {
    const mutation = {
      actionType: UserSecretsMutation.ACTION_TYPE.WRITE_SECRET,
      name: 'userToken',
      value: userToken
    };

    await UserSecretsMutation.mutate(mutation);
    this.setState({
      userToken,
      status: userToken
        ? Status.CATALOG_MANAGER.USER_TOKEN_SET
        : Status.CATALOG_MANAGER.USER_TOKEN_EMPTY
    });
  };

  /**
   * Loads the userToken from NerdStorage
   */
  _loadState() {
    UserSecretsQuery.query({
      name: 'userToken'
    })
      .then(({ data }) => {
        if (!data) {
          console.log(
            'Cannot update state. No new entities returned from UserStorageQuery.'
          );
          this.setState({
            userToken: null,
            status: Status.CATALOG_MANAGER.USER_TOKEN_EMPTY
          });
        } else {
          // console.debug(data);

          this.setState({
            userToken: data.value,
            status: data.value
              ? Status.CATALOG_MANAGER.USER_TOKEN_SET
              : Status.CATALOG_MANAGER.USER_TOKEN_EMPTY
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          userToken: null,
          status: Status.CATALOG_MANAGER.USER_TOKEN_EMPTY
        });
        Toast.showToast({ title: error.message, type: Toast.TYPE.CRITICAL });
      });
  }

  render() {
    const { userToken, status } = this.state;

    if (status === Status.CATALOG_MANAGER.LOADING)
      return <Spinner fillContainer />;

    return (
      <div className="root">
        {/* No user, render the login screen */}
        {status === Status.CATALOG_MANAGER.USER_TOKEN_EMPTY && (
          <Auth setUserToken={this._setUserToken} />
        )}

        {/* User exists, render tabs with repo content from GitHub GraphQL API */}
        {status === Status.CATALOG_MANAGER.USER_TOKEN_SET && (
          <div className="container">
            <Tabs defaultValue="tab-1" className="tabs">
              <TabsItem value="tab-1" label="Repositories">
                <GitHubQuery userToken={userToken} />
              </TabsItem>
              <TabsItem value="tab-2" label="Pull Requests">
                <PullRequests userToken={userToken} />
              </TabsItem>
              <TabsItem value="tab-3" label="Workflows">
                <Workflows
                  userToken={userToken}
                  githubUrl="https://api.github.com/"
                />
              </TabsItem>
              <TabsItem value="tab-4" label="Settings">
                <Settings deleteUserToken={this._deleteUserToken} />
              </TabsItem>
            </Tabs>
          </div>
        )}
      </div>
    );
  }
}
