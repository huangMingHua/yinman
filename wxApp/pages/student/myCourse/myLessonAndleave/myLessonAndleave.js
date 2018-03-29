// pages/student/myCourse/myLessonAndleave/myLessonAndleave.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentName:'',
    leavesRecort:[],
    makeUpRecord:[],
    levels: [
      {
        id: 1,
        name: '无等级'
      },
      {
        id: 2,
        name: 'A'
      },
      {
        id: 3,
        name: 'B'
      },
      {
        id: 4,
        name: 'C'
      },
      {
        id: 5,
        name: 'D'
      },
    ],
    isShow: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { studentId = 0, courseTableDetailId = 0 } = options;
    if (studentId){
      wx.setStorageSync('studentId', studentId)
    }
    var appInstance = getApp();
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: `请假补课记录`
    })
    this.getStudent()
    this.getleaveAndMakeUp(courseTableDetailId)
  },
  getStudent(){
    var appInstance = getApp();
    //获取学生的名字
    appInstance.ajax("/student/getById", { id: wx.getStorageSync('studentId') }, "get", (res) => {
      wx.hideLoading()
      this.setData({ studentName: res.data.name })
    })
  },
  getleaveAndMakeUp(courseTableDetailId){
    var appInstance = getApp();
    //获取请假补课记录
    appInstance.ajax("/student/getleaveAndMakeUpRecord", { id: wx.getStorageSync('studentId'),courseTableDetailId}, "get", (res) => {  
      if(res.data.code){
        let { leavesRecord, makeUpRecord}=res.data.data;
        if (leavesRecord.length === 0 && makeUpRecord.length===0){
          return this.setData({ isShow:0})
        }
        this.setData({ leavesRecort: leavesRecord, makeUpRecord: makeUpRecord})
      }else{
        wx.showToast({
          title: '数据出错',
          icon: 'none',
        })
      }
      // this.setData({ studentName: res.data.name })
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
  //tab事件传过来的值是0就是请假记录1就是补课记录
  url:function(e){
    this.setData({ urlIndex: e.currentTarget.dataset.urlindex})
  }
})