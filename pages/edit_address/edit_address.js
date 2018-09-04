// pages/edit_address/edit_address.js
var util = require("../../utils/util.js");
let school; // 学校选择器 
let park; //园区选择器

var str_cookie; // 缓存中的cookie
var cookie; //返回给后台服务器的cookie


// 获取全局变量url
var app = getApp();

/**
 *  定义修改收货信息url (address信息)
 */
var updateAds_URL = app.globalData.url + "shipping/update.do";

/**
 * 用户接收需要被编辑的地址数据对象（未编辑）
 */
let editAddress;

/**
 * 通过接收上一个界面的未编辑数据解析来的
 * 
 */
let pre_ads_id;
let pre_ads_name;
let pre_ads_phone;
let pre_ads_largerArea;
let pre_ads_mediumArea;
let pre_ads_smallArea;
let pre_ads_address;
let pre_ads_isFirst;

/**
 * pre_ads_mediumArea ，pre_ads_smallArea
 * 解析出的1维数组
 * 
 */
let mutilArray = [];

/**
 * 获得界面数据的临时参数
 * 用来解析出mediumArea smallArea
 */
let af_ads_largerArea_id;
let af_ads_otherArea_id;

/**
 * 用户编辑之后的地址数据
 */
let af_ads_id;
let af_ads_name;
let af_ads_phone;
let af_ads_largerArea;
let af_ads_mediumArea;
let af_ads_smallArea;
let af_ads_address;
let af_ads_isFirst;
let af_ads_status;

/**
 * 判断手机号是否正确
 */
