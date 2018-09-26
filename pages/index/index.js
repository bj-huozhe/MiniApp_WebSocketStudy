//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    outputContent: [],
    message: "",
    socketTask: null
  },

  //事件处理函数
  /**
   * 输入消息
   */
  inputTap: function(e) {
    this.setData({message: e.detail.value});
  },

  /**
   * 建立 WebSocket 连接
   */
  openConnection:function() {
    let that = this;
    var socketTask = wx.connectSocket({
      url: 'ws://localhost:8080/ws',
      success: function() {
        var tempContent = that.data.outputContent;
        tempContent.push('建立 WebSocket 成功!');
        that.setData({
          outputContent: tempContent,
        })
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET"
    })

    that.setData({ 
      socketTask: socketTask
      })

    // 监听 WebSocket 接受到服务器的消息事件
    socketTask.onMessage(onMessage => {
      var resvMsg = onMessage.data;
      var tempContent = that.data.outputContent;
      tempContent.push('resvMsg:' + resvMsg);
      that.setData({
        outputContent: tempContent,
      })
    })

    // 监听WebSocket 连接关闭事件
    socketTask.onClose(close => {
      var tempContent = that.data.outputContent;
      tempContent.push('WebSocket 已断开!');
      that.setData({
        outputContent: tempContent,
      })
    })
  },

  /**
   * 发送消息
   */
  sendMessage:function() {
    let that = this;
    var socketTask = that.data.socketTask;
    var sendMsg = that.data.message;

    socketTask.send({
      data: sendMsg,
      success:function() {
        var tempContent = that.data.outputContent;
        tempContent.push('sendMsg:' + sendMsg);
        that.setData({
          outputContent: tempContent
        })
      }
    })
  },

  /**
   * 关闭 WebSocket 连接
   */
  closeConnection:function() {
    let that = this;
    var socketTask = this.data.socketTask;

    socketTask.close();
  }
})
