// pages/student/bookingRecord/bookingRecord.js
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     courseTableItems:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { studentId=0 } = options
    if (studentId){
      wx.setStorageSync('studentId', studentId)
    }
    let article='1.请按时上课，建议提前5分钟到达保证课时的完整性。迟到不延时<br/>2.凡请假调课务必提前2日，临时请假按旷工。（急病除外）<br />3.每学期（春，秋）所有的课程可因私（含病假）调课2次，学期内补课，延期作废<br  />寒暑假1对1课上几次报几次，5次以内补课调课，5-10次课可调课1次 寒暑假补课，延期作废。<br />寒暑假集体课不延期，不调课。<br />4.法定节假日可调课，不计在私调课2次以内，学期内补课，延期作废。<br />5.关于停课：学生因私停课，1对1课需提前2个课时提出停课申请，保留剩余课时。为提前申请，则需扣除2个课时，保留剩余课时。集体课（2人以上）停课视为自动放弃，不退费，不保留课时';
    WxParse.wxParse("article", 'html', article, this, 5)
    let appInstance = getApp();
    appInstance.ajax("/courseTable/getBookingCourseList", { "studentId": wx.getStorageSync('studentId') }, "get", (res) => {
      if (res.data.code) {
        this.setData({courseTableItems:res.data.data})
      } else {
        wx.showToast({
          icon: 'none',
          title: '数据出错',
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