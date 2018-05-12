/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import type { AppSettings, Dispatch, Quote, Transaction } from './types';
import { abbreviatedNumberFormatter, currencyFormatter, percentFormatter } from './formatters';
import { changePageSize, deleteSymbols } from './actions';
import { Link } from 'react-router-dom';
import PortfolioActions from './PortfolioActions';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import cx from 'classnames';
import selectTableHOC from 'react-table/lib/hoc/selectTable';

type StateProps = {
  appSettings: AppSettings,
  dispatch: Dispatch,
  quotes: { [symbol: string]: Quote },
  symbols: Array<string>,
  transactions: Array<Transaction>,
};

type Props = StateProps;

type State = {
  selectedSymbols: Set<string>,
};

const SelectReactTable = selectTableHOC(ReactTable);

function classes(cell) {
  return cx('text-right', {
    'text-danger': cell != null && cell < 0,
    'text-success': cell != null && cell >= 0,
  });
}

const TABLE_COLUMNS = [
  {
    accessor: 'companyName',
    Cell: props => (props.value == null ? '...' : props.value),
    Footer: <strong>Portfolio value:</strong>,
    Header: 'Name',
    headerClassName: 'text-left',
  },
  {
    accessor: 'symbol',
    Cell: props => <Link to={`/stocks/${props.value}`}>{props.value}</Link>,
    Header: 'Symbol',
    headerClassName: 'text-left',
  },
  {
    accessor: 'latestPrice',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : currencyFormatter.format(props.value)}
      </div>
    ),
    Header: 'Last Price',
    headerClassName: 'text-right',
  },
  {
    accessor: 'change.change',
    Cell: props => {
      const cell = props.original.change;
      return (
        <div className={classes(props.value)}>
          {cell.change == null
            ? '...'
            : `${cell.change >= 0 ? '+' : ''}${currencyFormatter.format(cell.change)} (${
                cell.changePercent >= 0 ? '+' : ''
              }${percentFormatter.format(cell.changePercent)})`}
        </div>
      );
    },
    Header: 'Change',
    headerClassName: 'text-right',
  },
  {
    accessor: 'marketCap',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : abbreviatedNumberFormatter.format(props.value)}
      </div>
    ),
    Header: 'Mkt. Cap',
    headerClassName: 'text-right',
  },
  {
    accessor: 'latestVolume',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : abbreviatedNumberFormatter.format(props.value)}
      </div>
    ),
    Header: 'Volume',
    headerClassName: 'text-right',
  },
  {
    accessor: 'open',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : currencyFormatter.format(props.value)}
      </div>
    ),
    Header: 'Open',
    headerClassName: 'text-right',
  },
  {
    accessor: 'high',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : currencyFormatter.format(props.value)}
      </div>
    ),
    Header: 'High',
    headerClassName: 'text-right',
  },
  {
    accessor: 'low',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : currencyFormatter.format(props.value)}
      </div>
    ),
    Header: 'Low',
    headerClassName: 'text-right',
  },
  {
    accessor: 'daysGain',
    Cell: props => (
      <div className={classes(props.value)}>
        {props.value == null
          ? '...'
          : `${props.value >= 0 ? '+' : ''}${currencyFormatter.format(props.value)}`}
      </div>
    ),
    Footer: props => {
      const totalDaysGain = props.data.reduce((total, current) => total + current.daysGain, 0);
      return (
        <div className={classes(totalDaysGain)}>
          {totalDaysGain >= 0 ? '+' : ''}
          {currencyFormatter.format(totalDaysGain)}
        </div>
      );
    },
    Header: "Day's gain",
    headerClassName: 'text-right',
  },
];

