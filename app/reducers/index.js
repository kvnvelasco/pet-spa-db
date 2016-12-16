// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import animals from './animals'
import clients from './clients'
import layout from './layout'
import services from './services'

const rootReducer = combineReducers({
  routing,
  animals,
  clients,
  layout,
  services
});

export default rootReducer;
