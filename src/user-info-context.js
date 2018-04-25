import React, { Component } from 'react';

// export const userInfo = {
//   isLogin: false,
//   username: null
// }
// export const UserContext = React.createContext(
//   userInfo
// )
export const userInfo = {
  // light: {
  //   foreground: '#ffffff',
  //   background: '#222222',
  // },
  // dark: {
  //   foreground: '#000000',
  //   background: '#eeeeee',
  // },
  isLogin: false,
  userName: null
};
export const ThemeContext = React.createContext({
  userInfo: userInfo,
  toggleTheme: () => {},
});

