/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import type { Quote, Transaction } from './reducers';
import { currencyFormatter, numberFormatter } from './formatters';
import PortfolioActions from './PortfolioActions';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { deleteTransactions } from './actions';
import selectTableHOC from 'react-table/lib/hoc/selectTable';

type StateProps = {
  dispatch: Function,
  quotes: { [symbol: string]: Quote },
  transactions: Array<Transaction>,
};

type Props = StateProps;

type State = {
  selectedTransactionIds: Set<number>,
};

const SelectReactTable = selectTableHOC(ReactTable);

const TABLE_COLUMNS = [
  { accessor: 'companyName', Header: 'Name', headerClassName: 'text-left' },
  { accessor: 'symbol', Header: 'Symbol', headerClassName: 'text-left' },
  { accessor: 'type', Header: 'Type', headerClassName: 'text-left' },
  {
    accessor: 'shares',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : numberFormatter.format(props.value)}
      </div>
    ),
    Header: 'Shares',
    headerClassName: 'text-right',
  },
  {
    accessor: 'price',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : currencyFormatter.format(props.value)}
      </div>
    ),
    Header: 'Price',
    headerClassName: 'text-right',
  },
  {
    accessor: 'commission',
    Cell: props => (
      <div className="text-right">
        {props.value == null ? '...' : currencyFormatter.format(props.value)}
      </div>
    ),
    Header: 'Commission',
    headerClassName: 'text-right',
  },
];

class Transactions extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // If any currently selected transactions are not in the next props update, remove them from the
    // internal selected transactions `Set` to stay up-to-date.
    let hasChanges = false;
    const nextTransactions = new Set(nextProps.transactions);
    const nextSelectedTransactionIds = new Set();
    for (const transactionId of prevState.selectedTransactionIds) {
      if (nextTransactions.has(transactionId)) nextSelectedTransactionIds.add(transactionId);
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

  handleToggleAllTransactionIds = (isSelected: boolean) => {
    if (this.isAllTransactionIdsSelected()) {
      this.setState({ selectedTransactionIds: new Set() });
    } else {
      this.setState({
        selectedTransactionIds: new Set(this.props.transactions.map(transaction => transaction.id)),
      });
    }
  };

  handleToggleTransactionIdSelected = (transactionId: number) => {
    if (this.isTransactionIdSelected(transactionId)) {
      this.state.selectedTransactionIds.delete(transactionId);
    } else {
      this.state.selectedTransactionIds.add(transactionId);
    }
    this.forceUpdate();
  };

  isAllTransactionIdsSelected = () => {
    return this.state.selectedTransactionIds.size === this.props.transactions.length;
  };

  isTransactionIdSelected = (transactionId: number) => {
    return this.state.selectedTransactionIds.has(transactionId);
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
              isSelected={this.isTransactionIdSelected}
              keyField="id"
              noDataText="No transactions yet. Add one using the form below."
              selectAll={this.isAllTransactionIdsSelected()}
              selectType="checkbox"
              toggleAll={this.handleToggleAllTransactionIds}
              toggleSelection={this.handleToggleTransactionIdSelected}
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
