// pages/about/about.js
Page({
  data: {
    boff: false,
    teachers: [],
    text: "",
    btnBoff: true,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "比赛介绍"
    })
      var appInstance = getApp()
      //获取用户信息
      appInstance.ajax("/competitionPresentation/getAll", {}, "get", (res) => {
        console.log(res)
        this.data.teachers = res.data
        console.log(this.data.teachers)
        for (var i = 0; i < this.data.teachers.length; i++) {
          if (this.data.teachers[i].res.place.length >= 12) {
            this.data.teachers[i].res.place=this.data.teachers[i].res.place.substring(0,12)
            this.data.teachers[i].res.place += "..."
            this.data.teachers[i].res.time = this.data.teachers[i].res.time.substring(0, 12)
            this.data.teachers[i].res.time += "..."
          }
        }
        this.setData({ teachers: this.data.teachers })
      });
      this.setData({ text: "音曼音乐老师" })
   
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