/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import { currencyFormatter, percentFormatter } from './formatters';
import BootstrapTable from 'react-bootstrap-table-next';
import PortfolioActions from './PortfolioActions';
import type { Quote } from './reducers';
import { connect } from 'react-redux';
import { deleteSymbols } from './actions';
import paginationFactory from 'react-bootstrap-table2-paginator';

type StateProps = {
  dispatch: Function,
  quotes: { [symbol: string]: Quote },
  symbols: Array<string>,
};

type Props = StateProps;

type State = {
  selectedSymbols: Set<string>,
};

const pagination = paginationFactory({
  hideSizePerPage: true, // This seems to use some broken Bootstrap 3 controls.
  sizePerPage: 50,
});

const bigNumberFormatter = new window.Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const POWER_SUFFIXES = ['', 'K', 'M', 'B', 'T'];
function abbreviateNumber(num: number, fixed) {
  if (num === null) return null; // terminate early
  if (num === 0) return '0'; // terminate early

  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  const b = num.toPrecision(2).split('e'); // get power
  const k = b.length === 1 ? 0 : Math.floor(Math.min(parseInt(b[1].slice(1), 10), 14) / 3); // floor at decimals, ceiling at trillions
  const d = k < 0 ? k : Math.abs(k); // enforce -0 is 0
  const c = d < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed); // divide by power
  return `${bigNumberFormatter.format(c)}${POWER_SUFFIXES[k]}`; // append power
}

function classes(cell) {
  if (cell == null) return '';
  else if (cell >= 0) return 'text-success';
  else return 'text-danger';
}

const TABLE_COLUMNS = [
  { dataField: 'companyName', sort: true, text: 'Name' },
  { dataField: 'symbol', sort: true, text: 'Symbol' },
  {
    align: 'right',
    dataField: 'latestPrice',
    formatter: cell => (cell == null ? '...' : currencyFormatter.format(cell)),
    headerAlign: 'right',
    sort: true,
    text: 'Last Price',
  },
  {
    align: 'right',
    classes(cell) {
      return classes(cell.change);
    },
    dataField: 'change',
    formatter: cell =>
      cell.change === null
        ? '...'
        : `${cell.change >= 0 ? '+' : ''}${currencyFormatter.format(cell.change)} (${
            cell.changePercent >= 0 ? '+' : ''
          }${percentFormatter.format(cell.changePercent)})`,
    headerAlign: 'right',
    sort: true,
    sortFunc(a, b, order) {
      const asc = order === 'asc';
      if (a.change == null && b.change == null) return 0;
      else if (a.change == null) return asc ? -1 : 1;
      else if (b.change == null) return asc ? 1 : -1;
      else if (asc) return a.change - b.change;
      else return b.change - a.change;
    },
    text: 'Change',
  },
  {
    align: 'right',
    dataField: 'marketCap',
    formatter: cell => (cell == null ? '...' : abbreviateNumber(cell)),
    headerAlign: 'right',
    sort: true,
    text: 'Mkt. Cap',
  },
  {
    align: 'right',
    dataField: 'open',
    formatter: cell => (cell == null ? '...' : currencyFormatter.format(cell)),
    headerAlign: 'right',
    sort: true,
    text: 'Open',
  },
  {
    align: 'right',
    dataField: 'close',
    formatter: cell => (cell == null ? '...' : currencyFormatter.format(cell)),
    headerAlign: 'right',
    sort: true,
    text: 'Close',
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

  handleToggleSymbolSelected = (overviewRow: Object, isSelected: boolean) => {
    if (isSelected) {
      this.state.selectedSymbols.add(overviewRow.symbol);
    } else {
      this.state.selectedSymbols.delete(overviewRow.symbol);
    }
    this.forceUpdate();
  };

  render() {
    const tableData = this.props.symbols.map(symbol => {
      const quote = this.props.quotes[symbol];
      return {
        change: {
          change: quote == null ? null : quote.change,
          changePercent: quote == null ? null : quote.changePercent,
        },
        close: quote == null ? null : quote.close,
        companyName: quote == null ? null : quote.companyName,
        latestPrice: quote == null ? null : quote.latestPrice,
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
        <Row>
          <Col>
            <BootstrapTable
              bordered={false}
              classes="table-sm"
              columns={TABLE_COLUMNS}
              data={tableData}
              defaultSorted={[{ dataField: 'symbol', order: 'asc' }]}
              keyField="symbol"
              noDataIndication={() => 'No symbols yet. Add one using the form below.'}
              pagination={pagination}
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
}))(Performance);
