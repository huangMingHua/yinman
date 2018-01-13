// pages/student/myCourse/myLessonAndleave/myLessonAndleave.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlIndex:0,
    prompt: ['调课说明', "1、每学期每节课因私原因仅限调课2次。", "2、请提前2天调课，2天内的课程不允许调课。"],
    record: [],
    semesterArr: [],
    index: 0,
    studentId: '',
    terms: [],
    teacherId: '',
    loading: '加载中',
    record1: [],
    semesterArr1: [],
    index1: 0,
    studentId1: '',
    terms1: [],
    teacherId1: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var appInstance = getApp();
    wx.showLoading({
      title: '加载中',
    })
    var appInstance = getApp();
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync("sign") == 1) {
      appInstance.ajax("/student/getById", { id: options.studentId }, "get", (res) => {
        //获取学生的名字
        wx.setNavigationBarTitle({
          title: `请假补课记录  ${res.data.name}`
        })
      })
      //获取学期
      appInstance.ajax("/student/getSignUpTerms", { studentId: options.studentId }, "get", (res) => {
        if (res.data[0]) {
          for (let item of res.data) {
            this.data.semesterArr.push(item.name)
          }
          wx.hideLoading()
          this.setData({ semesterArr: this.data.semesterArr, studentId: options.studentId, terms: res.data })
          //获取请假记录
          appInstance.ajax("/courseTableLeave/getListBystudentIdAndTermId", { studentId: options.studentId, termId: res.data[0].id }, "get", (res) => {
            if (res.data.code == 1) {
              console.log(res)
              this.setData({ record: res.data.data })

            } else {
              console.log('数据出错')
            }
            this.setData({ record: res.data })
          })
        } else {
          wx.hideLoading()
          this.setData({ loading: '没有数据' })
        }
      })



      //学生补课
      //获取学期
      appInstance.ajax("/student/getSignUpTerms", { studentId: options.studentId }, "get", (res) => {
        if (res.data[0]) {
          for (let item of res.data) {
            this.data.semesterArr1.push(item.name)
          }
          this.setData({ semesterArr1: this.data.semesterArr1, studentId1: options.studentId, terms1: res.data })
          appInstance.ajax("/courseTableChangeClass/getListByTermIdAndstundetId", { studentId: options.studentId, termId: res.data[0].id }, "get", (res) => {
            if (res.data.code == 1) {
              this.setData({ record1: res.data.data })
            } else {
              console.log('数据出错')
            }
          })
        } else {
          wx.hideLoading()
          this.setData({ loading: '没有数据' })
        }
      })
    } else {
      appInstance.ajax("/teacher/getByUserId", { userId: wx.getStorageSync('_id') }, "get", (res) => {
        //获取老师姓名
        wx.setNavigationBarTitle({
          title: `请假补课记录  ${res.data.data.name}`
        })
        var teacherId = res.data.data.id
        //获取学期
        appInstance.ajax("/teacher/getTerms", { teacherId: teacherId }, "get", (res) => {
          if (res.data.data.length == 0) {
            wx.hideLoading()
            return
          } else {
            this.setData({ loading: '没有数据' })
          }
          for (let item of res.data.data) {
            this.data.semesterArr.push(item.name)
          }
          this.setData({ semesterArr: this.data.semesterArr, terms: res.data.data, teacherId: teacherId })
          wx.hideLoading()
          //获取老师调课
          appInstance.ajax("/teacher/getCourseSwitch", { teacherId: teacherId, termId: res.data.data[0].id }, "get", (res) => {
            console.log(res)
            this.setData({ record: res.data })
          });
        });
      })
      //老师补课
      //获取老师姓名
      appInstance.ajax("/teacher/getByUserId", { userId: options.userId }, "get", (res) => {
        wx.setNavigationBarTitle({
          title: `我的调课  ${res.data.data.name}`
        })
        var teacherId = res.data.data.id
        appInstance.ajax("/teacher/getTerms", { teacherId: teacherId }, "get", (res) => {
          if (res.data.data.length == 0) {
            wx.hideLoading()
            return
          } else {
            this.setData({ loading: '没有数据' })
          }
          for (let item of res.data.data) {
            this.data.semesterArr1.push(item.name)
          }
          this.setData({ semesterArr: this.data.semesterArr1, terms: res.data.data, teacherId1: teacherId })
          wx.hideLoading()
          //获取老师补课信息
          appInstance.ajax("/courseTableChangeClassForTeacher/getListByTeacherIdAndtermId", { teacherId: teacherId, termId: res.data.data[0].id }, "get", (res) => {
            console.log(res)
            this.setData({ record1: res.data })
          });
        });
      })
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