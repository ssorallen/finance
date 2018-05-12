/* @flow */

import type { Action, AppState } from './types';
import csvStringify from 'csv-stringify/lib/es5/sync';
import { transformStocksToGf } from './transformers';

export default function(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_SYMBOL': {
      const nextSymbols =
        state.symbols.indexOf(action.symbol) === -1
          ? [...state.symbols, action.symbol]
          : state.symbols;
      return {
        ...state,
        symbols: nextSymbols,
      };
    }
    case 'ADD_TRANSACTION': {
      const nextSymbols =
        state.symbols.indexOf(action.transaction.symbol) === -1
          ? [...state.symbols, action.transaction.symbol]
          : state.symbols;

      // Adding a new Transaction also adds the Transaction's symbol to the list of symbols to
      // watch.
      return {
        ...state,
        nextTransactionId: state.nextTransactionId + 1,
        symbols: nextSymbols,
        transactions: [
          ...state.transactions,
          { ...action.transaction, id: state.nextTransactionId },
        ],
      };
    }
    case 'ADD_TRANSACTIONS': {
      // Ensure no duplicate symbols are added.
      const nextSymbols = new Set(state.symbols);
      let nextTransactionId = state.nextTransactionId;
      const newTransactions = action.transactions.map(transaction => {
        nextSymbols.add(transaction.symbol);
        const newTransaction = { ...transaction, id: nextTransactionId };
        nextTransactionId += 1;
        return newTransaction;
      });

      return {
        ...state,
        nextTransactionId,
        symbols: Array.from(nextSymbols),
        transactions: state.transactions.concat(newTransactions),
      };
    }
    case 'CHANGE_PAGE_SIZE':
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          pageSize: action.pageSize,
        },
      };
    case 'DELETE_PORTFOLIO':
      return {
        ...state,
        nextTransactionId: 1,
        symbols: [],
        transactions: [],
      };
    case 'DELETE_SYMBOLS': {
      // Preserve Flow refinement inside `filter` by keeping a reference to `symbols`.
      const symbols = action.symbols;
      return {
        ...state,
        symbols: state.symbols.filter(symbol => symbols.indexOf(symbol) === -1),
      };
    }
    case 'DELETE_TRANSACTIONS': {
      // Preserve Flow refinement inside `filter` by keeping a reference to `transactions`.
      const transactions = action.transactions;
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transactions.indexOf(transaction) === -1
        ),
      };
    }
    case 'DOWNLOAD_PORTFOLIO': {
      const documentBody = document.body;
      if (documentBody == null) throw new Error('How in the hell did we get here?');

      const csvData = csvStringify(transformStocksToGf(state.transactions, state.quotes), {
        columns: [
          'Symbol',
          'Name',
          'Type',
          'Date',
          'Shares',
          'Price',
          'Cash value',
          'Commission',
          'Notes',
        ],
        header: true,
      });

      // The following is some funky funkiness to download a file generated in JS. Get down with
      // this funk.
      const blob = new Blob([csvData], { type: 'text/csv' });
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.download = 'My Portfolio.csv';
      a.href = url;
      a.style.display = 'none';
      documentBody.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);

      return state;
    }
    case 'FETCH_CHART_REQUEST':
      return {
        ...state,
        isFetchingCount: state.isFetchingCount + 1,
      };
    case 'FETCH_CHART_FAILURE':
      return {
        ...state,
        isFetchingCount: state.isFetchingCount - 1,
      };
    case 'FETCH_CHART_SUCCESS':
      return {
        ...state,
        charts: { ...state.charts, [action.symbol]: action.chartData },
        isFetchingCount: state.isFetchingCount - 1,
      };
    case 'FETCH_QUOTES_FAILURE':
      return {
        ...state,
        fetchErrorMessage: action.error.message,
        isFetchingCount: state.isFetchingCount - 1,
      };
    case 'FETCH_QUOTES_REQUEST':
      return {
        ...state,
        fetchErrorMessage: null,
        isFetchingCount: state.isFetchingCount + 1,
      };
    case 'FETCH_QUOTES_SUCCESS':
      return {
        ...state,
        isFetchingCount: state.isFetchingCount - 1,
        quotes: action.quotes,
        updatedAt: Date.now(),
      };
    default:
      return state;
  }
}
