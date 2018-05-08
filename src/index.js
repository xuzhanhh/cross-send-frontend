import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom'

function askPermission() {
  return new Promise(function (resolve, reject) {
      var permissionResult = Notification.requestPermission(function (result) {
          // 旧版本
          resolve(result);
      });
      if (permissionResult) {
          // 新版本
          permissionResult.then(resolve, reject);
      }
  })
  .then(function (permissionResult) {
      if (permissionResult !== 'granted') {
          // 用户未授权
      }
  });
}

askPermission()
ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'))
registerServiceWorker();
