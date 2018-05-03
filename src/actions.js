/* @flow */

import type Action from './reducers';

export function addTicker(ticker: string): Action {
  return {
    ticker,
    type: 'ADD_TICKER',
  };
}
