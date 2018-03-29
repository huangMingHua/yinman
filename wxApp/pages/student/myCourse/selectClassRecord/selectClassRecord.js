// pages/student/myCourse/selectClassRecord/selectClassRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentName: "",
    records: [] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: `选课记录`
    })
    this.getStudent();
    this.getRecord(options.courseTableId)
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
  
  },
  getStudent() {
    var appInstance = getApp();
    //获取学生的名字
    appInstance.ajax("/student/getById", { id: wx.getStorageSync('studentId') }, "get", (res) => {
      this.setData({ studentName: res.data.name })
    })
  },
  getRecord(courseTableDetailId){
    var appInstance = getApp();
    //获取学生的名字
    appInstance.ajax("/courseTable/getSelectClassRecord", { courseTableDetailId: courseTableDetailId, studentId: wx.getStorageSync('studentId') }, "get", (res) => {
      if (res.data.code) {
        if(res.data.data){
          this.setData({ records: res.data.data})
        }
      }
    })
  }
})