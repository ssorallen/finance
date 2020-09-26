/* @flow */

export type Chart = Array<{|
  +change: number,
  +changeOverTime: number,
  +changePercent: number,
  +close: number,
  +date: string,
  +high: number,
  +label: string,
  +low: number,
  +open: number,
  +unadjustedVolume: number,
  +volume: number,
  +vwap: number,
|}>;

export type IEXSymbol = {|
  +date: string,
  +iexId: number,
  +isEnabled: boolean,
  +name: string,
  +symbol: string,
  +type: string,
|};

export type Quote = {|
  +avgTotalVolume: number,
  +change: number,
  +changePercent: number,
  +close: number,
  +companyName: string,
  +high: number,
  +latestPrice: number,
  +latestVolume: number,
  +low: number,
  +marketCap: number,
  +open: number,
  +peRatio: ?number,
  +previousClose: number,
  +price: number,
  +symbol: string,
  +week52High: number,
  +week52Low: number,
|};

export type Transaction = {|
  +cashValue: ?number,
  +commission: number,
  +date: ?string,
  +id: number,
  +notes: ?string,
  +price: number,
  +shares: number,
  +symbol: string,
  +type: 'Buy' | 'Sell',
|};

export type AddSymbolAction = {|
  +symbol: string,
  +type: 'ADD_SYMBOL',
|};

export type AddTransactionAction = {|
  +transaction: Transaction,
  +type: 'ADD_TRANSACTION',
|};

export type AddTransactionsAction = {|
  +transactions: Array<Transaction>,
  +type: 'ADD_TRANSACTIONS',
|};

export type ChangePageSizeAction = {|
  +pageSize: number,
  +type: 'CHANGE_PAGE_SIZE',
|};

export type DeletePortfolioAction = {|
  +type: 'DELETE_PORTFOLIO',
|};

export type DeleteSymbolsAction = {|
  +symbols: Array<string>,
  +type: 'DELETE_SYMBOLS',
|};

export type DeleteTransactionsAction = {|
  +transactions: Array<Transaction>,
  +type: 'DELETE_TRANSACTIONS',
|};

export type DownloadPortfolioAction = {|
  +type: 'DOWNLOAD_PORTFOLIO',
|};

export type FetchAllIexSymbolsFailureAction = {|
  +error: TypeError,
  +type: 'FETCH_ALL_IEX_SYMBOLS_FAILURE',
|};

export type FetchAllIexSymbolsRequestAction = {|
  +type: 'FETCH_ALL_IEX_SYMBOLS_REQUEST',
|};

export type FetchAllIexSymbolsSuccessAction = {|
  allIexSymbols: Array<IEXSymbol>,
  +type: 'FETCH_ALL_IEX_SYMBOLS_SUCCESS',
|};

export type FetchSymbolDataFailureAction = {|
  +error: TypeError,
  +type: 'FETCH_SYMBOL_DATA_FAILURE',
|};

export type FetchSymbolDataRequestAction = {|
  +type: 'FETCH_SYMBOL_DATA_REQUEST',
|};

export type FetchSymbolDataSuccessAction = {|
  +symbolData: {
    chart: Chart,
    quote: Quote,
  },
  +symbol: string,
  +type: 'FETCH_SYMBOL_DATA_SUCCESS',
|};

export type FetchQuotesFailureAction = {|
  +error: TypeError,
  +type: 'FETCH_QUOTES_FAILURE',
|};

export type FetchQuotesRequestAction = {|
  +type: 'FETCH_QUOTES_REQUEST',
|};

export type FetchQuotesSuccessAction = {|
  +quotes: { [symbol: string]: Object },
  +type: 'FETCH_QUOTES_SUCCESS',
|};

export type ImportTransactionsFileFailureAction = {|
  +type: 'IMPORT_TRANSACTIONS_FILE_FAILURE',
|};

export type ImportTransactionsFileRequestAction = {|
  +type: 'IMPORT_TRANSACTIONS_FILE_REQUEST',
|};

export type ImportTransactionsFileSuccessAction = {|
  +type: 'IMPORT_TRANSACTIONS_FILE_SUCCESS',
|};

export type Action =
  | AddSymbolAction
  | AddTransactionAction
  | AddTransactionsAction
  | ChangePageSizeAction
  | DeletePortfolioAction
  | DeleteSymbolsAction
  | DeleteTransactionsAction
  | DownloadPortfolioAction
  | FetchAllIexSymbolsFailureAction
  | FetchAllIexSymbolsRequestAction
  | FetchAllIexSymbolsSuccessAction
  | FetchSymbolDataFailureAction
  | FetchSymbolDataRequestAction
  | FetchSymbolDataSuccessAction
  | FetchQuotesFailureAction
  | FetchQuotesRequestAction
  | FetchQuotesSuccessAction
  | ImportTransactionsFileFailureAction
  | ImportTransactionsFileRequestAction
  | ImportTransactionsFileSuccessAction;

export type AppSettings = {|
  +pageSize: number,
|};

export type AppState = {|
  +allIexSymbols: ?Array<IEXSymbol>,
  +appSettings: AppSettings,
  +charts: { [symbol: string]: Chart },
  +fetchErrorMessage: ?string,
  +isFetchingAllIexSymbols: boolean,
  +isFetchingCount: number,
  +nextTransactionId: number,
  +quotes: { [symbol: string]: Quote },
  +symbols: Array<string>,
  +transactions: Array<Transaction>,
  +updatedAt: ?number,
|};

export type GetState = () => AppState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
