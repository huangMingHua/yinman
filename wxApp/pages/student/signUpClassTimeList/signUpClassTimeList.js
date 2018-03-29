// pages/student/signUpClassTimeList/signUpClassTimeList.js
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
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
    btn: 0,
    //在报名课程取消或者特定的情况下需要隐藏按钮
    hiddenBtn: false,
    article:"",
    requirements:"",
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let appInstance = getApp();
    //获取教师的信息，用户的头像，课时课的信息
    if (options.courseDetailId){
      appInstance.ajax("/courseTable/getClassTimeClassById", { id: options.courseDetailId }, "get", (res) => {
        if (res.data.code) {
          let data = res.data.data;
          data.level = this.data.levels[data.level-1].name
          this.setData({data:res.data.data})
          var that = this
          console.log(res.data.data.term.noticeOfReservation)
          WxParse.wxParse("article", 'html', res.data.data.term.noticeOfReservation, that, 5)
        }else{
          wx.showToast({
            icon: 'none',
            title: '数据出错',
          }) 
        }
        console.log(res)
      });
    }else{
      appInstance.ajax("/signUpCurriculum/getClassById", { id: options.id }, "get", (res) => {
        if (res.data.code) {
          let data = {
            id: res.data.data.id,
            user: res.data.data.user,
            teacher: res.data.data.courseTableDetail.teacher,
            course: res.data.data.courseTableDetail.course,
            level: this.data.levels[res.data.data.courseTableDetail.level-1].name,
            duration: res.data.data.courseTableDetail.duration,
            term: res.data.data.courseTableDetail.term
          }
          var that = this
          WxParse.wxParse("article", 'html', res.data.data.courseTableDetail.term.noticeOfReservation, that, 5)
          if (res.data.data.state === '已取消' || res.data.data.state === '已确认' || res.data.data.state==='已拒绝') {
            this.data.hiddenBtn = true
          }
          this.setData({
            disabled:true,
            requirements: res.data.data.specialRequirements,
            data,
            num: res.data.data.classTimeNum,
            btn:1,
            hiddenBtn: this.data.hiddenBtn
            })
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据出错',
          })
        }
        console.log(res)
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
  onShow: function () {
    let appInstance = getApp();
    //如果当前用户有学生获取学生信息
    if (wx.getStorageSync("studentId")) {
      console.log(wx.getStorageSync("studentId"))
      let id = wx.getStorageSync("studentId")
      appInstance.ajax("/student/getById", { id: id }, "get", (res) => {
        if (typeof res.data === 'object' && res.data) {
          this.setData({ student: res.data })
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据出错',
          })
        }
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
  //减课时数
  bindReduce(){
    if(this.data.num===1){
      wx.showToast({
        icon: 'none',
        title: '课时数最低报一节课',
      })
    }else{
      if (this.data.btn) {
        return
      }
      let num = --this.data.num
      this.setData({num})
    }
  },
  //加课程数
  bindAdd(){
      if (this.data.btn) {
        return
      }
      let num = ++this.data.num
      this.setData({ num: num })
  },
  requirementsInput(e){
    this.data.requirements = e.detail.value;
    this.setData({ requirements: this.data.requirements })
  },
  submit(){
    console.log(this.data.requirements)
    if (!wx.getStorageSync('studentId')) {
      wx.navigateTo({
        url: '/pages/index/class/class?from=class'
      })
      return
    }
    let appInstance = getApp();
    appInstance.ajax("/signUpCurriculum/saveCurriculum", { studentId: wx.getStorageSync('studentId'), curriculumId: this.data.data.id, num: this.data.num, requirements: this.data.requirements}, "post", (res) => {
      if (res.data.code == 1) {
        wx.showToast({
          icon:'none',
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
      success: (res) => {
        if (res.confirm) {
          let appInstance = getApp();
          appInstance.ajax("/signUpCurriculum/changeState", { id: this.data.data.id, state: '取消' }, "post", (res) => {
            wx.showToast({
              title: "取消成功！",
              duration: 1000
            })
            setTimeout(() => {
              this.goBack()
            }, 2000)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  redirectTo() {
    wx.redirectTo({
      url: '/pages/student/registrationRecord/registrationRecord'
    })
  }
})