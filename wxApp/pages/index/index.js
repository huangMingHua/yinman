// pages/index/index.js
Page({
  data: {
    url:"",
    signUrl:""
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "个人中心"
    })
    // 页面初始化 options为页面跳转所带来的参数
          var appInstance = getApp();
        // 判断是不是已经预约
        //   appInstance.ajax("/getBookingCourse", { id: wx.getStorageSync('_id'),state:0}, "get",  (res)=> {
        //     if (res.data.boff) {
        //       this.setData({ url: "subscribeList/subscribeList" })
        //     } else {
        //       this.setData({ url: "class/class" })
        //     }
        //   });
        // // 判断是不是已经报名
        //   appInstance.ajax("/getsignUp", { id: wx.getStorageSync('_id'),state:0}, "get",  (res)=> {
        //     if (!res.data.boff) {
        //       this.setData({ signUrl: "signUpList/signUpList" })
        //     } else {
        //       this.setData({ signUrl: "signUp/signUp" })
        //     }
        //   });

  },
  classTo: function () {
    wx.navigateTo({
      url: "/pages/index/class/appointmentList/appointmentList"
    })
  },

  enrollTo: function () {
    wx.navigateTo({
      url: "/pages/student/studentList/studentList"
    })
  },
  telUs: function () {
    wx.navigateTo({
      url: "contact/contact"
    })
  }
})