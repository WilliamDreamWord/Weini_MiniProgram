// hisOrder_popup.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容1
    fisrt_content: {
      type: String,
      value: '内容1'
    },
    // 弹窗内容2
    second_content: {
      type: String,
      value: '内容2'
    },
    // 弹窗内容3
    third_content: {
      type: String,
      value: '内容3'
    },
    // 弹窗内容4
    fourth_content: {
      type: String,
      value: '内容4'
    },
    fifth_content: {
      type: String,
      value: '内容5'
    },
    // 弹窗确认按钮文字
    btn_ok: {
      type: String,
      value: '关闭'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideHisOrderPopup: function () {
      this.setData({
        flag: !this.data.flag
      })
    },
    //展示弹框
    showHisOrderPopup() {
      this.setData({
        flag: !this.data.flag
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _close() {
      //触发成功回调
      this.triggerEvent("close");
    }
  }
})