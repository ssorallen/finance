/* @flow */

import type { GetState, Transaction } from './types';

const IEX_ROOT = 'https://api.iextrading.com/1.0';

export function addSymbol(symbol: string) {
  return { symbol, type: 'ADD_SYMBOL' };
}

export function addTransaction(transaction: Transaction) {
  return { transaction, type: 'ADD_TRANSACTION' };
}

export function addTransactions(transactions: Array<Transaction>) {
  return { transactions, type: 'ADD_TRANSACTIONS' };
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

export function downloadPortfolio() {
  return { type: 'DOWNLOAD_PORTFOLIO' };
}

// A timeout to periodically fetch new quotes.
let fetchQuotesTimeout;

function clearFetchQuotesTimeout() {
  if (fetchQuotesTimeout != null) {
    clearTimeout(fetchQuotesTimeout);
    fetchQuotesTimeout = null;
  }
}

// Example data:
//
// {
//   date: '2018-04-09',
//   open: 169.88,
//   high: 173.09,
//   low: 169.845,
//   close: 170.05,
//   volume: 29017718,
//   unadjustedVolume: 29017718,
//   change: 1.67,
//   changePercent: 0.992,
//   vwap: 171.555,
//   label: 'Apr 9',
//   changeOverTime: 0,
// }
export function fetchChart(symbol: string) {
  return function(dispatch: Function) {
    dispatch({ type: 'FETCH_CHART_REQUEST' });
    fetch(`${IEX_ROOT}/stock/${symbol}/chart/1y`)
      .then(response => {
        response
          .json()
          .then(chartData => {
            dispatch({ chartData, symbol, type: 'FETCH_CHART_SUCCESS' });
          })
          .catch(error => {
            dispatch({ error, type: 'FETCH_CHART_FAILURE' });
          });
      })
      .catch(error => {
        dispatch({ error, type: 'FETCH_CHART_FAILURE' });
      });
  };
}

export function fetchQuotes() {
  return function(dispatch: Function, getState: GetState) {
    function setFetchQuotesTimeout() {
      // Because more `fetchQuote` actions might be in flight, ensure the timer is empty and
      // synchronously create the next one (even though it was cleared once when this action was
      // first dispatched). This ensures no more than one timeout at a time is pending.
      clearFetchQuotesTimeout();
      setTimeout(() => {
        dispatch(fetchQuotes());
      }, 300000); // Fetch quotes minimally every 5 minutes. (5 * 60 * 1000)
    }

    const { symbols } = getState();
    if (symbols.length === 0) {
      // No need to do anything if there are no symbols to fetch. Restart the timer and bomb out
      // early.
      clearFetchQuotesTimeout();
      setFetchQuotesTimeout();
      return;
    }

    clearFetchQuotesTimeout();
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
            // is `quote`. Unzip the response to match the shape of the store.
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
      .catch(error => {
        dispatch({ error, type: 'FETCH_QUOTES_FAILURE' });
      })
      .finally(() => {
        setFetchQuotesTimeout();
      });
  };
}
