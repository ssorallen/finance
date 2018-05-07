/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import type { Quote, Transaction } from './reducers';
import { currencyFormatter, numberFormatter, percentFormatter } from './formatters';
import PortfolioActions from './PortfolioActions';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import cx from 'classnames';
import { deleteSymbols } from './actions';

type StateProps = {
  dispatch: Function,
  quotes: { [symbol: string]: Quote },
  symbols: Array<string>,
  transactions: Array<Transaction>,
};

type Props = StateProps;

type State = {
  selectedSymbols: Set<string>,
};

function classes(cell) {
  return cx('text-right', {
    'text-danger': cell != null && cell < 0,
    'text-success': cell != null && cell >= 0,
  });
}

const TABLE_COLUMNS = [
  { accessor: 'companyName', Header: 'Name', headerClassName: 'text-left' },
  { accessor: 'symbol', Header: 'Symbol', headerClassName: 'text-left' },
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
    accessor: 'shares',
    Cell: props => (
      <div className="text-right">
        {props.value === 0 ? '...' : numberFormatter.format(props.value)}
      </div>
    ),
    Header: 'Shares',
    headerClassName: 'text-right',
  },
  {
    accessor: 'costBasis',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : currencyFormatter.format(props.value)}
      </div>
    ),
    Header: 'Cost Basis',
    headerClassName: 'text-right',
  },
  {
    accessor: 'marketValue',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : currencyFormatter.format(props.value)}
      </div>
    ),
    Header: 'Mkt Value',
    headerClassName: 'text-right',
  },
  {
    accessor: 'gain',
    Cell: props => (
      <div className={classes(props.value)}>
        {props.value == null
          ? '...'
          : `${props.value >= 0 ? '+' : ''}${currencyFormatter.format(props.value)}`}
      </div>
    ),
    Header: 'Gain',
    headerClassName: 'text-right',
  },
  {
    accessor: 'gainPercent',
    Cell: props => (
      <div className={classes(props.value)}>
        {props.value == null
          ? '...'
          : `${props.value >= 0 ? '+' : ''}${percentFormatter.format(props.value)}`}
      </div>
    ),
    Header: 'Gain %',
    headerClassName: 'text-right',
  },
];

class Performance extends React.Component<Props, State> {
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

  handleToggleAllSymbols = (isSelected: boolean) => {
    if (isSelected) {
      this.setState({
        selectedSymbols: new Set(this.props.symbols),
      });
    } else {
      this.setState({ selectedSymbols: new Set() });
    }
  };

  handleToggleSymbolSelected = (performanceRow: Object, isSelected: boolean) => {
    if (isSelected) {
      this.state.selectedSymbols.add(performanceRow.symbol);
    } else {
      this.state.selectedSymbols.delete(performanceRow.symbol);
    }
    this.forceUpdate();
  };

  render() {
    const tableData = this.props.symbols.map(symbol => {
      const quote = this.props.quotes[symbol];
      const transactions = this.props.transactions.filter(
        transaction => transaction.symbol === symbol
      );

      let costBasis = 0;
      let marketValue = 0;
      let shares = 0;
      transactions.forEach(transaction => {
        // Only summing 'Buy' transactions.
        if (transaction.type !== 'Buy') return;

        costBasis += transaction.price * transaction.shares;
        costBasis += transaction.commission;
        shares += transaction.shares;
        if (quote != null) marketValue += quote.latestPrice * transaction.shares;
      });

      const gain = marketValue - costBasis;
      let gainPercent = 0;
      if (quote != null) gainPercent = gain / costBasis;

      // Show returns only if the user owns shares and the quote has been returned from the API call.
      // Showing any earlier will look like some erroneous and funky data.
      const showReturns = shares > 0 && quote != null;
      return {
        change: {
          change: quote == null ? null : quote.change,
          changePercent: quote == null ? null : quote.changePercent,
        },
        companyName: quote == null ? null : quote.companyName,
        costBasis: showReturns ? costBasis : null,
        gain: showReturns ? gain : null,
        gainPercent: showReturns ? gainPercent : null,
        latestPrice: quote == null ? null : quote.latestPrice,
        marketValue: showReturns ? marketValue : null,
        shares,
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
            <ReactTable
              columns={TABLE_COLUMNS}
              data={tableData}
              defaultSorted={[{ desc: false, id: 'symbol' }]}
              getPaginationProps={() => ({
                className: 'pt-2',
                NextComponent: props => <Button className="btn-sm" outline {...props} />,
                PreviousComponent: props => <Button className="btn-sm" outline {...props} />,
                showPageJump: false,
              })}
              noDataText="No symbols yet. Add one using the form below."
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  quotes: state.quotes,
  symbols: state.symbols,
  transactions: state.transactions,
}))(Performance);
