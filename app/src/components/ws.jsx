import React from 'react';

class WSWrap extends React.PureComponent {
  state = {
    msg: ''
  }
  componentDidMount(){
    this.initWs()
  }
  initWs(){
    let count = 1;
    this.ws = new WebSocket('ws://localhost:8888');
    this.ws.onopen = () => {
      console.log('已经建立websocket连接');
    }

    this.ws.onmessage = e => {
      console.log(`I have received ${e.data}`)
    }

    this.ws.onclose = e => {
      console.log("连接关闭");
    };

    this.ws.onerror = e => {
      console.log('连接失败，正在重连...')
      setTimeout(() => {
        count ++ 
        this.initWs()
      }, 1000)
    }

    this.timer = setInterval(() => {
      this.ws.send('这是一条心跳包消息');
    }, 60000)
  }

  sendMsg = (e) => {
    const msg = e.target.value
    this.setState({
      msg
    }, () => {
      this.ws ? this.ws.send(msg) : this.initWs()
    })
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }
  render() {
    const { msg } = this.state
    return <input value={msg} placeholder='请输入聊天内容' onChange={this.sendMsg} />
  }


}

export default WSWrap;
