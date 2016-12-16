import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DatePicker, Select, Input, Row, Col, Button, Table, Icon, Card, Modal } from 'antd'
import moment from 'moment'

import { IconWithText } from '../components/text'
import { openEditor } from '../actions/layout'
import { editClient, filterClients, getClients, deleteClient} from '../actions/client'

const Search = Input.Search
const Option = Select.Option

class Actions extends Component {
  _edit() {
    this.props.dispatch(editClient(this.props.client))
  }
  _delete() {
    this.props.dispatch(deleteClient(this.props.client.id))
  }
  _addTransaction(){
    this.props.dispatch({type: 'ADD_TRANSACTION', payload: this.props.client})
  }
  render() {
    return (
      <span>
        <a onClick={this._addTransaction.bind(this)}>Add Transaction</a>
        <span className="ant-divider" />
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
  }

  _openEditor() {
    this.props.dispatch(openEditor())
  }

  _filterClients(event) {
    this.props.dispatch(filterClients(event.target.value, this.props.clients))
  }

  _renderTransactionCard(list) {

  }
  _renderOtherInfo(record) {
      const petCards = record.pets.map( (item, index) => {
        return <div className='padded-area-small pet-card'>
          <Row gutter={10} type='flex'>
            <div>
              <h5> Name </h5>
              <span>{item.name} </span>
            </div>
            <div>
              <h5> Type </h5>
              <span>{item.type} </span>
            </div>
            <div>
              <h5> Breed </h5>
              <span>{item.breed} </span>
            </div>
            {item.comments && (
              <div>
                <h5>Comments</h5>
                <p>
                  <span>{item.comments}</span>
                </p>
              </div>)
            }
          </Row>

          </div>
      })
      const transactionCards = record.transactions && record.transactions.map((item, index) =>  {
        const services = item.services.map( (item, index) => (
          <Row key={index} type='flex' justify='space-between'>
            <span>{`${item.name}:`}</span>
            <span>{`${item.price} PHP `}</span>
          </Row>
        ))
        return <Col key={index} span={24} key={index}>
          <div className={['padded-area-small']}>
            <Card title={record.pets[item.pet].name} extra={`Price: ${item.total-(item.discount || 0)} PHP` } style={{fontSize: '12px'}}>
              {item.discount &&
              <div>
                <Row type='flex' justify='space-between'>
                  <strong>Discount:</strong>
                  <span>{`${item.discount} PHP `}</span>
                </Row>
              </div>
              }
              <h4> Services Rendered </h4>
                {services}
              <div>
                <Row type='flex' justify='space-between'>
                  <strong>Groomer:</strong>
                  <span>{`${item.groomer || ''} `}</span>
                </Row>
              </div>
              <h4> Comments </h4>
                {item.comments}
            </Card>
          </div>
        </Col>
      })
      return (
        <div>
          <Row type='flex'>
            <Col span={6} >
              <h4> Pets </h4>
              {petCards}
            </Col>
            <Col span={18} style={{maxHeight: '50vh', overflowX: 'scroll'}}>
              <h4> Transactions </h4>
              {transactionCards}
            </Col>
          </Row>
        </div>
      )
  }

  _transactionChange(name, data) {
    this.setState({transaction: {
      ...this.state.transaction,
      [name]: data
    }})
  }
  _checkActive(name){
    const selected = this.state.transaction.services.filter( item => {
      return item.name == name
    })

    return selected.length ? 'primary' : 'default'
  }

  _transactionChangeHandler(name, event) {
    this.setState({ transaction: { ...this.state.transaction, [name]: event.target.value } });
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
  _createServices(arr) {
    if(!this.state.transaction.pet) return {board: [], groom: []}
    let modifier
    switch (this.props.transaction.client.pets[this.state.transaction.pet].size) {
      case 'small':
        modifier = 0
        break;
      case 'medium':
        modifier = 100
        break;
      case 'large':
        modifier = 300
        break;
      case 'xl':
        modifier = 400
        break;
      default:
        modifier = 0
        break
    }
    return arr.reduce((acc, service, index) => {
      const element = <Col span={24} key={index} style={{marginBottom: '10px'}}>
                        <Button onClick={this._toggleService.bind(this, service, modifier)}
                          type={this._checkActive.call(this, service.name)}
                          style={{width: '100%'}}
                          size='large'>{`${service.name} ${service.price + (service.type == 'groom' && modifier)} PHP`}</Button>
                      </Col>
      return {...acc, [service.type]: [...acc[service.type], element]}
    },{board: [], groom: []})
  }

  _saveTransaction() {
    const client = {...this.props.transaction.client,
      transactions: [...(this.props.transaction.client.transactions || []),
      {...this.state.transaction, date: this.state.transaction.date.toString()}]}
    this.props.dispatch({type: 'SAVE_CLIENT', payload: client})
    this._cancelTransaction()
  }

  _cancelTransaction() {
    this.props.dispatch({type: 'CANCEL_TRANSACTION'})
    this.setState({transaction: {
        services: [],
        total: 0
      }
    })
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
    const petOptions = this.props.transaction.show
      && this.props.transaction.client.pets.map( (pet, index) => {
        return <Option key={index} value={`${index}`}>{`${pet.name} - ${pet.type}`}</Option>
      })

    const dogServices = this._createServices(this.props.services.dog)
    const catServices = this._createServices(this.props.services.cat)
    const bothServices = this._createServices(this.props.services.both)
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
                <Table expandedRowRender={this._renderOtherInfo.bind(this)}
                      pagination={false}
                      columns={columns}
                      dataSource={clients}
                      className="table" />
              </div>
              {!this.props.transaction.show ? null
                : <Modal
                  width={900}
                  className='transaction'
                  title={`Add a transaction to ${this.props.transaction.client.name}`}
                  visible={this.props.transaction.show}
                  onCancel={this._cancelTransaction.bind(this) }
                  onOk={this._saveTransaction.bind(this)}>
                  <Row>
                    <Col span={24}>
                      <h5>Select Pet</h5>
                      <Select style={{ width: '100%' }} size="large"
                        onChange={this._transactionChange.bind(this, 'pet')}>
                        {petOptions}
                      </Select>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={12}>
                      <DatePicker style={{width: '100%'}}
                      onChange={this._transactionChange.bind(this, 'date')}
                      addonBefore='Birthdate'
                      placeholder="Date of Transaction"
                      format='Do MMM, YYYY'
                      size='large'/>
                    </Col>
                    <Col span={12}>
                      <Input size='large'
                      addonBefore='Groomer'
                      value={this.state.transaction.groomer}
                      onChange={this._transactionChangeHandler.bind(this, 'groomer')}/>
                    </Col>
                  </Row>
                  <h3 style={{marginBottom: '10px'}}>Services</h3>
                  <Row gutter={20} style={{display: this.state.transaction.pet ? null : 'none'}}>
                    <Col span={12}>
                      <h4>Grooming</h4>
                      <Row>
                        {this.state.transaction.pet &&
                          this.props.transaction.client.pets[this.state.transaction.pet].type == 'Dog'
                          ? dogServices.groom : null
                        }
                        {bothServices.groom}
                      </Row>
                    </Col>
                    <Col span={12}>
                      <h4>Board</h4>
                      {this.state.transaction.pet &&
                        this.props.transaction.client.pets[this.state.transaction.pet].type == 'Cat'
                        ? catServices.board : null
                      }
                      {bothServices.board}
                    </Col>
                  </Row>
                  <Row>
                    <h4>Comments</h4>
                    <Input type='textarea'
                          onChange={this._transactionChangeHandler.bind(this, 'comments')}
                            />
                  </Row>
                  <Row type='flex' justify='end' align='middle' gutter={10}>
                    <h2>Discount:</h2>
                    <Col span={4}>
                      <Input size='large'
                        onChange={this._transactionChangeHandler.bind(this, 'discount')}/>
                    </Col>
                    <h2>PHP</h2>
                  </Row>
                  <Row type='flex' justify='end' gutter={10}>
                    <h2>Total: </h2>
                    <Col span={4}>
                      <h2 style={{textAlign: 'right'}}>{` ${(this.state.transaction.total || 0) - (this.state.transaction.discount || 0)}`}</h2>
                    </Col>
                    <h2>PHP</h2>
                  </Row>
                </Modal>
              }
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
