import React, { Component } from 'react';
import { getAuthorization } from 'cos-js-sdk-v5'
import { notification,Modal, Layout, Menu, Icon, Button, Input, Row, Col, Upload } from 'antd'
import { get } from '../../../utils/fetch'
import { getAuth, url } from '../../../utils/cos'

const Search = Input.Search;
class BeeReceive extends React.Component {
  constructor(props) {
    super(props)
    this.downloadLink = React.createRef();
    this.state={
      getFile:true
    }
  }


  render() {
    const { getFile } = this.state
    return (
      <div>
        <Search
          placeholder="输入取件码"
          enterButton="确认"
          onSearch={this._onSearch}
        />
        <div className="bee-receive__download">
          {getFile?<a ref={this.downloadLink} download >点击下载</a>:null}
        </div>
      </div>
    )
  }

  _onSearch = async (value) => {
    console.log(value)
    let info = await getAuth()
    let res = await fetch(url + `${value}`, {
      headers: {
        // Authorization: info.Authorization
      }
    })
    console.log(res)
    console.log(res.status)
    if (res.status === 200) {
      notification.success({
        message: '文件提取完成',
      })
      console.log(this.downloadLink)
      this.downloadLink.current.href = res.url
      this.setState({
        getFile: true
      })
    }
  }


}

export default BeeReceive