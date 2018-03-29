// pages/teacher/leaveAndMakeup/leaveAndMakeup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:1,
    teacherName:'',
    courseTableDetail:'',
    leavesRecort: [],
    makeUpRecord: [],
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let courseTableDetailId = options.courseTableDetailId;
    var appInstance = getApp();
    appInstance.ajax('/courseTableChangeClassForTeacher/getListByCourseTableDetailIdAndTeacherId', { courseTableDetailId: courseTableDetailId,teacherId:wx.getStorageSync('teacherId')},"get",(response)=>{
      let res = response.data;
      console.log(res);
      if(res.code){
        let { teacher, courseTableDetail, courseTableItemChangeClasses, courseTableItemLeave}=res.data
        this.setData({ teacherName: teacher.name, courseTableDetail, makeUpRecord: courseTableItemChangeClasses, leavesRecort:courseTableItemLeave})
      }else{
        wx.showToast({
          icon:'none',
          title: res.msg
        })
      }
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
  
  }
})