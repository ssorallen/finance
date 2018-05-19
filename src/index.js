/* @flow */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table/react-table.css';
import { applyMiddleware, compose, createStore } from 'redux';
import App from './App';
import type { AppState } from './types';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import persistState from 'redux-localstorage';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk';

const rootElement = document.getElementById('root');
if (rootElement == null) throw new Error('Missing element #root to render app');

// Enable Redux Devtools in the browser.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Pass an initial state to `createStore` rather than use a default argument in the reducer to
// enable 'redux-localstorage' to merge its persisted state with this initial state.
const initialState: AppState = {
  allIexSymbols: null,
  appSettings: {
    pageSize: 10,
  },
  charts: {},
  fetchErrorMessage: null,
  isFetchingAllIexSymbols: false,
  isFetchingCount: 0,
  nextTransactionId: 1,
  quotes: {},
  symbols: [],
  transactions: [],
  updatedAt: null,
};

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(
    applyMiddleware(thunk),
    persistState(
      // Any keys in the following Array will be persisted from the store to local storage and
      // re-hydrated when the app re-loads.
      [
        'allIexSymbols',
        'appSettings',
        'nextTransactionId',
        'quotes',
        'symbols',
        'transactions',
        'updatedAt',
      ],
      {
        key: 'default',
      }
    )
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
registerServiceWorker();
