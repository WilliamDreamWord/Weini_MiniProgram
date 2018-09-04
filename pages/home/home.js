// pages/home/home.js
var template = require('../../template/template.js');
var util = require("../../utils/util.js");

var str_cookie;// 缓存中的cookie
var cookie;//返回给后台服务器的cookie

// 获取全局变量url
var app = getApp();

/**
 *  定义提交订单url (package信息)
 *  定义查找当前用户是否用户默认地址url 
 *  提交新订单url
 *  查询订单总数url
 */
var newQkg_URL = app.globalData.url + "package/add.do";
var selectDefault_URL = app.globalData.url + "shipping/select_default.do";
var newOrder_URL = app.globalData.url + "order/add.do";
var allOrder_URL = app.globalData.url + "order/count_all.do";

/**
 * 临时数据参数
 */
let pkg_address_id = 0; //快递地址的id 初始为0
let pkg_type_id = 0; //货物类型的id 初始为0
let strFirst_address; // 地址对象数组的string类型参数
let strOther_Info; //其他参数对象的string类型


/**
 * 传回后端服务器的参数
 * 
 */
let pkg_address; // 快递地址
let pkg_type; //货物类型
let pkg_price; //货物单价
let pkg_code; //货物的取件码
let pkg_name; //提货的名字
let pkg_time; //收货时间
let pkg_remark; //货物备注

/**
 * 从服务器获取的参数
 * 
 */
let hasFirst_address; //该用户是否拥有默认地址 否代表用户收货地址为空
let first_address; //该用户的默认地址

/**
 * 用户进入小程序提示条款弹窗
 * 点击之后
 * 在小程序内部的跳转不再提示条款弹窗
 */
let tip_popup = true; //控制条款弹窗

/**
 * address 的id
 * package 的id
 */
