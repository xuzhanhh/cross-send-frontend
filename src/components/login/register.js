import React, { Component } from 'react';
import { Form, Icon, notification, Input, Button, Checkbox } from 'antd';
import { postData, send } from '../../utils/fetch'
import { Redirect } from 'react-router-dom'
import WrappedRegistrationForm from './registerForm'



class Register extends React.Component{
  render(){
    return(
      <div>
        <WrappedRegistrationForm {...this.props}/>
      </div>
    )
  }
}
export default Register