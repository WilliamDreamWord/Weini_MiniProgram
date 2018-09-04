// pages/join_us/join_us.js
var URL; // 存储申请人表单的接口
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'man', value: '男', checked: 'true'},
      { name: 'women', value: '女', },
    ]
  },

  // 提交表单
  formSubmit: function(e) {
    var that = this;
    var name = e.detail.value.name;
    var gender = e.detail.value.gender;
    var qq = e.detail.value.qq;
    var phone = e.detail.value.phone;
    var address = e.detail.value.address;
    console.log("申请人的信息：" + name + gender + qq + phone + address);

    if( name == "" || gender == "" || qq  == "" || phone == "" || address == "") {
      util.tipError("请先申请人完善信息", that) 
      setTimeout(function() {
        util.clearError(that);
      }, 2000);
    } else {
      // 申请人请求
      wx.request({
        url: '',
        data: {
          name: name,
          gender: gender,
          qq: qq,
          phone: phone,
          address: address
        },
        method: 'POST',
        header: {
          'Content-Type': "json",
        },
        success: function (res) {
          console.log(res);
          wx.showLoading({
            title: '申请中...',
          });
          setTimeout(function () {
            wx.hideLoading();
          }, 2000);
          setTimeout(function () {
            wx.showToast({
              title: '申请成功!',
              icon: 'success',
            });

            that.setData({
              form_info: ''
            });
          }, 2000);
        },
        fail: function (res) {
          console.log(res);
          util.tipError("该功能正在维护中!", that);
          setTimeout(function () {
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
    util.tipError("该功能正在维护中! 请直接联系客服", that);
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