let addressID;
let packageID;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // totalOrder: totalOrder,
    fisrt_address: {},

    array: ['橘园食堂三楼中通', '橘园三舍圆通', '杏园食堂韵达', '杏园食堂百世', '西师街全峰', '西师街中通', '西师街申通', '西师街顺丰', '西师街京东派', '西师街天天快递', '西师街万象物流', '防空洞EMS', '美食城京东派', '美食城韵达', '美食城百世', '美食城顺丰', '竹园超市申通', '楠园超市圆通', '二号门EMS', '其他快递点(请备注)'],
    objectArray: [{
        id: 0,
        name: '橘园食堂三楼中通'
      },
      {
        id: 1,
        name: '橘园三舍圆通',
      },
      {
        id: 2,
        name: '杏园食堂韵达',
      },
      {
        id: 3,
        name: '杏园食堂百世',
      },
      {
        id: 4,
        name: '西师街全峰',
      },
      {
        id: 5,
        name: '西师街中通',
      },
      {
        id: 6,
        name: '西师街申通',
      },
      {
        id: 7,
        name: '西师街顺丰',
      },
      {
        id: 8,
        name: '西师街京东派',
      },
      {
        id: 9,
        name: '西师街天天快递',
      },
      {
        id: 10,
        name: '西师街万象物流',
      },
      {
        id: 11,
        name: '防空洞EMS',
      },
      {
        id: 12,
        name: '美食城京东派',
      },
      {
        id: 13,
        name: '美食城韵达',
      },
      {
        id: 14,
        name: '美食城百世',
      },
      {
        id: 15,
        name: '美食城顺丰',
      },
      {
        id: 16,
        name: '竹园超市申通',
      },
      {
        id: 17,
        name: '楠园超市圆通',
      },
      {
        id: 18,
        name: '二号门EMS',
      },
      {
        id: 19,
        name: '其他快递点(请备注)',
      }
    ],
    index: 0,

    arraytype: ['小件2元(小于2kg)', '大件3元(小于4kg)', '超大件10元起(暂不接单)'],
    objectArray: [{
        id: 0,
        name: '小件2元(小于2kg)'
      },
      {
        id: 1,
        name: '大件3元(小于4kg)'
      },
      {
        id: 2,
        name: '超大件10元起(暂不接单)'
      },
    ],
    index1: 0,
  },

  // 快递地址选择器 
  bindPickerChange: function(e) {
    console.log('快递地址选择器选择改变，携带值为', e.detail.value)
    pkg_address_id = e.detail.value;
    this.setData({
      index: e.detail.value
    })
  },

  // 货物类型选择器
  bindTypeChange: function(e) {
    console.log('货物类型选择器选择改变，携带值为', e.detail.value);
    let pkg_type_id = e.detail.value;
    this.setData({
      index1: e.detail.value
    })
  },

  // 跳转至加入我们界面
  join_us: function(e) {
    wx.navigateTo({
      url: '/pages/join_us/join_us',
    })
  },

  // 跳转至操作手册界面
  opera_guide: function(e) {
    wx.navigateTo({
      url: '/pages/opera_guide/opera_guide',
    })
  },

  // 提交方法
  formSubmit: function(e) {
    var that = this;

    // 获取表单数据
    pkg_address_id = e.detail.value.pkg_address;
    pkg_type_id = e.detail.value.pkg_type;
    pkg_code = e.detail.value.pkg_code;
    pkg_name = e.detail.value.pkg_name;
    pkg_time = e.detail.value.pkg_time;
    pkg_remark = e.detail.value.pkg_remark;

    // 快递地址解析
    if (pkg_address_id == 0)
      pkg_address = "橘园食堂三楼中通"
    if (pkg_address_id == 1)
      pkg_address = "橘园三舍圆通"
    if (pkg_address_id == 2)
      pkg_address = "杏园食堂韵达"
    if (pkg_address_id == 3)
      pkg_address = "杏园食堂百世"
    if (pkg_address_id == 4)
      pkg_address = "西师街全峰"
    if (pkg_address_id == 5)
      pkg_address = "西师街中通"
    if (pkg_address_id == 6)
      pkg_address = "西师街申通"
    if (pkg_address_id == 7)
      pkg_address = "西师街顺丰"
    if (pkg_address_id == 8)
      pkg_address = "西师街东东派"
    if (pkg_address_id == 9)
      pkg_address = "西师街天天快递"
    if (pkg_address_id == 10)
      pkg_address = "西师街万象物流"
    if (pkg_address_id == 11)
      pkg_address = "防空洞EMS"
    if (pkg_address_id == 12)
      pkg_address = "美食城京东派"
    if (pkg_address_id == 13)
      pkg_address = "美食城韵达"
    if (pkg_address_id == 14)
      pkg_address = "美食城百世"
    if (pkg_address_id == 15)
      pkg_address = "美食城顺丰"
    if (pkg_address_id == 16)
      pkg_address = "竹园超市申通"
    if (pkg_address_id == 17)
      pkg_address = "楠园超市圆通"
    if (pkg_address_id == 18)
      pkg_address = "二号门EMS"
    if (pkg_address_id == 19)
      pkg_address = "其他快递点(请备注)"

    // 货物类型解析
    /**
     * 小件type：1
     * 大件type：2
     * 超大件type：3
     */
    if (pkg_type_id == 0) {
      pkg_type = 1;
      pkg_price = 2.00;
    }
    if (pkg_type_id == 1) {
      pkg_type = 2;
      pkg_price = 3.00;
    }
    if (pkg_type_id == 2) {
      pkg_type = 3;
      pkg_price = 10.00;
    }

    console.log("订单表单数据：" + pkg_address + pkg_type + pkg_price + pkg_code + pkg_name + pkg_time + pkg_remark);

    // 非空条件判定
    if ("" == util.trim(pkg_code) || "" == util.trim(pkg_name) || "" == util.trim(pkg_time)) {
      util.tipError("关键信息不能为空!", that);
      setTimeout(function() {
        util.clearError(that);
      }, 2000);
      return;
    } else if (pkg_type == 3) {
      util.tipError("超大件暂不接单!", that);
      setTimeout(function () {
        util.clearError(that);
      }, 2000);
    } else{
      if (
        pkg_address == wx.getStorageSync('pkg_address') &&
        pkg_type == wx.getStorageSync('pkg_type') &&
        pkg_name == wx.getStorageSync('pkg_name') &&
        pkg_code == wx.getStorageSync('pkg_code')) {

        // 用户提交了重复订单
        util.tipError("请勿重复提交订单", that);
        setTimeout(function() {
          util.clearError(that);
        }, 2000);

      } else {

        /**
         * 下单逻辑
         * 
         * 取用户的收货地址列表
         * 1 若为空，则提示用户先去添加收货地址
         * 1.1 填写完收货地址则直接返回该界面 继续下单
         * 
         * 2 若不为空，拉取默认地址显示给用户确认
         * 2.2 若用户确认为当前收货地址 继续下单
         * 2.3 若用户不确认为当前收货地址 则点击选择 跳转至收货地址列表 点击其他收货地址 继续下单
         * 
         */

        if (hasFirst_address) {
          // 启用有默认地址的提示框
          that.popup.showPopup();
        } else {
          // 启用没有默认地址的提示框
          that.other_popup.showOtherPopup();
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    template.tabbar("tabBar", 0, this) //0表示第一个tabbar
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 先渲染条款提示框
   */
  onReady: function() {
    //获得new_popup组件
    this.new_popup = this.selectComponent("#new_popup");
    if (tip_popup) {
      this.new_popup.showNewPopup();
    }

    // 获取popup组件
    this.popup = this.selectComponent("#popup");

    // 获取other_popup组件
    this.other_popup = this.selectComponent("#other_popup");
  },

  // 朕知道了 事件
  _close() {
    console.log('你点击了 朕知道了');
    this.new_popup.hideNewPopup();
    tip_popup = false;
  },

  // 去添加 事件
  _add() {
    console.log('你点击了 去添加');
    this.other_popup.hideOtherPopup();
    // 跳转至新增收货地址界面
    wx.navigateTo({
      url: '/pages/new_address/new_address?fromHome=1',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 重新选 事件
  _error() {
    console.log('你点击了 重新选');
    this.popup.hidePopup();
    // 跳转至收货地址列表界面
    wx.navigateTo({
      url: '/pages/shipping_address/shipping_address?fromHome=1',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 朕确定 事件
  _success() {

    var that = this;

    console.log('你点击了 朕确定');
    this.popup.hidePopup();

    // 用户点击朕确定按钮
    console.log("发回后端服务器的下单地址（默认地址）id：" + addressID);

    wx.setStorageSync('pkg_address', pkg_address);
    wx.setStorageSync('pkg_type', pkg_type);
    wx.setStorageSync('pkg_name', pkg_name);
    wx.setStorageSync('pkg_time', pkg_time);
    wx.setStorageSync('pkg_code', pkg_code);

    // 成功下单 样式变化
    wx.showLoading({
      title: '下单咯...',
    });

    /**
     * 订单数据+地址id
     * 发回后端服务器响应
     */
    wx.request({
      url: newQkg_URL,
      data: {
        name: pkg_name,
        address: pkg_address,
        code: pkg_code,
        price: pkg_price,
        packageType: pkg_type,
        exceptTime: pkg_time,
        detail: pkg_remark,
      },
      method: 'POST',
      header: {
        'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
        'cookie': cookie,
      },
      success: function(res) {
        console.log(res);
        console.log("包裹信息存储成功");
        packageID = res.data.data.id;

        wx.request({
          url: newOrder_URL,
          data: {
            shippingId: addressID,
            packageId: packageID
          },
          method: 'POST',
          header: {
            'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
            'cookie': cookie,
          },
          success: function(response) {
            console.log(response);
            console.log("下单成功");

            /**
             *  查询订单总数
             */
            wx.request({
              url: allOrder_URL,
              method: 'POST',
              header: {
                'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
                'cookie': cookie,
              },
              success: function(res) {
                console.log(res);
                console.log("成功查询订单总数");

                that.setData({
                  totalOrder: res.data.data + 125,
                })
              },
              fail: function(res) {
                console.log(res);
              }
            })

            setTimeout(function() {
              wx.showToast({
                title: '下单成功!',
                icon: 'success',
              })
            }, 2000);

          },
          fail: function(response) {
            console.log(response);
            console.log("下单失败");

            var that = this;

            // 添加失败
            util.tipError("服务器繁忙，请稍后再试", that);
            setTimeout(function() {
              util.clearError(that);
            }, 2000);
          }
        })
      },
      fail: function(res) {
        console.log(res);
        console.log("包裹信息存储失败");

        // 添加失败
        util.tipError("服务器繁忙，请稍后再试", that);
        setTimeout(function() {
          util.clearError(that);
        }, 2000);
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this;

    // wx.showLoading({
    //   title: '加载中...',
    //   duration: 1000
    // })

    /**
     * 
     * 开始查询当前用户是否拥有默认地址
     * 
     */
    setTimeout(function() {

      str_cookie = wx.getStorageSync('cookie'); // 缓存中的cookie
      cookie = "JSESSIONID=" + str_cookie; //返回给后台服务器的cookie

      console.log("homejs从缓存中获取的cookie：" + cookie);

      wx.request({
        url: selectDefault_URL,
        method: 'POST',
        header: {
          'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
          'cookie': cookie,
        },
        success: function (res) {
          // console.log(res);
          if (res.data.data == null) {
            console.log(res);
            console.log("当前用户没有收货地址")
            hasFirst_address = false; //模拟没有收货地址

          } else if (res.data.code != null) {
            console.log(res);
            console.log("当前用户有默认地址")
            hasFirst_address = true; //模拟有收货地址
            first_address = res.data.data;

            strFirst_address =
              JSON.stringify(first_address["receiverLargeArea"]) +
              JSON.stringify(first_address["receiverDoor"]);

            strOther_Info =
              "姓名:" +
              JSON.stringify(first_address["receiverName"]) +
              "  电话号码:" +
              JSON.stringify(first_address["receiverMobile"]);

            console.log("该用户的当前默认地址为：" + strFirst_address + strOther_Info);

            addressID = res.data.data.id;

            // 前期渲染有默认地址的提示框
            that.setData({
              first_address: strFirst_address,
              otherInfo: strOther_Info
            })
          }
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          // 回调函数
        }
      })

      /**
       *  查询订单总数
       */
      wx.request({
        url: allOrder_URL,
        method: 'POST',
        header: {
          'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
          'cookie': cookie,
        },
        success: function (res) {
          console.log(res);
          console.log("成功查询到订单总数")

          that.setData({
            totalOrder: res.data.data + 125,
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }, 2000)

    
    /**
     * 验证用户添加了第一个地址
     * 或者点击了其他地址
     * 回调后至该界面发起请求
     * 下订单
     */
    if (wx.getStorageSync('isNew_address') === "yes" || wx.getStorageSync('isAdd_address') === "yes") {

      wx.setStorageSync('pkg_address', pkg_address)
      wx.setStorageSync('pkg_type', pkg_type);
      wx.setStorageSync('pkg_name', pkg_name);
      wx.setStorageSync('pkg_time', pkg_time);
      wx.setStorageSync('pkg_code', pkg_code);
      wx.setStorageSync('isNew_address', 'false');
      wx.setStorageSync('isAdd_address', 'false')

      // 成功下单 样式变化
      wx.showLoading({
        title: '下单咯...',
      });

      /**
       * 订单数据
       * 发回后端服务器响应
       */
      wx.request({
        url: newQkg_URL,
        data: {
          name: pkg_name,
          address: pkg_address,
          code: pkg_code,
          price: pkg_price,
          packageType: pkg_type,
          exceptTime: pkg_time,
          detail: pkg_remark,
        },
        method: 'POST',
        header: {
          'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
          'cookie': cookie,
        },
        success: function(res) {
          console.log(res);
          console.log("包裹信息存储成功");

          addressID = wx.getStorageSync('addressID');
          packageID = res.data.data.id;

          console.log(addressID + packageID);

          /**
           * 将addressid和packageid
           * 发起order请求
           */
          wx.request({
            url: newOrder_URL,
            data: {
              shippingId: addressID,
              packageId: packageID
            },
            method: 'POST',
            header: {
              'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
              'cookie': cookie,
            },
            success: function(response) {
              console.log(response);
              console.log("该笔订单下单成功");


              /**
               *  查询订单总数
               */
              wx.request({
                url: allOrder_URL,
                method: 'POST',
                header: {
                  'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
                  'cookie': cookie,
                },
                success: function(res) {
                  console.log(res);
                  console.log("成功查询订单总数");

                  that.setData({
                    totalOrder: res.data.data + 125,
                  })
                },
                fail: function(res) {
                  console.log(res);
                }
              })

            },
            fail: function(response) {
              console.log(response);
              console.log("下单失败");
            }
          })

        },
        fail: function(res) {
          console.log(res);
          // 添加失败
          var that = this;
          util.tipError("服务器繁忙，请稍后再试", that);
          setTimeout(function() {
            util.clearError(that);
          }, 2000);
        }
      })

      setTimeout(function() {
        wx.hideLoading();
      }, 2000);
      setTimeout(function() {
        wx.showToast({
          title: '下单成功!',
          icon: 'success',
        })
      }, 2000);

    }
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