/* @flow */

import * as React from 'react';
import type { Quote, Transaction } from './reducers';
import { connect } from 'react-redux';
import { currencyFormatter, numberFormatter } from './formatters';

type OwnProps = {
  onToggleSelected: (transaction: Transaction) => void,
  selected: boolean,
  transaction: Transaction,
};

type StateProps = {
  quote: ?Quote,
};

type Props = OwnProps & StateProps;

class OverviewRow extends React.Component<Props> {
  handleChangeIsSelected = () => {
    this.props.onToggleSelected(this.props.transaction);
  };

  render() {
    const { quote, transaction } = this.props;
    return (
      <tr>
        <td style={{ width: 1 }}>
          <input
            checked={this.props.selected}
            onChange={this.handleChangeIsSelected}
            type="checkbox"
          />
        </td>
        <td>{quote == null ? '...' : quote.companyName}</td>
        <td>{transaction.symbol}</td>
        <td>{transaction.type}</td>
        <td>{transaction.date}</td>
        <td>{numberFormatter.format(transaction.shares)}</td>
        <td>{currencyFormatter.format(transaction.price)}</td>
        <td>{currencyFormatter.format(transaction.commission)}</td>
      </tr>
    );
  }
}

export default connect((state, ownProps: OwnProps) => ({
  quote: state.quotes[ownProps.transaction.symbol],
}))(OverviewRow);
