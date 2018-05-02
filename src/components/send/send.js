import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { Layout, Menu, Icon, Button, Input, Spin, message, Modal, Upload } from 'antd';
import { subscribeSend, getFileInfo, socket } from './send-api'
import { get } from '../../utils/fetch'
import './index.less'
const Search = Input.Search;
const Dragger = Upload.Dragger;
class SendComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      visible: false,
      fileList: [],
      uploading: false,
      uploadingInfo: 'uploading',
    }
    this.sendingTimes = 0
    this.sendingData
    this.sendingDataInfo = {}
    this.chunkSize = 1024 * 1024
  }
  sendChunk = (reciveIndex, fileInfo) => {
    console.log('sendChunk', fileInfo)
    let dataWillSend = fileInfo.sendingTimes - reciveIndex > 1 ?
    fileInfo.sendingData.slice(reciveIndex * this.chunkSize, (reciveIndex + 1) * this.chunkSize)
      : fileInfo.sendingData.slice(reciveIndex * this.chunkSize, fileInfo.sendingData.byteLength)


    socket.emit('upload', {buffer: fileInfo.sendingData.slice(reciveIndex * this.chunkSize, (reciveIndex + 1) * this.chunkSize), index: reciveIndex, fileName: fileInfo.fileName }, (resIndex, retFileName) => {
      console.log('upload success', retFileName)
      // let fileInfo = JSON.parse(retfileInfo)
      let fileInfo = this.sendingDataInfo[retFileName]
      if (resIndex < fileInfo.sendingTimes) {
        this.sendChunk(resIndex + 1, fileInfo)
      } else {
        this._finishUploadFile()
        message.success('上传成功')
      }
    });
  }

  handleUpload = () => {
    const { fileList } = this.state;
    this.setState({
      uploading: true,
      uploadingInfo: '读取文件中'
    });
    let totalFileInfo = {}
    fileList.forEach((file) => {
      totalFileInfo[file.name] = {
        fileName : file.name,
        fileSize : file.size
      }
    })
    console.log('totalFileInfo', totalFileInfo)
    getFileInfo(totalFileInfo)
    fileList.forEach((file) => {
      console.log(file)
      this.setState(() => { return { uploadingInfo: '等待接收方确认' } })
      let reader = new FileReader();
      reader.fileName = file.name
      reader.readAsArrayBuffer(file)
      reader.onload = (e) => {
        let data = e.target.result; // 'data:image/jpeg;base64,/9j/4AAQSk...(base64编码)...'            
        let fileName = e.target.fileName
        console.log(e)
        this.sendingDataInfo[fileName] = {}
        this.sendingDataInfo[fileName].sendingData = data
        let times = Math.ceil(data.byteLength / this.chunkSize)
        this.sendingDataInfo[fileName].sendingTimes = times
        this.sendingDataInfo[fileName].fileName = fileName

        // debugger
        socket.emit('getChunkLength', { fileName:fileName, times: times, totalSize: data.byteLength })
        // this.sendChunk(0)
      }
    });

  }
  _finishUploadFile = () => {
    this.setState({
      uploading: false
    })
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
    console.log('render', loading)
    return (
      <div className="send-area">
        <div className="send-area--wrapper">
          <Icon style={{ fontSize: '120px' }} type="search" />
          <div className="send-area-info">请输入接收设备的uuid</div>
          <div><Search onSearch={this._findUuid} style={{ width: '70%' }} placeholder="" enterButton="comfirm" />
          </div>
        </div>
        {loading ? <Spin></Spin> : null}
        <Modal
          title="上传文件"
          visible={visible}
          onOk={this._handleUploadModalCancel}
          onCancel={this._handleUploadModalCancel}
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到这里上传</p>
            {/* <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p> */}
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
              {uploading ? uploadingInfo : 'Start Upload'}
            </Button>
          </div>
        </Modal>
      </div>
    )
  }
  _handleUploadModalCancel = () => {
    this.setState({
      visible: false
    })
  }
  _createSocket = async (uuid) => {
    this._setLoading(true)
    // console.log(this.state.loading)
    // console.log(data)
    await subscribeSend(uuid)
    this._setLoading(false)
    this._bind()
    // console.log(this.state.loading)

  }
  _bind = () => {
    console.log('_bind')
    socket.on('allowSend', () => {
      console.log('allowSend', this.sendingDataInfo)
      Object.keys(this.sendingDataInfo).forEach((fileName)=>{
        this.sendChunk(0, this.sendingDataInfo[fileName])
      })
      
      this.setState(() => { return { uploadingInfo: '发送中' } })
    })
    socket.on('refuseSend', () => {
      message.error('对方拒绝接收文件! 请检查')
      this.setState({
        uploading: false
      })
    })
  }
  _setLoading = (condition) => {
    // this.setState({
    //   loading: condition
    // })
    console.log('_setLoading', condition)
    this.setState(() => {
      return {
        loading: condition
      }
    });
  }

  _findUuid = async (uuid) => {
    let ret = await get(`/findUniqueId?uuid=${uuid}`)
    switch (ret.code) {
      case -1:
        message.error(ret.errMessage)
        break
      case 1:
        message.success('成功连接')
        await this._createSocket(uuid)
        this.setState({
          visible: true,
        })
        break
      default:
        message.error('服务器开小差了')
    }
    // let isRoomExist = await get(`/findUniqueId`)
    // {
    // let isRoomExist =  await fetch('/findUniqueId').then(res => { return res.json() }).then(data => { return data })
    // console.log(isRoomExist)
    // }
  }

  _getUuid = async () => {
    {
      let uuid = await fetch('/createUniqueId').then(res => { return res.json() }).then(data => { return data.uuid })
      this.setState({
        uuid
      })
      console.log(uuid)
    }

  }
}

export default SendComponent