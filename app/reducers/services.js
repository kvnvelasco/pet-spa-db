const initialState = {  }


function getIndexesByKeyWord(keyword, arr) {
  return arr.reduce((acc, item, index) => {
    if(item.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) return [...acc, index]
    return acc
  }, [])
}

export default function reducer(state=initialState, action) {
  const {type, payload} = action
  switch (type) {
    case 'GET_SERVICES':
      return {...state, seed: payload}
    case 'PICK_SERVICE':
      return {...state,
        filterText: null,
        selected: {...payload.data, index: payload.index}}
    case 'MODIFY_PRICE':
      return {...state, selected: {...state.selected, price: payload}}
    case 'FILTER_SERVICES':
      if(!payload) return {...state, selected: {}, filtered: {}, filterText: ''}
      return {...state,
        filterText: payload,
        filtered: {
        hotel: getIndexesByKeyWord(payload, state.seed.hotel),
        groom: getIndexesByKeyWord(payload, state.seed.groom)
      }}
    case 'SAVE_SERVICE':
      return {...state,
        filterText: '',
        selected: {} ,
        filtered: {}}
    case 'CANCEL_SERVICE':
      return {...state,
        filterText: '',
        selected: {},
        filtered: {}}
    default:
      return state
  }
}
