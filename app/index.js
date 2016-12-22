// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import './app.global.css';

const store = configureStore();

import enUS from 'antd/lib/locale-provider/en_US'
import {LocaleProvider} from 'antd'

import Layout from './screens/layout'
import Home from './screens/home'

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
}

render(
  <LocaleProvider locale={enUS}>
    <Provider store={store}>
      <Layout>
        <Home />
      </Layout>
    </Provider>
  </LocaleProvider>
  ,
  document.getElementById('root')
);
