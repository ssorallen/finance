/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import type { Quote, Transaction } from './reducers';
import { currencyFormatter, numberFormatter } from './formatters';
import BootstrapTable from 'react-bootstrap-table-next';
import PortfolioActions from './PortfolioActions';
import { connect } from 'react-redux';
import { deleteTransactions } from './actions';
import paginationFactory from 'react-bootstrap-table2-paginator';

type StateProps = {
  dispatch: Function,
  quotes: { [symbol: string]: Quote },
  transactions: Array<Transaction>,
};

type Props = StateProps;

type State = {
  selectedTransactionIds: Set<number>,
};

const pagination = paginationFactory({
  hideSizePerPage: true, // This seems to use some broken Bootstrap 3 controls.
  sizePerPage: 50,
});

const TABLE_COLUMNS = [
  { dataField: 'companyName', sort: true, text: 'Name' },
  { dataField: 'symbol', sort: true, text: 'Symbol' },
  { dataField: 'type', sort: true, text: 'Type' },
  { dataField: 'date', sort: true, text: 'Date' },
  {
    dataField: 'shares',
    formatter: cell => (cell === 0 ? null : numberFormatter.format(cell)),
    sort: true,
    text: 'Shares',
  },
  {
    dataField: 'price',
    formatter: cell => (cell === 0 ? null : currencyFormatter.format(cell)),
    sort: true,
    text: 'Price',
  },
  {
    dataField: 'commission',
    formatter: cell => (cell === 0 ? null : currencyFormatter.format(cell)),
    sort: true,
    text: 'Commission',
  },
];

class Transactions extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps, prevState) {
    // If any currently selected transactions are not in the next props update, remove them from the
    // internal selected transactions `Set` to stay up-to-date.
    let hasChanges = false;
    const nextTransactions = new Set(nextProps.transactions);
    const nextSelectedTransactionIds = new Set();
    for (const transaction of prevState.selectedTransactionIds) {
      if (nextTransactions.has(transaction)) nextSelectedTransactionIds.add(transaction.id);
      else hasChanges = true;
    }

    if (hasChanges) return { selectedTransactionIds: nextSelectedTransactionIds };
    else return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      // This is *not* treated as immutable. Object identity will not always correctly indicate
      // when changes are made.
      selectedTransactionIds: new Set(),
    };
  }

  handleDeleteSelectedTransactions = () => {
    const transactionsToDelete = this.props.transactions.filter(transaction =>
      this.state.selectedTransactionIds.has(transaction.id)
    );
    this.props.dispatch(deleteTransactions(transactionsToDelete));
  };

  handleToggleAllTransactions = (isSelected: boolean) => {
    if (isSelected) {
      this.setState({
        selectedTransactionIds: new Set(this.props.transactions.map(transaction => transaction.id)),
      });
    } else {
      this.setState({ selectedTransactionIds: new Set() });
    }
  };

  handleToggleTransactionSelected = (transaction: Transaction, isSelected: boolean) => {
    if (isSelected) {
      this.state.selectedTransactionIds.add(transaction.id);
    } else {
      this.state.selectedTransactionIds.delete(transaction.id);
    }
    this.forceUpdate();
  };

  render() {
    const tableData = this.props.transactions.map(transaction => {
      const quote = this.props.quotes[transaction.symbol];
      return {
        ...transaction,
        companyName: quote == null ? '...' : quote.companyName,
      };
    });
    const deleteDisabled =
      this.props.transactions.length === 0 || this.state.selectedTransactionIds.size === 0;
    return (
      <React.Fragment>
        <Row className="mb-3 mt-3">
          <Col>
            <Button
              color={deleteDisabled ? 'secondary' : 'danger'}
              disabled={deleteDisabled}
              onClick={this.handleDeleteSelectedTransactions}
              outline
              size="sm">
              Delete
            </Button>
          </Col>
          <PortfolioActions />
        </Row>
        <Row className="mb-3">
          <Col>
            <BootstrapTable
              bordered={false}
              columns={TABLE_COLUMNS}
              data={tableData}
              defaultSorted={[{ dataField: 'symbol', order: 'asc' }]}
              keyField="id"
              noDataIndication={() => 'No transactions yet. Add one using the form below.'}
              pagination={pagination}
              selectRow={{
                mode: 'checkbox',
                onSelect: this.handleToggleTransactionSelected,
                onSelectAll: this.handleToggleAllTransactions,
                selected: Array.from(this.state.selectedTransactionIds),
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
  transactions: state.transactions,
}))(Transactions);
