// pages/mine/mine.js
var template = require('../../template/template.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '/images/goTo.png',
  },

  // 跳转至收货地址
  shipping_address: function(e) {
    wx.navigateTo({
      url: '/pages/shipping_address/shipping_address?fromHome=0',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //跳转至历史订单
  history_order: function(e) {
    wx.navigateTo({
      url: '/pages/history_order/history_order',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 跳转至加入我们
  join_us: function(e) {
    wx.navigateTo({
      url: '/pages/join_us/join_us',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 跳转至使用手册
  opera_guide: function(e) {
    wx.navigateTo({
      url: '/pages/opera_guide/opera_guide',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 跳转至客服反馈
  take_advice: function(e) {
    wx.navigateTo({
      url: '/pages/take_advice/take_advice',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    template.tabbar("tabBar", 2, this)//1表示第三个tabbar
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})