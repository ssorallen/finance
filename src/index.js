/* @flow */

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { applyMiddleware, compose, createStore } from 'redux'
import App from './App';
import { Provider } from 'react-redux'
import React from 'react';
import ReactDOM from 'react-dom';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk';

const rootElement = document.getElementById('root');
if (rootElement == null) throw new Error('Missing element #root to render app');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
registerServiceWorker();
