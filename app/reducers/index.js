import { combineReducers } from 'redux'
import clients from './clients'
import layout from './layout'
import services from './services'

export default combineReducers({
  clients,
  layout,
  services
})
