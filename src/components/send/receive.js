import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { notification, Layout, Menu, Icon, Button, Input, Spin, Radio, Tooltip, Modal, message, List, Progress } from 'antd';
import { subscribeSend, socket } from './send-api'
import Clipboard from 'react-clipboard.js';
import { get } from '../../utils/fetch'
import './index.less'
const Search = Input.Search;
const RadioGroup = Radio.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
class ReceiveComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      selectValue: null,
      step: 1,
      showComfirm: false,
      fileInfo: {
        fileName: 'null',
      },
      receiveFile: new Map()
    }
    this.chunkSize = 1024 * 1024
  }
  render() {
    const { currentFileInfo, loading, selectValue, step, uuid, showComfirm, fileInfo, receiveFile } = this.state
    const listDataSource = []
    receiveFile.forEach(value=>{
      listDataSource.push(value)
    })
    console.log('render', loading)
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    console.log('render', socket)

    return (
      <div>
        {step === 1 ?
          (<div className="receive-area">
            <div className="receive-area__icon"><Icon style={{ fontSize: '120px' }} type="question" /></div>
            <div className="receive-area__info">
              请问你是下述选项的那种?
            </div>
            <RadioGroup onChange={this.onChangeSelectValue} value={selectValue}>
              <Radio style={radioStyle} value={1}><Tooltip placement="right" title="我将为您提供uuid" text>这是我想接受文件的第一台设备</Tooltip></Radio>
              {/* <br /> */}
              <Radio style={radioStyle} value={2}><Tooltip placement="right" title="您需要输入uuid来进行配对">这是我想接收文件的其余设备</Tooltip></Radio>
            </RadioGroup>
            {selectValue === 2 ? <Input placeholder="请输入uuid" /> : null}
            <Button onClick={this._gotoStep2}>下一步</Button>
          </div>) : null
        }
        {
          step === 2 ? (
            <div>
              <div className="receive-area__uuid">你的uuid为:
                <Input className="receive-area__uuid-place" value={uuid} disabled={true}></Input>
                <span className="receive-area__uuid-copy">
                  {/* <Button type="primary">复制到剪切板</Button> */}
                  <Clipboard component="a" data-clipboard-text={uuid} onSuccess={() => { message.success('复制成功') }}>
                    复制到剪切板
                  </Clipboard>
                </span>
              </div>
              <div className="receive-area__file">
                {receiveFile && receiveFile.size > 0 ? (
                  <List
                    itemLayout="horizontal"
                    // dataSource={Array.from(receiveFile)}
                    dataSource={listDataSource}
                    renderItem={item => (
                      <List.Item style={{ margin: '20px' }} actions={[<a disabled={!item.isFinish} download={item.aDownload} href={item.aHref}>保存</a>]}>
                        <List.Item.Meta
                          title={item.fileName}
                        />
                        {console.log('listItem', item)}
                        {/* <div>{item.currentInfo}</div> */}
                        <Progress style={{ marginBottom: '3px', marginRight: '20px' }} percent={(item.currentInfo * 100).toFixed(2)} status="active" />
                      </List.Item>
                    )}
                  />) : <div className="receive-area__file-loading"><Spin size="large" indicator={antIcon} /><div>等待接收文件</div></div>
                }
              </div>
            </div>
          ) : null
        }
        <Modal title="请确认" visible={showComfirm} onOk={this._onOkModal} onCancel={this._onCancelModal}>
          向您发送了{currentFileInfo?Object.keys(currentFileInfo).length:null}个文件:
          {currentFileInfo?this._renderFileInfo():null}
          <div style={{float:'right'}}>是否下载?</div></Modal>
      </div>)
  }
  _renderFileInfo(){
    const { currentFileInfo } = this.state
    let output = []
    
    Object.keys(currentFileInfo).forEach((fileName)=>{
      let fileInfo = currentFileInfo[fileName]
      output.push(<div key={fileInfo.fileName}>{`${fileInfo.fileName} 约(${this._genNumber(fileInfo.fileSize)})`}</div>)
    })
    return output
    // return `${fileInfo.fileName} 约(${this._genNumber(fileInfo.fileSize)})`
  }
  _genNumber(fileSize){
    // console.log(fileSize)
    let myFileSize = fileSize
    let suffix = ['B', 'KB', 'MB', 'GB'], i = 0
    for (i = 0; (myFileSize / 1024) > 1; i++) {
      myFileSize /= 1024
    }
    console.log(myFileSize)
    return myFileSize && Number(myFileSize).toFixed(1) + suffix[i]
  }

  _onCancelModal = () => {
    this.setState({
      showComfirm: false
    })
    socket && socket.emit('refuseSend')
  }
  _onOkModal = () => {
    this.setState({
      showComfirm: false
    })
    socket && socket.emit('allowSend')
  }
  onChangeSelectValue = (e) => {
    this.setState({
      selectValue: e.target.value
    })
  }
  _createSocket = async (uuid) => {
    this._setLoading(true)
    // console.log(this.state.loading)
    console.log(uuid)
    await subscribeSend(uuid, this._bind)
    this._setLoading(false)
    // console.log(this.state.loading)

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
  _gotoStep2 = async () => {
    let uuid = await this._getUuid()
    this._createSocket(uuid)
    this.setState({
      step: 2
    })
    console.log('_gotoStep2', socket)
  }
  _findUuid = async (uuid) => {
    // let isRoomExist = await get(`/findUniqueId?uuid=${uuid}`)
    let isRoomExist = await get(`/findUniqueId`)
    console.log(isRoomExist)
  }
  _bind = () => {
    console.log('bind', socket)
    let { receiveFile } = this.state
    socket && socket.on('fileInfo', (ret) => {
      let fileInfo = JSON.parse(ret)
      console.log('fileInfo', fileInfo)
      let mapFileInfo = receiveFile
      Object.keys(fileInfo).forEach((key) => {
        let fileName = key
        let value = fileInfo[key]
        mapFileInfo.set(fileName, Object.assign(value, {
          fileName: value.fileName,
          aDownload: value.fileName,
          currentInfo: 0
        }))
      })
      console.log(mapFileInfo)

      this.setState({
        currentFileInfo: fileInfo,
        receiveFile: mapFileInfo,
        showComfirm: true,
      })
      // this.setState({
      //   fileInfo,
      //   showComfirm: true,
      // })
      // this.setState(()=>{return{
      //   receiveFile: [{
      //     fileName: `${fileInfo.fileName}`,
      //     aDownload: `${fileInfo.fileName}`,
      //     currentInfo: 0,
      //   }]
      // }})
    })
    socket && socket.on('sendChunkLength', (res) => {
      let { receiveFile } = this.state
      receiveFile.set(res.fileName, Object.assign(receiveFile.get(res.fileName), {
        tempBlob : [],
        totalRecive : res.times,
        fileSize : res.totalSize,
        tempRecive: 1,
      }))
      this.setState({
        receiveFile
      })
      console.log('sendChunkLength', receiveFile)
    })
    socket && socket.on('binary', (data) => {
      let { receiveFile } = this.state
      const { fileName } = data
      let tempReceive = receiveFile.get(fileName) 
      console.log('[default] [binary]', data.index, data.buffer.byteLength)
      //如果完全接受
      if (tempReceive.tempRecive === tempReceive.totalRecive) {
        //放入最后一个
        tempReceive.tempBlob.push(data.buffer)
        var blob = new Blob(tempReceive.tempBlob);
        var objectUrl = URL.createObjectURL(blob);
        console.log(blob.size)

        // let preFileInfo = this.state.receiveFile[0]
        tempReceive.currentInfo = 1
        tempReceive.aHref = objectUrl
        tempReceive.isFinish = true
        receiveFile.set(fileName, tempReceive)
        this.setState({
          receiveFile
        })
        data.buffer.byteLength>0&&notification.success({
          duration:2,
          message: '下载完成',
          description: `${fileName}下载完成`
        })
        console.log('finish', receiveFile)
      } else {
        console.log(this.state)
        // let preFileInfo = this.state.receiveFile[0]
        tempReceive.currentInfo = this.chunkSize * (++(tempReceive.tempRecive)) / Number(tempReceive.fileSize)
        tempReceive.currentInfo = tempReceive.currentInfo>1?1:tempReceive.currentInfo
        tempReceive.isFinish = false
        tempReceive.tempBlob.push(data.buffer)
        receiveFile.set(fileName, tempReceive)
        this.setState({
          receiveFile
        })
        // this.tempBlob.push(data.buffer)
      }
    });
  }

  _getUuid = async () => {
    {
      let uuid = await fetch('/createUniqueId').then(res => { return res.json() }).then(data => { return data.uuid })
      this.setState({
        uuid
      })
      console.log(uuid)
      return uuid
    }

  }
}

export default ReceiveComponent