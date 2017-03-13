export const SAVE_CLIENT = 'SAVE_CLIENT'
export const EDIT_CLIENT = 'EDIT_CLIENT'
export const FILTER_CLIENTS = 'FILTER_CLIENTS'
export const UNFILTER_CLIENTS = 'UNFILTER_CLIENTS'
import {debounce} from 'lodash'
import { add, put, list , dbDelete } from '../utils/db'
import { message } from 'antd'
import { closeEditor } from './layout'
export function saveClient(data) {
  return async dispatch => {
    if (!data) return
    let id
    try {
      // add default values
      if(data.address && !data.address.country) data.address.country = 'Philippines'
      // Manipulate saved client
      if(data.id) {
        id = await put('clients', data)
      } else {
        id = await add('clients', data)
      }
      dispatch({type: SAVE_CLIENT, payload: {...data, id: id || data.id}})
      dispatch({type: 'CLOSE_EDITOR'})
      dispatch({type: 'CLOSE_RECORD'})
      message.success('Saved!', 5)
    } catch (e) {
      message.error(`Failed to save. Reason: ${e.message}`, 5)
    }
  }
}

export function importClients(clients) {
  return async dispatch => {
    try {
      for(var client of clients) {
        await put('clients', client)
      }
      getClients()(dispatch)
    } catch (e) {
      console.error(e)
    }
  }
}


export function getClients() {
  return async dispatch => {
    try {
      let clients = await list('clients')
      dispatch({type: 'GET_CLIENTS', payload: clients})
    } catch (e) {
      message.error('failed to load clients ' + e, 3)
    }
  }
}

// bfs with query
function traverse(o, query) {
    for (var i in o) {
      if (i !== 'name' || i !== 'email') {
        if (o[i] !== null && typeof(o[i])=="object") {
            let found = traverse(o[i], query)
            if(found) return true
        }
        if(typeof(o[i]) == 'string') {
          const found = o[i].toLowerCase().indexOf(query.toLowerCase())
          if(found >= 0) return true
        }
      }
    }
}



export function filterClients(query, array) {
  return async dispatch => {
    if(query === ''){
      return dispatch({type: UNFILTER_CLIENTS})
    }
    const filtered = array.reduce( (acc, item, index) => {
      const found = traverse(item, query)
      if(found) return [...acc, index]
      return acc
    }, [])
    dispatch({type: FILTER_CLIENTS, payload: {filtered, query}})
  }
}

export function editClient(data) {
  return async dispatch => {
    dispatch({type: EDIT_CLIENT, payload: data})
    dispatch({type: 'CLOSE_RECORD'})
    dispatch({type: 'OPEN_EDITOR'})
  }
}

export function deleteClient(id) {
  return async dispatch => {
    try {
      const deleted = await dbDelete('clients', id)
      dispatch({type: 'DELETE_CLIENT', payload: id})
      dispatch({type: 'CLOSE_EDITOR'})
      dispatch({type: 'CLOSE_RECORD'})
      message.success('Deleted!', 5)
    } catch (e) {
      message.error(`Failed to delete. Reason: ${e.message}`, 5)
    }
  }
}
