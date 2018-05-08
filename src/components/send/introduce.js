import React from 'react'
import { Tabs, Carousel, Button } from 'antd'
import './introduce.less'
import IntroduceContent from './introduce-content'
const TabPane = Tabs.TabPane;
class Introduce extends React.Component {
  render() {
    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
          style={{ height: 220 }}
        >
          <TabPane tab="简介" key="1"><IntroduceContent tab={'introMD'}/></TabPane>
          <TabPane tab="收/发文件" key="2"><IntroduceContent tab={'sendreceiveMD'}/></TabPane>
          <TabPane tab="蜜蜂箱" key="3"><IntroduceContent tab={'beeBoxMD'}/></TabPane>
          <TabPane tab="注册/登录" key="4"><IntroduceContent tab={'registerLoginMD'}/></TabPane>
          <TabPane tab="好友交互" key="5"><IntroduceContent tab={'interactionMD'}/></TabPane>
        </Tabs>
      </div>
    )
  }

}
export default Introduce