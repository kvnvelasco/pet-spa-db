import { add, putWithoutVerify, list , dbDelete } from '../utils/db'

export function bootstrap() {
  return async dispatch => {
    try {
      const getServices = await list('services')
      if(!getServices.length) {
        for(let i = 0; i < seed.length; i++) {
          let save = await putWithoutVerify('services', seed[i])
        }
      }
      // screw with the services to make it manageable
      const services = getServices.reduce( (acc, item) => {
        return {...acc, [item.type]: [...(acc[item.type] || []), item]}
      }, {})
      dispatch({type: 'GET_SERVICES', payload: services})
    } catch (e) {
      console.error(e)
    }
  }
}

export function newService(service) {
  return async dispatch => {
    try {
      const putService = await putWithoutVerify('services', service)
      const getServices = await list('services')
      const services = getServices.reduce( (acc, item) => {
        return {...acc, [item.type]: [...(acc[item.type] || []), item]}
      }, {})
      dispatch({type: 'GET_SERVICES', payload: services})
      dispatch({type: 'SAVE_SERVICE', payload: service})
    } catch (e) {
      console.error(e)
    } finally {

    }
  }
}

const seed =  [{
      name: 'Cat Dorm',
      price: 450,
      type: 'hotel'
    },{
      name: 'Puppy Playpen',
      price: 450,
      type: 'hotel'
    },{
      name: 'Doggie Suite',
      price: 1000,
      type: 'hotel'
    },{
      name: 'Doggie Studio',
      price: 1200,
      type: 'hotel'
    },{
      name: 'Dluxe Rooms',
      price: 800,
      type: 'hotel'
    },{
      name: 'Family Room 1',
      price: 800,
      type: 'hotel'
    },{
      name: 'Family Room 2',
      price: 600,
      type: 'hotel'
    },{
      name: 'Family Room 3',
      price: 400,
      type: 'hotel'
    },{
      name: 'Full Style',
      price: 500,
      type: 'groom'
    },{
      name: 'Fluff and Brush',
      price: 400,
      type: 'groom'
    },{
      name: 'full groom',
      price: 500,
      type: 'groom'
    },{
      name: 'Bath and Tidy',
      price: 400,
      type: 'groom'
    },{
      name: 'Pamper Me',
      price: 600,
      type: 'groom'
    }]
