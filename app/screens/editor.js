import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Input, Icon, Col, Row, AutoComplete, Button, Modal, Radio, DatePicker, Table } from 'antd'
import { IconWithText } from '../components/text'

import enUS from 'antd/lib/date-picker/locale/en_US'
import moment from 'moment-timezone/moment-timezone'

import { saveClient } from '../actions/client'
import { closeEditor } from '../actions/layout'

import countries from '../utils/countries.json'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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

    this.state = {
      client: {
        pets: []
      },
      newPet: {}
    }
  }

  _clientSaveHandler() {
    let clientToSave = {...this.state.client}
    if(clientToSave.country === undefined) clientToSave.country = 'Philippines'

    clientToSave.contact = {
      prefix: clientToSave.phonePrefix|0,
      number: clientToSave.phoneNumber|0
    }

    clientToSave.address = {
      street: clientToSave.streetAddr,
      city: clientToSave.city,
      country: clientToSave.country
    }

    delete clientToSave.streetAddr
    delete clientToSave.city
    delete clientToSave.country
    delete clientToSave.phoneNumber
    delete clientToSave.phonePrefix

    this.props.dispatch(saveClient(clientToSave))
  }

  _bootstrap(client) {
    let transformed = {...client}
    if(client.address) {
      transformed.streetAddr = client.address.street
      transformed.city = client.address.city
      transformed.country = client.address.country
    }
    if(client.contact){
      transformed.phonePrefix = client.contact.prefix
      transformed.phoneNumber = client.contact.number
    }
    this.setState({client: transformed, bootstrapped: true})
  }

  _clientCancelHandler() {
    this.setState({move: false})
    setTimeout(this.props.dispatch.bind(this, closeEditor()), 400)
  }

  _clientChangeHandler(field, event) {
    this.setState({ client: { ...this.state.client, [field]: event.target.value } });
  }

  _petChangeHandler(field, event) {
    this.setState({newPet: {...this.state.newPet, [field]: event.target.value}})
  }

  _petBirthdateHanlder(moment) {
    this.setState({newPet: {...this.state.newPet, birthdate: moment}})
  }

  _petSaveHandler() {
    let petToSave = {...this.state.newPet} || {}
    if(petToSave.birthdate === undefined) {
      petToSave.birthdate = moment().locale('en').utcOffset(8)
    }
    petToSave.birthdate = petToSave.birthdate.toString()
    petToSave.size = petToSave.size || 'small'
    if(petToSave.edited !== undefined) {
      this.setState({
        client: {...this.state.client,
          pets: [...this.state.client.pets.slice(0, petToSave.edited),
            petToSave,
            ...this.state.client.pets.slice(petToSave.edited+1)]},
        newPet: {},
        addPet: false,
        })
      return
    }
    this.setState({
      client: {...this.state.client, pets: [...this.state.client.pets, petToSave]},
      newPet: {},
      addPet: false,
      })
  }

  componentDidMount() {
    if(this.props.client && !this.state.bootstrapped){
      this._bootstrap(this.props.client)
    }
    this.setState({move: true})
  }

  _editPet(pet, index) {
    let newPet = {...pet, edited: index}
    newPet.birthdate = newPet.birthdate ? moment(newPet.birthdate) : moment()
    this.setState({addPet: true, newPet})
  }

  _deletePet(index) {
    this.setState({client: {...this.state.client, pets: [
      ...this.state.client.pets.slice(0, index),
      ...this.state.client.pets.slice(index+1)
    ]}})
  }

  render() {
    return (
      <div>
        <div id='overlay' className={this.state.move && 'open'} onClick={this._clientCancelHandler.bind(this)} />
        <div id='editor-window' className={this.state.move && 'open'}>
          <div className='padded-area'>
            <h3>Add New Client</h3>
          </div>
          <div className='padded-area'>
            <Input addonBefore='Full Name'
              value={this.state.client.name}
              onChange={this._clientChangeHandler.bind(this, 'name')}
              placeholder="Client's Full Name" size='large' />
            <Input addonBefore='Email'
              value={this.state.client.email}
              onChange={this._clientChangeHandler.bind(this, 'email')}
              placeholder="Client's email" size='large' />
            <Input addonBefore='Street Address'
              value={this.state.client.streetAddr}
              onChange={this._clientChangeHandler.bind(this, 'streetAddr')}
             placeholder="e.g 123 Makati Avenue" size='large' />
           <Input.Group>
             <Col span={14}>
               <Input addonBefore='City'
                 value={this.state.client.city}
                 onChange={this._clientChangeHandler.bind(this, 'city')}
                placeholder="e.g Mandaluyong" size='large' />
             </Col>
             <Col span={10}>
               <AutoComplete
                dataSource={this.countries}
                  value={this.state.client.country || 'Philippines'}
                  onChange={this._clientChangeHandler.bind(this, 'country')}
                  style={{ width: '100%' }}
                  size='large'
                  defaultValue='Philippines'/>
             </Col>
           </Input.Group>
           <Input.Group>
             <Col span={9}>
               <Input addonBefore='Phone +('
                 addonAfter=')'
                 value={this.state.client.phonePrefix}
                 onChange={this._clientChangeHandler.bind(this, 'phonePrefix')}
                placeholder="63" size='large' />
             </Col>
             <Col span={15}>
               <Input addonBefore=''
                 value={this.state.client.phoneNumber}
                 onChange={this._clientChangeHandler.bind(this, 'phoneNumber')}
                placeholder="e.g 917123134" size='large' />
             </Col>
           </Input.Group>
            <Input
              addonBefore="https://facebook.com/"
              value={this.state.client.facebook}
              onChange={this._clientChangeHandler.bind(this, 'facebook')}
              placeholder='facebook id' size="large"
            />

            <Row type='flex' align='middle' style={{margin: '20px 0'}}>
              <Col span={5}>
                <h4>Pets</h4>
              </Col>
              <Button size='large' onClick={e => this.setState({addPet: true})} icon='plus-circle'>Add a pet</Button>
            </Row>
            <Table
              dataSource={this.state.client.pets}
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
              <Button onClick={this._clientSaveHandler.bind(this)} type='primary' size='large'>Save Client </Button>
              <Button onClick={this._clientCancelHandler.bind(this)} size='large'>Cancel</Button>
            </Row>
          </div>
          <Modal
            okText='Save Pet'
            cancelText='Cancel'
            onOk={this._petSaveHandler.bind(this)}
            onCancel={e => this.setState({addPet: false, newPet: {}})}
            visible={this.state.addPet}
            title='Add a Pet'>
            <Row type='flex' justify='space-between'>
              <Col span={18} >
                <Input size='large'
                  value={this.state.newPet.name}
                  onChange={this._petChangeHandler.bind(this, 'name')}
                  addonBefore="Pet's Name" />
              </Col>
              <RadioGroup size="large"
                defaultValue='Dog'
                value={this.state.newPet.type}
                onChange={this._petChangeHandler.bind(this, 'type')}>
                <RadioButton value='Dog'>Dog</RadioButton>
                <RadioButton value='Cat'>Cat</RadioButton>
              </RadioGroup>
            </Row>
            { this.state.newPet.type == 'Dog' ?
              <Row style={{marginBottom: '10px'}}>
                <h4>Animal size</h4>
                <RadioGroup size="large"
                  defaultValue='small'
                  value={this.state.newPet.size}
                  onChange={this._petChangeHandler.bind(this, 'size')}>
                  <RadioButton value='small'>Small</RadioButton>
                  <RadioButton value='medium'>Medium</RadioButton>
                  <RadioButton value='large'>Large</RadioButton>
                  <RadioButton value='xl'>Extra Large</RadioButton>
                </RadioGroup>
              </Row>
            : null }
            <Row type='flex' justify='space-between' gutter={20}>
              <Col span={10}>
                <Input size='large'
                  value={this.state.newPet.breed}
                  addonBefore='Breed'
                  onChange={this._petChangeHandler.bind(this, 'breed')}
                  placeholder='e.g. Beagle, Siamese'/>
              </Col>
              <Col span={4}>
                <span>Pet's Birthday</span>
              </Col>
              <Col span={10}>
                <DatePicker
                  onChange={this._petBirthdateHanlder.bind(this)}
                  value={this.state.newPet.birthdate}
                  style={{width: '100%'}}
                  addonBefore='Birthdate'
                  placeholder="Pet's Birthday"
                  format='Do MMM, YYYY'
                  size='large'
                  locale={enUS}/>
              </Col>
            </Row>
            <Input
              value={this.state.newPet.comments}
              onChange={this._petChangeHandler.bind(this, 'comments')}
              type='textarea' size='large' placeholder='Comments' />
          </Modal>
        </div>
      </div>

    )
  }
}

export default connect( store => ({
  open: store.layout.editor,
  data: store.layout.data
}))(Editor)
