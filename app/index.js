// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';

import './app.global.css';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

import enUS from 'antd/lib/locale-provider/en_US'
import {LocaleProvider} from 'antd'


Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
}

render(
  <LocaleProvider locale={enUS}>
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>
  </LocaleProvider>
  ,
  document.getElementById('root')
);
