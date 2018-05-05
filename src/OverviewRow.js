/* @flow */

import * as React from 'react';
import type { Quote } from './reducers';
import QuoteChange from './QuoteChange';
import { connect } from 'react-redux';
import cx from 'classnames';

type OwnProps = {
  symbol: string,
};

type StateProps = {
  quote: ?Quote,
};

type Props = OwnProps & StateProps;

function abbreviateNumber(num: number, fixed) {
  if (num === null) return null; // terminate early
  if (num === 0) return '0'; // terminate early

  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  const b = num.toPrecision(2).split('e'); // get power
  const k = b.length === 1 ? 0 : Math.floor(Math.min(parseInt(b[1].slice(1), 10), 14) / 3); // floor at decimals, ceiling at trillions
  const d = k < 0 ? k : Math.abs(k); // enforce -0 is 0
  const c = d < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed); // divide by power
  const e = c + ['', 'K', 'M', 'B', 'T'][k]; // append power
  return e;
}

class OverviewRow extends React.Component<Props> {
  render() {
    const { quote, symbol } = this.props;
    return (
      <tr>
        <td style={{ width: 1 }}>
          <input type="checkbox" />
        </td>
        <td>{quote == null ? '...' : quote.companyName}</td>
        <td>{symbol}</td>
        <td>{quote == null ? '...' : quote.latestPrice}</td>
        <td
          className={cx({
            'text-danger': quote && quote.change < 0,
            'text-success': quote && quote.change >= 0,
          })}>
          <QuoteChange quote={quote} />
        </td>
        <td>{quote == null ? '...' : abbreviateNumber(quote.marketCap, 1)}</td>
        <td>{quote == null ? '...' : quote.open}</td>
        <td>{quote == null ? '...' : quote.close}</td>
      </tr>
    );
  }
}

export default connect((state, ownProps: OwnProps) => ({
  quote: state.quotes[ownProps.symbol],
}))(OverviewRow);
