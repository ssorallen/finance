/* @flow */

import type { GetState, Transaction } from './reducers';

const IEX_ROOT = 'https://api.iextrading.com/1.0';

export function addSymbol(symbol: string) {
  return function (dispatch: Function) {
    dispatch({ ticker: symbol, type: 'ADD_TICKER' });
  }
}

export function addTransaction(transaction: Transaction) {
  return function (dispatch: Function) {
    dispatch({ transaction, type: 'ADD_TRANSACTION' });
  }
}

export function fetchQuotes() {
  return function (dispatch: Function, getState: GetState) {
    dispatch({ type: 'FETCH_QUOTES_REQUEST' });
    fetch(`${IEX_ROOT}/stock/market/batch?types=quote&symbols=${getState().symbols.join(',')}`)
      .then(response => {
        response.json()
          .then((data) => {
            // Data comes back under the endpoint from which it was requested. In this case the key
            // is `quote`. Unzip the response to match the shape our the store.
            //
            // See: https://iextrading.com/developer/docs/#batch-requests
            const nextQuotes = {};
            Object.keys(data).forEach(ticker => {
              nextQuotes[ticker] = data[ticker].quote;
            });
            dispatch({ quotes: nextQuotes, type: 'FETCH_QUOTES_SUCCESS' });
          })
          .catch(() => {
            dispatch({ type: 'FETCH_QUOTES_FAILURE' });
          });
      })
      .catch(() => {
        dispatch({ type: 'FETCH_QUOTES_FAILURE' });
      });
  };
};
