Page({
  data: {
    boff: true,
    sign: 0,
    student:[]
  },
  onLoad: function (options) {
    //全局变量
    var appInstance = getApp();
    appInstance.ajax("/courseTable/getStudentAll", { teacherId: wx.getStorageSync('_id')}, "get",  (res)=> {
      var student = res.data
      console.log(student)
      this.setData({ student: student})
    })
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