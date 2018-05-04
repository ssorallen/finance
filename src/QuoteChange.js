/* @flow */

import * as React from 'react';
import type { Quote } from './reducers';

export default function QuoteChange(props: { quote: ?Quote }) {
  const { quote } = props;
  if (quote == null) return '...';
  else {
    const isPositive = quote.change >= 0;
    return (
      <React.Fragment>
        {isPositive ? '+' : ''}{quote.change}{' '}
        ({isPositive ? '+' : ''}{Math.round(quote.changePercent * 10000) / 100}%)
      </React.Fragment>
    );
  }
}
