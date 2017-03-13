import Db from 'dexie'

let db

const VERSION = 1

const INDEXES = {
  animals: '++id, name, breed',
  clients: '++id, name',
  groomers: '++id, name'
}

const SCHEMA = {
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
     pets: {
       name: 'string',
       birthdate: 'string',
       type: 'string',
       size: 'string'
     }
  }
};


const init = () => {
  if(!db){
    db = new Db('pet-spa')
    db.version(1).stores({
      animals: '++id, name, breed',
      clients: '++id, name',
      groomers: '++id, name'
    })
    db.version(2).stores({
      clients: '++id, name',
      services: '++id, name',
    })

    db.version(3).stores({
      clients: '++id, name',
      services: '++id, name, type',
    }).upgrade()

  }

  if(!db.isOpen()) db.open()
  return db
}

const verify = (table, object) => {
  console.log(object)
  if(Array.isArray(object)) {
    object.forEach( item => {
      verify(table, item)
    })
  } else {
    for( const key of Object.keys(table)) {
      if(key === 'id' || key === 'key') continue
      if(!object[key]) throw {type: 'Required Field Missing', message: `${key}  is blank`}

      const type = typeof table[key] === 'string' ? table[key] : 'object'
      if(type == 'array' && object[key].length >= 0){
        continue
      }
    if(type === 'number' && typeof parseInt(object[key]) === 'number') continue

    if(type === 'object')  verify(table[key], object[key])
     if(typeof object[key] !== type ) {
        console.log(typeof object[key], type)
        throw {type: 'Schema Mismatch', message: `${key} must be ${table[key]} but it's ${object[key] || 'blank'}`}
      }
    }
    return true
  }
}


export async function dumpDB() {
  init()
  return {
    clients: await list('clients'),
    services: await list('services')
  }
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

export async function putWithoutVerify(table, object) {
  init()
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
