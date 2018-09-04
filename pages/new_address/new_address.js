// pages/new_address/new_address.js
var util = require("../../utils/util.js");
let school; // 学校选择器 
let park; //园区选择器

// 获取全局变量url
var app = getApp();

var str_cookie; // 缓存中的cookie
var cookie; //返回给后台服务器的cookie

/**
 * 添加收货地址url
 */
var shippingAdd_URL = app.globalData.url + "shipping/add.do";

/**
 * 临时数据参数
 * 代表表单信息中的大区域
 * 代表表单信息中的中区域和小区域
 */
let ads_LargerArea_id;
let ads_Medium_Small_id;

/**
 * 收货地址表单数据
 * 统一解析为为后端满足的格式
 */
let ads_name;
let ads_phone;
let ads_LargerArea;
let ads_MediumArea;
let ads_SmallArea;
let ads_detail;
let ads_first;
let ads_status;

/**
 * 用户判定该页面是否由home界面直接跳转而来
 * 0: 代表由上一级界面(收货地址列表)进入
 * 1: 代表由其他界面（首页）进入
 */
let fromHome;

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
    index: 0,
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
    multiIndex: [0, 0],
  },

  // 学校选择器 
  bindPickerChange: function(e) {
    console.log('学校选择器选择改变，携带值为', e.detail.value)
    ads_LargerArea_id = e.detail.value;
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
    let ads_first;

    console.log("用户点击了保存按钮")

    // 获取表单数据
    ads_name = e.detail.value.ads_name;
    ads_phone = e.detail.value.ads_phone;
    ads_LargerArea_id = e.detail.value.ads_LargerArea_id;
    ads_Medium_Small_id = e.detail.value.ads_Medium_Small_id;
    ads_detail = e.detail.value.ads_detail;
    ads_first = e.detail.value.ads_first;

    /**
     * 解析表单数据：ads_LargerArea_id
     * 输出：ads_LargerArea
     */
    if (ads_LargerArea_id == "0")
      ads_LargerArea = "西南大学";

    /**
     *  解析表单数据: ads_Medium_Small_id
     * 输出：ads_MediumArea
     * 输出：ads_SmallArea
     */
    switch (ads_Medium_Small_id[0]) {
      case 0:
        ads_MediumArea = "北区";
        switch (ads_Medium_Small_id[1]) {
          case 0:
            ads_SmallArea = "橘园";
            break;
          case 1:
            ads_SmallArea = "梅园";
            break;
          case 2:
            ads_SmallArea = "李园";
            break;
          case 3:
            ads_SmallArea = "杏园";
            break;
          case 4:
            ads_SmallArea = "桃园";
            break;
        }
        break;
      case 1:
        ads_MediumArea = "南区";
        switch (ads_Medium_Small_id[1]) {
          case 0:
            ads_SmallArea = "楠园";
            break;
          case 1:
            ads_SmallArea = "竹园";
            break;
        }
        break;
    }

    if (ads_first)
      ads_status = 1;
    else
      ads_status = 2;

    console.log("新增收货地址表单数据为：" + ads_name + ads_phone + ads_LargerArea + ads_MediumArea + ads_SmallArea + ads_detail + ads_first);

    // 非空条件判定
    if ("" == util.trim(ads_name) || "" == util.trim(ads_phone) || "" == util.trim(ads_detail)) {
      util.tipError("关键信息不能为空！", that);
      setTimeout(function() {
        util.clearError(that);
      }, 2000);
      return;
    } else {
      if (ads_phone.length != 11) {
        util.tipError("手机号长度错误！", that);
        setTimeout(function() {
          util.clearError(that);
        }, 2000);
      } else if (!myreg.test(ads_phone)) {
        util.tipError("手机号格式错误！", that);
        setTimeout(function() {
          util.clearError(that);
        }, 2000);
      } else {
        if (
          ads_name === wx.getStorageSync('ads_name') &&
          ads_phone === wx.getStorageSync('ads_phone') &&
          ads_LargerArea === wx.getStorageSync('ads_LargerArea') &&
          ads_MediumArea === wx.getStorageSync('ads_MediumArea') &&
          ads_SmallArea === wx.getStorageSync('ads_SmallArea') &&
          ads_detail === wx.getStorageSync('ads_detail')
        ) {
          // 用户提交了重复收货地址
          util.tipError("您已经拥有该地址了喔", that);
          setTimeout(function() {
            util.clearError(that);
          }, 2000);
        } else {

          
          /**
           * 新增收货地址 逻辑
           * 
           * 1.检测该页面从首页跳转而来 fromhome=1
           * 1.1 如果用户没有将该地址设为默认地址而保存
           * 1.2 则提交收货地址数据至后端服务器时将其设为默认地址
           * 
           * 2.检测该页面从上一级 收货地址列表页面跳转而来fromhome=0
           * 
           */

          if (fromHome == 1) {
            console.log("该界面由首页直接跳转而来")

            /**
             * 判断用户是否将第一次的地址设为默认地址
             */
            if (!ads_first) {
              console.log("且用户没有将第一个收货地址设为默认地址")
              ads_first = true;
              this.new_popup.showNewPopup();
            } else {

              console.log("且用户将第一个收货地址设为默认地址了")
              // 跳转样式
              wx.showLoading({
                title: '拼命跳转中...',
              })

              /**
               * 地址数据发回后端服务器
               * 默认地址设为1
               * 非默认地址设为2
               */
              wx.request({
                url: shippingAdd_URL,
                data: {
                  receiverName: ads_name,
                  receiverMobile: ads_phone,
                  receiverLargeArea: ads_LargerArea,
                  receiverMediumArea: ads_MediumArea + ads_SmallArea,
                  receiverSmallArea: ads_SmallArea,
                  receiverDoor: ads_detail,
                  status: 1
                },
                method: 'POST',
                header: {
                  'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
                  'cookie': cookie,
                },
                success: function (res) {

                  wx.setStorageSync('ads_name', ads_name)
                  wx.setStorageSync('ads_phone', ads_phone);
                  wx.setStorageSync('ads_LargerArea', ads_LargerArea);
                  wx.setStorageSync('ads_MediumArea', ads_MediumArea);
                  wx.setStorageSync('ads_SmallArea', ads_SmallArea);
                  wx.setStorageSync('ads_detail', ads_detail);

                  console.log("收货地址添加成功！")
                  wx.setStorageSync('isAdd_address', 'yes');
                  wx.setStorageSync('addressID', res.data.data.id);

                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 2000)
                },
                fail: function (res) {
                  console.log(res);
                  // 添加失败
                  var that = this;
                  util.tipError("服务器繁忙，请稍后再试", that);
                  setTimeout(function () {
                    util.clearError(that);
                  }, 2000);
                }
              })

            }
          } else {
            // 由上一页跳转而来
            console.log("该界面由上一级界面跳转而来")

            // 跳转样式
            wx.showLoading({
              title: '加载中...',
            })

            /**
             * 地址数据发回后端服务器
             * 默认地址设为1
             * 非默认地址设为2
             */
            wx.request({
              url: shippingAdd_URL,
              data: {
                receiverName: ads_name,
                receiverMobile: ads_phone,
                receiverLargeArea: ads_LargerArea,
                receiverMediumArea: ads_MediumArea + ads_SmallArea,
                receiverSmallArea: ads_SmallArea,
                receiverDoor: ads_detail,
                status: ads_status
              },
              method: 'POST',
              header: {
                'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
                'cookie': cookie,
              },
              success: function (res) {

                wx.setStorageSync('ads_name', ads_name)
                wx.setStorageSync('ads_phone', ads_phone);
                wx.setStorageSync('ads_LargerArea', ads_LargerArea);
                wx.setStorageSync('ads_MediumArea', ads_MediumArea);
                wx.setStorageSync('ads_SmallArea', ads_SmallArea);
                wx.setStorageSync('ads_detail', ads_detail);

                console.log("收货地址添加成功！")
                // wx.setStorageSync('isAdd_address', 'yes');

                setTimeout(function () {
                  wx.hideLoading()
                  wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                  });
                }, 2000)
              },
              fail: function (res) {
                console.log(res);
                // 添加失败
                util.tipError("服务器繁忙，请稍后再试", that);
                setTimeout(function () {
                  util.clearError(that);
                }, 2000);
              }
            })
          }
        }
      }
    }

  },

  // 朕知道了 事件
  _close() {

    var that = this;

    console.log('你点击了 朕知道了');
    this.new_popup.hideNewPopup();

    // 跳转样式
    wx.showLoading({
      title: '拼命跳转中...',
    })

    /**
     * 地址数据发回后端服务器
     * 默认地址设为1
     * 非默认地址设为2
     */
    wx.request({
      url: shippingAdd_URL,
      data: {
        receiverName: ads_name,
        receiverMobile: ads_phone,
        receiverLargeArea: ads_LargerArea,
        receiverMediumArea: ads_MediumArea + ads_SmallArea,
        receiverSmallArea: ads_SmallArea,
        receiverDoor: ads_detail,
        status: 1
      },
      method: 'POST',
      header: {
        'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
        'cookie': cookie,
      },
      success: function(res) {
        
        wx.setStorageSync('ads_name', ads_name)
        wx.setStorageSync('ads_phone', ads_phone);
        wx.setStorageSync('ads_LargerArea', ads_LargerArea);
        wx.setStorageSync('ads_MediumArea', ads_MediumArea);
        wx.setStorageSync('ads_SmallArea', ads_SmallArea);
        wx.setStorageSync('ads_detail', ads_detail);

        console.log("收货地址添加成功！")

        wx.setStorageSync('isAdd_address', 'yes');
        wx.setStorageSync('addressID', res.data.data.id);

        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      },
      fail: function(res) {
        // 添加失败
        console.log(res);
        var that = this;
        util.tipError("服务器繁忙，请稍后再试", that);
        setTimeout(function () {
          util.clearError(that);
        }, 2000);
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    fromHome = options.fromHome;
    if (fromHome == 1)
      console.log("new_address界面由 首页跳转而来");
    else
      console.log("new_address界面由 上一级界面 收货地址列表页面跳转而来");

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得new_popup组件
    this.new_popup = this.selectComponent("#new_popup");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    str_cookie = wx.getStorageSync('cookie'); // 缓存中的cookie
    cookie = "JSESSIONID=" + str_cookie; //返回给后台服务器的cookie
    console.log("新增地址的cookie是" + cookie)
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