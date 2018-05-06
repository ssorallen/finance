/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import type { Quote, Transaction } from './reducers';
import { currencyFormatter, numberFormatter, percentFormatter } from './formatters';
import BootstrapTable from 'react-bootstrap-table-next';
import PortfolioActions from './PortfolioActions';
import { connect } from 'react-redux';
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
  if (cell === '...') return '';
  else if (cell >= 0) return 'text-success';
  else return 'text-danger';
}

const TABLE_COLUMNS = [
  { dataField: 'companyName', sort: true, text: 'Name' },
  { dataField: 'symbol', sort: true, text: 'Symbol' },
  {
    dataField: 'latestPrice',
    formatter: cell => (cell === '...' ? cell : currencyFormatter.format(cell)),
    sort: true,
    text: 'Last Price',
  },
  {
    classes(cell) {
      return classes(cell.change);
    },
    dataField: 'change',
    formatter: cell =>
      cell.change === '...'
        ? cell.change
        : `${cell.change >= 0 ? '+' : ''}${currencyFormatter.format(cell.change)} (${
            cell.changePercent >= 0 ? '+' : ''
          }${percentFormatter.format(cell.changePercent)})`,
    sort: true,
    sortFunc(a, b, order) {
      const asc = order === 'asc';
      if (a.change === '...' && b.change === '...') return 0;
      else if (a.change === '...') return asc ? -1 : 1;
      else if (b.change === '...') return asc ? 1 : -1;
      else if (asc) return a.change - b.change;
      else return b.change - a.change;
    },
    text: 'Change',
  },
  {
    dataField: 'shares',
    formatter: cell => (cell === 0 ? '...' : numberFormatter.format(cell)),
    sort: true,
    text: 'Shares',
  },
  {
    dataField: 'costBasis',
    formatter: cell => (cell === '...' ? cell : currencyFormatter.format(cell)),
    sort: true,
    text: 'Cost Basis',
  },
  {
    dataField: 'marketValue',
    formatter: cell => (cell === '...' ? cell : currencyFormatter.format(cell)),
    sort: true,
    text: 'Mkt Value',
  },
  {
    classes,
    dataField: 'gain',
    formatter: cell =>
      cell === '...' ? cell : `${cell >= 0 ? '+' : ''}${currencyFormatter.format(cell)}`,
    sort: true,
    text: 'Gain',
  },
  {
    classes,
    dataField: 'gainPercent',
    formatter: cell =>
      cell === '...' ? cell : `${cell >= 0 ? '+' : ''}${percentFormatter.format(cell)}`,
    sort: true,
    text: 'Gain %',
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
      selectedSymbols: new Set(),
    };
  }

  handleDeleteSelectedSymbols = () => {
    const symbolsToDelete = this.props.symbols.filter(symbol =>
      this.state.selectedSymbols.has(symbol)
    );
    this.props.dispatch(deleteSymbols(symbolsToDelete));
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
          change: quote == null ? '...' : quote.change,
          changePercent: quote == null ? '...' : quote.changePercent,
        },
        companyName: quote == null ? '...' : quote.companyName,
        costBasis: showReturns ? costBasis : '...',
        gain: showReturns ? gain : '...',
        gainPercent: showReturns ? gainPercent : '...',
        latestPrice: quote == null ? '...' : quote.latestPrice,
        marketValue: showReturns ? marketValue : '...',
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
        <Row>
          <Col>
            <BootstrapTable
              bordered={false}
              columns={TABLE_COLUMNS}
              data={tableData}
              defaultSorted={[{ dataField: 'symbol', order: 'asc' }]}
              keyField="symbol"
              noDataIndication={() => 'No symbols yet. Add one using the form below.'}
              selectRow={{
                mode: 'checkbox',
                onSelect: this.handleToggleSymbolSelected,
                onSelectAll: this.handleToggleAllSymbols,
                selected: Array.from(this.state.selectedSymbols),
              }}
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
