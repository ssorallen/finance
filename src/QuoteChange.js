/* @flow */

import * as React from 'react';
import type { Quote } from './reducers';
import { currencyFormatter, percentFormatter } from './formatters';

export default function QuoteChange(props: { quote: ?Quote }) {
  const { quote } = props;
  if (quote == null) return '...';
  else {
    const isPositive = quote.change >= 0;
    return (
      <React.Fragment>
        {isPositive ? '+' : ''}
        {currencyFormatter.format(quote.change)} ({isPositive ? '+' : ''}
        {percentFormatter.format(quote.changePercent)})
      </React.Fragment>
    );
  }
}
