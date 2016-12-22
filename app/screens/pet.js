import React, { Component } from 'react'
import {Modal, Row, Col, Radio, Input, DatePicker} from 'antd'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
import moment from 'moment'

export default class PetEditor extends Component {

  _birthdate(moment) {
    this.props.dispatch({type: 'PET_DATA_CHANGE', payload: {field: 'birthdate', data: moment}})
  }

  _change(field, data){
    this.props.dispatch({type: 'PET_DATA_CHANGE', payload: {field, data: data.target.value}})
  }

  _save() {
    let petToSave = this.props.pet
    if(petToSave.birthdate) {
      petToSave.birthdate = petToSave.birthdate.toString()
    } else {
      petToSave.birthdate = moment().toString()
    }
    petToSave.size = petToSave.size || 'small'

    this.props.dispatch({type: 'SAVE_PET', payload: {data: petToSave, edited: this.props.edited}})
  }

  _cancel() {
    this.props.dispatch({type: 'CANCEL_PET'})
  }

  render() {
    const pet = this.props.pet || {}
    const birthdate = typeof pet.birthdate !== 'function' ? moment(pet.birthdate) : pet.birthdate
    return (
      <Modal
        okText='Save Pet'
        cancelText='Cancel'
        onOk={this._save.bind(this)}
        onCancel={this._cancel.bind(this)}
        visible={this.props.open}
        title='Add a Pet'>
        <Row type='flex' justify='space-between'>
          <Col span={18} >
            <Input size='large'
              value={pet.name}
              onChange={this._change.bind(this, 'name')}
              addonBefore="Pet's Name" />
          </Col>
          <RadioGroup size="large"
            defaultValue='Dog'
            value={pet.type}
            onChange={this._change.bind(this, 'type')}>
            <RadioButton value='Dog'>Dog</RadioButton>
            <RadioButton value='Cat'>Cat</RadioButton>
          </RadioGroup>
        </Row>
        { pet.type == 'Dog' ?
          <Row style={{marginBottom: '10px'}}>
            <h4>Animal size</h4>
            <RadioGroup size="large"
              defaultValue='small'
              value={pet.size}
              onChange={this._change.bind(this, 'size')}>
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
              value={pet.breed}
              addonBefore='Breed'
              onChange={this._change.bind(this, 'breed')}
              placeholder='e.g. Beagle, Siamese'/>
          </Col>
          <Col span={4}>
            <span>Pet's Birthday</span>
          </Col>
          <Col span={10}>
            <DatePicker
              onChange={this._birthdate.bind(this)}
              value={birthdate}
              style={{width: '100%'}}
              addonBefore='Birthdate'
              placeholder="Pet's Birthday"
              format='Do MMM, YYYY'
              size='large'/>
          </Col>
        </Row>
        <Input
          value={pet.comments}
          onChange={this._change.bind(this, 'comments')}
          type='textarea' size='large' placeholder='Comments' />
      </Modal>
    )
  }
}
