// pages/student/myCourse/myCourse.js
Page({
  data: {
    boff: true,
    course:["1","2"]
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
  switch: function (e) {
    if (e.currentTarget.dataset.head == 1) {
      this.setData({ boff: true })
    } else {
      this.setData({ boff: false })
    }


  }
})