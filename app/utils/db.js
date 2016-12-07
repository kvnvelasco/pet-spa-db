import Db from 'dexie'

let db

const VERSION = 1

const INDEXES = {
  animals: '++id, name, breed',
  clients: '++id, name',
  groomers: '++id, name'
}

const SCHEMA = {
  animals: {
    name: 'string' ,
    breed: 'string',
    type: ['Feline', 'Canine'],
    birthdate: 'Date',
    comments: 'string',
    groomer: 'number'
  },

  clients: {
     name: 'string',
     address: {
       street: 'string',
       city: 'string',
       country: 'string'
     },
     contact: {
      prefix: 'number',
      number: 'number'
     },
     email: 'string' ,
     facebook: 'string',
     pets: 'array'
  },
  groomers: {
    name: 'string'
  }
};


const init = () => {
  if(!db){
    db = new Db('pet-spa')
    db.version(VERSION).stores(INDEXES)
  }
  if(!db.isOpen()) db.open()
  return db
}

const verify = (table, object) => {
  for( const key of Object.keys(object)) {
    if(key === 'id' || key === 'key') continue
    const type = typeof table[key] === 'string' ? table[key] : 'object'

    if(type == 'array' && object[key].length >= 0){
      continue
    }

    if(typeof object[key] !== type ) {
      console.log(object)
      throw {type: 'Schema Mismatch', message: `${key} must be ${table[key]} but it's ${object[key] || 'blank'}`}
    }

    if(type === 'object') {
      verify(table[key], object[key])
    }
  }
  return true
}

export async function add(table, object) {
  init()
  await verify(SCHEMA[table], object)
  return await db[table].add(object)
}

export async function put(table, object){
  init()
  await verify(SCHEMA[table], object)
  return await db[table].put(object)

}

export async function list(table) {
  init()
  return await db[table].toArray()
}

export async function dbDelete(table, id) {
  init()
  return await db[table].delete(id)
}
