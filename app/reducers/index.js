// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import animals from './animals'
import clients from './clients'
import layout from './layout'

const rootReducer = combineReducers({
  routing,
  animals,
  clients,
  layout
});

export default rootReducer;
