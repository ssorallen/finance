/* @flow */

type AddTickerAction = {
  ticker: string,
  type: 'ADD_TICKER',
};

export type Transaction = {
  commission: number,
  date: ?string,
  price: number,
  shares: number,
  ticker: string,
  type: 'Buy' | 'Sell',
};

type AddTransactionAction = {
  transaction: Transaction,
  type: 'ADD_TRANSACTION',
}

type FetchQuotesFailureAction = {
  type: 'FETCH_QUOTES_FAILURE',
};

type FetchQuotesRequestAction = {
  type: 'FETCH_QUOTES_REQUEST',
};

type FetchQuotesSuccessAction = {
  quotes: {[ticker: string]: Object},
  type: 'FETCH_QUOTES_SUCCESS',
};

export type Action =
  | AddTickerAction
  | AddTransactionAction
  | FetchQuotesFailureAction
  | FetchQuotesRequestAction
  | FetchQuotesSuccessAction;

export type Quote = {
  change: number,
  changePercent: number,
  companyName: string,
  latestPrice: number,
  marketCap: number,
  price: number,
  symbol: string,
};

type State = {
  isFetchingPrices: boolean,
  quotes: {[ticker: string]: Quote},
  transactions: Array<Transaction>,
  symbols: Array<string>,
};

export type GetState = () => State;

const initialState = {
  isFetchingPrices: false,
  quotes: {},
  symbols: [],
  transactions: [],
}

export default function(state: State = initialState, action: Action) {
  switch(action.type) {
  case 'ADD_TICKER':
    const nextSymbols = state.symbols.indexOf(action.ticker) === -1 ?
      state.symbols.concat([action.ticker]) :
      state.symbols;
    return {
      ...state,
      symbols: nextSymbols,
    };
  case 'ADD_TRANSACTION':
    return {
      ...state,
      transactions: state.transactions.concat([action.transaction]),
    };
  case 'FETCH_QUOTES_FAILURE':
    return {
      ...state,
      isFetchingQuotes: false,
    };
  case 'FETCH_QUOTES_REQUEST':
    return {
      ...state,
      isFetchingQuotes: true,
    };
  case 'FETCH_QUOTES_SUCCESS':
    return {
      ...state,
      isFetchingQuotes: false,
      quotes: action.quotes,
    };
  default:
    return state;
  }
}