class Overview extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // If any currently selected symbols are not in the next props update, remove them from the
    // internal selected symbols `Set` to stay up-to-date.
    let hasChanges = false;
    const nextSymbols = new Set(nextProps.symbols);
    const nextSelectedSymbols = new Set();
    for (const symbol of prevState.selectedSymbols) {
      if (nextSymbols.has(symbol)) nextSelectedSymbols.add(symbol);
      else hasChanges = true;
    }

    if (hasChanges) return { selectedSymbols: nextSelectedSymbols };
    else return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      // This is *not* treated as immutable. Object identity will not always correctly indicate
      // when changes are made.
      selectedSymbols: new Set(),
    };
  }

  handleDeleteSelectedSymbols = () => {
    this.props.dispatch(deleteSymbols(Array.from(this.state.selectedSymbols)));
  };

  handlePageSizeChange = (nextPageSize: number) => {
    this.props.dispatch(changePageSize(nextPageSize));
  };

  handleToggleAllSymbols = (isSelected: boolean) => {
    if (this.isAllSymbolsSelected()) {
      this.setState({ selectedSymbols: new Set() });
    } else {
      this.setState({
        selectedSymbols: new Set(this.props.symbols),
      });
    }
  };

  handleToggleSymbolSelected = (symbol: string) => {
    if (this.isSymbolSelected(symbol)) {
      this.state.selectedSymbols.delete(symbol);
    } else {
      this.state.selectedSymbols.add(symbol);
    }
    this.forceUpdate();
  };

  isAllSymbolsSelected = () => {
    return this.state.selectedSymbols.size === this.props.symbols.length;
  };

  isSymbolSelected = (symbol: string) => {
    return this.state.selectedSymbols.has(symbol);
  };

  render() {
    const tableData = this.props.symbols.map(symbol => {
      const quote = this.props.quotes[symbol];
      const transactions = this.props.transactions.filter(
        transaction => transaction.symbol === symbol
      );
      const totalShares = transactions.reduce((prev, curr) => prev + curr.shares, 0);

      return {
        change: {
          change: quote == null ? null : quote.change,
          changePercent: quote == null ? null : quote.changePercent,
        },
        companyName: quote == null ? null : quote.companyName,
        daysGain: quote == null || totalShares === 0 ? null : quote.change * totalShares,
        high: quote == null ? null : quote.high,
        latestPrice: quote == null ? null : quote.latestPrice,
        latestVolume: quote == null ? null : quote.latestVolume,
        low: quote == null ? null : quote.low,
        marketCap: quote == null ? null : quote.marketCap,
        open: quote == null ? null : quote.open,
        symbol,
      };
    });

    const deleteDisabled = this.props.symbols.length === 0 || this.state.selectedSymbols.size === 0;
    return (
      <React.Fragment>
        <Row className="mb-3 mt-3">
          <Col>
            <Button
              color={deleteDisabled ? 'secondary' : 'danger'}
              disabled={deleteDisabled}
              onClick={this.handleDeleteSelectedSymbols}
              outline
              size="sm">
              Delete
            </Button>
          </Col>
          <PortfolioActions />
        </Row>
        <Row className="mb-4">
          <Col>
            <SelectReactTable
              columns={TABLE_COLUMNS}
              data={tableData}
              defaultSorted={[{ desc: false, id: 'symbol' }]}
              getPaginationProps={() => ({
                className: 'pt-2',
                NextComponent: props => <Button className="btn-sm" outline {...props} />,
                PreviousComponent: props => <Button className="btn-sm" outline {...props} />,
                showPageJump: false,
              })}
              isSelected={this.isSymbolSelected}
              keyField="symbol"
              noDataText="No symbols yet. Add one using the form below."
              onPageSizeChange={this.handlePageSizeChange}
              pageSize={this.props.appSettings.pageSize}
              selectAll={this.isAllSymbolsSelected()}
              selectType="checkbox"
              toggleAll={this.handleToggleAllSymbols}
              toggleSelection={this.handleToggleSymbolSelected}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  appSettings: state.appSettings,
  quotes: state.quotes,
  symbols: state.symbols,
  transactions: state.transactions,
}))(Overview);
