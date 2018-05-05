/* @flow */

import * as React from 'react';
import type { Quote, Transaction } from './reducers';
import QuoteChange from './QuoteChange';
import { connect } from 'react-redux';
import cx from 'classnames';
import formatNumber from 'format-number';

type OwnProps = {
  transaction: Transaction,
};

type StateProps = {
  quote: ?Quote,
};

type Props = OwnProps & StateProps;

class OverviewRow extends React.Component<Props> {
  render() {
    const formatter = formatNumber({ padRight: 2, round: 2 });
    const { quote, transaction } = this.props;
    return (
      <tr>
        <td style={{ width: 1 }}><input type="checkbox" /></td>
        <td>{quote == null ? '...' : quote.companyName}</td>
        <td>{transaction.symbol}</td>
        <td>{transaction.type}</td>
        <td>{transaction.date}</td>
        <td>{transaction.shares}</td>
        <td>{formatter(transaction.price)}</td>
        <td>{formatter(transaction.commission)}</td>
      </tr>
    );
  }
}

export default connect((state, ownProps: OwnProps) => ({
  quote: state.quotes[ownProps.transaction.symbol],
}))(OverviewRow);
