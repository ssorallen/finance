/* @flow */

type IAction = { type: string };

type AddTickerAction = IAction & {
  ticker: string,
};

type Action = AddTickerAction;

type State = {
  tickers: Array<string>,
};

const initialState = {
  tickers: [],
}

export default function(state: State = initialState, action: Action) {
  switch(action.type) {
  case 'ADD_TICKER':
    return {
      ...state,
      tickers: state.tickers.concat(action.ticker),
    }
  default:
    return state;
  }
}
