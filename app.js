//app.js
var openid; // 用户的唯一标识
var unionid; // 用户在微信开放平台下的唯一标识
var URL_login = 'http://www.bestpaopao.com/wechat/user/login.do';  //会话管理开始
var URL = 'http://www.bestpaopao.com/wechat/';  //定义全局变量-URL

App({
  //全局变量
  globalData: {
    userInfo: null,
    url: URL,
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({

      success: function(res) {

        wx.request({
          url: URL_login,
          data: {
            code: res.code
          },
          method: 'POST',
          header: {
            'Content-Type': "application/x-www-form-urlencoded",
          },
          success: function(response) {
            // 获取后端返回的jessionid作为小程序会话管理标示
            console.log(response);
            wx.setStorageSync('cookie', response.data.data.JSESSIONID);
          },
          fail: function(response) {
            console.log(response);
          },
          complete: function(response) {
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

})