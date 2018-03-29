// pages/student/signUpTermDetail/signUpTermDetail.js
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    student:{},
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
    //0是确认报名默认值，1为取消
    btn:0,
    //在报名课程取消或者特定的情况下需要隐藏按钮
    hiddenBtn: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取报名的详情信息
    let appInstance = getApp();
    //如果当前用户有学生获取学生信息
    if (wx.getStorageSync("studentId")){
      console.log(wx.getStorageSync("studentId"))
      let id=wx.getStorageSync("studentId")
      appInstance.ajax("/student/getById", { id: id }, "get", (res) => {
        if (typeof res.data === 'object'&&res.data) {
          this.setData({ student: res.data})
        }else{
          // wx.showToast({
          //   icon:'none',
          //   title: '还没有添加学生',
          // })
        }
      });
    }
    //options.courseDetailId是从报名页跳过来的options.id是从报名记录列表页
    if (options.courseDetailId) {
      appInstance.ajax("/courseTable/getByDetailId", { id: options.courseDetailId }, "get", (res) => {
        if (res.data.code){
          let data = res.data.data
          data.level = this.data.levels[data.level-1].name
          this.setData({ data })
          var that = this
          WxParse.wxParse("article", 'html', data.course.courseDescription, that, 5)
        }else{
          wx.showToast({
            icon:'none',
            title: '数据出错',
          })
        }
      });
    }else{
      console.log(options.id)
      appInstance.ajax("/signUpCurriculum/getById", { id: options.id }, "get", (res) => {   
      if (res.data.code) {
        let data = res.data.data
        if (data.changeCourseTableDetail){
          this.data.data = {
            id: data.id,
            user: data.user,
            teacher: data.changeCourseTableDetail.teacher,
            course: data.changeCourseTableDetail.course,
            level: this.data.levels[data.changeCourseTableDetail.level].name,
            classroom: data.changeCourseTableDetail.classroom,
            dayOfWeek: data.changeCourseTableDetail.dayOfWeek,
            startTime: data.changeCourseTableDetail.startTime,
            endTime: data.changeCourseTableDetail.endTime,
            startDate: data.changeCourseTableDetail.startDate,
            endDate: data.changeCourseTableDetail.endDate,
          }
          var that = this
          WxParse.wxParse("article", 'html', data.changeCourseTableDetail.course.courseDescription, that, 5)
        }else{
          this.data.data = {
            id: data.id,
            user: data.user,
            teacher: data.courseTableDetail.teacher,
            course: data.courseTableDetail.course,
            level: this.data.levels[data.courseTableDetail.level-1].name,
            classroom: data.courseTableDetail.classroom,
            dayOfWeek: data.courseTableDetail.dayOfWeek,
            startTime: data.courseTableDetail.startTime,
            endTime: data.courseTableDetail.endTime,
            startDate: data.courseTableDetail.startDate,
            endDate: data.courseTableDetail.endDate,
          }
          var that = this
          WxParse.wxParse("article", 'html', data.courseTableDetail.course.courseDescription, that, 5)
        }
        
        if (res.data.data.state === '已取消' || res.data.data.state === '已确认' || res.data.data.state=== '已拒绝') {
          this.data.hiddenBtn = true
        }
        console.log(res.data.data.state, this.data.hiddenBtn)
        this.setData({ data: this.data.data, btn: 1, hiddenBtn: this.data.hiddenBtn})
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
            if (res.data.length>0){
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
    }
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
  submit(){
    if (!wx.getStorageSync('studentId')){
      wx.navigateTo({
        url: '/pages/index/class/class?from=sign'
      })
      return
    }
    let appInstance = getApp();
    appInstance.ajax("/signUpCurriculum/saveCurriculum", { studentId: wx.getStorageSync('studentId'), curriculumId: this.data.data.id }, "post", (res) => {
      if (res.data.code == 1) {
        wx.showToast({
          icon: 'none',
          title: '报名成功 请48小时内缴费可保留名额',
          duration: 3000
        })
        setTimeout(() => {
          this.redirectTo()
        }, 4000)
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 3000
        })
      }
    });
  },
  cancel() {
    console.log(this.data.data.id)
    wx.showModal({
      title: '提示',
      content: '确认取消报名？',
      success:  (res)=> {
        if (res.confirm) {
          let appInstance = getApp();
          appInstance.ajax("/signUpCurriculum/changeState", { id: this.data.data.id, state: '取消' }, "post", (res) => {
            wx.showToast({
              title: "取消成功！",
              duration: 1000
            })
            setTimeout(()=>{
              this.goBack()
            },2000)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goBack(){
    wx.navigateBack({
      delta: 1
    })
  },
  redirectTo(){
    wx.redirectTo({
      url: '/pages/student/registrationRecord/registrationRecord'
    })
  }
})