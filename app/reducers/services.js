const initialState = {
  cat: [{
    name: 'Cat Dorm',
    price: 450,
    type: 'board'
  },{
    name: 'Fluff and Brush',
    price: 400,
    type: 'groom'
  },{
    name: 'full groom',
    price: 500,
    type: 'groom'
  }],
  dog: [{
    name: 'Puppy Playpen',
    price: 450,
    type: 'board'
  },,{
    name: 'Doggie Suite',
    price: 1000,
    type: 'board'
  },{
    name: 'Doggie Studio',
    price: 1200,
    type: 'board'
  },{
    name: 'Bath and Tidy',
    price: 400,
    type: 'groom'
  },{
    name: 'Full Style',
    price: 500,
    type: 'groom'
  },{
    name: 'Pamper Me',
    price: 600,
    type: 'groom'
  }],
  both: [{
    name: 'Dluxe Rooms',
    price: 800,
    type: 'board'
  },{
    name: 'Family Room 1',
    price: 800,
    type: 'board'
  },{
    name: 'Family Room 2',
    price: 600,
    type: 'board'
  },{
    name: 'Family Room 3',
    price: 400,
    type: 'board'
  }]
}

export default function reducer(state=initialState, action){
  return state
}
