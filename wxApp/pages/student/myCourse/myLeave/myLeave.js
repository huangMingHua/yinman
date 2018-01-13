// pages/student/myCourse/myLesson/myLesson.js
Page({
  data: {
    //温馨提示内容
    prompt: ['调课说明', "1、每学期每节课因私原因仅限调课2次。", "2、请提前2天调课，2天内的课程不允许调课。"],
    record: [],
    semesterArr: [],
    index: 0,
    studentId: '',
    terms: [],
    teacherId: '',
    loading: '加载中'
  },
  onLoad: function (options) {
    console.log(options)
    // 页面初始化 options为页面跳转所带来的参数
    var appInstance = getApp();
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync("sign") == 1) {
      appInstance.ajax("/student/getById", { id: options.studentId }, "get", (res) => {
        console.log(res)
        wx.setNavigationBarTitle({
          title: `我的请假  ${res.data.name}`
        })
      })
      appInstance.ajax("/student/getSignUpTerms", { studentId: options.studentId }, "get", (res) => {
        if (res.data[0]) {
          for (let item of res.data) {
            this.data.semesterArr.push(item.name)
          }
          wx.hideLoading()
          this.setData({ semesterArr: this.data.semesterArr, studentId: options.studentId, terms: res.data })
          appInstance.ajax("/courseTableLeave/getListBystudentIdAndTermId", { studentId: options.studentId, termId: res.data[0].id }, "get", (res) => {
            if (res.data.code==1){
              console.log(res)
              this.setData({ record: res.data.data })

            }else{
              console.log('数据出错')
            }
            this.setData({ record: res.data })
          })
        } else {
          wx.hideLoading()
          this.setData({ loading: '没有数据' })
        }
      })
    } else {
      appInstance.ajax("/teacher/getByUserId", { userId: wx.getStorageSync('_id') }, "get", (res) => {
        wx.setNavigationBarTitle({
          title: `我的请假  ${res.data.data.name}`
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
            this.data.semesterArr.push(item.name)
          }
          this.setData({ semesterArr: this.data.semesterArr, terms: res.data.data, teacherId: teacherId })
          wx.hideLoading()
          appInstance.ajax("/teacher/getCourseSwitch", { teacherId: teacherId, termId: res.data.data[0].id }, "get", (res) => {
            console.log(res)
            this.setData({ record: res.data })
          });
        });
      })

    }

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  semesterChange(e) {
    var appInstance = getApp()
    if (wx.getStorageSync("sign") == 1) {
      if (this.data.semesterArr.length > 0) {
        console.log(this.data.terms[e.detail.value].id)
        appInstance.ajax("/courseTableLeave/getListBystudentIdAndTermId", { termId: this.data.terms[e.detail.value].id, studentId: this.data.studentId }, "get", (res) => {
          console.log(res.data.data)
          this.setData({ record: res.data, index: e.detail.value })
        });
      }
    } else {
      if (this.data.semesterArr.length > 0) {
        appInstance.ajax("/teacher/getCourseSwitch", { teacherId: this.data.teacherId, termId: this.data.terms[e.detail.value].id }, "get", (res) => {
          this.setData({ record: res.data, index: e.detail.value })
        });
      }
    }

  },
})