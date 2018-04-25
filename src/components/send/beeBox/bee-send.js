import React, { Component } from 'react';
import { getAuthorization } from 'cos-js-sdk-v5'
import { notification, message, Modal, Layout, Menu, Icon, Button, Input, Row, Col, Upload } from 'antd'
import { get } from '../../../utils/fetch'
import { getAuth, url} from '../../../utils/cos'
const Dragger = Upload.Dragger;

class BeeSend extends React.Component {
  constructor(props){
    super(props)
    this.fileInput = React.createRef();
    this.state = {
      loading: false,
      visible: false,
      fileList: [],
      uploading: false,
      uploadingInfo: 'uploading',
    }
  }
  _uploadData = async ()=>{
    const { fileList } = this.state
    let file = fileList[0]
    let info = await getAuth()
    console.log(info)
    var fd = new FormData();
    let Key = 'dir/' + file.name;
    fd.append('key', Key);
    fd.append('Signature', info.Authorization);
    fd.append('Content-Type', '');
    info.XCosSecurityToken && fd.append('x-cos-security-token', info.XCosSecurityToken);
    fd.append('file', file);

    let res = await fetch(url, {
      method:'post',
      // mode:'cors', 
      // headers: {
      //           'Content-Type': 'multipart/form-data'
      //       },                                                                          
      body:fd
    })
    console.log(res)    
    console.log(res.headers)
    for (var pair of res.headers.entries()) {
      console.log(pair[0]+ ': '+ pair[1]);
   }
    console.log(res.body.getReader())
    return res
  }

  render() {
    const { loading, visible, uploading, uploadingInfo } = this.state    
    const uploadProps = {
      name: 'file',
      multiple: true,
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    }
    return (
      <div>
        {/* <h1>Ajax Post 上传</h1> */}

        {/* <input id="fileSelector" type="file" ref={this.fileInput}/> */}
        {/* <Button onClick={this._uploadData}>放入蜜蜂箱</Button> */}
        <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
          </Dragger>
          {/* <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" /> Select File
          </Button>
          </Upload> */}
          <div className="upload-start">
            <Button
              className="upload-demo-start"
              type="primary"
              onClick={this.handleUpload}
              disabled={this.state.fileList.length === 0}
              loading={uploading}
            >
              {uploading ? uploadingInfo : '放入蜜蜂箱'}
            </Button>
          </div>
        <div id="msg"></div>
      </div>
    )
  }
  handleUpload = async() => {
    const { fileList } = this.state;
    console.log(fileList)
    let res = await this._uploadData()
    if(res.code === 204){
      notification.success({
        message: '文件存放完成',
      })
    }
  }
}
export default BeeSend