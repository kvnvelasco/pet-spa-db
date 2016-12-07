const initialState = {
  list: [],
  filtered: {
    show: false,
    list: []
  }
}



import { SAVE_CLIENT, EDIT_CLIENT, FILTER_CLIENTS, UNFILTER_CLIENTS } from '../actions/client'

export default function reducer(state=initialState, action){
  switch (action.type) {
    case 'GET_CLIENTS':
      return {...state, list: action.payload}
    case SAVE_CLIENT:
      if(action.payload.id){
        let index = 0
        for(const item of state.list){
          if(item.id == action.payload.id) {
            return {...state, list: [
              ...state.list.slice(0, index),
              action.payload,
              ...state.list.slice(index + 1)
            ]}
          }
          index = index + 1
        }
      }
      return {...state, list: [...state.list, action.payload]}
      break
    case EDIT_CLIENT:
     return {...state, active: action.payload}
    case FILTER_CLIENTS:
      return {...state, filtered: {show: true, list: action.payload}}
    case UNFILTER_CLIENTS:
      return {...state, filtered: {show: false, list: []}}
    case 'CLOSE_EDITOR':
      return {...state, active: null}
    case 'DELETE_CLIENT':
      let index
      for(index = 0; index < state.list.length; index++) {
        if(state.list[index].id == action.payload) break
      }
      return {...state, list: [
        ...state.list.slice(0, index),
        ...state.list.slice(index + 1)
      ]}
    default:
      return state
  }
}
