// pages/new_order/new_order.js
var template = require('../../template/template.js');
var util = require("../../utils/util.js");
var school; // 学校选择器 
var school_analysis; // 解析后的学校名称
var park; //园区选择器
var area_analysis; //从园区中解析出来的南区/北区
var community_analysis; // 从园区解析出来的橘园 ，梅园 ，李园。。。
var category; //类型选择器
var category_analysis; // 从类型解析出来的（小件1元（小于2kg））
var URL_receiver = 'https://www.bestpaopao.cn/wechat/shipping/add.do'; // 存储收货人信息接口
var URL_package = 'https://www.bestpaopao.cn/wechat/package/add.do'; //存储订单信息接口
var URL_addOrder = 'https://www.bestpaopao.cn/wechat/order/add.do';
var price; //订单单价
var str_cookie = wx.getStorageSync('cookie'); // 缓存中的cookie
var cookie = "JSESSIONID=" + str_cookie; //返回给后台服务器的cookie


Page({

  /**
   * 页面的初始数据
   */
  data: {
    str_build: '',
    str_dorm: '',
    str_name: '',
    str_phone: '',
    str_address: '',
    showTopTips: false,
    errorMsg: "",
    
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

    arraytype: ['小件1元(小于2kg)', '大件2元(小于5kg)', '超大件5元暂不接单'],
    objectArray: [{
        id: 0,
        name: '小件1元(小于2kg)'
      },
      {
        id: 1,
        name: '大件2元(小于5kg)'
      },
      {
        id: 2,
        name: '超大件5元暂不接单'
      },
    ],
    index: 0,
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

  bindTypeChange: function(e) {
    console.log('类型选择器选择改变，携带值为', e.detail.value);
    category = e.detail.value;
    this.setData({
      index: e.detail.value
    })
  },

  // 跳转至join_us界面
  join: function(e) {
    wx.navigateTo({
      url: '/pages/join_us/join_us',
    })
  },

  // 跳转至take_advice界面
  advice: function(e) {
    wx.navigateTo({
      url: '/pages/take_advice/take_advice',
    })
  },

  // 表单提交控件
  formSubmit: function(e) {
    var that = this;
    console.log(e.detail.value);

    //获得表单数据
    var school = e.detail.value.school;
    var park = e.detail.value.park;
    var build = e.detail.value.build;
    var dorm = e.detail.value.dorm;
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var address = e.detail.value.address;
    var category = e.detail.value.category;
    var code = e.detail.value.code;
    var remarks = e.detail.value.remarks;

    // 解析学校，园区，类型字段
    switch (school) {
      case 0:
        school_analysis = "西南大学";
        break;
    }
    switch (park[0]) {
      case 0:
        area_analysis = "北区";
        switch (park[1]) {
          case 0:
            community_analysis = "橘园";
            break;
          case 1:
            community_analysis = "梅园";
            break;
          case 2:
            community_analysis = "李园";
            break;
          case 3:
            community_analysis = "杏园";
            break;
          case 4:
            community_analysis = "桃园";
            break;
        }
        break;
      case 1:
        area_analysis = "南区";
        switch (park[1]) {
          case 0:
            community_analysis = "楠园";
            break;
          case 1:
            community_analysis = "竹园";
            break;
        }
        break;
    }
    switch (category) {
      case 0:
        category_analysis = "小件1元(小于2kg)";
        price = 1.00;
        break;
      case 1:
        category_analysis = "大件2元(小于5kg)";
        price = 2.00;
        break;
      case 2:
        category_analysis = "超大件5元(暂不接单)";
        price = 5.00;
        break;
    }

    // console.log(school_analysis);

    // 非空条件测试
    if ("" == util.trim(build) || "" == util.trim(dorm) || "" == util.trim(name) || "" == util.trim(phone) || "" == util.trim(address) || "" == util.trim(code)) {

      util.tipError("关键信息不能为空!", that);
      setTimeout(function() {
        util.clearError(that);
      }, 2000);
      return;
    } else {

      // 类型为超大件的不接单
      if (category == 2) {
        util.tipError("超大件暂不接单", that);
        setTimeout(function() {
          util.clearError(that);
        }, 2000);

      } else if (
        school_analysis == wx.getStorageSync('school_analysis') &&
        area_analysis == wx.getStorageSync('area_analysis') &&
        community_analysis == wx.getStorageSync('community_analysis') &&
        build == wx.getStorageSync('build') &&
        dorm == wx.getStorageSync('dorm') &&
        name == wx.getStorageSync('name') &&
        phone == wx.getStorageSync('phone') &&
        address == wx.getStorageSync('address') &&
        category == wx.getStorageSync('category') &&
        code == wx.getStorageSync('pkgcode')) {
        // 如果用户提交了重复订单
        util.tipError("请勿重复提交订单", that);
        setTimeout(function() {
          util.clearError(that);
        }, 2000);

      } else {

        console.log(cookie);

        // 收货人信息请求
        wx.request({
          // 收货人信息存储接口
          url: URL_receiver,
          data: {
            receiverLargeArea: school_analysis,
            receiverMediumArea: area_analysis,
            receiverSmallArea: community_analysis + build,
            receiverDoor: dorm,
            receiverName: name,
            receiverMobile: phone,
          },
          method: 'POST',
          header: {
            'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
            'cookie': cookie,
          },
          success: function(res) {
            console.log(res);

            var shipping_id = res.data.data.id;
            console.log(shipping_id);

            if (res.data.code === 0) {
              // 快递信息存储请求
              wx.request({
                // 快递信息存储接口
                url: URL_package,
                data: {
                  name: code,
                  address: address,
                  code: code,
                  price: price,
                  packageType: category,
                  detail: remarks
                },
                method: 'POST',
                header: {
                  'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
                  'cookie': cookie,
                },
                success: function(response) {
                  console.log(response);

                  var package_id = response.data.data.id;
                  console.log(package_id);

                  wx.request({
                    url: URL_addOrder,
                    data: {
                      shippingId: shipping_id,
                      packageId: package_id
                    },
                    method: 'POST',
                    header: {
                      'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
                      'cookie': cookie,
                    },
                    success: function(res1) {
                      console.log(res1);
                    },
                    fail: function(res1) {
                      console.log(res1);
                    },
                    complete: function(res1) {
                      // 回调函数
                    }
                  })

                  // 存入缓存 下次直接拉取使用
                  wx.setStorageSync('school_analysis', school_analysis);
                  wx.setStorageSync('area_analysis', area_analysis);
                  wx.setStorageSync('community_analysis', community_analysis);
                  wx.setStorageSync('build', build);
                  wx.setStorageSync('dorm', dorm);
                  wx.setStorageSync('name', name);
                  wx.setStorageSync('phone', phone);
                  wx.setStorageSync('address', address);
                  wx.setStorageSync('category', category);
                  wx.setStorageSync('pkgcode', code);
                  wx.setStorageSync('remarks', remarks);

                  wx.showLoading({
                    title: '下单咯...',
                  });
                  setTimeout(function () {
                    wx.hideLoading();
                  }, 2000);
                  setTimeout(function () {
                    wx.showToast({
                      title: '下单成功!',
                      icon: 'success',
                    })
                  }, 2000);
                },
                fail: function(res) {
                  util.tipError("服务器繁忙，请稍后再试", that);
                  setTimeout(function () {
                    util.clearError(that);
                  }, 2000);
                  console.log(res);
                },
                complete: function(res) {
                  // 回调函数
                }
              })
            }

          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            // 在这里写关于订单的回调函数
          }
        })

      }

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    template.tabbar("tabBar", 1, this) //1表示第二个tabbar

    var str_build = wx.getStorageSync('build');
    var str_dorm = wx.getStorageSync('dorm');
    var str_name = wx.getStorageSync('name');
    var str_phone = wx.getStorageSync('phone');
    var str_address = wx.getStorageSync('address');

    if (str_build != "" && str_dorm != "" && str_name != "" && str_phone != "" && str_address != "") {
      this.setData({
        str_build: str_build,
        str_dorm: str_dorm,
        str_name: str_name,
        str_phone: str_phone,
        str_address: str_address
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