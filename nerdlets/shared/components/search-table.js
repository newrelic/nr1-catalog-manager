import React from 'react';
import PropTypes from 'prop-types';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

export default class SearchTable extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array
  };

  render() {
    const { data, columns } = this.props;
    const { SearchBar } = Search;

    return (
      <>
        {data.length > 0 ? (
          <ToolkitProvider
            wrapperClasses="table-responsive"
            keyField="id"
            data={data}
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
          <table>
            <tr style={{ backgroundColor: 'fff' }}>
              <td colSpan="6">No data to display</td>
            </tr>
          </table>
        )}
      </>
    );
  }
}
