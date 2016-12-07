// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './screens/layout'
import Home from './screens/home'

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home} />
  </Route>
);
