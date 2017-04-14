// pages/index/index.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数


  },
  classTo: function () {
    console.log('1111');
    wx.navigateTo({
      url: "class/class"
    })
  },

  enrollTo: function () {
    wx.navigateTo({
      url: "signUp/signUp"
    })
  },
  telUs: function () {
    wx.navigateTo({
      url: "contact/contact"
    })
  }
})