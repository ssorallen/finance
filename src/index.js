/* @flow */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-table/react-table.css';
import { applyMiddleware, compose, createStore } from 'redux';
import App from './App';
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
const initialState = {
  fetchErrorMessage: null,
  isFetchingQuotes: false,
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
    persistState(['nextTransactionId', 'quotes', 'symbols', 'transactions', 'updatedAt'], {
      key: 'default',
    })
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
registerServiceWorker();
