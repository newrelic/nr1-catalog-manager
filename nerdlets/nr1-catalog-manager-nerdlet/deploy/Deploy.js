import React from 'react';
import PropTypes from 'prop-types';
import Github from '../github';
import {
  Grid,
  GridItem,
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

export default class Deploy extends React.Component {
  static propTypes = {
    githubUrl: PropTypes.string,
    userToken: PropTypes.string,
    isSetup: PropTypes.bool,
    repo: PropTypes.object,
    user: PropTypes.string,
    closeModal: PropTypes.func
    // setUserToken: PropTypes.func.isRequired
  };
  // static propTypes = {
  //   githubUrl: PropTypes.string,
  //   setGithubUrl: PropTypes.func.isRequired,

  //   userToken: PropTypes.string,
  //   setActiveTab: PropTypes.func
  // };

  constructor(props) {
    super(props);
    this.state = {
      userToken: props.userToken || '',
      githubUrl: props.githubUrl || '',
      appName: props.repo.name, // props.appName || '',
      version: props.repo.refs.nodes[0].name, // props.version || '',
      ref: props.repo.refs.nodes[0].target.oid, // props.ref || '',
      user: props.user // props.user || ''
      // githubUrl: props.githubUrl || '',
      // isGithubEnterprise: true,
      // isValidUrl: true
    };

    // this.handleSetGithubUrl = this.handleSetGithubUrl.bind(this);
    this.triggerWorkflowDispatch = this.triggerWorkflowDispatch.bind(this);
  }

  async triggerWorkflowDispatch(event) {
    event.preventDefault();
    // console.log(
    //   this.state.githubUrl,
    //   this.state.userToken,
    //   this.props.githubUrl,
    //   this.props.userToken,
    //   this.state.appName,
    //   this.state.version,
    //   this.state.ref,
    //   this.state.user
    // );
    const { userToken, githubUrl, repo } = this.props;
    const { appName, version, ref, user } = this.state;
    console.log('DISPATCH:', this.state);
    const github = new Github({ userToken, githubUrl });
    // const path = `repos/jbeveland27/prototype-nr1-actions/actions/workflows/catalog.yml/dispatches`;
    const path = `repos/newrelic/${appName}/actions/workflows/catalog.yml/dispatches`;

    await github.post(path, {
      ref: 'main',
      inputs: { appName, version, ref, user }
    });

    Toast.showToast({
      title: 'Deploy Initiated',
      description:
        'GitHub Workflows initiated. Refresh Workflow tab to view progress.',
      // actions: [{
      //   label: 'Say hi!',
      //   onClick: () => console.log('Hello World!'),
      // }],
      type: Toast.TYPE.NORMAL
    });
    this.props.closeModal();
  }

  renderRefs() {
    const { repo } = this.props;
    const refs = get(repo, 'refs.nodes');
    return (
      <div className="select-container">
        {/* <label className="AACLAC-wnd-TextField-label">Version</label> */}
        <Select
          onChange={(event, value) => {
            const ref = repo.refs.nodes.find(r => r.name === value);
            this.setState({ ref: ref.target.oid, version: value });
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
    // const { userToken } = this.state;
    // const { setUserToken } = this.props;
    // const GHURL = this._getGithubUrl();
    const { repo } = this.props;
    return (
      <StackItem grow style={{ width: '100%' }}>
        {/* <h2>Trigger Workflow Dispatch</h2> */}
        <HeadingText>Initiate Catalog Deployment</HeadingText>
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
          <Stack
            fullWidth
            verticalType={Stack.VERTICAL_TYPE.BOTTOM}
            // className="integration-input-container"
          >
            <StackItem grow>
              <TextField
                autofocus
                label="NR1 Nerdpack Name"
                value={repo.name}
                placeholder={repo.name}
                disabled
                className="text-field"
                // onChange={({ target }) => {
                //   this.setState({ appName: target.value });
                // }}
              />
              {/* <Select onChange={(evt, value) => alert(value)}>
                <SelectItem value="a">Value is "a"</SelectItem>
                <SelectItem value="b">Value is "b"</SelectItem>
                <SelectItem value="c">Value is "c"</SelectItem>
              </Select> */}
              {this.renderRefs()}
              {/* <TextField
                autofocus
                label="Version"
                placeholder="version"
                onChange={({ target }) => {
                  this.setState({ version: target.value });
                }}
              />
              <TextField
                autofocus
                label="Commit SHA"
                placeholder="commit sha"
                onChange={({ target }) => {
                  this.setState({ ref: target.value });
                }}
              /> */}
              {/* <TextField
                autofocus
                label="User"
                placeholder="user"
                onChange={({ target }) => {
                  this.setState({ user: target.value });
                }}
              /> */}
              {/* <Button
                style={{ marginTop: '20px' }}
                onClick={this.triggerWorkflowDispatch}
                // disabled={!userToken || userToken.length !== 40}
                type="primary"
              >
                Trigger Workflow
              </Button> */}

              <Button
                type={Button.TYPE.Secondary}
                onClick={this.props.closeModal}
              >
                Cancel
              </Button>
              <Button
                type={Button.TYPE.PRIMARY}
                onClick={this.triggerWorkflowDispatch}
              >
                Deploy
              </Button>
            </StackItem>
            {/* <StackItem>
              
            </StackItem> */}
          </Stack>
        </form>
      </StackItem>
    );
  }

  render() {
    const { isSetup, userToken, repo } = this.props;
    console.log('deploymentRepo:', repo);
    console.log('State:', this.state);
    // console.log(userToken);
    // const apClient = client(userToken);

    // console.log(`Setup? ${isSetup}`);
    // if (!isSetup) {
    //   return <></>;
    // }

    if (!isSetup) {
      return <></>;
    }

    return (
      // <Grid className="container integration-container">
      //   <GridItem columnSpan={12}>
      //     <Stack
      //       directionType="vertical"
      //       gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
      //       fullWidth
      //     >
      <div className="deploy-modal">
        {userToken && this.renderWorkflowInputForm()}
        {/* </Stack>
        </GridItem>
      </Grid> */}
      </div>
    );
  }
}
