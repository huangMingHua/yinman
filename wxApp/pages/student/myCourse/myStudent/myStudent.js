Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "查看详情"
    })
    var appInstance = getApp()
    console.log(options)
    //获取用户信息
    appInstance.ajax("/teacher/getStudentsByItemId", { itemId: options.itemId} , "get",  (res)=> {
      console.log(res.data)
      this.setData({ info: res.data.data})
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setStorageSync("sign", 2)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },
  url:function(e){
    wx.setStorageSync("sign", 1)
    wx.navigateTo({
      url: `/pages/student/myCourse/myLesson/myLesson?studentId=${e.currentTarget.dataset.itemid}`
    })
  }
  ,
  url1: function (e) {
    wx.setStorageSync("sign", 1)
    wx.navigateTo({
      url: `/pages/student/myCourse/myLessonAndleave/myLessonAndleave?studentId=${e.currentTarget.dataset.itemid}`
    })
  }
})