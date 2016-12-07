export const OPEN_EDITOR = 'OPEN_EDITOR'
export const CLOSE_EDITOR = 'CLOSE_EDITOR'
export const TOGGLE_EDITOR = 'TOGGLE_EDITOR'

export function openEditor(data) {
  return async dispatch => {
    dispatch({type: OPEN_EDITOR, payload: data || {}})
  }
}

export function toggleEditor() {

}

export function closeEditor() {
  return async dispatch => {
    dispatch({type: CLOSE_EDITOR})
  }
}
