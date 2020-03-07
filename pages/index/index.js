var utils = require('./../../utils/util.js')

Page({
  data: {
    newslsit: [],
    message: '',
    scrollTop: 0,
    id: 0,
  },

  onLoad: function() {
    const self = this;
    self.initWebSocket();
    wx.getStorage({
      key: 'newslist',
      success: function(res) {
        self.newslsit = res.data;
        self.setData({
          newslsit: res.data
        })
      },
    })

  },
  send: function() {
    const self = this;
    // 判断内容是否为空
    if (self.data.message) {
      wx.sendSocketMessage({
        data: self.data.message,
      })

      self.rolling_bottom();
      var list = [];
      list = this.data.newslsit; //自己的消息
      var temp = {
        id: self.id++,
        content: this.data.message,
        date: utils.formatTime(new Date),
        role: 'me'
      }
      list.push(temp);
      self.setData({
        newslsit: list,
        message: null
      })
      wx.setStorage({
        key: 'newslist',
        data: list,
      })

    } else {
      wx.showToast({
        title: '消息不能为空哦 ~',
        icon: 'none',
        duration: 1500
      })
    }
    self.rolling_bottom();
  },
  bindChange: function(e) {
    this.setData({
      message: e.detail.value
    })
  },
  initWebSocket: function() {
    const self = this;
    wx.connectSocket({
      url: 'ws://127.0.0.1:3000',
    })
    // 连接成功
    wx.onSocketOpen(function() {
      console.log("WebSocket以打开");
      wx.sendSocketMessage({
        data: '你好'
      })
    })

    wx.onSocketMessage(function(res) {
      console.log("onSocketMessage===>>", res)
      var data = JSON.parse(res.data);
      data.role = "server"; //设置角色
      data.id = self.data.id;
      var list = self.data.newslsit
      list.push(data);
      self.setData({
        newslsit: list,
        message: null
      })
      wx.setStorage({
        key: 'newslist',
        data: self.data.newslsit,
      })

      self.rolling_bottom();
    })
    wx.onSocketClose(function() {
      console.log("WebSocket以关闭")
    })
  },
  rolling_bottom: function() {
    const self = this;
    var s = 0;
    var list = wx.createSelectorQuery().selectAll('.list');
    list.boundingClientRect(rects => {
      rects.forEach(rect => {
        self.setData({
          scrollTop: rect.bottom
        })
      }).exec()
    })

  }
})