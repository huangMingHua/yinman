
App({
  onLaunch: function (options) {

  },
  onShow: function (options) {
    // Do something when show.
  },
  onHide: function () {
    // Do something when hide.
  },
  onError: function (msg) {
    console.log(msg)
  },
  ajax: function (urls, datas,mode,cb) {
    wx.request({
      url: 'http://127.0.0.1:7001'+urls, //仅为示例，并非真实的接口地址
      data: datas,
      method:mode,
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        cb(res);
      }
    })
   

  }
})