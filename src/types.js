/* @flow */

type AddSymbolAction = {
  symbol: string,
  type: 'ADD_SYMBOL',
};

export type Chart = Array<{
  change: number,
  changeOverTime: number,
  changePercent: number,
  close: number,
  date: string,
  high: number,
  label: string,
  low: number,
  open: number,
  unadjustedVolume: number,
  volume: number,
  vwap: number,
}>;

export type Transaction = {
  cashValue: ?number,
  commission: number,
  date: ?string,
  id: number,
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

type DownloadPortfolioAction = {
  type: 'DOWNLOAD_PORTFOLIO',
};

type FetchChartFailureAction = {
  error: TypeError,
  type: 'FETCH_CHART_FAILURE',
};

type FetchChartRequestAction = {
  error: TypeError,
  type: 'FETCH_CHART_REQUEST',
};

type FetchChartSuccessAction = {
  chartData: Chart,
  symbol: string,
  type: 'FETCH_CHART_SUCCESS',
};

type FetchQuotesFailureAction = {
  error: TypeError,
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
  | DownloadPortfolioAction
  | FetchChartFailureAction
  | FetchChartRequestAction
  | FetchChartSuccessAction
  | FetchQuotesFailureAction
  | FetchQuotesRequestAction
  | FetchQuotesSuccessAction;

export type Quote = {
  avgTotalVolume: number,
  change: number,
  changePercent: number,
  close: number,
  companyName: string,
  high: number,
  latestPrice: number,
  latestVolume: number,
  low: number,
  marketCap: number,
  open: number,
  peRatio: ?number,
  previousClose: number,
  price: number,
  symbol: string,
  week52High: number,
  week52Low: number,
};

export type AppState = {
  charts: { [symbol: string]: Chart },
  fetchErrorMessage: ?string,
  isFetchingCount: number,
  nextTransactionId: number,
  quotes: { [symbol: string]: Quote },
  symbols: Array<string>,
  transactions: Array<Transaction>,
  updatedAt: ?number,
};

export type GetState = () => AppState;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
