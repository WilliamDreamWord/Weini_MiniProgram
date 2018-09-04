// pages/template/template.js

  //初始化数据
  function tabbarinit() {
    return [
      {
        "current": 0,
        "pagePath": "/pages/home/home",
        "iconPath": "/images/home1.png",
        "selectedIconPath": "/images/home2.png",
        "text": "主页"
      },
      {
        "current": 0,
        "pagePath": "/pages/news/mews",
        "iconPath": "/images/news1.png",
        "selectedIconPath": "/images/news2.png",
        "text": "资讯"
      },
      {
        "current": 0,
        "pagePath": "/pages/mine/mine",
        "iconPath": "/images/mine1.png",
        "selectedIconPath": "/images/mine2.png",
        "text": "我的"
      }
    ]
  }

//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
    var that = target;
    var bindData = {};
    var otabbar = tabbarinit();
    otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
    otabbar[id]['current'] = 1;
    bindData[bindName] = otabbar
    that.setData({ bindData });
  }

module.exports = {
  tabbar: tabbarmain
}