import React from 'react'
import { Input, List } from 'antd'
import { postData } from './../../../utils/fetch'
import './dialogueModal.less'
const Search = Input.Search
class DialogueModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }
  componentDidMount() {
    this._getMessage()
  }
  render() {
    console.log(this.props)
    const { data } = this.state
    return (
      <div>
        <div className="dialogue__list">
          <List
            // bordered
            dataSource={data}
            renderItem={item => (
              <List.Item>

                {item.from == this.props.from.userId ?
                  <div className="dialogue__to">
                    <div >
                      {item.message}<br />
                      <div className="dialogue__to__time">{item.createdAt}
                      </div>
                    </div>
                  </div> :
                  <div className="dialogue__from">
                    <div >
                      {item.message} <br />
                      <div className="dialogue__from__time">{item.createdAt}
                      </div>
                    </div>
                  </div>
                }


              </List.Item>)}
          ></List>
        </div>
        <Search
          enterButton="发送"
          onSearch={(value) => { this._sendMessage(value) }}
        >
        </Search>
      </div>
    )
  }

  sortId = (a, b) => {
    return a.id - b.id
  }
  _getMessage = async () => {
    let ret = await postData('findMessage', {
      from: this.props.from.userId,
      to: this.props.to.id,
    })
    if (ret.code === 0) {
      this.setState({
        data: ret.data.message.sort(this.sortId)
      })
    }
    console.log(ret)
  }
  _sendMessage = async (value) => {
    let ret = await postData('postMessage', {
      from: this.props.from.userId,
      to: this.props.to.id,
      message: value
    })
    this._getMessage()
    console.log(ret)
  }
}

export default DialogueModal