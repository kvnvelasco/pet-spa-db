import { OPEN_EDITOR, CLOSE_EDITOR } from '../actions/layout'
const initialState = {
  editor: false,
  data: {}
}

export default function reducer(state=initialState, action){
  switch (action.type) {
    case OPEN_EDITOR:
      return {...state, editor: true, data: action.payload}
    case CLOSE_EDITOR:
      return {...state, editor: false, data: {}}
    case 'OPEN_RECORD':
      return {...state, record: true}
    case 'CLOSE_RECORD':
      return {...state, record: false}
    case 'NEW_TRANSACTION':
      return {...state, transaction: true}
    case 'CANCEL_TRANSACTION':
      return {...state, transaction: false}
    case 'SAVE_TRANSACTION':
      return {...state, transaction: false}
    case 'NEW_PET':
      return {...state, pet: true}
    case 'SAVE_PET':
      return {...state, pet: false}
    case 'CANCEL_PET':
      return {...state, pet: false}
    case 'EDIT_PET':
      return {...state, pet: true}
    case 'ADD_SERVICE':
      return {...state, services: true}
    case 'CANCEL_SERVICE':
      return {...state, services: false}
    case 'SAVE_SERVICE':
      return {...state, services: false}
    default:
      return state
  }
}
