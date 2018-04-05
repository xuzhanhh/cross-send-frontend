import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { Layout, Menu, Icon, Button, Input, Row, Col } from 'antd';
import './index.less'
const Search = Input.Search;
class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    const { } = this.state
    const { onClickCard } = this.props
    return (
      <div className="welcome">
        <div className="welcome__header">请问你需要</div>
        <Row type="flex" justify="center">
          <Col xs={24} md={12}>
            <div className="welcome__info" onClick={()=>{onClickCard('send')}}>
            <Icon type="rocket" style={{fontSize:'120px', color:'#83cdff'}}/>
            <div className="welcome__info__send__title">发送文件</div>
            <div className="welcome__info__send__info">从这一终端选择文件并发送到指定终端(包括windows,mac,android等)</div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="welcome__info" onClick={()=>{onClickCard('receive')}}>
            <Icon type="gift" style={{fontSize:'120px', color:'#83cdff'}}/>
            <div className="welcome__info__send__title">接收文件</div>
            <div className="welcome__info__send__info">生成uuid,并等待发送端发送文件</div>
            
            </div>
          </Col>
          {/* <Col xs={24} md={8}><div className="welcome__info">333</div></Col> */}
        </Row>
      </div>
    )
  }


}

export default Welcome