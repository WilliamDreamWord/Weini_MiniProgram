// pages/take_advice.js
var util = require("../../utils/util.js");
var URL;  // 存储反馈表单接口
var entity_type = 2;  //评论类型
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  // 反馈表单提交
  formSubmit: function(e) {
    var that = this;
    var advice = e.detail.value.advice;
    // console.log(advice);

    // 反馈为空
    if (advice == ""){
      util.tipError("请填写反馈", that);
      setTimeout(function() {
        util.clearError(that);
      }, 2000);
    } else {
      wx.request({
        url: '',
        data: {
          content: advice,
          entity_type: entity_type,
        },
        method: 'POST',
        header: {
          'Content-Type': "json",
        },
        success: function (res) {
          console.log(res);
          wx.showLoading({
            title: '反馈中...',
          });
          setTimeout(function () {
            wx.hideLoading();
          }, 2000);
          setTimeout(function () {
            wx.showToast({
              title: '反馈成功!',
              icon: 'success',
            });

            that.setData({
              form_info: ''
            });
          }, 2000);
        },
        fail: function (res) {
          console.log(res);
          util.tipError("该功能正在维护中！", that);
          setTimeout(function(){
            util.clearError(that);
          }, 2000);
        },
        complete: function (res) {
          // 回调函数
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that = this;
    util.tipError("该功能正在维护中！请直接联系客服！", that);
    setTimeout(function () {
      util.clearError(that);
    }, 3000);
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