import React from 'react'
import {Row, Col, Icon} from 'antd'

export function IconWithText(props, state) {
  return <Row type='flex' align='middle'>
    <Col span={2}>
      <Icon type={props.icon} />
    </Col>
    <Col span={22}>
      {props.children}
    </Col>
  </Row>
}
