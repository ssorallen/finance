/* @flow */

import type { GetState, Transaction } from './reducers';

const IEX_ROOT = 'https://api.iextrading.com/1.0';

export function addSymbol(symbol: string) {
  return { symbol, type: 'ADD_SYMBOL' };
}

export function addTransaction(transaction: Transaction) {
  return { transaction, type: 'ADD_TRANSACTION' };
}

export function deletePortfolio() {
  return { type: 'DELETE_PORTFOLIO' };
}

export function deleteSymbols(symbols: Array<string>) {
  return { symbols, type: 'DELETE_SYMBOLS' };
}

export function deleteTransactions(transactions: Array<Transaction>) {
  return { transactions, type: 'DELETE_TRANSACTIONS' };
}

export function fetchQuotes() {
  return function(dispatch: Function, getState: GetState) {
    dispatch({ type: 'FETCH_QUOTES_REQUEST' });
    fetch(
      `${IEX_ROOT}/stock/market/batch?types=quote&symbols=${encodeURIComponent(
        getState().symbols.join(',')
      )}`
    )
      .then(response => {
        response
          .json()
          .then(data => {
            // Data comes back under the endpoint from which it was requested. In this case the key
            // is `quote`. Unzip the response to match the shape our the store.
            //
            // See: https://iextrading.com/developer/docs/#batch-requests
            const nextQuotes = {};
            Object.keys(data).forEach(symbol => {
              nextQuotes[symbol] = data[symbol].quote;
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
}
