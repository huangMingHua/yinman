
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
Page({
  data: {
    url: ""

  },
  onLoad: function (options) {
    //全局变量
    var appInstance = getApp()
    //获取用户信息
    var This = this
    wx.login({
      success: function (res) {
        if (res.code) {
          function myAsyncFunc() {
            return new Promise(function (resolve, reject) {
              appInstance.ajax("/", { userId: res.code }, "post", function (res) {
                resolve(res)
              });
            });
          }
          async function demo() {
            var result = await myAsyncFunc();
            wx.setStorageSync('sign', result.data)
            if (result.data == 1 || result.data == 2) {
              This.setData({ url: "/pages/student/student" })
              console.log(This.data.url)
            } else {
              This.setData({ url: "/pages/index/index" })
              console.log(This.data.url)
            }
          }
          demo()
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });



  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})