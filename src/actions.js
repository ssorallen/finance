/* @flow */

import type { Dispatch, GetState, Transaction } from './types';
import csvParse from 'csv-parse/lib/es5/sync';
import { transformGfToStocks } from './transformers';

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

export function changePageSize(nextPageSize: number) {
  return { pageSize: nextPageSize, type: 'CHANGE_PAGE_SIZE' };
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
let fetchAllQuotesTimeout: ?TimeoutID;

function clearFetchQuotesTimeout() {
  if (fetchAllQuotesTimeout != null) {
    clearTimeout(fetchAllQuotesTimeout);
    fetchAllQuotesTimeout = null;
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
export function fetchSymbolData(symbol: string) {
  return function(dispatch: Dispatch) {
    dispatch({ type: 'FETCH_SYMBOL_DATA_REQUEST' });
    fetch(`${IEX_ROOT}/stock/${symbol}/batch?types=chart,quote&range=1y`)
      .then(response => {
        response
          .json()
          .then(symbolData => {
            dispatch({ symbol, symbolData, type: 'FETCH_SYMBOL_DATA_SUCCESS' });
          })
          .catch(error => {
            dispatch({ error, type: 'FETCH_SYMBOL_DATA_FAILURE' });
          });
      })
      .catch(error => {
        dispatch({ error, type: 'FETCH_SYMBOL_DATA_FAILURE' });
      });
  };
}

export function fetchAllQuotes() {
  return function(dispatch: Dispatch, getState: GetState) {
    function setFetchQuotesTimeout() {
      // Because more `fetchQuote` actions might be in flight, ensure the timer is empty and
      // synchronously create the next one (even though it was cleared once when this action was
      // first dispatched). This ensures no more than one timeout at a time is pending.
      clearFetchQuotesTimeout();
      setTimeout(() => {
        dispatch(fetchAllQuotes());
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
          .catch(error => {
            dispatch({ error, type: 'FETCH_QUOTES_FAILURE' });
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

export function fetchAllIexSymbols() {
  return function(dispatch: Dispatch) {
    dispatch({ type: 'FETCH_ALL_IEX_SYMBOLS_REQUEST' });
    fetch(`${IEX_ROOT}/ref-data/symbols`)
      .then(response => {
        response
          .json()
          .then(data => {
            dispatch({ allIexSymbols: data, type: 'FETCH_ALL_IEX_SYMBOLS_SUCCESS' });
          })
          .catch(error => {
            dispatch({ error, type: 'FETCH_ALL_IEX_SYMBOLS_FAILURE' });
          });
      })
      .catch(error => {
        dispatch({ error, type: 'FETCH_ALL_IEX_SYMBOLS_FAILURE' });
      });
  };
}

export function importTransactionsFile(file: Blob) {
  return function(dispatch: Dispatch) {
    dispatch({ type: 'IMPORT_TRANSACTIONS_FILE_REQUEST' });
    const fileReader = new FileReader();
    fileReader.onerror = () => {
      dispatch({ type: 'IMPORT_TRANSACTIONS_FILE_FAILURE' });
    };
    fileReader.onload = () => {
      const parsedCsv = csvParse(fileReader.result, { columns: true });
      dispatch(addTransactions(transformGfToStocks(parsedCsv)));
      dispatch(fetchAllQuotes());
      dispatch({ type: 'IMPORT_TRANSACTIONS_FILE_SUCCESS' });
    };
    fileReader.readAsText(file);
  };
}
