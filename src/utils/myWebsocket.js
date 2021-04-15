import websocket from "./websocket";

class myWebsocket {
  constructor(id) {
    this.ws = null;
    this.id = id;
    this.msg = null;
    this.timer = null;
  }
  // 创建连接
  createWs() {
    try {
      let token = sessionStorage.getItem("token");
      this.ws = new WebSocket(`ws:${websocket}/ws?token=${token}`);
      this.ws.onopen = () => this.openWs()
      this.ws.onclose = () => this.close()
      this.ws.onerror = () => this.linkErr()
      this.ws.onmessage = (msg) => this.wsMsg(msg)
      this.timer = null;
    } catch(err) {
      console.log(err)
      alert("不支持websocket连接")
    }
  }
  // 打开
  openWs() {
    this.ws.send(this.id);
  }
  close() {
    console.log('guanbil')
  }
  // 关闭
  closeWs() {
    console.log('closeWs')
    if(this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
    try {
      this.ws.close();
    } catch (error) {
      console.info('ws close err', this.ws)
    }
  }
  // 心跳检测
  checkWs() {
    let that = this;
    if(this.timer != null) {
      clearTimeout(this.timer)
      this.linkErr();
    }
    if(this.timer == null) {
      this.timer = setTimeout(() => {
        that.openWs();
      }, 30000)
    }
  }
  // 重连
  linkErr() {
    if(this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = null;
    this.ws = null;
    this.createWs();
  }
  // 获取消息
  wsMsg(msg) {
    let info = null;
    if(this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = null;
    this.checkWs();
    try {
      info = JSON.parse(msg.data);
    } catch (err) {
      // console.log(err);
    }
    if (typeof info === "object" && info !== null) {
      this.msg = info;
    }
  }
  // 返回消息
  getMsg() {
    return this.msg;
  }
}

export default myWebsocket;