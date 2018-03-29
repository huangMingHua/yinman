// pages/student/student.js
Page({
  data:{
  // url:"",
  signUrl:"",
  headInfo:{
    head:"",
    name:"",
    tel:""
  },
  sign:"",
  students:[],
  idx:0,
  studentId:0,
  showStudentUrl:false,
  showIndex:1,
  urlIndex: 2,
  signCurriculumList: [],
  //0是学生，1是老师
  isWho: 0
  },
  onLoad:function(options){
    wx.setStorageSync("idx", 0)
    if (options.urlindex){
      this.setData({ urlIndex: options.urlindex })
      if (options.urlindex == 0) {
        wx.setNavigationBarTitle({
          title: "个人中心"
        })
      } else if (options.urlindex== 1) {
        wx.setNavigationBarTitle({
          title: "展示中心"
        })
      } else {
        wx.setNavigationBarTitle({
          title: "关于音曼"
        })
      }
    }
    
  },
  onReady: function (options){
    
    // 页面渲染完成
  },
  onShow: function (options){
    if (options) {
      this.setData({ urlIndex: options.urlindex })
      if (options.urlindex == 0) {
        wx.setNavigationBarTitle({
          title: "个人中心"
        })
      } else if (options.urlindex == 1) {
        wx.setNavigationBarTitle({
          title: "展示中心"
        })
      } else {
        wx.setNavigationBarTitle({
          title: "关于音曼"
        })
      }
    }
   
    if (this.data.showIndex){
      wx.showLoading({
        title: '数据加载中',
      })
      this.setData({showIndex:0})
    }
    var app = getApp()
    app.getUserInfo((user) => {
      wx.hideLoading()
      this.setData({ displayPersonalCenter: app.globalData.displayPersonalCenter })
      // this.setData({ url: "/pages/student/student" })
      if (user.state == 2) {
        //老师端
        this.setData({isWho:1})
        var appInstance = getApp();
        appInstance.ajax("/user/getByOpenId", { openId: appInstance.globalData.user.openId }, "get", (res) => {
          var state = res.data.msg.state
          wx.setStorageSync("sign", state)
          this.data.headInfo.name = appInstance.globalData.user.wxName
          this.data.headInfo.head = appInstance.globalData.user.wxHead
          this.setData({ headInfo: this.data.headInfo, sign: state })
          appInstance.ajax("/teacher/getByUserId", { userId: res.data.msg.id }, "get", (res) => {
            if (res.data.code) {
              wx.setStorageSync('teacherId', res.data.data.id);
            } else {
              wx.showToast({
                icon: 'none',
                title: '没有当前老师',
              })
            }
          });
        });
      }else{
        //学生端
        // 页面初始化 options为页面跳转所带来的参数
        var appInstance = getApp();
        appInstance.ajax("/user/getByOpenId", { openId: appInstance.globalData.user.openId }, "get", (res) => {
          var state = res.data.msg.state
          wx.setStorageSync("sign", state)
          this.data.headInfo.name = appInstance.globalData.user.wxName
          this.data.headInfo.head = appInstance.globalData.user.wxHead
          this.setData({ headInfo: this.data.headInfo, sign: state, idx: wx.getStorageSync('idx') })
        });
        // 判断是不是已经预约
        appInstance.ajax("/student/getByStudent", { userId: wx.getStorageSync('_id') }, "get", (res) => {
          if (res.data.length == 0) {
            this.setData({
              students: []
            })
            return
          }
          if (res.data[wx.getStorageSync('idx')].booking == 1 || res.data[wx.getStorageSync('idx')].sign_up == 1) {
            this.data.showStudentUrl = true
          }
          wx.setStorageSync('studentId', res.data[wx.getStorageSync('idx')].id)
          this.setData({ students: res.data, studentId: res.data[wx.getStorageSync('idx')].id, showStudentUrl: this.data.showStudentUrl })
        });
      }
      
    // 页面显示
    })
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  courseTo:function(){
      wx.navigateTo({
        url: `/pages/student/myCourse/myCourse?studentId=${this.data.studentId}`
      })
  },
  lessonTo:function(){
    wx.navigateTo({
      url:`/pages/student/myCourse/myLesson/myLesson?studentId=${this.data.studentId}`
    })
  },
  levaeTo: function () {
    wx.navigateTo({
      url: `/pages/student/myCourse/myLeave/myLeave?studentId=${this.data.studentId}`
    })
  },
  teacherCourseTo(){
    wx.navigateTo({
      url: `/pages/teacher/teacherSchedule/teacherSchedule`
    })
  },
  instructionTo:function(){
    wx.navigateTo({
      url: `/pages/student/onlineInstruction/videoList/videoList?studentId=${this.data.studentId}&fn=order`
    })
  },
  classTo: function () {
    let appInstance = getApp();
    appInstance.ajax("/courseTable/getBookingCourseList", { "studentId": this.data.studentId }, "get", (res) => {
      if (res.data.code) {
        if (res.data.data.length > 0) {
          wx.navigateTo({
            url: `/pages/student/bookingRecord/bookingRecord`
          })
        } else {
          wx.navigateTo({
            url: `/pages/student/customerReservation/customerReservation`
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '数据出错',
        })
      }
    });
  },
  enrollTo: function () {
    if (this.data.studentId){
      wx.setStorageSync("studentId", this.data.studentId)
    }
    //查看当前学生有没有报名课程有的话跳转到报名列表页没有的话跳到报名页
    let appInstance = getApp();
    appInstance.ajax("/signUpCurriculum/getStudentCurriculum", { "studentId": this.data.studentId }, "get", (res) => {
      if (res.data.code) {
        if (res.data.data.length>0){
          wx.navigateTo({
            url: `/pages/student/registrationRecord/registrationRecord`
          })
         }else{
          wx.navigateTo({
            url: `/pages/student/signUpTeacherList/signUpTeacherList`
          })
         }
      }else{
        wx.showToast({
          icon: 'none',
          title: '数据出错',
        })
      }
    });
    console.log(this.data.signCurriculum)
    
  },
  telUs: function () {
    wx.navigateTo({
      url: "/pages/index/contact/contact"
    })
  }
  , 
  switchStudent(e){
    if (this.data.students[e.currentTarget.dataset.index].booking == 0 && this.data.students[e.currentTarget.dataset.index].sign_up == 0) {
      this.data.showStudentUrl = false
    }else{
      this.data.showStudentUrl = true
    }
    wx.setStorageSync('studentId', this.data.students[e.currentTarget.dataset.index].id)
    wx.setStorageSync('idx',e.currentTarget.dataset.index)
    this.setData({ idx: e.currentTarget.dataset.index, studentId: this.data.students[e.currentTarget.dataset.index].id, showStudentUrl: this.data.showStudentUrl})
  },
  url(e) {
    if (this.data.isWho === 1 && e.currentTarget.dataset.urlindex==0) {
      this.setData({ urlIndex: 3 })
    }else{
      this.setData({ urlIndex: e.currentTarget.dataset.urlindex })
    }
    if (e.currentTarget.dataset.urlindex == 0 || this.data.urlIndex === 3) {
      wx.setNavigationBarTitle({
        title: "个人中心"
      })
    } else if (e.currentTarget.dataset.urlindex == 1) {
      wx.setNavigationBarTitle({
        title: "展示中心"
      })
    } else {
      wx.setNavigationBarTitle({
        title: "关于音曼"
      })
    }
  }
})