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
        sReason: '',
        courseTableDetailId:'',
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
    //教室下拉框时间
    teacherChange: function(e) {
        this.data.makeupTime = ['请选择']
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            teacherIndex: e.detail.value
        })
        this.setData({ makeupTime: ['请选择'], room: '', timeIndex: 0 })
        if (e.detail.value != 0) {
          console.log(this.data.course)
          for (var item of this.data.teacherData[e.detail.value - 1].classes) {
            let leaveTime = this.data.leaveTime[this.data.leaveIndex]
            let makeUpTime = item.date + " " + item.startTime + "~" + item.endTime
            console.log(this.data.leaveTime[this.data.leaveIndex], makeUpTime)
            this.data.makeupTime.push(item.date + " " + item.startTime + "~" + item.endTime)
          }
          this.setData({ makeupTime: this.data.makeupTime, courseTableItems: this.data.teacherData[e.detail.value - 1].classes })
        } else {
            this.setData({ makeupTime: ['请选择'], room: '', timeIndex: 0 })
        }
    },
    //时间选择下拉框事件
    bindTimeChange: function(e) {
        this.data.arrTime = e.detail.value
        this.setData({ arrTime: this.data.arrTime })
    },
    //日期选择下拉框事件
    bindDateChange: function(e) {
        this.data.arrDate = e.detail.value
        this.setData({
            arrDate: this.data.arrDate
        })
    },
    TimesChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if (e.detail.value != 0) {
            console.log(this.data.courseTableItems[e.detail.value - 1].classroomName)
            this.setData({
                timeIndex: e.detail.value,
                room: this.data.courseTableItems[e.detail.value - 1].classroomName,
            })
        } else {
            this.setData({
                timeIndex: 0,
                room: '',
            })
        }
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "申请补课"
        })
        var appInstance = getApp()
            //获取用户信息
        appInstance.ajax("/student/getFreeListByCourseTableDetailId", { courseTableDetailId: options.courseTableDetailId, studentId: wx.getStorageSync('studentId') }, "get", (res) => {
          appInstance.ajax("/student/getById", { id: wx.getStorageSync('studentId') }, 'get', (res) => {
                console.log(res)
                this.setData({ courseTableDetailId: options.courseTableDetailId, name: res.data.name })
            })
          appInstance.ajax("/courseTableChangeClass/getMakeupDataForStudent", { courseTableDetailId: options.courseTableDetailId, studentId: wx.getStorageSync('studentId') }, "get", (res) => {
                this.data.teachers = ["请选择"];
                for (var [key, item] of res.data.teachers.entries()) {
                  this.data.teachers.push(item.teacher
                    .name)
                }
                this.setData({ teachers: this.data.teachers, teacherData: res.data.teachers })
            })
            if (res.data.data.courseTableDetailStudent.numberOfChangeClass == 0) {
                wx.showToast({
                    title: '你本节课补课次数已用完',
                    icon: 'none',
                    duration: 5000
                })
                this.setData({ disabled: true })
            } else if ((res.data.data.courseTableDetailStudent.allNumberOfChangeClass - res.data.data.courseTableDetailStudent.numberOfleave) - (res.data.data.courseTableDetailStudent.allNumberOfChangeClass - res.data.data.courseTableDetailStudent.numberOfChangeClass) == 0) {
                wx.showToast({
                    title: `你没有补课次数，不需要补课`,
                    icon: 'none',
                    duration: 5000
                })
                this.setData({ disabled: true })
            }
            this.data.prompt = ['注意事项', `1、本课程你已请假${res.data.data.courseTableDetailStudent.allNumberOfChangeClass - res.data.data.courseTableDetailStudent.numberOfleave}次，剩余${res.data.data.courseTableDetailStudent.numberOfleave}次，补课${res.data.data.courseTableDetailStudent.allNumberOfChangeClass - res.data.data.courseTableDetailStudent.numberOfChangeClass}次，剩余${res.data.data.courseTableDetailStudent.numberOfChangeClass}次`, '2、申请1次调课即为完成了1次请假和1次补课']
            for (var item of res.data.data.courseTableItems) {
                this.data.leaveTime.push(item.date + " " + item.startTime + "~" + item.endTime)
            }

            this.setData({ course: res.data.data, courseTableDetailId: options.courseId, prompt: this.data.prompt, studentId: options.studentId })
        });
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    leaveChange: function(e) {
        console.log(e)

        this.setData({
            leaveIndex: e.detail.value
        })
        if (e.detail.value == 0) {
            return
        }
        var appInstance = getApp()
        if (e.detail.value != 0) {

        }

    },
    //提交事件
    formSubmit: function(e) {
        console.log(e)
        this.setData({ sLeave: '', sTeacher: '', sMakeup: '' })
        var appInstance = getApp()
        if (this.data.teacherIndex == 0) {
            this.setData({ sTeacher: '请选择调课老师' })
            return
        }
        if (this.data.timeIndex == 0) {
            this.setData({ sMakeup: '请选择补课时间' })
            return
        }
        wx.showToast({
            title: '提交中',
            icon: 'success',
            duration: 5000,
            mask: true
        })
        console.log(this.data.courseTableDetailId)
        appInstance.ajax("/courseTableChangeClass/addMakeup", {
            courseTableDetailId: this.data.courseTableDetailId,
            currentTeacher: this.data.teacherData[this.data.teacherIndex - 1].id,
            toCourseTableItemId: this.data.courseTableItems[this.data.timeIndex - 1].id,
            reason: e.detail.value.reason,
            studentId: wx.getStorageSync('studentId'),
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
                    })
                }, 5000)
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