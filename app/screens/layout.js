import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Menu } from 'antd'

import Editor from './editor'
import Sidebar from './sidebar'

import {closeEditor} from '../actions/layout'

const Item = Menu.Item

import paw from '../static/paw.png'

class Layout extends Component {
  constructor(){
    super()
    this.state = {
      current: 'clients'
    }
  }
  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key,
    })
  }

  render(){
    return  <div>
              {/* <Row type='flex'
                style={{
                  padding: '0 20px'
                }}
                align='middle'
                justify='space-between' className='navigation'>
                <Col span={4}>
                  <h5> Aroma Pet Spa Database </h5>
                </Col>
                <Col span={20}>
                  <Menu
                    mode='horizontal'
                    onClick={this.handleClick.bind(this)}
                    selectedKeys={[this.state.current]}
                    >
                    <Item key='clients'>
                      Clients
                    </Item>
                    <Item key='animals'>
                      Animals
                    </Item>
                  </Menu>
                </Col>
              </Row> */}

              <Row type='flex' style={{minHeight: '100vh'}}>
                <Col span={5}>
                  <Sidebar />
                </Col>
                <Col span={19}>
                  {this.props.children}
                </Col>
              </Row>
              {this.props.editor ? <Editor client={this.props.activeClient}/> : null}
            </div>
  }
}

export default connect(store => ({
  editor: store.layout.editor,
  activeClient: store.clients.active
}))(Layout)
