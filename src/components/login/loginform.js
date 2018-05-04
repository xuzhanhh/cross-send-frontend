import React, { Component } from 'react';
import { Tooltip, Form, Icon, notification, Input, Button, Checkbox } from 'antd';
import './login.less'
import { postData, send } from '../../utils/fetch'
import { ThemeContext } from '../../user-info-context'
import { Route, Link, Redirect } from 'react-router-dom'
const FormItem = Form.Item;

class OriginLoginForm extends React.Component {
  constructor(props){
    super(props)
    // this.state={
    //   isLogin: false, 
    // }
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // await fetch
        this._getInfo(values)
      }
    });
  }
  _test = async () => {
    let data = await postData('/xauth/test')
    console.log(data)
  }
  _getInfo = async (values) => {
    let data = await postData('/xauth/login', values)
    console.log(data)
    switch(data.code){
      case 0 :
        notification.success({
          message: '登录成功',
          description: `欢迎你, ${data.nickname}`
        })
        // this.setState({
        //   isLogin: true
        // })
        this.props.updateUserInfo(true, data.username, data.userid, data.nickname)
        break;
      case -1:
        notification.error({
          message:'登录失败',
          description: data.message
        })
        break;
    }
  }
  _logout =  async (values) => {
    // let data = await postData('/xauth/login', values)
    // console.log(data)
    await postData('/logout')
    this.props.updateUserInfo(false, null)
  }
  render() {
    console.log(this)
    const { getFieldDecorator } = this.props.form;
    const { from } = { from: { pathname: '/send' } }
    
    // const { from } = this.props.location.state || { from: { pathname: '/send' } }
    // const { isLogin } = this.state
    // if (isLogin) {
    //   return (<Redirect to={from}></Redirect>)
    // }
    return (
      <div className="login-form__wrapper">
        
        <ThemeContext.Consumer>
          {
            userInfo => 
          {return userInfo.isLogin?<Redirect to={from} />:null}
          }
        </ThemeContext.Consumer>

        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )} */}
             {/* <a className="login-form-forgot" href="">Forgot password</a> */}
             <Tooltip title="使用github登录"><a className="login-form__github" href="/xauth/github"><Icon type="github" /></a></Tooltip>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
          </Button>
            <Button onClick={this._test} className="login-form-button">
              test
          </Button>
            {/* <Button onClick={this._logout} className="login-form-button">
              logout
          </Button> */}
          {/* <a href="/logout">登出</a> */}
            Or <Link to="register">注册</Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const LoginForm = Form.create()(OriginLoginForm);
export default LoginForm 