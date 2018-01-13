// pages/about/about.js
Page({
  data: {
    boff: false,
    course: [],
    text: "",
    btnBoff: true,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "音曼课程"
    })
    var appInstance = getApp()
    //获取用户信息
    appInstance.ajax("/rhythmCourse/getAll", {}, "get", (res) => {
      console.log(res)
      this.data.course = res.data
      for (var i = 0; i < this.data.course.length; i++) {
        if (this.data.course[i].res.category.length >= 12) {
          this.data.teachers[i].res.category = this.data.teachers[i].res.category.substring(0, 12)
          this.data.teachers[i].res.category += "..."
        } else if (this.data.course[i].res.time.length >= 12){
          this.data.teachers[i].res.time = this.data.teachers[i].res.time.substring(0, 12)
          this.data.teachers[i].res.time += "..."
        }
      }
      this.setData({ course: this.data.course })
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