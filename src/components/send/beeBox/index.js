import React, { Component } from 'react';
import { Modal, Layout, Menu, Icon, Button, Input, Row, Col } from 'antd'
import BeeSend from './bee-send'
import BeeReceive from './bee-receive'
class BeeBox extends React.Component {
  state = { sendVisible: false ,
            receiveVisible: false }

  showSend = () => {
    this.setState({
      sendVisible: true,
    });
  }
  showReceive = () => {
    this.setState({
      receiveVisible: true,
    });
  }
  sendHandleOk = (e) => {
    console.log(e);
    this.setState({
      sendVisible: false,
      receiveVisible: false,
    });
  }
  sendHandleCancel = (e) => {
    console.log(e);
    this.setState({
      sendVisible: false,
      receiveVisible: false,
    });
  }
  render() {
    return (
      <div>
        {/* <Button type="primary" onClick={this.showModal}>Open</Button> */}
        <Row type="flex" justify="center">
            <Col xs={24} md={12}>
              <div className="welcome__info" onClick={this.showSend}>
                <Icon type="cloud-upload-o" style={{ fontSize: '120px', color: '#83cdff' }} />
                <div className="welcome__info__send__title">我要寄件</div>
                {/* <div className="welcome__info__send__info">从这一终端选择文件并发送到指定终端(包括windows,mac,android等)</div> */}
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="welcome__info" onClick={this.showReceive}>
                <Icon type="cloud-download-o" style={{ fontSize: '120px', color: '#83cdff' }} />
                <div className="welcome__info__send__title">我要收件</div>
                {/* <div className="welcome__info__send__info">生成uuid,并等待发送端发送文件</div> */}
              </div>
            </Col>
          </Row>
        <Modal
          title="寄件"
          visible={this.state.sendVisible}
          onOk={this.sendHandleOk}
          onCancel={this.sendHandleCancel}
          footer={null}
        >
          <BeeSend closeModal={this.sendHandleCancel}/>
        </Modal>
        <Modal
          title="收件"
          visible={this.state.receiveVisible}
          onOk={this.sendHandleOk}
          onCancel={this.sendHandleCancel}
          footer={null}
          
        >
          <BeeReceive closeModal={this.sendHandleCancel}/>
        </Modal>
      </div>
    );
  }
}

export default BeeBox