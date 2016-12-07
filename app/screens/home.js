import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Row, Col, Button, Table, Icon, Card } from 'antd'

import { IconWithText } from '../components/text'
import { openEditor } from '../actions/layout'
import { editClient, filterClients, getClients, deleteClient} from '../actions/client'

const Search = Input.Search

class Actions extends Component {
  _edit() {
    this.props.dispatch(editClient(this.props.client))
  }
  _delete() {
    this.props.dispatch(deleteClient(this.props.client.id))
  }
  render() {
    return (
      <span>
        <a onClick={this._edit.bind(this)}>Edit</a>
        <span className="ant-divider" />
        <a onClick={this._delete.bind(this)}>Delete</a>
      </span>
    )
  }
}

Actions = connect()(Actions)

const columns = [{
    title: 'Name',
    dataIndex: 'name'
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
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (item, record) => <Actions client={record}/>
  }
]

function openLink(event){
  event.preventDefault()
  require('electron').shell.openExternal(event.target.href)
}

class Home extends Component {
  constructor(){
    super()
  }

  componentWillMount() {
    this.props.dispatch(getClients())
  }

  _openEditor() {
    this.props.dispatch(openEditor())
  }

  _filterClients(event) {
    this.props.dispatch(filterClients(event.target.value, this.props.clients))
  }

  _renderOtherInfo(record) {
      let petCards = record.pets.map( item => {
        return <Col span={6}>
          <div className='padded-area-small'>
            <Card title={item.name} extra={item.type} style={{fontSize: '12px'}}>
              <Row>
                <Col span={12}>
                  <p>
                    <h5>Breed </h5>
                    <span>{item.breed}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <h5>Groomer</h5>
                    <span>{item.groomer}</span>
                  </p>
                </Col>
              </Row>
              <h5>Comments</h5>
              <p>
                <span>{item.comments}</span>
              </p>
            </Card>
          </div>
        </Col>
      })
      return (
        <div>
          <h4> Pets </h4>
          <Row type='flex'>
            {petCards}
          </Row>
        </div>
      )
  }

  render(){
    let clients
    if(this.props.search.show) {
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
                  <Search onChange={this._filterClients.bind(this) }className='big-search' id='big-search' placeholder='Search for pets or clients' size='large' />
                </Col>
                <Button onClick={this._openEditor.bind(this)}
                  icon='plus-circle' type='primary' size='large'>Add New Client</Button>
              </Row>
              <div className='padded-area'>
                <Table expandedRowRender={this._renderOtherInfo.bind(this)}
                      columns={columns}
                      dataSource={clients}
                      className="table" />
              </div>
            </div>
  }
}


export default connect(store => ({
  clients: store.clients.list,
  search: store.clients.filtered
}))(Home)
