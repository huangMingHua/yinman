// pages/teacher/teacherSchedule/teacherSchedule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    semesterArr: [],
    semesterIndex: 0,
    termClass: [],
    classTime: [],
    teacher:{},
    user:{},
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
    let teacherId = wx.getStorageSync('teacherId')
    var appInstance = getApp();
    appInstance.ajax("/teacher/getTeamsByTeacherId", { teacherId: teacherId }, "get", (res) => {
      if (res.data.code === 1) {
        for (let i = 0; i < res.data.data.length; i++) {
          this.data.semesterArr[i] = res.data.data[i].name;
        }
        if (this.data.semesterArr.length === 0) {
          this.data.isShow = 0;
        } else {
          this.data.DateSatartEnd = res.data.data[this.data.semesterIndex].startDate + '~' + res.data.data[this.data.semesterIndex].endDate
          this.setData({ semesterArr: this.data.semesterArr, DateSatartEnd: this.data.DateSatartEnd, terms: res.data.data})
          this.getClass(this.data.terms[this.data.semesterIndex].id)
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '学期出错',
        })
      }
    });
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
  //学期切换
  semesterChange(e) {
    this.data.semesterIndex = e.detail.value
    this.data.DateSatartEnd = this.data.terms[this.data.semesterIndex].startDate + '~' + this.data.terms[this.data.semesterIndex].endDate
    this.setData({ semesterIndex: this.data.semesterIndex, DateSatartEnd: this.data.DateSatartEnd })
    this.getClass(this.data.terms[e.detail.value].id)
  },
  getClass(termId){
    var appInstance = getApp();
    appInstance.ajax("/teacher/getTermClassAndClassTime", { teacherId: wx.getStorageSync('teacherId'),termId: termId }, "get", (res) => {
      if (res.data.code === 1) {
        this.setData({ termClass: res.data.data.termClass, classTime: res.data.data.classTime, teacher: res.data.data.teacher, user: res.data.data.user})
      } else {
        wx.showToast({
          icon: 'none',
          title: '学期出错',
        })
      }
    }); 
  }
})