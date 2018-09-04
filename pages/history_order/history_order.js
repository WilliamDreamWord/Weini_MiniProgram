// pages/history_order/history_order.js

// 获取全局变量url
var app = getApp();
// 定义提交订单url
var URL_hisList = app.globalData.url + "order/list.do";

var orderid = new Array();  // 代表每个订单id的数组
var inquenery = new Array();  //代表每个订单被点击的次数

let str_cookie; // 缓存中的cookie
var cookie; //返回给后台服务器的cookie

let modelData = {}// 订单大概信息
let detailData; //订单详细信息


/**
 * 需要展示的订单详细信息
 */
let first_detail;
let second_detail;
let third_detail;
let fourth_detail;
let fifth_detail;

/**
 * 从界面中抓取的总详细信息
 */
let order_detail = [];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentlist: [],
    detaillist: [],
  },


  /**
   * 算法
   */
  check: function(e) {

    var that = this;
    var id = e.target.id;

    console.log(orderid);

    // 下拉列表算法
    for (var i =0;i < orderid.length; i++) {

      if (id == orderid[i]) {

        console.log(inquenery[i]);

        // 对于一个图标是否被点击两次有效
        if (inquenery[i] % 2 == 1) {
          // 该图标的被点击次数为奇数
          // 说明此时正开启
          // 需要将其关闭
          that.setData({
            'currentItem': 0,
          })
        } else {
          // 该图标的被点击次数为偶数
          // 说明次数其正关闭
          // 需要将其开启
          if (i==0) {
            that.setData({
              detaillist: detailData,
              'currentItem': id,
            })
          } else {
            that.setData({
              detaillist: detailData,
              'currentItem': id,
            })
          }
        }
        inquenery[i]++;
        console.log(inquenery);
      }
    }
  },

  // 显示订单详情
  showOrder_detail: function(e) {

    order_detail = e.currentTarget.dataset.item["orderItemVoList"];
    console.log("您点击的item详细信息为:" + JSON.stringify(order_detail));
    
    var that = this;
    
    first_detail = "下单时间：" + order_detail[0].createTime;
    second_detail = "接单时间：" + e.currentTarget.dataset.item["getTime"];
    third_detail = "配送时间：" + e.currentTarget.dataset.item["endTime"];
    fourth_detail = "送达时间：" + e.currentTarget.dataset.item["closeTime"];
    fifth_detail = 
      "取件人: " + order_detail[0].packageName + 
      " 价格: " + order_detail[0].price + 
      " 支付方式: " + e.currentTarget.dataset.item["paymentTypeDesc"];

    that.hisOrder_popup.showHisOrderPopup();
    that.setData({
      first_detail: first_detail,
      second_detail: second_detail,
      third_detail: third_detail,
      fourth_detail: fourth_detail,
      fifth_detail: fifth_detail
    })

  },

  // 朕明白了 事件
  _close() {
    console.log('你点击了 朕明白了');
    this.hisOrder_popup.hideHisOrderPopup();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    for (var i =0; i< orderid.length; i++) {
      inquenery[i] = 0;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取hisOrder_popup组件
    this.hisOrder_popup = this.selectComponent("#hisOrder_popup");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;

    str_cookie = wx.getStorageSync('cookie'); // 缓存中的cookie
    cookie = "JSESSIONID=" + str_cookie; //返回给后台服务器的cookie
    console.log("历史订单的cookie是" + cookie)

    wx.showLoading({
      title: '加载中...',
      duration: 1000
    })

    /**
     * 查询订单的接口
     */

    wx.request({
      url: URL_hisList,
      data: {
        pageNum: 1,
        pageSize: 10,
      },
      method: 'POST',
      header: {
        'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
        'cookie': cookie,
      },
      success: function (res) {
        // console.log(res);
        modelData = res.data.data;
        modelData.forEach((item) => {
          item.createTime = item.createTime.substring(0, 11); //要截取字段的字符串
        })
        detailData = res.data.data;

        that.setData({
          contentlist: modelData,
        })
        console.log(modelData);
      },
      fail: function (res) {
        console.log(res);
        console.log("查询订单信息失败")

        var that = this;
        util.tipError("服务器繁忙，请稍后再试", that);
        setTimeout(function () {
          util.clearError(that);
        }, 2000);
      },
      complete: function (res) {
        // 回调函数
      }


    })
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