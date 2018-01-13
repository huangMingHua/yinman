// pages/yinmanIntroduce/yinmanIntroduce.js
 var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{
    title: "",
    content: "",
    img: ""
  },
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: "音曼介绍"
    })
    var appInstance = getApp()
    appInstance.ajax("/voiceIntroduction/get", {}, "get", (res) => {
      this.setData({ title: res.data.res.title })
      this.setData({ img: res.data.picPath })
      var that = this
      WxParse.wxParse("article", 'html', res.data.res.content, that,5)
    });

    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})