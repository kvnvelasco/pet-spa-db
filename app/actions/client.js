export const SAVE_CLIENT = 'SAVE_CLIENT'
export const EDIT_CLIENT = 'EDIT_CLIENT'
export const FILTER_CLIENTS = 'FILTER_CLIENTS'
export const UNFILTER_CLIENTS = 'UNFILTER_CLIENTS'

import { add, put, list , dbDelete } from '../utils/db'
import { message } from 'antd'
import { closeEditor } from './layout'
export function saveClient(data) {
  return async dispatch => {
    if (!data) return
    let id
    try {
      if(data.id) {
        id = await put('clients', data)
      } else {
        id = await add('clients', data)
      }

      dispatch({type: SAVE_CLIENT, payload: {...data, id: id || data.id}})
      dispatch({type: 'CLOSE_EDITOR'})
      message.success('Saved!', 5)
    } catch (e) {
      message.error(`Failed to save. Reason: ${e.message}`, 5)
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
        if (o[i] !== null && typeof(o[i])=="object") {
            //going on step down in the object tree!!
            let found = traverse(o[i], query)
            if(found) return true
        }
        if(typeof(o[i]) == 'string') {
          const found = o[i].toLowerCase().indexOf(query.toLowerCase())
          if(found >= 0) return true
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
    dispatch({type: 'OPEN_EDITOR'})
  }
}

export function deleteClient(id) {
  return async dispatch => {
    try {
      const deleted = await dbDelete('clients', id)
      dispatch({type: 'DELETE_CLIENT', payload: id})
      message.success('Deleted!', 5)
    } catch (e) {
      message.error(`Failed to delete. Reason: ${e.message}`, 5)
    }
  }
}
