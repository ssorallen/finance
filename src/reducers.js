/* @flow */

type AddSymbolAction = {
  symbol: string,
  type: 'ADD_SYMBOL',
};

export type Transaction = {
  commission: number,
  date: ?string,
  notes: ?string,
  price: number,
  shares: number,
  symbol: string,
  type: 'Buy' | 'Sell',
};

type AddTransactionAction = {
  transaction: Transaction,
  type: 'ADD_TRANSACTION',
};

type AddTransactionsAction = {
  transactions: Array<Transaction>,
  type: 'ADD_TRANSACTIONS',
};

type DeletePortfolioAction = {
  type: 'DELETE_PORTFOLIO',
};

type DeleteSymbolsAction = {
  symbols: Array<string>,
  type: 'DELETE_SYMBOLS',
};

type DeleteTransactionsAction = {
  transactions: Array<Transaction>,
  type: 'DELETE_TRANSACTIONS',
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
  | AddTransactionsAction
  | DeletePortfolioAction
  | DeleteSymbolsAction
  | DeleteTransactionsAction
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
  isFetchingQuotes: boolean,
  quotes: { [symbol: string]: Quote },
  symbols: Array<string>,
  transactions: Array<Transaction>,
  updatedAt: ?number,
};

export type GetState = () => State;

export default function(state: State, action: Action): State {
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
        symbols: nextSymbols,
        transactions: [...state.transactions, action.transaction],
      };
    }
    case 'ADD_TRANSACTIONS': {
      // Ensure no duplicate symbols are added.
      const nextSymbols = new Set(state.symbols);
      action.transactions.forEach(transaction => {
        nextSymbols.add(transaction.symbol);
      });

      return {
        ...state,
        symbols: Array.from(nextSymbols),
        transactions: state.transactions.concat(action.transactions),
      };
    }
    case 'DELETE_PORTFOLIO':
      return {
        ...state,
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
