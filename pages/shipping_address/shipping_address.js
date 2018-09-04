// pages/shipping_address/shipping_address.js

var str_cookie; // 缓存中的cookie
var cookie; //返回给后台服务器的cookie

// 获取全局变量url
var app = getApp();

/**
 *  定义查询所有收货地址url (address信息)
 *  定义删除指定收货地址url （address信息）
 */
var adsList_URL = app.globalData.url + "shipping/list.do";
var deleteAds_URL = app.globalData.url + "shipping/delete.do";


/**
 * 用户接受后端服务器返回的用户地址列表数据 list对象数组
 */
let contentList = {};

/**
 * 用户判定界面删除按钮的宽比
 */
let xmove

/**
 * 用户判定该页面是否由home界面直接跳转而来
 * 0: 代表由上一级界面(我的)进入
 * 1: 代表由其他界面（首页）进入
 * 
 */
let fromHome;

/**
 * 用户重新选择地址点击获取的地址数据
 * 用户编辑时选中的item所有数据
 * 用户重新选择地址点击获取的名字数据
 * 用户重新选择地址点击获取的手机号码数据
 * 显示的其他数据
 * 删除指定的地址id
 */
let selectedAddress = {};
let editAddress = {};
let selectedName;
let selectedPhone;
let otherInfo;
let selectedID;
let deleteID; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit: '编辑',
    selectedAddress: selectedAddress,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    fromHome = options.fromHome;

      /**
       * 测试数据
       */
    // contentList = [{
    //     'id': '1',
    //     'first_name': '胡',
    //     'name': '胡晓蔓',
    //     'largerArea': '西南大学',
    //     'mediumArea': '北区',
    //     'smallArea': '橘园',
    //     'phone': '13042373156',
    //     'first_address': true,
    //     'address': '西南大学北区橘园八舍406'
    //   },
    //   {
    //     'id': '2',
    //     'first_name': '姚',
    //     'name': '姚果',
    //     'largerArea': '西南大学',
    //     'mediumArea': '北区',
    //     'smallArea': '梅园',
    //     'phone': '13042373156',
    //     'first_address': false,
    //     'address': '西南大学北区梅园9舍103'
    //   },
    //   {
    //     'id': '3',
    //     'first_name': '姚',
    //     'name': '姚果',
    //     'largerArea': '西南大学',
    //     'mediumArea': '北区',
    //     'smallArea': '李园',
    //     'phone': '13042373156',
    //     'first_address': false,
    //     'address': '西南大学北区李2舍201'
    //   },
    //   {
    //     'id': '4',
    //     'first_name': '姚',
    //     'name': '姚果',
    //     'largerArea': '西南大学',
    //     'mediumArea': '南区',
    //     'smallArea': '楠园',
    //     'phone': '13042373156',
    //     'first_address': false,
    //     'address': '西南大学南区楠园八舍326'
    //   },
    // ]

  },

  /**
   * 显示删除按钮
   */
  showDeleteButton: function(e) {
    let index = e.currentTarget.dataset.index
    this.setXmove(index, -65)

  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function(e) {
    let index = e.currentTarget.dataset.index;

    this.setXmove(index, 0)
  },

  /**
   * 设置movable-view位移
   */
  setXmove: function(index, xmove) {
    let contentList = this.data.contentList
    // contentList[index].xmove = xmove;

    this.setData({
      contentList: contentList,
    })
  },

  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function(e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },

  /**
   * 删除地址
   */
  handleDeleteAddress: function(e) {
    let index = e.currentTarget.dataset.index
    deleteID = e.currentTarget.dataset.id;
    console.log("删除的地址id是：" + deleteID);

    /**
     * 删除地址
     */
    wx.request({
      url: deleteAds_URL,
      data: {
        shippingId: deleteID,
      },
      method: 'POST',
      header: {
        'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
        'cookie': cookie,
      },
      success: function(res) {
        console.log(res);
        console.log("成功删除该地址");
      },
      fail: function(res) {
        console.log(res);
        console.log("删除地址失败");

        var that = this;
        util.tipError("服务器繁忙，请稍后再试", that);
        setTimeout(function () {
          util.clearError(that);
        }, 2000); 
      }
    })

    let contentList = this.data.contentList

    contentList.splice(index, 1)

    this.setData({
      contentList: contentList
    })
    if (contentList[index]) {
      this.setXmove(index, 0)
    }
  },

  /**
   * 新增收货地址
   */
  new_address: function(e) {
    wx.navigateTo({
      url: '/pages/new_address/new_address?fromHome=0',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 编辑收货地址
   */
  edit_address: function(e) {

    console.log("edit点击事件获取的item为：" + JSON.stringify(e.currentTarget.dataset.item));

    editAddress = JSON.stringify(e.currentTarget.dataset.item);


    // console.log("shipping_address页面需要编辑的数据：" + editedAddress);
    
    wx.navigateTo({
      url: '/pages/edit_address/edit_address?editAddress=' + editAddress,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    // 获取popup组件
    this.popup = this.selectComponent("#popup");
  },

  /**
   * 用户选择某一收货地址
   */
  selectAddress: function(e) {

    var that = this;

    selectedAddress = 
      JSON.stringify(e.currentTarget.dataset.item["receiverLargeArea"]) +
      JSON.stringify(e.currentTarget.dataset.item["receiverDoor"]);

    selectedName = JSON.stringify(e.currentTarget.dataset.item["receiverName"]);
    selectedPhone = JSON.stringify(e.currentTarget.dataset.item["receiverMobile"]);
    selectedID = e.currentTarget.dataset.item["id"];

    wx.setStorageSync('addressID', selectedID);

    otherInfo = "名字:" + selectedName + "  电话号码:" + selectedPhone;
    console.log("select点击事件获取的item为：" + JSON.stringify(e.currentTarget.dataset.item));

    // 由主页界面跳转而来
    if (fromHome == 1) {
      console.log("shipping_address 页面是由home界面跳转" + fromHome);
      this.popup.showPopup();
      that.setData({
        selectedAddress: selectedAddress,
        otherInfo: otherInfo
      })
    } else {
      // 从上一级页面（我的）跳转而来
      console.log("shipping_address 页面是否由上一级界面跳转来");
    }
  },

  // 选错了 事件
  _error() {
    console.log("你点击了 选错了");
    this.popup.hidePopup();
  },

  // 选好了 事件
  _success() {
    console.log("你点击了 选好了");
    this.popup.hidePopup();
    wx.setStorageSync('isNew_address', 'yes')

    // 跳转样式
    wx.showLoading({
      title: '拼命跳转中...',
    })
    /**
     * 地址数据发回后端服务器
     * 
     */

    setTimeout(function() {
      wx.navigateBack({
        delta: 1,
      })
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this;

    str_cookie = wx.getStorageSync('cookie'); // 缓存中的cookie
    cookie = "JSESSIONID=" + str_cookie; //返回给后台服务器的cookie
    console.log("地址列表的cookie是" + cookie)
    
    wx.showLoading({
      title: '加载中...',
      duration: 1000
    })

    /**
     * 查询当前用户收货地址列表
     */
    wx.request({
      url: adsList_URL,
      data: {
        pageNum: 1,
        pageSize: 10
      },
      method: 'POST',
      header: {
        'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
        'cookie': cookie,
      },
      success: function (res) {
        console.log(res);
        contentList = res.data.data;
        console.log(contentList);

        that.setData({
          contentList: contentList,
        })
      },
      fail: function (res) {
        console.log(res);
      }
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