var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['西南大学'],
    objectArray: [{
      id: 0,
      name: '西南大学'
    }, ],

    multiArray: [
      ['北区', '南区'],
      ['橘园', '梅园', '李园', '杏园', '桃园']
    ],
    objectMultiArray: [
      [{
          id: 0,
          name: '北区'
        },
        {
          id: 1,
          name: '南区'
        }
      ],
      [{
          id: 0,
          name: '橘园'
        },
        {
          id: 1,
          name: '梅园'
        },
        {
          id: 2,
          name: '李园'
        },
        {
          id: 3,
          name: '杏园'
        },
        {
          id: 3,
          name: '桃园'
        }
      ],
    ],

  },

  // 学校选择器 
  bindPickerChange: function(e) {
    console.log('学校选择器选择改变，携带值为', e.detail.value)
    school = e.detail.value;
    this.setData({
      index: e.detail.value
    })
  },

  // 园区选择器
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    park = e.detail.value;
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['橘园', '梅园', '李园', '杏园', '桃园'];
            break;
          case 1:
            data.multiArray[1] = ['楠园', '竹园'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  // 默认地址切换器
  default_address: function(e) {
    console.log('该地址是否设为默认地址', e.detail.value)
  },

  // 提交方法
  formSubmit: function(e) {

    var that = this;

    // 获取表单数据
    af_ads_id = pre_ads_id;
    af_ads_name = e.detail.value.af_ads_name;
    af_ads_phone = e.detail.value.af_ads_phone;
    af_ads_largerArea_id = e.detail.value.af_ads_largerArea_id;
    af_ads_otherArea_id = e.detail.value.af_ads_otherArea_id;
    af_ads_address = e.detail.value.af_ads_address;
    af_ads_isFirst = e.detail.value.af_ads_isFirst;

    /**
     * 解析表单数据：af_ads_largerArea_id
     * 输出：af_ads_largerArea
     */
    switch (af_ads_largerArea_id) {
      case 0:
        af_ads_largerArea = "西南大学";
        break;
    }

    /**
     *  解析表单数据: af_ads_otherArea_id
     * 输出：af_ads_MediumArea
     * 输出：af_ads_SmallArea
     */
    switch (af_ads_otherArea_id[0]) {
      case 0:
        af_ads_mediumArea = "北区";
        switch (af_ads_otherArea_id[1]) {
          case 0:
            af_ads_smallArea = "橘园";
            break;
          case 1:
            af_ads_smallArea = "梅园";
            break;
          case 2:
            af_ads_smallArea = "李园";
            break;
          case 3:
            af_ads_smallArea = "杏园";
            break;
          case 4:
            af_ads_smallArea = "桃园";
            break;
        }
        break;
      case 1:
        af_ads_mediumArea = "南区";
        switch (af_ads_otherArea_id[1]) {
          case 0:
            af_ads_smallArea = "楠园";
            break;
          case 1:
            af_ads_smallArea = "竹园";
            break;
        }
        break;
    }

    if (af_ads_isFirst)
      af_ads_status = 1;
    else
      af_ads_status = 2;

    if ( af_ads_name == "") {
      af_ads_name = pre_ads_name;
    }
    if (af_ads_phone == "") {
      af_ads_phone = pre_ads_phone;
    }
    if (af_ads_address == "") {
      af_ads_address = pre_ads_address;
    }

    console.log("用户编辑之后的地址数据为：" + af_ads_id + af_ads_name + af_ads_phone + af_ads_largerArea + af_ads_mediumArea + af_ads_smallArea + af_ads_address + af_ads_status);

    console.log(af_ads_name);

    // 检测当手机号码不为空的时候判断格式和长度
    if (af_ads_phone != pre_ads_address) {
      if (af_ads_phone.length != 11) {
        util.tipError("手机号长度错误！", that);
        setTimeout(function() {
          util.clearError(that);
        }, 2000);
      } else if (!myreg.test(af_ads_phone)) {
        util.tipError("手机号格式错误！", that);
        setTimeout(function() {
          util.clearError(that);
        }, 2000);
      } else {
        // 跳转样式
        wx.showLoading({
          title: '提交中...',
        })

        /**
         * 地址数据发回后端服务器
         * 默认地址设为1
         * 非默认地址设为2
         */
        wx.request({
          url: updateAds_URL,
          data: {
            id: af_ads_id,
            receiverName: af_ads_name,
            receiverMobile: af_ads_phone,
            receiverLargeArea: af_ads_largerArea,
            receiverMediumArea: af_ads_mediumArea + af_ads_smallArea,
            receiverSmallArea: af_ads_smallArea,
            receiverDoor: af_ads_address,
            status: af_ads_status
          },
          method: 'POST',
          header: {
            'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
            'cookie': cookie,
          },
          success: function(res) {
            console.log(res);
            console.log("修改收货地址成功");

            setTimeout(function () {
              wx.hideLoading()
              wx.showToast({
                title: '提交成功',
                icon: 'success',
              });
            }, 2000)
          },
          fail: function(res) {
            console.log(res);
            console.log("修改收货地址失败");

            var that = this;
            util.tipError("服务器繁忙，请稍后再试", that);
            setTimeout(function() {
              util.clearError(that);
            }, 2000);
          }
        })
      }
    } else {
      // 跳转样式
      wx.showLoading({
        title: '提交中...',
      })

      /**
       * 地址数据发回后端服务器
       * 默认地址设为1
       * 非默认地址设为2
       */
      wx.request({
        url: updateAds_URL,
        data: {
          id: af_ads_id,
          receiverName: af_ads_name,
          receiverMobile: af_ads_phone,
          receiverLargeArea: af_ads_largerArea,
          receiverMediumArea: af_ads_mediumArea + af_ads_smallArea,
          receiverSmallArea: af_ads_smallArea,
          receiverDoor: af_ads_address,
          status: af_ads_status
        },
        method: 'POST',
        header: {
          'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
          'cookie': cookie,
        },
        success: function(res) {
          console.log(res);
          console.log("修改收货地址成功");

          setTimeout(function () {
            wx.hideLoading()
            wx.showToast({
              title: '提交成功',
              icon: 'success',
            });
          }, 2000)
        },
        fail: function(res) {
          console.log(res);
          console.log("修改收货地址失败");

          var that = this;
          util.tipError("服务器繁忙，请稍后再试", that);
          setTimeout(function() {
            util.clearError(that);
          }, 2000);
        }
      })



    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    editAddress = JSON.parse(options.editAddress);

    console.log("edit_address页面接受上一级 shipping_address页面的数据：" + JSON.stringify(editAddress));

    // 解析数据
    pre_ads_id = editAddress["id"];
    pre_ads_name = editAddress["receiverName"];
    pre_ads_phone = editAddress["receiverMobile"];
    pre_ads_largerArea = editAddress["receiverLargeArea"];
    pre_ads_mediumArea = editAddress["receiverMediumArea"].substring(0, 2);
    pre_ads_smallArea = editAddress["receiverSmallArea"];
    pre_ads_address = editAddress["receiverDoor"];
    pre_ads_isFirst = editAddress["status"];

    // 反向解析medium和smaller生成一维数组
    if (pre_ads_mediumArea == "北区") {
      mutilArray[0] = 0;
      if (pre_ads_smallArea == "橘园")
        mutilArray[1] = 0;
      if (pre_ads_smallArea == "梅园")
        mutilArray[1] = 1;
      if (pre_ads_smallArea == "李园")
        mutilArray[1] = 2;
      if (pre_ads_smallArea == "杏园")
        mutilArray[1] = 3;
      if (pre_ads_smallArea == "桃园")
        mutilArray[1] = 4;
    } else if (pre_ads_mediumArea == "南区") {
      mutilArray[0] = 1;
      if (pre_ads_smallArea == "楠园")
        mutilArray[1] = 0;
      if (pre_ads_smallArea == "竹园")
        mutilArray[1] = 1;
    }

    // 解析largerArea
    if (pre_ads_largerArea === "西南大学") {
      this.setData({
        index: 0,
        pre_ads_name: pre_ads_name,
        pre_ads_phone: pre_ads_phone,
        pre_ads_address: pre_ads_address,
        pre_ads_isFirst: pre_ads_isFirst,
        multiIndex: mutilArray,
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

     str_cookie = wx.getStorageSync('cookie'); // 缓存中的cookie
     cookie = "JSESSIONID=" + str_cookie; //返回给后台服务器的cookie
     console.log("编辑地址的cookie是" + cookie)

    wx.showLoading({
      title: '加载中...',
      duration: 1000,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})