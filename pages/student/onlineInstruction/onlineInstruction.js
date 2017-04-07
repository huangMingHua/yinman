// pages/student/onlineInstruction/onlineInstruction.js
Page({
  data: {
      prompt: ["增值服务项目","报名本项目学员，可以在下次回课之前上传自己的弹奏视频，由教师通过网络进行一次批改。", ""],

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
  },
  //上传
  chooseImg: function () {
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            //do something
          }
        })
      }
    })
  },
  //提交事件
  submit: function () {
    wx.showToast({
      title: "提交成功"
    })
  },
})