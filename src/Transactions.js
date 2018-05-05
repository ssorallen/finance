/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import type { Transaction } from './reducers';
import TransactionRow from './TransactionRow';
import { connect } from 'react-redux';
import { deleteTransactions } from './actions';

type StateProps = {
  dispatch: Function,
  transactions: Array<Transaction>,
};

type Props = StateProps;

type State = {
  selectedTransactions: Set<Transaction>,
};

class Transactions extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      // This is *not* treated as immutable. Object identity will not always correctly indicate
      // when changes are made.
      selectedTransactions: new Set(),
    };
  }

  handleDeleteSelectedTransactions = () => {
    this.props.dispatch(deleteTransactions(Array.from(this.state.selectedTransactions)));
    this.setState({ selectedTransactions: new Set() });
  };

  handleToggleAllTransactions = () => {
    if (this.state.selectedTransactions.size < this.props.transactions.length) {
      this.setState({ selectedTransactions: new Set(this.props.transactions) });
    } else {
      this.setState({ selectedTransactions: new Set() });
    }
  };

  handleToggleTransactionSelected = (transaction: Transaction) => {
    if (this.state.selectedTransactions.has(transaction)) {
      this.state.selectedTransactions.delete(transaction);
      this.forceUpdate();
    } else {
      this.state.selectedTransactions.add(transaction);
      this.forceUpdate();
    }
  };

  render() {
    let allTransactionsSelected = this.props.transactions.length > 0;
    const transactionsBySymbol = {};
    this.props.transactions.forEach(transaction => {
      if (transactionsBySymbol[transaction.symbol] == null) {
        transactionsBySymbol[transaction.symbol] = [];
      }
      transactionsBySymbol[transaction.symbol].push(transaction);
      allTransactionsSelected =
        allTransactionsSelected && this.state.selectedTransactions.has(transaction);
    });

    const deleteDisabled =
      this.props.transactions.length === 0 || this.state.selectedTransactions.size === 0;
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
        </Row>
        <Row>
          <Col>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 1 }}>
                    <input
                      checked={allTransactionsSelected}
                      disabled={this.props.transactions.length === 0}
                      onChange={this.handleToggleAllTransactions}
                      type="checkbox"
                    />
                  </th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Shares</th>
                  <th>Price</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {this.props.transactions.length === 0 ? (
                  <tr>
                    <td className="text-center" colSpan="8">
                      No transactions yet. Add one using the form below.
                    </td>
                  </tr>
                ) : (
                  Object.keys(transactionsBySymbol).map(symbol => {
                    const symbolTransactions = transactionsBySymbol[symbol];
                    return symbolTransactions == null ? null : (
                      <React.Fragment key={symbol}>
                        {symbolTransactions.map((transaction, i) => (
                          <TransactionRow
                            key={i}
                            onToggleSelected={this.handleToggleTransactionSelected}
                            selected={this.state.selectedTransactions.has(transaction)}
                            transaction={transaction}
                          />
                        ))}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  transactions: state.transactions,
}))(Transactions);
