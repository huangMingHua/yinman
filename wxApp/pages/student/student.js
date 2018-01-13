// pages/student/student.js
Page({
  data:{
  url:"",
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
  url:'',
  urlIndex: 2
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
      this.setData({ url: "/pages/student/student" })
      if (user.state == 2) {
        // this.setData({
        //   url: "/pages/teacher/teacher"
        // })
        wx.redirectTo({
          url: '/pages/teacher/teacher?urlindex=' + this.data.urlIndex
        })
      }
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
         this.setData({ students: res.data, studentId: res.data[wx.getStorageSync('idx')].id, showStudentUrl: this.data.showStudentUrl })
       });
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
  instructionTo:function(){
    wx.navigateTo({
      url: `/pages/student/onlineInstruction/videoList/videoList?studentId=${this.data.studentId}&fn=order`
    })
  },
  classTo: function () {
      wx.navigateTo({
        url: `/pages/index/subscribeList/subscribeList?_id=${this.data.studentId}&fn=order`
      })
  },
  enrollTo: function () {
      wx.navigateTo({
        url: `/pages/index/signUpList/signUpList?_id=${this.data.studentId}&fn=order&index=0`
      })
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
    wx.setStorageSync('idx',e.currentTarget.dataset.index)
    this.setData({ idx: e.currentTarget.dataset.index, studentId: this.data.students[e.currentTarget.dataset.index].id, showStudentUrl: this.data.showStudentUrl})
  },
  url(e) {
    console.log(e)
    this.setData({ urlIndex: e.currentTarget.dataset.urlindex })
    if (e.currentTarget.dataset.urlindex == 0) {
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