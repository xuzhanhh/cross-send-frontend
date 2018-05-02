import React, { Component } from 'react';
import { getAuthorization } from 'cos-js-sdk-v5'
import { Table, notification, Modal, Layout, Menu, Icon, Button, Input, Row, Col, Upload } from 'antd'
import { get, postData } from '../../../utils/fetch'
import { getAuth, url } from '../../../utils/cos'
import { timestampToTime, fileSize } from '../../../utils/utils'
const Search = Input.Search;
class BeeReceive extends React.Component {
  constructor(props) {
    super(props)
    this.downloadLink = React.createRef();
    this.state = {
      getFile: false
    }
  }


  render() {
    const { getFile, dataSource, columns } = this.state
    return (
      <div>
        <Search
          placeholder="输入取件码"
          enterButton="确认"
          onSearch={this._onSearch}
        />
        <div className="bee-receive__download">
          {/* {getFile?<a ref={this.downloadLink} download >点击下载</a>:null} */}
          {getFile ? <Table dataSource={dataSource} columns={columns} /> : null}
        </div>
      </div>
    )
  }

  _onSearch = async (value) => {
    let res = await postData('/getBeeInfo', { authCode: value })
    console.log(res)
    if (res.code === '0') {
      notification.success({message:'文件提取成功'})
      this.setState({
        getFile: true,
        columns: [{
          title: '文件名',
          dataIndex: 'fileName',
          key: 'fileName',
        }, {
          title: '最后修改时间',
          key: 'lastModified',
          render: (text, record) => (
            <span>{timestampToTime(record.lastModified)}</span>
          )
        }, {
          title: '文件大小',
          key: 'fileSize',
          render: (text, record) => (
            <span>{fileSize(new Number(record.fileSize))}</span>
          )
        }, {
          title: '下载',
          key: 'action',
          render: (text, record) => (
            <a href={url + record.key} download >点击下载</a>
          )
        }
        ],
        dataSource: res.data
      })
    } else {
      notification.error({message:'文件提取失败', description: res.errMessage})
      this.setState({
        getFile: false
      })
    }
  }


}

export default BeeReceive