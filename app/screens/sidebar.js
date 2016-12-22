import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import {Timeline} from 'antd'

import { filterClients } from '../actions/client'


// WARNING: Stateful component. Needs to be refactored.
class Sidebar extends Component {
  constructor(){
    super()
    this.state = {
      pets: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.pets) return
    const pets = nextProps.pets.map( item => {
      const year = moment().year()
      let adjustedBirthdate = moment(item.birthdate, 'ddd MMM DD YYYY hh:mm:ss GMTZ').year(year)
      if(adjustedBirthdate.isBefore(moment(), 'day')) adjustedBirthdate.year(year + 1)
      else adjustedBirthdate.year(year)
      return {...item, birthdate: adjustedBirthdate}
    }).sort((left, right) => {
      return left.birthdate.diff(right.birthdate, 'days')
    })
    this.setState({pets})
  }

  _searchHandler(query) {
    this.props.dispatch(filterClients(query, this.props.clients))
  }
  render() {
    let timeline = this.state.pets.filter( item => item.birthdate.diff(moment(), 'days') < 14)
    .map( (item, index) => {
      const format = {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: '[next] dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'Do MMM, YYYY'
      }
      return <Timeline.Item className='timeline' onClick={this._searchHandler.bind(this, item.owner.name)}
      key={index}>{`${item.owner.name}'s ${item.type} ${item.name} ${item.birthdate.calendar(null, format)}`}</Timeline.Item>
    })
    return (
      <div id='sidebar' className='padded-area'>
        <h4 style={{marginBottom: '20px'}}>Upcoming Pet Birthdays </h4>
        <Timeline>
          {timeline || <h4>No Pet Data</h4>}
        </Timeline>
      </div>
    )
  }
}


export default connect( store => ({
  pets: store.clients.list.flatMap( item => {
    const pets = item.pets.map( pet => {
      return {...pet, owner: {name: item.name, contact: item.contact, email: item.email}}
    })
    return pets
  }),
  clients: store.clients.list
}))(Sidebar)
