/* @flow */

import * as React from 'react';
import type { Quote, Transaction } from './reducers';
import QuoteChange from './QuoteChange';
import { connect } from 'react-redux';
import cx from 'classnames';
import formatNumber from 'format-number';

type OwnProps = {
  symbol: string,
};

type StateProps = {
  quote: ?Quote,
  transactions: Array<Transaction>,
};

type Props = OwnProps & StateProps;

class PerformanceRow extends React.Component<Props> {
  render() {
    const { quote, transactions } = this.props;

    let costBasis = 0;
    let marketValue = 0;
    let shares = 0;
    transactions.forEach(transaction => {
      // Only summing 'Buy' transactions.
      if (transaction.type !== 'Buy') return;

      costBasis += transaction.price * transaction.shares;
      shares += transaction.shares;
      if (quote != null) marketValue += quote.latestPrice * transaction.shares;
    });

    const gain = marketValue - costBasis;
    let gainPercent = 0;
    if (quote != null) gainPercent = gain / costBasis;

    // Show returns only if the user owns shares and the quote has been returned from the API call.
    // Showing any earlier will look like some erroneous and funky data.
    const showReturns = shares > 0 && quote != null;

    const formatter = formatNumber({ padRight: 2, round: 2 });
    return (
      <tr>
        <td style={{ width: 1 }}>
          <input type="checkbox" />
        </td>
        <td>{quote == null ? '...' : quote.companyName}</td>
        <td>{this.props.symbol}</td>
        <td>{quote == null ? '...' : quote.latestPrice}</td>
        <td
          className={cx({
            'text-danger': quote && quote.change < 0,
            'text-success': quote && quote.change >= 0,
          })}>
          <QuoteChange quote={quote} />
        </td>
        <td>{shares > 0 ? shares : '...'}</td>
        <td>{showReturns ? formatter(costBasis) : '...'}</td>
        <td>{showReturns ? formatter(marketValue) : '...'}</td>
        <td className={cx({ 'text-danger': gain < 0, 'text-success': gain >= 0 })}>
          {showReturns ? `${gain >= 0 ? '+' : ''}${formatter(gain)}` : '...'}
        </td>
        <td className={cx({ 'text-danger': gain < 0, 'text-success': gain >= 0 })}>
          {showReturns ? `${gain >= 0 ? '+' : ''}${Math.round(gainPercent * 10000) / 100}%` : '...'}
        </td>
      </tr>
    );
  }
}

export default connect((state, ownProps: OwnProps) => ({
  quote: state.quotes[ownProps.symbol],
  transactions: state.transactions.filter(transaction => transaction.symbol === ownProps.symbol),
}))(PerformanceRow);
