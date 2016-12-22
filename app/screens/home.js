import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DatePicker, Select, Input, Row, Col, Button, Table, Icon, Card, Modal } from 'antd'
import moment from 'moment'

import { IconWithText } from '../components/text'
import { openEditor } from '../actions/layout'
import { editClient, filterClients, getClients, deleteClient} from '../actions/client'
import {bootstrap} from '../actions/services'
const Search = Input.Search
const Option = Select.Option

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a > b ? -1 : 1
  },
  {
    title: 'Contact Number',
    dataIndex: 'contact',
    render: (text, record, index) => `+(${text.prefix}) ${text.number}`
  },
  {
    title: 'Email',
    dataIndex: 'email'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: 150,
    render: text => `${text.street}, ${text.city}, ${text.country} ${text.zip || ''}`
  },
  {
    title: 'Facebook',
    dataIndex: 'facebook',
    render: text => text ? <a target='_blank' onClick={openLink} href={`https://facebook.com/${text}`}>{`https://facebook.com/${text}`}</a> : null
  }
]

function openLink(event){
  event.preventDefault()
  require('electron').shell.openExternal(event.target.href)
}

class Home extends Component {
  constructor(){
    super()
    this.state = {
      transaction: {
        services: [],
        total: 0,
        discount: 0
      }
    }
  }

  componentWillMount() {
    this.props.dispatch(getClients())
    this.props.dispatch(bootstrap())
  }

  _openEditor() {
    this.props.dispatch(openEditor())
  }

  _filterClients(event) {
    this.props.dispatch(filterClients(event.target.value, this.props.clients))
  }

  _toggleService(name, modifier) {
    let trueIndex = 0
    const selected = this.state.transaction.services.filter( (item, index) => {
      trueIndex = item == name ? index : trueIndex
      return item == name
    })
    if(selected.length){
      this.setState({transaction: {
        ...this.state.transaction,
        total: this.state.transaction.total - name.price - modifier,
        services: [
          ...this.state.transaction.services.slice(0, trueIndex),
          ...this.state.transaction.services.slice(trueIndex + 1)
        ]
      }})
    } else {
      this.setState({transaction: {
        ...this.state.transaction,
        total: this.state.transaction.total + name.price + modifier,
        services: [
          ...this.state.transaction.services,
          name
        ]
      }})
    }
  }

  _openRecord(record) {
    this.props.dispatch({type: 'OPEN_RECORD', payload: record})
  }

  render() {
    let clients
    if (this.props.search.show) {
      clients = this.props.search.list.map( item => {
        const it = this.props.clients[item]
        return {...it, key: it.id}
      })
    } else {
      clients = this.props.clients.map( item => {
        return {...item, key: item.id}
      })
    }

    return  <div className='container'>
              <Row type='flex' justify='space-around' gutter={20}>
                <Col span={18}>
                  <Search onChange={this._filterClients.bind(this)} value={this.props.searchQuery || ''}
                    className='big-search' id='big-search' placeholder='Search for pets or clients' size='large' />
                </Col>
                <Button onClick={this._openEditor.bind(this)}
                  icon='plus-circle' type='primary' size='large'>Add New Client</Button>
              </Row>
              <div className='padded-area'>
                <Table
                  onRowClick={this._openRecord.bind(this)}
                  pagination={false}
                  columns={columns}
                  dataSource={clients}
                  className="table" />
              </div>
            </div>
  }
}


export default connect(store => ({
  clients: store.clients.list,
  search: store.clients.filtered,
  searchQuery: store.clients.filtered.query,
  transaction: store.clients.selected,
  services: store.services
}))(Home)
