/* @flow */

type AddSymbolAction = {
  symbol: string,
  type: 'ADD_SYMBOL',
};

export type Transaction = {
  commission: number,
  date: ?string,
  price: number,
  shares: number,
  symbol: string,
  type: 'Buy' | 'Sell',
};

type AddTransactionAction = {
  transaction: Transaction,
  type: 'ADD_TRANSACTION',
};

type FetchQuotesFailureAction = {
  type: 'FETCH_QUOTES_FAILURE',
};

type FetchQuotesRequestAction = {
  type: 'FETCH_QUOTES_REQUEST',
};

type FetchQuotesSuccessAction = {
  quotes: { [symbol: string]: Object },
  type: 'FETCH_QUOTES_SUCCESS',
};

export type Action =
  | AddSymbolAction
  | AddTransactionAction
  | FetchQuotesFailureAction
  | FetchQuotesRequestAction
  | FetchQuotesSuccessAction;

export type Quote = {
  change: number,
  changePercent: number,
  close: number,
  companyName: string,
  latestPrice: number,
  marketCap: number,
  open: number,
  price: number,
  symbol: string,
};

type State = {
  isFetchingPrices: boolean,
  quotes: { [symbol: string]: Quote },
  symbols: Array<string>,
  transactions: Array<Transaction>,
  updatedAt: ?number,
};

export type GetState = () => State;

const initialState = {
  isFetchingPrices: false,
  quotes: {},
  symbols: [],
  transactions: [],
  updatedAt: null,
};

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'ADD_SYMBOL':
      const nextSymbols =
        state.symbols.indexOf(action.symbol) === -1
          ? [...state.symbols, action.symbol]
          : state.symbols;
      return {
        ...state,
        symbols: nextSymbols,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.transaction],
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
        updatedAt: Date.now(),
      };
    default:
      return state;
  }
}
