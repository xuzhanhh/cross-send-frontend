import React, { Component } from 'react';
import { Form, Icon, notification, Input, Button, Checkbox } from 'antd';
import { postData, send } from '../../utils/fetch'
import { Redirect } from 'react-router-dom'
import LoginForm from './loginform'
class Login extends React.Component{
  render(){
    return(
      <div>
        <LoginForm {...this.props}/>
      </div>
    )
  }
}
export default Login