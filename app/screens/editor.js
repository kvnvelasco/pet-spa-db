import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Input, Icon, Col, Row, AutoComplete, Button, Table } from 'antd'
import { saveClient } from '../actions/client'
import { closeEditor } from '../actions/layout'

import countries from '../utils/countries.json'
import moment from 'moment'

const columns = [
  {
    title: "Pet's Name",
    dataIndex: 'name'
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
    title: 'Birthdate',
    dataIndex: 'birthdate',
    render: (text) => `${moment(text).format('Do MMM, YYYY')}`
  }
]

class Editor extends Component {
  constructor(props) {
    super(props)
    this.countries = countries.reduce( (acc, item) => {
      return [...acc, item.name.common]
    },[])
  }

  _save() {
    this.props.dispatch(saveClient(this.props.client))
  }

  _cancel() {
    this.props.dispatch({type: 'CLOSE_EDITOR'})
  }

  _change(field, event) {
    this.props.dispatch({type: 'CLIENT_DATA_UPDATE', payload: {field, data: event.target.value}})
  }

  _newPet(){
    this.props.dispatch({type: 'NEW_PET'})
  }
  _editPet(pet, index) {
    this.props.dispatch({type: 'EDIT_PET', payload: index})
  }

  _deletePet(index) {
    this.props.dispatch({type: 'DELETE_PET', payload: index})
  }

  render() {
    const client = this.props.client || {}
    const address = client.address || {}
    const contact = client.contact || {}
    return (
      <div>
        <div id='overlay' className={this.props.open && 'open'} onClick={this._cancel.bind(this)} />
        <div id='editor-window' className={this.props.open && 'open'}>
          <div className='padded-area'>
            <h3>Add New Client</h3>
          </div>
          <div className='padded-area'>
            <Input addonBefore='Full Name'
              value={client.name}
              onChange={this._change.bind(this, 'name')}
              placeholder="Client's Full Name" size='large' />
            <Input addonBefore='Email'
              value={client.email}
              onChange={this._change.bind(this, 'email')}
              placeholder="Client's email" size='large' />
            <Input addonBefore='Street Address'
              value={address.street}
              onChange={this._change.bind(this, ['address', 'street'])}
             placeholder="e.g 123 Makati Avenue" size='large' />
           <Input.Group>
             <Col span={14}>
               <Input addonBefore='City'
                 value={address.city}
                 onChange={this._change.bind(this, ['address', 'city'])}
                placeholder="e.g Mandaluyong" size='large' />
             </Col>
             <Col span={10}>
               <AutoComplete
                dataSource={this.countries}
                  value={address.country || 'Philippines'}
                  onChange={this._change.bind(this, ['address', 'country'])}
                  style={{ width: '100%' }}
                  size='large'
                  defaultValue='Philippines'/>
             </Col>
           </Input.Group>
           <Input.Group>
             <Col span={9}>
               <Input addonBefore='Phone +('
                 addonAfter=')'
                 value={contact.prefix}
                 onChange={this._change.bind(this, ['contact', 'prefix'])}
                placeholder="63" size='large' />
             </Col>
             <Col span={15}>
               <Input addonBefore=''
                 value={contact.number}
                 onChange={this._change.bind(this, ['contact', 'number'])}
                placeholder="e.g 917123134" size='large' />
             </Col>
           </Input.Group>
            <Input
              addonBefore="https://facebook.com/"
              value={client.facebook}
              onChange={this._change.bind(this, 'facebook')}
              placeholder='facebook id' size="large"
            />

            <Row type='flex' align='middle' style={{margin: '20px 0'}}>
              <Col span={5}>
                <h4>Pets</h4>
              </Col>
              <Button size='large'
                onClick={this._newPet.bind(this)}
                icon='plus-circle'>Add a pet</Button>
            </Row>
            <Table
              dataSource={client.pets}
              columns={[...columns, {
                title: 'Actions',
                key: 'actions',
                render: (item, record, index) => (
                  <span>
                    <a onClick={this._editPet.bind(this, record, index)}>Edit</a>
                    <span className="ant-divider" />
                    <a onClick={this._deletePet.bind(this, index)}>Delete</a>
                  </span>
                )
              }]} />
            <Row>
              <Button onClick={this._save.bind(this)} type='primary' size='large'>Save Client </Button>
              <Button onClick={this._cancel.bind(this)} size='large'>Cancel</Button>
            </Row>
          </div>
        </div>
      </div>

    )
  }
}

export default connect( store => ({
  open: store.layout.editor,
  data: store.layout.data
}))(Editor)
