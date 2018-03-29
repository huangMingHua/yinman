// pages/teacher/timeTag/timeTag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    cnum: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var appInstance = getApp();
    appInstance.ajax("/courseTable/getTermTimeTag", { courseTableDetailId: options.courseTableDetailId }, "get", (res) => {
      if (res.data.code === 1) {
        this.setData({ list: res.data.data })
        console.log(this.data.list)
      } else {
        wx.showToast({
          icon: 'none',
          title: '学期出错',
        })
      }
    });

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

  }
})