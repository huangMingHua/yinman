// pages/student/customerReservation/customerReservation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student:{},
    courses:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var appInstance = getApp()
    let id = wx.getStorageSync("studentId");
    appInstance.ajax("/student/getById", { id: id }, "get", (res) => {
      if (typeof res.data === 'object' && res.data) {
        this.setData({ student: res.data })
      } else {
        // wx.showToast({
        //   icon:'none',
        //   title: '还没有添加学生',
        // })
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
    this.getCourse();
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
  getCourse(){
    var appInstance = getApp()
    appInstance.ajax('/courseTable/getBookingCourses', { studentId: wx.getStorageSync("studentId")}, 'get', (responese) => {
      let res = responese.data;
      if (res.code) {
        this.setData({ courses: res.data });
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg
        })
      }
    })
  }
})