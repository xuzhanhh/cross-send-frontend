import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { Layout, Menu, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class About extends Component {
  render() {
    return (
      <Layout>
      
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            this is about page
          </div>
        </Content>
      </Layout>
    )
  }
}
export default About