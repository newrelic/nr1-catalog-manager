import React, { PureComponent } from 'react';
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
  Toast,
  Spinner,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from 'nr1';
import get from 'lodash.get';

import Status from '../constants/Status';

export default class Workflows extends PureComponent {
  static propTypes = {
    userToken: PropTypes.string,
    githubUrl: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      status: Status.LOADING
    };
  }

  async componentDidMount() {
    const { userToken, githubUrl } = this.props;

    const github = new Github({ userToken, githubUrl });

    // const repo_path = `repos/newrelic/${appName}/actions/workflows/catalog.yml/dispatches`;s
    const nr1_catalog_path = `repos/newrelic/nr1-catalog/actions/workflows/generate-catalog-pr.yml/runs`;

    const nr1_catalog_runs = await github.get(nr1_catalog_path);

    console.log('nr1_catalog_runs', nr1_catalog_runs);

    // Toast.showToast({
    //   title: 'Deploy Initiated',
    //   description:
    //     'GitHub Workflows initiated. Refresh Workflow tab to view progress.',
    //   // actions: [{
    //   //   label: 'Say hi!',
    //   //   onClick: () => console.log('Hello World!'),
    //   // }],
    //   type: Toast.TYPE.NORMAL
    // });

    this.setState({
      status: Status.DATA_FETCHED,
      nr1CatalogWorkflows: nr1_catalog_runs,
      column_0: TableHeaderCell.SORTING_TYPE.ASCENDING
    });
  }

  // async triggerWorkflowDispatch(event) {
  //   event.preventDefault();
  //   // console.log(
  //   //   this.state.githubUrl,
  //   //   this.state.userToken,
  //   //   this.props.githubUrl,
  //   //   this.props.userToken,
  //   //   this.state.appName,
  //   //   this.state.version,
  //   //   this.state.ref,
  //   //   this.state.user
  //   // );
  //   const { userToken, githubUrl, repo } = this.props;
  //   const { appName, version, ref, user } = this.state;
  //   console.log('DISPATCH:', this.state);
  //   const github = new Github({ userToken, githubUrl });
  //   // const path = `repos/jbeveland27/prototype-nr1-actions/actions/workflows/catalog.yml/dispatches`;
  //   const path = `repos/newrelic/${appName}/actions/workflows/catalog.yml/dispatches`;

  //   await github.post(path, {
  //     ref: 'main',
  //     inputs: { appName, version, ref, user }
  //   });

  //   Toast.showToast({
  //     title: 'Deploy Initiated',
  //     description:
  //       'GitHub Workflows initiated. Refresh Workflow tab to view progress.',
  //     // actions: [{
  //     //   label: 'Say hi!',
  //     //   onClick: () => console.log('Hello World!'),
  //     // }],
  //     type: Toast.TYPE.NORMAL
  //   });
  //   this.props.closeModal();
  // }

  _onClickTableHeaderCell(key, event, sortingData) {
    this.setState({ [key]: sortingData.nextSortingType });
  }

  renderWorkflowData() {
    const { workflow_runs: workflowRuns } = this.state.nr1CatalogWorkflows;

    console.log('workflows', workflowRuns);
    return (
      <div style={{ overflowX: 'auto' }}>
        <Table
          items={workflowRuns}
          // selected={({ item }) => item.selected}
          onSelect={(evt, { item }) => (item.selected = evt.target.checked)}
        >
          <TableHeader>
            <TableHeaderCell
              value={({ item }) => item.status}
              sortable
              sortingType={this.state.column_0}
              sortingOrder={1}
              onClick={this._onClickTableHeaderCell.bind(this, 'column_0')}
            >
              Status
            </TableHeaderCell>
            <TableHeaderCell
              value={({ item }) => item.workflow_id}
              sortable
              sortingType={this.state.column_1}
              sortingOrder={2}
              onClick={this._onClickTableHeaderCell.bind(this, 'column_1')}
            >
              Workflow ID
            </TableHeaderCell>
            <TableHeaderCell
              value={({ item }) => item.created_at}
              sortable
              sortingType={this.state.column_2}
              sortingOrder={3}
              onClick={this._onClickTableHeaderCell.bind(this, 'column_2')}
            >
              Created At
            </TableHeaderCell>
            <TableHeaderCell
              value={({ item }) => item.created_at}
              sortable
              sortingType={this.state.column_2}
              sortingOrder={3}
              onClick={this._onClickTableHeaderCell.bind(this, 'column_3')}
            >
              Action Run
            </TableHeaderCell>
          </TableHeader>

          {({ item }) => (
            <TableRow>
              <TableRowCell>{item.status}</TableRowCell>
              <TableRowCell>{item.workflow_id}</TableRowCell>
              <TableRowCell>{item.created_at}</TableRowCell>
              <TableRowCell>
                <a
                  href={`https://github.com/newrelic/nr1-catalog/actions/runs/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`https://github.com/newrelic/nr1-catalog/actions/runs/${item.id}`}
                </a>
              </TableRowCell>
            </TableRow>
          )}
        </Table>
      </div>
    );
  }

  render() {
    const { status } = this.state;

    if (status === Status.LOADING) return <Spinner />;

    return (
      <div className="">
        {status === Status.DATA_FETCHED && this.renderWorkflowData()}
      </div>
    );
  }
}
