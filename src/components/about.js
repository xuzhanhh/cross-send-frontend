import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { Layout, Menu, Icon } from 'antd';
import Login from './login'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class About extends Component {
  render() {
    return (
      <Layout>
      
        <Content style={{ margin: '24px 16px 0' }}>
          <Login {...this.props}/>
        </Content>
      </Layout>
    )
  }
}
export default About