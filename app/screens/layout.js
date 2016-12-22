import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'antd'

import Editor from './editor'
import Sidebar from './sidebar'
import Pet from './pet'
import Record from './record'
import Services from './services'

import {closeEditor} from '../actions/layout'

class Layout extends Component {
  render(){
    const {editor, transaction, record, pet, services} = this.props.layout
    return  <div>
              <Row type='flex' style={{minHeight: '100vh'}}>
                <Col span={5}>
                  <Sidebar />
                </Col>
                <Col span={19}>
                  {this.props.children}
                </Col>
              </Row>
              <Record
                transaction={this.props.transaction || {}}
                newTransaction={transaction}
                pickService={services}
                open={record}
                dispatch={this.props.dispatch}
                client={this.props.activeClient} />
              <Editor open={editor}
                client={this.props.activeClient}/>
              <Pet dispatch={this.props.dispatch}
                edited={this.props.editPet}
                pet={this.props.pet} open={pet}/>
              <Services open={services} services={this.props.services}
                dispatch={this.props.dispatch}
                transaction={this.props.transaction}/>
            </div>
  }
}

export default connect(store => ({
  services: store.services,
  layout: store.layout,
  transaction: store.clients.newTransaction,
  pet: store.clients.activePet,
  activeClient: store.clients.active
}))(Layout)
