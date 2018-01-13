// pages/student/myCourse/applyLessons/applyLessons.js
Page({
  data: {
    //教室下拉框数据
    teachers: ['请选择'],
    leaveTime: ['请选择'],
    makeupTime: ['请选择'],
    time: [""],
    leaveIndex: 0,
    timeIndex: 0,
    //日期初始的虚拟号
    teacherIndex: 0,
    //日期选择
    arrDate: "2016-09-01",
    //时间选择
    arrTime: "12:01",
    name: "",
    course: "",
    classroom: [""],
    room: "",
    reason: "",
    result: "",
    //温馨提示内容
    prompt: [],
    teacherData: [],
    courseTableItems: [],
    studentId: '',
    disabled: false,
    sLeave: '',
    sTeacher: '',
    sMakeup: '',
    sReason: ''
  },
  //教室下拉框时间
  teacherChange: function (e) {
    this.data.makeupTime = ['请选择']
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      teacherIndex: e.detail.value
    })
    this.setData({ timeIndex: 0, room: '', sReason: '', makeupTime: ['请选择'] })
    if (e.detail.value != 0) {
      for (var item of this.data.teacherData[e.detail.value - 1].courseTableItems) {
        this.data.makeupTime.push(item.date + " " + item.startTime + "~" + item.endTime)
      }
      this.setData({ makeupTime: this.data.makeupTime, courseTableItems: this.data.teacherData[e.detail.value - 1].courseTableItems })
    }
  },
  //时间选择下拉框事件
  bindTimeChange: function (e) {
    this.data.arrTime = e.detail.value
    this.setData({ arrTime: this.data.arrTime })
  },
  //日期选择下拉框事件
  bindDateChange: function (e) {
    this.data.arrDate = e.detail.value
    this.setData({
      arrDate: this.data.arrDate
    })
  },
  TimesChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeIndex: 0,
      room: '',
    })
    if (e.detail.value != 0) {
      console.log(this.data.courseTableItems[e.detail.value - 1].classroomName)
      this.setData({
        timeIndex: e.detail.value,
        room: this.data.courseTableItems[e.detail.value - 1].classroomName,
      })
    }
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "申请请假"
    })
    var appInstance = getApp()
    //获取用户信息
    appInstance.ajax("/student/getFreeListByCourseTableDetailId", { courseTableDetailId: options.courseId, studentId: options.studentId }, "get", (res) => {
      console.log(res)
      appInstance.ajax("/student/getById", { id: options.studentId }, 'get', (res) => {
        console.log(res)
        this.setData({ name: res.data.name })
      })
      if (res.data.data.courseTableDetailStudent.numberOfleave == 0) {
        wx.showToast({
          title: '你本节课调课次数已用完',
          icon: 'success',
          duration: 5000
        })
        this.setData({ disabled: true })
      }
      this.data.prompt = ['注意事项', `1、本课程你已请假${res.data.data.courseTableDetailStudent.allNumberOfChangeClass - res.data.data.courseTableDetailStudent.numberOfleave}次，剩余${res.data.data.courseTableDetailStudent.numberOfleave}次，补课${res.data.data.courseTableDetailStudent.allNumberOfChangeClass - res.data.data.courseTableDetailStudent.numberOfChangeClass}次，剩余${res.data.data.courseTableDetailStudent.numberOfChangeClass}次`, '2、申请1次调课即为完成了1次请假和1次补课']
      for (var item of res.data.data.courseTableItems) {
        this.data.leaveTime.push(item.date + " " + item.startTime + "~" + item.endTime)
      }
      this.setData({ course: res.data.data, prompt: this.data.prompt, leaveTime: this.data.leaveTime, studentId: options.studentId })
    });
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
  leaveChange: function (e) {
    this.setData({
      leaveIndex: e.detail.value
    })
    var appInstance = getApp()
    this.setData({ teachers: ['请选择'], teacherData: [], teacherIndex: 0, timeIndex: 0, room: '', sReason: '', makeupTime: ['请选择'] })
    if (e.detail.value != 0) {
      appInstance.ajax("/courseTableChangeClass/getChangeClassDataForStudent", { id: this.data.course.courseTableItems[e.detail.value - 1].id, studentId: this.data.studentId }, "get", (res) => {
        console.log(res)
        this.data.teachers = ["请选择"];
        for (var [key, item] of res.data.teachers.entries()) {
          this.data.teachers.push(item.name)
        }
        this.setData({ teachers: this.data.teachers, teacherData: res.data.teachers })
      })
    }
  },
  //提交事件
  formSubmit: function (e) {
    this.setData({ sLeave: '', sTeacher: '', sMakeup: '', sReason: '' })
    var appInstance = getApp()
    if (this.data.leaveIndex == 0) {
      this.setData({ sLeave: '请选择请假时间' })
      return
    }
    if (!e.detail.value.reason) {
      this.setData({ sReason: '请填写请假原因' })
      return
    }
    let fromTime
    try {
      fromTime = this.data.course.courseTableItems[this.data.leaveIndex - 1].id
      console.log(this.data.course.courseTableItems[this.data.leaveIndex - 1])
    } catch (err) {
      fromTime = 0
    }
    let teacher
    try {
      teacher = this.data.teacherData[this.data.teacherIndex - 1].id
    }
    catch (err) {
      teacher = 0
    }
    let toTime
    try {
      toTime = this.data.courseTableItems[this.data.timeIndex - 1].id
    }
    catch (err) {
      toTime = 0
    }
    let leaveDate = new Date("2018-01-10").getTime()
    let nowDate = new Date("2018-01-09").getTime()
    if ((leaveDate - nowDate) / 1000 / 3600 / 24 < 2) {
      wx.showModal({
        title: '提示',
        content: '2天内的请假不允许补课，小长假除外！',
        success: function (res) {
          if (res.confirm) {
            teacher=0
            toTime=0
          } else if (res.cancel) {
            console.log('用户点击取消')
            return
          }
        }
      })
    }
    return
    wx.showToast({
      title: '提交中',
      icon: 'success',
      duration: 5000,
      mask: true
    })
    //选择补课老师时没有补课选择时间
    if (this.data.teacherIndex != 0){
      if (this.data.timeIndex == 0){
        return this.setData({ sMakeup: '请选择补课时间' })
      }
    }
    //没有选择补课老师和补课时间说明他是请假
    if (this.data.teacherIndex == 0 && this.data.timeIndex==0) {
      appInstance.ajax("/courseTableLeave/addLeave", {
        fromCourseTableItemId: fromTime,
        sStatus: this.data.course.courseTableItems[this.data.leaveIndex - 1].courseTableItemStudentStatus,
        reason: e.detail.value.reason,
        studentId: this.data.studentId,
      }, "post", (res) => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '调课成功',
            icon: 'success',
            duration: 5000,
          })
          setTimeout(() => {
            wx.navigateBack({
              url: '/pages/student/myCourse/myCourse?studentId=' + wx.getStorageSync("studentId"),
            }, 5000)
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 5000
          })
        }
      })
      return
    }
    appInstance.ajax("/courseTableChangeClass/addChangeClass", {
      fromCourseTableItemId: fromTime,
      currentTeacher: teacher,
      toCourseTableItemId: toTime,
      reason: e.detail.value.reason,
      studentId: this.data.studentId,
    }, "post", (res) => {
      if (res.data.code == 1) {
        wx.showToast({
          title: '请假成功',
          icon: 'success',
          duration: 5000,
        })
        setTimeout(() => {
          wx.navigateBack({
            url: '/pages/student/myCourse/myCourse?studentId=' + wx.getStorageSync("studentId"),
          }, 5000)
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 5000
        })
      }
    })
  }


  //  获取用户信息



})