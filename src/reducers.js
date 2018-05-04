/* @flow */

type AddTickerAction = {
  ticker: string,
  type: 'ADD_TICKER',
};

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

type Action =
  | AddTickerAction
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
  tickers: Array<string>,
};

const initialState = {
  isFetchingPrices: false,
  quotes: {},
  tickers: [],
}

export default function(state: State = initialState, action: Action) {
  switch(action.type) {
  case 'ADD_TICKER':
    return {
      ...state,
      tickers: state.tickers.concat(action.ticker),
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
