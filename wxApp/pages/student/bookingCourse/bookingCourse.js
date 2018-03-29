// pages/student/bookingCourse/bookingCourse.js
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student:{},
    courseTableItem:{},
    requirements:'',
    bookingCourse:{},
    hiddenBtn:false,
    btn: 0,
    disabled:false,
    requirementVlaue:'',
    bookingCorseId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var appInstance = getApp()
      let { courseTableItemId=0, dir = 0, bookingCorseId=0 } = options;
      this.setData({ bookingCorseId: bookingCorseId})
      if (dir){
        appInstance.ajax("/courseTable/getBookingCourseById", { id: bookingCorseId }, "get", (response) => {
          let res = response.data
          if (res.code) {
            let { courseTableItem, bookingCourse } = res.data
            var that = this
            if (bookingCourse.state === '已取消' || bookingCourse.state === '已确认' || bookingCourse.state === '已拒绝') {
              this.data.hiddenBtn = true
            }
            this.setData({ courseTableItem: courseTableItem, bookingCourse: bookingCourse, btn: 1, hiddenBtn: this.data.hiddenBtn, disabled: true, requirementVlaue: bookingCourse.requirement })
            WxParse.wxParse("article", 'html', courseTableItem.term.noticeOfReservation, that, 5)
          } else {
            wx.showToast({
              icon: 'none',
              title: res.msg
            })
          }
        });
      }else{
        appInstance.ajax("/courseTable/getBookingCourseItem", { courseTableItemId: courseTableItemId }, "get", (response) => {
          let res = response.data
          if (res.code) {
            this.setData({ courseTableItem: res.data });
            var that = this
            WxParse.wxParse("article", 'html', res.data.term.noticeOfReservation, that, 5)
          } else {
            wx.showToast({
              icon: 'none',
              title: res.msg
            })
          }
        });
      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    if (!wx.getStorageSync("studentId")) {
      var appInstance = getApp();
      appInstance.ajax("/user/getByOpenId", { openId: appInstance.globalData.user.openId }, "get", (res) => {
        appInstance.ajax("/student/getByStudent", { userId: res.data.msg.id }, "get", (res) => {
          if (typeof res.data === 'object' && res.data) {
            if (res.data.length > 0) {
              wx.setStorageSync("studentId", res.data[0].id)
              this.setData({ student: res.data[0] })
            }
          } else {
            wx.showToast({
              icon: 'none',
              title: '数据出错',
            })
          }
        });
      });
    }else{
      this.getStudent()
    }
  },
  getStudent(){
    var appInstance = getApp()
    appInstance.ajax("/student/getById", { id: wx.getStorageSync("studentId") }, "get", (res) => {
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
  bindRequirements(event){
      this.setData({requirements:event.detail.value});
  },
  submit(){
    if (!wx.getStorageSync('studentId')) {
      wx.navigateTo({
        url: '/pages/index/class/class?from=class'
      })
      return
    }
    var appInstance = getApp()
    appInstance.ajax("/courseTable/submitBookingCourse", { courseTableItemId: this.data.courseTableItem.id, studentId: wx.getStorageSync('studentId'), requirement: this.data.requirements }, "post", (response) => {
      let res = response.data
      if (res.code) {
        wx.showToast({
          icon: 'none',
          title: '预约成功',
          duration: 3000
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/student/bookingRecord/bookingRecord'
          })
        }, 4000)
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg
        })
      }
    });
  },
  cancel(){
    
    var appInstance = getApp()
    appInstance.ajax("/courseTable/bookingCourseCaculById", { id: this.data.bookingCorseId,state:'已取消'}, "post", (response) => {
      let res = response.data
      if (res.code) {
        wx.showToast({
          icon: 'none',
          title: '取消成功',
          duration: 3000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 4000)
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg
        })
      }
    });
  }
})