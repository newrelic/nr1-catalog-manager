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
  SelectItem
} from 'nr1';
import get from 'lodash.get';

export default class Deploy extends React.Component {
  static propTypes = {
    githubUrl: PropTypes.string,
    userToken: PropTypes.string,
    isSetup: PropTypes.bool,
    repo: PropTypes.object,
    user: PropTypes.string
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
  }

  renderRefs() {
    const { repo } = this.props;
    const refs = get(repo, 'refs.nodes');
    return (
      <>
        <label
          style={{ marginTop: '10px' }}
          className="AACLAC-wnd-TextField-label"
        >
          Version
        </label>
        <Select
          onChange={(event, value) => {
            const ref = repo.refs.nodes.find(r => r.name === value);
            this.setState({ ref: ref.target.oid, version: value });
          }}
          value={this.state.version}
        >
          {refs.map((node, i) => {
            return (
              <SelectItem key={i} value={node.name}>
                {node.name}
              </SelectItem>
            );
          })}
        </Select>
      </>
    );
  }

  renderWorkflowInputForm() {
    // const { userToken } = this.state;
    // const { setUserToken } = this.props;
    // const GHURL = this._getGithubUrl();
    const { repo } = this.props;
    return (
      <StackItem grow style={{ width: '100%' }}>
        <h2>Trigger Workflow Dispatch</h2>
        <p>Select version to deploy to catalog.</p>
        <form onSubmit={this.triggerWorkflowDispatch}>
          <Stack
            fullWidth
            verticalType={Stack.VERTICAL_TYPE.BOTTOM}
            className="integration-input-container"
          >
            <StackItem grow>
              <TextField
                autofocus
                label="NR1 Nerdpack Name"
                placeholder={repo.name}
                readOnly
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
              <Button
                style={{ marginTop: '20px' }}
                onClick={this.triggerWorkflowDispatch}
                // disabled={!userToken || userToken.length !== 40}
                type="primary"
              >
                Trigger Workflow
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
      <Grid className="container integration-container">
        <GridItem columnSpan={12}>
          <Stack
            directionType="vertical"
            gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
            fullWidth
          >
            {userToken && this.renderWorkflowInputForm()}
          </Stack>
        </GridItem>
        {/* <GridItem columnSpan={4}>
          <img
            width="200px"
            height="166px"
            src="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
          />
        </GridItem> */}
      </Grid>
    );
  }
}
