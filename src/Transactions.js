/* @flow */

import * as React from 'react';
import { Col, Row } from 'reactstrap';
import type { Transaction } from './reducers';
import TransactionRow from './TransactionRow';
import { connect } from 'react-redux';

type StateProps = {
  symbols: Array<string>,
  transactions: Array<Transaction>,
};

type Props = StateProps;

class Transactions extends React.Component<Props> {
  render() {
    const transactionsBySymbol = {};
    this.props.transactions.forEach(transaction => {
      if (transactionsBySymbol[transaction.symbol] == null) {
        transactionsBySymbol[transaction.symbol] = [];
      }
      transactionsBySymbol[transaction.symbol].push(transaction);
    });

    return (
      <Row>
        <Col>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 1 }}>
                  <input type="checkbox" />
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
                this.props.symbols.map(symbol => (
                  <React.Fragment key={symbol}>
                    {transactionsBySymbol[symbol].map((transaction, i) => (
                      <TransactionRow key={i} transaction={transaction} />
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </Col>
      </Row>
    );
  }
}

export default connect(state => ({
  symbols: state.symbols,
  transactions: state.transactions,
}))(Transactions);
