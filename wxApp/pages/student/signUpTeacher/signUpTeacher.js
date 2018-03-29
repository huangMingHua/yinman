// pages/student/signUpTeacher/signUpTeacher.js
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    termCourse:[],
    classTimeClass:[],
    user: {},
    teacher: {},
    term:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "报名"
    })
    //获取这个老师这个学期的课程信息
    let appInstance = getApp();
    appInstance.ajax("/courseTable/getListByTeacherIdAndTermId", { termId: options.termId, teacherId: options.teacherId, studentId: wx.getStorageSync('studentId')}, "post", (res) => {
      console.log(res)
      if (res.data.code) {
        this.setData({ 
          termCourse: res.data.data.termCourse,
          classTimeClass: res.data.data.classTimeClass,
          user: res.data.data.user,
          teacher: res.data.data.teacher,
          term: res.data.data.term
          })
        var that = this
        WxParse.wxParse("article", 'html', res.data.data.term.noticeOfReservation, that, 5)
      } else {
        wx.showToast({
          title: '数据出错',
          icon: 'success',
          duration: 5000
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