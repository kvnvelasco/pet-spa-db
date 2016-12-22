import React, { Component } from 'react'
import { Modal, Row, Col, Table, AutoComplete, Input, DatePicker, Button, Select, message } from 'antd'
import moment from 'moment'
import { editClient, deleteClient, saveClient } from '../actions/client'
import {connect} from 'react-redux'
const Option = Select.Option;

export default class Record extends Component {

  _momentHandler(field, data) {
    this.props.dispatch({type: 'TRANSACTION_DATA_CHANGE',
    payload: {field:'date', data: data.format('Do MMM, YY')}})
  }

  _dropdownHandler(field, data) {
    this.props.dispatch({type: 'TRANSACTION_DATA_CHANGE',
    payload: {field, data}})
  }
  _change(field, data) {
    this.props.dispatch({type: 'TRANSACTION_DATA_CHANGE',
    payload: {field, data: data.target.value}})
  }

  _newTransaction() {
    const TransactionCreator = {
      date: <DatePicker
            format='Do MMM, YYYY'
            onChange={this._momentHandler.bind(this, 'date')}/>,
      pet: <Select
              onChange={this._dropdownHandler.bind(this, 'pet')}
              style={{width: '150px'}}>
              {this.props.client.pets.map( (item, index) => {
                return <Option key={index} value={item.name}>{item.name}</Option>
              })}
            </Select>,
      type: <Select
              style={{width: '75px'}}
              onChange={this._dropdownHandler.bind(this, 'type')}>
              <Option value='groom'>Groom</Option>
              <Option value='hotel'>Hotel</Option>
            </Select>,
      service: <ServiceButton />,
      price: <Price />,
      handler: <Input
            onChange={this._change.bind(this, 'handler')}/>,
      actions: <Button size='large'
                onClick={this._saveTransaction.bind(this)}
                type='primary'
                icon='plus-circle'>
                Save Transaction </Button>
    }
    this.props.dispatch({type: 'NEW_TRANSACTION', payload: TransactionCreator})
  }

  _saveTransaction() {
    const transaction = this.props.transaction
    if(!transaction.date || !transaction.pet || !transaction.service
    || !transaction.type || !transaction.price) {
      message.error('Transaction Incomplete')
      return
    }
    this.props.dispatch({type: 'SAVE_TRANSACTION'})
  }

  _save() {
    this.props.dispatch(saveClient(this.props.client))
  }

  _cancel(){
    this.props.dispatch({type: 'CANCEL_TRANSACTION'})
    this.props.dispatch({type: 'CLOSE_RECORD'})
  }
  _cloneTransaction(transaction) {
    const todayTransaction = {...transaction, date: moment().format('Do MMM, YY')}
    this.props.dispatch({type: 'CLONE_TRANSACTION', payload: todayTransaction})
  }

  _renderActions(record) {
    if(record.actions) return record.actions
    return (
      <div>
        <a onClick={this._cloneTransaction.bind(this, record)}>Do this again</a>
      </div>
    )
  }
  render() {
    const record = this.props.client || {}
    const address = record.address || {}
    const contact = record.contact || {}
    const addressString = `${address.street}, ${address.city}`
    return (
      <Modal
        visible={this.props.open}
        title={record.name}
        width={1024}
        onOk={this.props.newTransaction ? this._saveTransaction.bind(this) : this._save.bind(this)}
        okText={this.props.newTransaction && 'Save Transaction'}
        onCancel={this._cancel.bind(this)}
        >
        <Row type='flex' className='padded-area'>
          <Data title='Full Name' data={record.name} />
          <Data title='Email' data={record.email} />
          <Data title='Contact Number' data={`+(${contact.prefix}) ${contact.number}`} />
          <Data title='Address' data={addressString} />
          <Col span={4}>
            <Row type='flex' align='end'>
              <Actions dispatch={this.props.dispatch} client={record} />
            </Row>
          </Col>
        </Row>

        <Row type='flex' align='space-between' justify='middle' className='padded-area'>
          <h3>Pets</h3>
        </Row>
        <Table
          columns={columns}
          dataSource={record.pets}
          pagination={false}
        />

        <Row type='flex' align='space-between' justify='middle' className='padded-area'>
          <h3>Transactions</h3>
          {!this.props.newTransaction &&
            <Button size='large'
              onClick={this._newTransaction.bind(this)}
              type='primary'
              icon='plus-circle'>New Transaction</Button>
          }
        </Row>
        <Table
          pagination={{pageSize: 3}}
          columns={[
            {
              title: 'Date',
              dataIndex: 'date',
              sorter: (a, b) => moment(a, 'Do MMM, YY').diff(moment(b, 'Do MMM, YY')),
              sortOrder: 'descend'
            },
            ...transactionColumns,
            {
            title: 'Actions',
            dataSource: 'actions',
            render: this._renderActions.bind(this)
          }]}
          dataSource={record.transactions}
        />
      </Modal>
    )
  }
}

const ServiceButton = connect(store => ({
  transaction: store.clients.newTransaction
}))(
class Service extends Component {
  _pickService() {
    this.props.dispatch({type: 'ADD_SERVICE'})
  }

  render() {
    return (
      <Button
        disabled={!this.props.transaction.pet || !this.props.transaction.type}
        icon='plus-circle'
        onClick={this._pickService.bind(this, 'service')}>
        {this.props.transaction.service || 'Pick Service'}
       </Button>
    )
  }
})

const Price = connect(store => ({
  transaction: store.clients.newTransaction
}))(
class price extends Component {
  _change(field, data) {
    this.props.dispatch({type: 'TRANSACTION_DATA_CHANGE',
    payload: {field, data: data.target.value}})
  }

  render() {
    return (
      <Input
        value={this.props.transaction.price}
        onChange={this._change.bind(this, 'price')} />
    )
  }
})



const transactionColumns = [
    {
      title: 'Pet',
      dataIndex: 'pet'
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Service',
      dataIndex: 'service'
    },
    {
      title: 'Price',
      dataIndex: 'price'
    },
    {
      title: 'Goomer / Handler',
      dataIndex: 'handler'
    }
]

const columns = [
  {
    title: "Pet's Name",
    dataIndex: 'name',

  },
  {
    title: 'Type',
    dataIndex: 'type'
  },
  {
    title: 'Breed',
    dataIndex: 'breed'
  },
  {
    title: 'Size',
    dataIndex: 'size'
  },
  {
    title: 'Birthdate',
    dataIndex: 'birthdate',
    render: (text) => `${moment(text).format('Do MMM, YYYY')}`
  }
]

function Data(props) {
  return (
    <Col span={5}>
      <h4>{props.title}</h4>
      <p>{props.data}</p>
    </Col>
  )
}

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
        <span>
          <h3><a onClick={this._edit.bind(this)}>Edit</a></h3>
        </span>
        <span>
          <h3><a onClick={this._delete.bind(this)}>Delete</a></h3>
        </span>
      </span>
    )
  }
}
