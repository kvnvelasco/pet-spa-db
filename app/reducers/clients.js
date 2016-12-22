const initialState = {
  list: [],
  filtered: {
    show: false,
    list: []
  },
  selected: {}
}



import { SAVE_CLIENT, EDIT_CLIENT, FILTER_CLIENTS, UNFILTER_CLIENTS } from '../actions/client'

function twoDeep(tree={}, address) {
  if(typeof address.field === 'object' && address.field.length > 1) {
    return {...tree, [address.field[0]]: {
      ...tree[address.field[0]],
      [address.field[1]]: address.data
    }}
  } else {
    return {...tree, [address.field]: address.data}
  }
}

export default function reducer(state=initialState, action){
  switch (action.type) {
    case 'NEW_CLIENT': {
      return {...state, active: {}}
    }
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
    case 'CLIENT_DATA_UPDATE':
      return {...state, active: twoDeep(state.active, action.payload)}
    case FILTER_CLIENTS:
      return {...state, filtered: {show: true, list: action.payload.filtered, query: action.payload.query} }
    case UNFILTER_CLIENTS:
      return {...state, filtered: {show: false, list: []}}
    case 'CLOSE_EDITOR':
      return {...state, active: {}}
    case 'OPEN_RECORD':
      return {...state, active: action.payload}
    case 'ADD_TRANSACTION':
      return {...state, selected: {client: action.payload, show: true}}
    case 'CLONE_TRANSACTION':
      return {...state, active: {...state.active, transactions: [
        action.payload,
        ...state.active.transactions
      ]}}
    case 'CANCEL_TRANSACTION':
      return {...state, selected: {client: {}, show: false}}
    case 'DELETE_CLIENT':
      let index
      for(index = 0; index < state.list.length; index++) {
        if(state.list[index].id == action.payload) break
      }
      return {...state, list: [
        ...state.list.slice(0, index),
        ...state.list.slice(index + 1)
      ]}
    case 'NEW_PET': {
      return {...state, editPet: false, activePet: {}}
    }
    case 'CANCEL_PET':
      return {...state, editPet: false, activePet: {}}
    case 'SAVE_PET':
      let newPetsArray = state.active.pets || []

      if(typeof state.editPet === 'number') {
        newPetsArray = [
          ...newPetsArray.slice(0, state.editPet),
          action.payload.data,
          ...newPetsArray.slice(state.editPet + 1)
        ]
      } else {
        newPetsArray = [...newPetsArray, action.payload.data]
      }
      return {...state,
        activePet: {},
        editPet: false,
        active: {
        ...state.active,
        pets: newPetsArray
      }}
    case 'EDIT_PET':
      return {...state,
        editPet: action.payload,
        activePet: state.active.pets[action.payload]}
    case 'DELETE_PET':
      let deletedPetsArray = state.active.pets || []
      deletedPetsArray = [
        ...deletedPetsArray.slice(0, action.payload),
        ...deletedPetsArray.slice(action.payload + 1)
      ]
      return {...state,
        activePet: {},
        editPet: false,
        active: {
        ...state.active,
        pets: deletedPetsArray
      }}
    case 'PET_DATA_CHANGE':
      return {...state, activePet: {
        ...state.activePet,
        [action.payload.field]: action.payload.data
      }}
    case 'NEW_TRANSACTION':
      return {...state,
      newTransaction: {},
      active: {
      ...state.active,
      transactions: [
        action.payload,
        ...(state.active.transactions || [])
      ]
    }}
    case 'TRANSACTION_DATA_CHANGE':
      return {...state, newTransaction: {
        ...state.newTransaction,
        [action.payload.field]: action.payload.data
      }}
    case 'SAVE_SERVICE':
      return {...state, newTransaction: {
        ...state.newTransaction,
        service: action.payload.name,
        price: action.payload.price
      }}
    case 'SAVE_TRANSACTION':
      let transaction = state.active.transactions.slice(1)
      return {...state, newTransaction: {},
      active: {
        ...state.active,
        transactions: [state.newTransaction, ...transaction]
      }
    }
    default:
      return state
  }
}
