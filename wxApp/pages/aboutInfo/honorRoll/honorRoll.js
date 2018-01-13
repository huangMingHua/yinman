Page({
  data: {
    boff: false,
    course: [],
    text: "",
    btnBoff: true,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "光荣榜"
    })
    var appInstance = getApp()
    //获取用户信息
    appInstance.ajax("/honorRoll/getList", {}, "get", (res) => {
      for (var i = 0; i < res.data.list.length; i++) {
        console.log(res.data.list[i].introduce)
        if (res.data.list[i].introduce.length >= 12) {
          res.data.list[i].introduce = res.data.list[i].introduce.substring(0, 12)
          res.data.list[i].introduce += "..."
        }
      }
      this.data.course = res.data.list
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