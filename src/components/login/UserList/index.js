import React from 'react'
import { notification, Modal, Layout, List, Avatar, Button, Spin, Input } from 'antd';
import reqwest from 'reqwest';
import './index.less'
import { postData } from '../../../utils/fetch'
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search
class UserList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      loadingMore: false,
      showLoadingMore: true,
      data: [],
      showUser: false,
      isClickSearch: false,
      searchData: []
    }

  }
  componentDidMount() {
    this._searchFriends()
  }
  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }
  render() {
    const { loading, loadingMore, showLoadingMore, data, searchData, isClickSearch } = this.state;
    // const loadMore = showLoadingMore ? (
    //   <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
    //     {loadingMore && <Spin />}
    //     {!loadingMore && <Button onClick={this.onLoadMore}>loading more</Button>}
    //   </div>
    // ) : null;
    return (
      <Layout>
        <div className="user-list">
          {/* <div className="user-list__title">好友列表</div> */}
          <div className="user-list__wrapper">
            <List
              header={<div>好友列表</div>}
              bordered
              className="demo-loadmore-list"
              loading={loading}
              itemLayout="horizontal"
              // loadMore={loadMore}
              dataSource={data}
              renderItem={item => (
                <List.Item actions={[
                  <Button onClick={() => { this._onClickAddFriend(item) }}>私信</Button>,
                  <Button onClick={() => { this._onClickAddFriend(item) }}>发送文件</Button>,
                  <Button type="danger" onClick={() => { this._onClickAddFriend(item) }}>删除好友</Button>]}>
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.nickname}</a>}
                  />
                </List.Item>
              )}
            />
            <Button onClick={this._onClickShowAddFriend}>添加好友</Button>
          </div>
          {/* <div className="user-list__add">
            <Button style={{margin:'0 auto'}}onClick={this._onClickAddFriend}>添加好友</Button>
          </div> */}
          <Modal
            title="添加好友"
            visible={this.state.showUser}
            footer={null}
            onCancel={this.handleCancel}
          >
            <div>
              {/* <Search placeholder="请输入用户昵称" enterButton="搜索" onSearch={value => console.log(value)}/> */}
              <Search placeholder="请输入用户昵称" enterButton="搜索" onSearch={value => { this._onClickShowByKeyword(value) }} />
              {isClickSearch ? <List
                style={{ marginTop: '20px' }}
                header={<div>搜索结果</div>}
                bordered
                className="demo-loadmore-list"
                loading={loading}
                itemLayout="horizontal"
                // loadMore={loadMore}
                dataSource={searchData}
                renderItem={item => (
                  <List.Item actions={[<Button onClick={() => { this._onClickAddFriend(item) }}>添加好友</Button>]}>
                    <List.Item.Meta
                      title={<a href="https://ant.design">{item.nickname ? item.nickname : ''}</a>}
                    />
                  </List.Item>
                )}
              /> : null}
            </div>
          </Modal>
        </div>

      </Layout >
    );
  }
  handleCancel = (e) => {
    this.setState({
      showUser: false,
    });
  }
  _searchFriends = async()=>{
    let ret = await postData('showFriends', {userId: this.props.userInfo.userId})
    this.setState({
      loading: false,
      data: ret.data[0]
    })
  }


  _onClickAddFriend = (item) => {
    this._makeFriendsService(this.props.userInfo.userId, item.id)
    console.log(this.props.userInfo, item)

  }
  _makeFriendsService = async (from, to) => {
    let ret = await postData('addFriend', { from: from, to: to })
    console.log(ret)
    switch (ret.code) {
      case 0:
        notification.success({ message: '好友添加成功' })
        break;
      case -1:
        notification.error({ message: ret.errMessage })
        break;
    }
  }

  _onClickShowAddFriend = () => {
    this.setState({
      showUser: true
    })
    // this._showUserService('我是')
  }
  _onClickShowByKeyword = (keyword) => {
    console.log('_onClickAddFriend')
    this._showUserService(keyword)
  }
  _showUserService = async (keyword) => {
    let data = await postData('showUser', { keyword: keyword })
    this.setState({
      searchData: data.userInfo,
      isClickSearch: true,
    })
    console.log(data)
  }

}

export default UserList