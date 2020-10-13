import React from 'react';
import PropTypes from 'prop-types';
import Github from '../github/github-rest-client';
import {
  StackItem,
  Stack,
  TextField,
  Button,
  Select,
  SelectItem,
  HeadingText,
  Toast
} from 'nr1';
import get from 'lodash.get';
import ValidateCatalog from './ValidateCatalog';

export default class Deploy extends React.Component {
  static propTypes = {
    githubUrl: PropTypes.string,
    userToken: PropTypes.string,
    repo: PropTypes.object,
    user: PropTypes.string,
    closeModal: PropTypes.func,
    action: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      appName: props.repo.name, // props.appName || '',
      version: props.repo.refs.nodes[0].name, // props.version || '',
      ref: props.repo.refs.nodes[0].target.oid, // props.ref || '',
      user: props.user // props.user || ''
    };

    this.triggerWorkflowDispatch = this.triggerWorkflowDispatch.bind(this);
  }

  triggerValidate = event => {
    event.preventDefault();
    this.setState({ status: 'VALIDATE' });
  };

  async triggerWorkflowDispatch(event) {
    event.preventDefault();
    const { userToken, githubUrl, action, repo } = this.props;
    const { appName, version, ref, user } = this.state;
    const { url } = repo;
    // console.log('DISPATCH:', this.state);

    const github = new Github({ userToken, githubUrl });
    const path = `repos/newrelic/${appName}/actions/workflows/catalog.yml/dispatches`;

    await github.post(path, {
      ref: 'main',
      inputs: { appName, version, ref, user, action, url }
    });

    Toast.showToast({
      title: 'Deploy Initiated',
      description:
        'GitHub Workflows initiated. Refresh Workflow tab to view progress.',
      type: Toast.TYPE.NORMAL
    });
    this.props.closeModal();
  }

  renderRefs() {
    const { repo } = this.props;
    const refs = get(repo, 'refs.nodes');
    return (
      <div className="select-container">
        <Select
          onChange={(event, value) => {
            const ref = repo.refs.nodes.find(r => r.name === value);
            this.setState({
              ref: ref.target.oid,
              version: value,
              status: 'REVALIDATE'
            });
          }}
          value={this.state.version}
          label="Version"
        >
          {refs.map((node, i) => {
            return (
              <SelectItem key={i} value={node.name}>
                {node.name}
              </SelectItem>
            );
          })}
        </Select>
      </div>
    );
  }

  renderWorkflowInputForm() {
    const { repo, action } = this.props;
    return (
      <StackItem grow style={{ width: '100%' }}>
        {action === 'add' ? (
          <HeadingText>New Catalog Application</HeadingText>
        ) : (
          <HeadingText>Update Catalog Application</HeadingText>
        )}
        <p>
          Select version to deploy to catalog. This will open a Pull Request in{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/newrelic/nr1-catalog/pulls"
          >
            <code>newrelic/nr1-catalog</code>
          </a>{' '}
          and initiate the review process.
        </p>
        <form onSubmit={this.triggerWorkflowDispatch}>
          <Stack fullWidth verticalType={Stack.VERTICAL_TYPE.BOTTOM}>
            <StackItem grow>
              <TextField
                autofocus
                label="NR1 Nerdpack Name"
                value={repo.name}
                placeholder={repo.name}
                disabled
                className="text-field"
              />
              {this.renderRefs()}

              <Button
                type={Button.TYPE.Secondary}
                onClick={this.props.closeModal}
              >
                Cancel
              </Button>
              <Button type={Button.TYPE.PRIMARY} onClick={this.triggerValidate}>
                Validate
              </Button>
            </StackItem>
          </Stack>
        </form>
      </StackItem>
    );
  }

  render() {
    const { userToken, repo } = this.props;

    return (
      <div className="deploy-modal">
        {userToken && this.renderWorkflowInputForm()}
        {this.state.status === 'VALIDATE' && (
          <div className="project-screenshots-container">
            <ValidateCatalog
              version={this.state.version}
              repoName={repo.name}
              triggerWorkflowDispatch={this.triggerWorkflowDispatch}
              closeModal={this.props.closeModal}
            />
          </div>
        )}
      </div>
    );
  }
}
