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
    teacherChange: function(e) {
        this.data.makeupTime = ['请选择']
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            teacherIndex: e.detail.value
        })
        if (e.detail.value != 0) {
            for (var item of this.data.teacherData[e.detail.value - 1].courseTableItems) {
                this.data.makeupTime.push(item.date)
            }
            this.setData({ makeupTime: this.data.makeupTime, courseTableItems: this.data.teacherData[e.detail.value - 1].courseTableItems })
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

        }

    },
    onLoad: function(options) {
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
                    title: '你本节课请假次数已用完',
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
    formSubmit: function(e) {
        console.log(e)
        this.setData({ sLeave: '', sTeacher: '', sMakeup: '' })
        var appInstance = getApp()
        if (this.data.leaveIndex == 0) {
            this.setData({ sLeave: '请选择请假时间' })
            return
        }
        if (e.detail.value.reason == 0) {
            this.setData({ sReason: '调课原因不能为空' })
            return
        }
        wx.showToast({
            title: '提交中',
            icon: 'success',
            duration: 5000,
            mask: true
        })
        appInstance.ajax("/courseTableLeave/addLeave", {
            fromCourseTableItemId: this.data.course.courseTableItems[this.data.leaveIndex - 1].id,
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
                    }, 2000)
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