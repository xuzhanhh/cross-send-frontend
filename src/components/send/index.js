import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { Layout, Menu, Icon, Button, Tabs, Col, Row } from 'antd';
import SendComponent from './send'
import ReceiveComponent from './receive'
import Welcome from './welcome'
import BeeBox from './beeBox'
import Introduce from './introduce'
import './index.less'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;

class Send extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uuid: '尚未拥有uuid',
      tabKey: '1',
      currentKey: 'welcome'
    }
  }
  render() {
    const { uuid, tabKey, currentKey } = this.state
    console.log(currentKey)
    return (
      <Layout style={{ flex: 1 }}>
        <Sider
          style={{ backgroundColor: '#fff' }}
          breakpoint="sm"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className="logo" />
          <Menu onClick={this._changeCurrentKey} mode="inline" selectedKeys={[currentKey]}>
            <Menu.Item key="welcome">
              <Icon type="rocket" />
              <span className="nav-text">欢迎</span>
            </Menu.Item>
            <Menu.Item key="send">
              <Icon type="upload" />
              <span className="nav-text">发送文件</span>
            </Menu.Item>
            <Menu.Item key="receive">
              <Icon type="download" />
              <span className="nav-text">接收文件</span>
            </Menu.Item>
            <Menu.Item key="beeBox">
              <Icon type="dropbox" />
              <span className="nav-text">蜜蜂箱</span>
            </Menu.Item>
            <Menu.Item key="introduce">
              <Icon type="bulb" />
              <span className="nav-text">用户手册</span>
            </Menu.Item>
            {/* <Menu.Item key="documents">
              <Icon type="api" />
              <span className="nav-text">文档</span>
            </Menu.Item> */}
            {/* <Menu.Item key="4">
              <Icon type="user" />
              <span className="nav-text">nav 4</span>
            </Menu.Item> */}
          </Menu>
        </Sider>


        <Content style={{ margin: '12px 0px' }}>
          <div className="content" style={{ minHeight: 360 }}>
            {/* <Tabs activeKey={tabKey} onChange={this._changeTab}>
              <TabPane tab="发送文件" key="1"><SendComponent/></TabPane>
              <TabPane tab="接收文件" key="2">Content of Tab Pane 2</TabPane>
              <TabPane tab="用户手册" key="3">Content of Tab Pane 3</TabPane>
            </Tabs> */}
            {(() => {
              switch (currentKey) {
                case 'welcome':
                  return <Welcome onClickCard = {this._changeCurrentKey}/>
                case 'send':
                  return <SendComponent />
                case 'receive': 
                  return <ReceiveComponent/>
                case 'beeBox':
                  return <BeeBox/>
                case 'introduce':
                  return <Introduce/>
                default:
                  return <div>服务器开小差了</div>
              }
            })()}
            <div style={{ lineHeight:'69px', height: '69px', textAlign: 'center' }}>
              xuzhanhong@GDUT 2018
        </div>
          </div>

        </Content>

      </Layout>
    )
  }
  _changeCurrentKey = (key) => {
    this.setState({
      currentKey: typeof key==='string'?key:key.key
    })
  }
  _changeTab = (key) => {
    this.setState({
      tabKey: key
    })
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

export default Send