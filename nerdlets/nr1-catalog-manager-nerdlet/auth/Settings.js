import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stack, StackItem, Button } from 'nr1';

export default class Settings extends PureComponent {
  static propTypes = {
    deleteUserToken: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  /**
   * Renders the view to remove the user's token from both NerdStorage and local state
   */
  render() {
    const { deleteUserToken } = this.props;
    const GHURL = 'https://github.com';

    return (
      <StackItem>
        <h3>Personal Access Token</h3>
        <p>
          You have provided a GitHub personal access token, which you can{' '}
          <a
            href={`${GHURL}/settings/tokens`}
            target="_blank"
            rel="noopener noreferrer"
          >
            delete from GitHub
          </a>
          . You can also delete your token from New Relic's secure storage.
        </p>
        <Stack alignmentType="center" distributionType="trailing" fill>
          <StackItem>
            <Button
              onClick={() => deleteUserToken(null)}
              iconType="interface_operations_trash"
              sizeType={Button.SIZE_TYPE.SMALL}
              type={Button.TYPE.DESTRUCTIVE}
            >
              Delete my User Token
            </Button>
          </StackItem>
        </Stack>
      </StackItem>
    );
  }
}
