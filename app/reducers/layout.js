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
    default:
      return state
  }
}
