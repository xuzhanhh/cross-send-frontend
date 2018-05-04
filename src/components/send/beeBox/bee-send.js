import React, { Component } from 'react';
import { getAuthorization } from 'cos-js-sdk-v5'
import { Checkbox, Steps, notification, message, Modal, Layout, Menu, Icon, Button, Input, Row, Col, Upload } from 'antd'
import { get, postData } from '../../../utils/fetch'
import { getAuth, url, } from '../../../utils/cos'
import './bee-send.less'
const Dragger = Upload.Dragger;
const Step = Steps.Step
class BeeSend extends React.Component {
  constructor(props) {
    super(props)
    this.fileInput = React.createRef();
    this.state = {
      loading: false,
      visible: false,
      fileList: [],
      uploading: false,
      uploadingInfo: 'uploading',
      currentStep: 0,
      needEmail: true,
      email: null
    }
  }
  _uploadData = async () => {
    const { fileList } = this.state
    let fileInfo = []
    for (let file of fileList) {
      let info = await getAuth()
      var fd = new FormData();
      let Key = 'dir/' + file.name;
      fd.append('key', Key);
      fd.append('Signature', info.Authorization);
      fd.append('Content-Type', '');
      info.XCosSecurityToken && fd.append('x-cos-security-token', info.XCosSecurityToken);
      fd.append('file', file);
      let res = await fetch(url, {
        method: 'post',
        body: fd
      })
      fileInfo.push({ res: res, key: Key, file })
    }
    return fileInfo
  }
  _onSendEmail = async (data) => {
    console.log(data)
    console.log('_onSendEmail')
  }
  render() {
    const { needEmail, authCode, loading, visible, uploading, uploadingInfo, currentStep } = this.state
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
        <Steps current={currentStep}>
          <Step title="上传文件" />
          <Step title="保存提取码" />
        </Steps>
        <div className="bee-send__contianer">
          {currentStep === 0 ?
            <div>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到这里上传</p>
                {/* <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p> */}
              </Dragger>
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
              </div></div> : null
          }
          {
            currentStep === 1 ?
              <div>
                <div className="bee-send__success">
                  上传成功,您的提取码为:&nbsp;&nbsp;<span className="bee-send__authcode">{authCode}</span>
                </div>
                <div className="bee-send__email">
                  <Input disabled={!needEmail} placeholder="填写email,我们将为您发送邮件" onChange={this._setEmail} />
                  <div className="bee-send__comfirm">
                    <Checkbox onChange={this._onWillSendEmail}>我不需要发送邮件</Checkbox>
                    <Button type="primary" onClick={this._onFinish}>完成</Button>
                  </div>
                </div>
              </div>
              : null
          }
        </div>
      </div>
    )
  }
  _setEmail = (e) => {
    console.log(e, e.target.value)
    this.setState({
      email: e.target.value
    })
  }
  _onFinish = () => {
    const { email, needEmail, authCode } = this.state
    if (needEmail) {
      postData('/sendAuthMail', {
        receiver: email,
        authCode
      })
      notification.success({
        message: '邮件发送成功',
        duration: 0,
        description: `已成功发送到邮箱: ${email}`
      })
    }

    this.setState({
      loading: false,
      visible: false,
      fileList: [],
      uploading: false,
      uploadingInfo: 'uploading',
      currentStep: 0,
      needEmail: true,
      email: null
    })
    this.props.closeModal()
  }
  _onWillSendEmail = (e) => {
    console.log(e)
    this.setState({
      needEmail: !e.target.checked
    })
  }

  handleUpload = async () => {
    const { fileList } = this.state;
    console.log(fileList)
    let response = await this._uploadData()
    console.log(response)
    let fileData = []
    // debugger
    for (let res of response) {
      if (res.res.status === 204) {
        fileData.push({
          key: res.key,
          fileName: res.file.name,
          fileSize: res.file.size,
          lastModified: res.file.lastModified
        })
      }
    }
    // if (postData.length > 0) {
    

    // }
    console.log(fileData)
    if (fileData.length > 0) {
      let storeInfo = await postData('/beeInfo', {
       'postData': fileData
      })
      if (storeInfo.code === 0) {
        const myKey = storeInfo.authCode
        const btn = (
          <Button type="primary" onClick={() => { this._onSendEmail(storeInfo.authCode); notification.close(myKey) }}>
            发送到邮箱
          </Button>
        );
        this.setState({
          currentStep: 1,
          authCode: storeInfo.authCode
        })
      } else {
        notification.error({
          message: '出现错误',
          duration: 0,
          description: '请稍后重试或联系网站管理员'
        })
      }
    }
  }
}
export default BeeSend