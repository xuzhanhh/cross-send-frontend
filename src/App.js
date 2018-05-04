import React, { Component } from 'react';
// import Button from 'antd/lib/button';
import { notification, Layout, Menu, Icon, Button } from 'antd';
import './App.less';
// import { subscribeToTimer } from './api';
import { Send, Intro, About } from './components/index'
import { Route, Link } from 'react-router-dom'
import { UserContext, userInfo, ThemeContext, themes } from './user-info-context'
import { postData, send } from './utils/fetch'
import Register from './../src/components/login/register'
import UserList from './components/login/UserList/index'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;



class ThemeTogglerButton extends React.Component {

  render() {
    return (
      <ThemeContext.Consumer>
        {userInfo => (
          <div><Button onClick={() => this.props.onClick(false, '傻逼')}></Button>{console.log(userInfo, this.props)}{JSON.stringify(userInfo)}</div>
        )}
      </ThemeContext.Consumer>
    )
  }
}

function Toolbar(props) {
  return (
    <ThemeTogglerButton onClick={props.changeTheme}>
      更变用户
    </ThemeTogglerButton>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      userInfo: userInfo,
      current: window.location.pathname.substr(1, window.location.pathname.length - 1) ? window.location.pathname.substr(1, window.location.pathname.length - 1) : 'intro'
    }
    this.updateUserInfo = (isLogin, userName, userId, nickname) => {
      this.setState(state => ({
        userInfo: {
          isLogin: isLogin,
          userName: userName,
          userId: userId,
          nickName: nickname
        }
      }));
    };
  }
  handleClick = (key) => {
    this.setState({
      current: key.key
    })
    if (key.key === 'logout') {
      this._logout()
    }
    switch (key.key) {
      case 'logout':
        this._logout()
        break;
      case 'friendList':
        break;
    }

  }
  _logout = async (values) => {
    // let data = await postData('/xauth/login', values)
    // console.log(data)
    await postData('/logout')
    notification.success({
      message: '登出成功',
    })
    this.updateUserInfo(false, null)
  }
  render() {
    console.log(this.state)
    const { userInfo } = this.state
    return (
      <ThemeContext.Provider value={this.state.userInfo}>
        <Layout style={{ height: '100%' }}>
          <Header style={{ backgroundColor: '#fff', padding: 0 }} >
            <div className="header__project" style={{ float: 'left', marginLeft: '20px' }}>
              <div className="header__icon"></div>
              <div className="header__title">Cross Send</div>
            </div>
            <Menu
              // theme="dark"
              selectedKeys={[this.state.current]}
              onClick={this.handleClick}
              mode="horizontal"
              style={{ backgroundColor: '#fff', lineHeight: '64px', float: 'right' }}
            >
              <Menu.Item key="intro"><Link to="intro">介绍</Link></Menu.Item>
              <Menu.Item key="send"><Link to="send">收发文件</Link></Menu.Item>
              {/* <Menu.Item key="about"><Link to="about">Login</Link></Menu.Item> */}

              <SubMenu key="sub1" title={<span><Icon type="user" /><span>{userInfo.userName ? userInfo.userName : '用户'}</span></span>}>
                {userInfo.isLogin ? null : <Menu.Item key="about"><Link to="about">登录/注册</Link></Menu.Item>}
                <Menu.Item key="6">设定</Menu.Item>
                {userInfo.isLogin ? <Menu.Item key="friendList"><Link to="userList">好友列表</Link></Menu.Item> : true}
                {userInfo.isLogin ? <Menu.Item key="logout">登出</Menu.Item> : true}

              </SubMenu>
            </Menu>

          </Header>
          <Route path="/intro" component={Intro}></Route>
          <Route path="/" exact={true} component={Intro}></Route>
          <Route path="/send" component={Send}></Route>
          {/* <Route path="/about" component={About}></Route> */}
          <Route path="/about" render={() => <About updateUserInfo={this.updateUserInfo}></About>}></Route>
          <Route path="/register" render={() => <Register updateUserInfo={this.updateUserInfo}></Register>}></Route>
          <Route path="/userList" render={() => <UserList updateUserInfo={this.updateUserInfo } userInfo={userInfo}></UserList>}></Route>

        </Layout>
      </ThemeContext.Provider>
    );
  }
}

export default App;