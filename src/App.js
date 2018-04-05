import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { Layout, Menu, Icon } from 'antd';
import './App.less';
// import { subscribeToTimer } from './api';
import { Send, Intro, About } from './components/index'
import { Route, Link } from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class App extends Component {
  constructor(props) {
    super(props);
    console.log(window.location.pathname)
    // subscribeToTimer((err, timestamp) => {
    //   console.log('getDataFromTimer', timestamp)
    //   this.setState({
    //     timestamp
    //   })
    // }
    // );
    this.state = {
      current: window.location.pathname.substr(1, window.location.pathname.length - 1) ? window.location.pathname.substr(1, window.location.pathname.length - 1) : 'intro'
    }
  }
  handleClick = (key) => {
    this.setState({
      current: key.key
    })
  }
  render() {
    console.log(this.state.current)
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{backgroundColor:'#fff', padding: 0 }} >
          <div className="header__project"style={{ float: 'left', marginLeft: '20px' }}>
            <div className="header__icon"></div>
            <div className="header__title">Cross Send</div>
          </div>
          <Menu
            // theme="dark"
            selectedKeys={[this.state.current]}
            onClick={this.handleClick}
            mode="horizontal"
            style={{backgroundColor:'#fff', lineHeight: '64px', float: 'right' }}
          >
            <Menu.Item key="intro"><Link to="intro">intro</Link></Menu.Item>
            <Menu.Item key="send"><Link to="send">send / recive</Link></Menu.Item>
            <Menu.Item key="about"><Link to="about">about</Link></Menu.Item>
          </Menu>

        </Header>
        <Route path="/intro" component={Intro}></Route>
        <Route path="/send" component={Send}></Route>
        <Route path="/about" component={About}></Route>

      </Layout>
    );
  }
}

export default App;