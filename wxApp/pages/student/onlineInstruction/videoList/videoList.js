// pages/student/onlineInstruction/videoList/videoList.js
Page({
  data: {
    videoArr: [
     
    ]
    ,
    studentId:null
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "视频列表"
    })
    this.setData({ studentId: options.studentId })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var appInstance = getApp();
    appInstance.ajax("/onlineGuide/getList", { pageIndex: 1, limit: 1000, studentId: this.data.studentId }, "get", (res) => {
      console.log(res)
      this.setData({ videoArr: res.data.list })
    });
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})