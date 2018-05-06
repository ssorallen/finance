/* @flow */

import type { Quote, Transaction } from './reducers';

type GfTransaction = {
  'Cash value': string,
  Commission: string,
  Date: string,
  Name: string,
  Notes: string,
  Price: string,
  Shares: string,
  Symbol: string,
  Type: 'Buy' | 'Sell',
};

export function transformGfToStocks(gfTransactions: Array<GfTransaction>): Array<Transaction> {
  return gfTransactions.map(transaction => ({
    cashValue: transaction['Cash value'] === '' ? null : parseFloat(transaction['Cash value']),
    commission: parseFloat(transaction.Commission),
    date: transaction.Date,
    id: -1, // A real ID is added in the reducer.
    notes: transaction.Notes,
    price: parseFloat(transaction.Price),
    shares: parseFloat(transaction.Shares),
    symbol: transaction.Symbol,
    type: transaction.Type,
  }));
}

export function transformStocksToGf(
  stocksTransactions: Array<Transaction>,
  quotes: { [symbol: string]: Quote }
): Array<GfTransaction> {
  return stocksTransactions.map(transaction => ({
    'Cash value': transaction.cashValue == null ? '' : `${transaction.cashValue}`,
    Commission: `${transaction.commission}`,
    Date: transaction.date == null ? '' : transaction.date,
    Name: quotes[transaction.symbol] == null ? '' : quotes[transaction.symbol].companyName,
    Notes: transaction.notes == null ? '' : transaction.notes,
    Price: `${transaction.price}`,
    Shares: `${transaction.shares}`,
    Symbol: transaction.symbol,
    Type: transaction.type,
  }));
}
