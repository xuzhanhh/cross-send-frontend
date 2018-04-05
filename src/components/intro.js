import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { Layout, Menu, Icon } from 'antd';
import { Route, Link } from 'react-router-dom'
import './intro.less'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class About extends Component {
  render() {
    return (
      <Layout>

        <Content style={{ margin: '24px 16px 0' }}>
          <div className="banner page">
            <div className="text-wrapper" style={{ opacity: 1 }}>
              <h1 className="" style={{ opacity: 1, transform: 'translate(0px, 0px)' }}>Cross Send</h1>
              <p className="" style={{ opacity: 1, transform: 'translate(0px, 0px)' }}>
                {/* <span>一个服务于企业级产品的设计体系。基于『确定』和『自然』的设计价值观，通过模块化的解决方案，让设计者专注于更好的用户体验。</span> */}
                <span>基于『便捷』和『自然』的设计价值观，通过跨终端跨系统解决方案，让用户专注于更好的文件传输体验。</span>
              </p>
              <div className="banner-btns" style={{ opacity: 1, transform: 'translate(0px, 0px)' }}>
              <Link to="send"><a className="banner-btn components" >
                  <span style={{color: '#fff'}}>开始使用</span></a></Link>
                <a className="banner-btn language" href="/docs/spec/introduce-cn">
                  <span>用户手册</span></a>
                {/* <span class="github-btn github-btn-large"><a class="" href="gh-btn//github.com/ant-design/ant-design/" target="_blank"><span class="gh-ico" aria-hidden="true"></span><span class="gh-text">Star</span></a><a class="gh-count" target="_blank" href="//github.com/ant-design/ant-design/stargazers/" style={{display: 'block'}}>26257</a></span> */}
              </div>
            </div>
          </div>
        </Content >
      </Layout >
    )
  }
}
export default About