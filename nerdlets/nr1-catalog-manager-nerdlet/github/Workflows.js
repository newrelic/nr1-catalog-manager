import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Github from './github-rest-client';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Button, Spinner, Modal } from 'nr1';

import Status from '../constants/Status';

export default class Workflows extends PureComponent {
  static propTypes = {
    userToken: PropTypes.string,
    githubUrl: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      status: Status.LOADING,
      hidden: true
    };
  }

  async componentDidMount() {
    const { userToken, githubUrl } = this.props;

    const github = new Github({ userToken, githubUrl });
    const nr1_catalog_path = `repos/newrelic/nr1-catalog/actions/workflows/generate-catalog-pr.yml/runs`;

    const nr1_catalog_runs = await github.get(nr1_catalog_path);

    // console.log('nr1_catalog_runs', nr1_catalog_runs);

    this.setState({
      status: Status.DATA_FETCHED,
      nr1CatalogWorkflows: nr1_catalog_runs
    });
  }

  fetchWorkflowJobs = async (event, { item }) => {
    this.setState({ hidden: false, status: Status.FETCHING });
    // console.log('item', item);

    const { id: run_id } = item;

    const { userToken, githubUrl } = this.props;
    const github = new Github({ userToken, githubUrl });
    const path = `repos/newrelic/nr1-catalog/actions/runs/${run_id}/jobs`;

    const workflowJobs = await github.get(path);

    // console.log('workflowJobs', workflowJobs);

    this.setState({
      status: Status.DATA_FETCHED,
      workflowJobs: workflowJobs
    });
  };

  _onClose = () => {
    this.setState({ hidden: true });
  };

  urlFormatter(cell) {
    return (
      <a
        href={`https://github.com/newrelic/nr1-catalog/actions/runs/${cell}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {`https://github.com/newrelic/nr1-catalog/actions/runs/${cell}`}
      </a>
    );
  }

  renderWorkflowData() {
    const { workflow_runs: workflowRuns } = this.state.nr1CatalogWorkflows;
    const { hidden, status } = this.state;

    const { SearchBar } = Search;
    const columns = [
      {
        dataField: 'run_number',
        text: 'Run'
      },
      {
        dataField: 'id',
        text: 'Run ID'
      },
      {
        dataField: 'status',
        text: 'Status'
      },
      {
        dataField: 'conclusion',
        text: 'Conclusion'
      },
      {
        dataField: 'workflow_id',
        text: 'Workflow ID'
      },
      {
        dataField: 'created_at',
        text: 'Created At'
      },
      {
        dataField: 'id',
        text: 'Action Run URL',
        formatter: this.urlFormatter
      }
    ];
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        this.fetchWorkflowJobs(e, { item: row, index: rowIndex });
      }
    };

    // console.log('workflows', workflowRuns);
    return (
      <div style={{ overflowX: 'auto' }}>
        <ToolkitProvider
          wrapperClasses="table-responsive"
          keyField="id"
          data={workflowRuns}
          columns={columns}
          search
        >
          {props => (
            <>
              <SearchBar {...props.searchProps} />
              <BootstrapTable {...props.baseProps} rowEvents={rowEvents} />
            </>
          )}
        </ToolkitProvider>
        <Modal hidden={this.state.hidden} onClose={this._onClose}>
          {!hidden && status === Status.DATA_FETCHED && (
            <>
              {/* {console.log(this.state.workflowJobs)} */}

              {this.renderWorkflowJobs()}
              <Button onClick={this._onClose} style={{ marginTop: '10px' }}>
                Close
              </Button>
            </>
          )}
        </Modal>
      </div>
    );
  }

  renderWorkflowJobs() {
    const { jobs } = this.state.workflowJobs;

    const { SearchBar } = Search;
    const columns = [
      {
        dataField: 'name',
        text: 'Job'
      },
      {
        dataField: 'status',
        text: 'Status'
      }
    ];

    return (
      <div style={{ overflowX: 'auto' }}>
        <ToolkitProvider
          wrapperClasses="table-responsive"
          keyField="id"
          data={jobs}
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
      </div>
    );
  }

  render() {
    const { status } = this.state;

    if (status === Status.LOADING) return <Spinner />;

    return <div className="">{this.renderWorkflowData()}</div>;
  }
}
