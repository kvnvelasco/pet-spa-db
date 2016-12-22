import React, { Component } from 'react'
import { Input, Button, Modal, Row, Col, message} from 'antd'

import { newService } from '../actions/services'

export default class Services extends Component {
  _pickService(index, data) {
    this.props.dispatch({type: 'PICK_SERVICE', payload: {index, data}})
  }
  _filterServices(event) {
    this.props.dispatch({type: 'FILTER_SERVICES', payload: event.target.value})
  }
  _renderService(item, index) {
    const selected = this.props.services.selected || {}
    const picked = selected.index === index
    return (
      <Col span={12} key={index}>
        <Button key={index}
          type={picked ? 'primary' : 'default'}
          onClick={this._pickService.bind(this, index, item)}
          style={{width: '100%', marginBottom: '10px'}}>
          {`${item.name} - ${item.price}PHP`}
        </Button>
      </Col>
    )
  }

  _modifyPrice(event) {
    this.props.dispatch({type: 'MODIFY_PRICE', payload: event.target.value})
  }

  _save(service) {
    if(!service.name) {
      if(!service.price) return message.error('You must enter a price')
      return this.props.dispatch(newService(
        {price: service.price,
        type: this.props.transaction.type,
        name: this.props.services.filterText}
      ))
    }
    this.props.dispatch({type: 'SAVE_SERVICE', payload: service})
  }



  render() {
    const {seed, selected={}, filtered=[], filterText} = this.props.services
    if(!seed) return <div />
    const transaction = this.props.transaction || {}
    const type = transaction.type || 'groom'
    const services = filtered[type] ? filtered[type].map(item => seed[transaction.type][item]) : seed[type]
    return (
      <Modal
        title='Services'
        visible={this.props.open}
        onOk={this._save.bind(this, selected)}
        onCancel={this.props.dispatch.bind(this, {type: 'CANCEL_SERVICE'})}
        >
        <Row type='flex' style={{marginBottom: '20px'}} gutter={10} align='bottom'>
          <Col span={12}>
            <h3>Service Name</h3>
            <Input
              value={filterText || selected.name }
              onChange={this._filterServices.bind(this)}
            />
          </Col>
          <Col>
            <h3>Service Price</h3>
            <Input
              disabled={!selected.name && !filterText}
              onChange={this._modifyPrice.bind(this)}
              value={selected && selected.price}
            />
          </Col>
          <Col>
            <h2>PHP</h2>
          </Col>
        </Row>
        <h3> Services </h3>
        <Row type='flex' gutter={10} style={{marginBottom: '10px'}}>
          {services.map(this._renderService.bind(this))}
        </Row>
      </Modal>
    )
  }
}
