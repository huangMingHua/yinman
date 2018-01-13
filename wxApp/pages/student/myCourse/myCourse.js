// pages/student/myCourse/myCourse.js
Page({
    data: {
        boff: true,
        course: [],
        content: {

        },
        eachCycle: [],
        list: [],
        sign: 1,
        index: 0,
        semesterArr: [],
        semester: [],
        studentId: '',
        term: '',
        teacherSemesterData: '',
        teacherId: '',
        teacherSemesterId: 0,
        frequency: 0,
        scrollLeft: null,
        loading: "加载中"
    },
    onLoad: function(options) {
        console.log(wx.getStorageSync("sign"))
        wx.setNavigationBarTitle({
          title: "我的课程"
        })
        wx.showLoading({
          title: '加载中',
        })

        //全局变量
        var appInstance = getApp()
            //获取用户信息
        var index = 0
        if (wx.getStorageSync("sign") == 1) {
            wx.setStorageSync('studentId', options.studentId)
            appInstance.ajax("/student/getSignUpTerms", { studentId: options.studentId }, "get", (res) => {
                if (res.data[0]) {
                    for (let item of res.data) {
                      this.data.semesterArr.push(item.name)
                    }
                    this.setData({ semesterArr: this.data.semesterArr, semester: res.data, studentId: options.studentId, term: res.data[0].id })
                    appInstance.ajax("/student/getSignUpCourse", { termId: res.data[0].id, studentId: options.studentId }, "get", (res) => {
                        console.log(res)
                        res.data.data.semester = this.data.term
                        res.data.data.studentId = options.studentId
                        console.log(res.data.data)
                        wx.hideLoading()
                        this.setData({ course: res.data.data })
                    });
                } else {
                    wx.hideLoading()
                    this.setData({ loading: '没有数据' })
                }
            });
            this.setData({ sign: 1, frequency: 1 })
        } else {
            this.data.content.head = wx.getStorageSync("wxHead")
            appInstance.ajax("/teacher/getByUserId", { userId: wx.getStorageSync('_id') }, "get", (res) => {
                var teacherId = res.data.data.id
                this.data.content.teacherName = res.data.data.name
                this.setData({
                    semesterArr: this.data.semesterArr
                })
                appInstance.ajax("/teacher/getTerms", { teacherId: teacherId }, "get", (res) => {
                    if (res.data.data.length == 0) {
                        wx.hideLoading()
                        this.setData({ loading: '没有数据' })
                        return
                    }
                    for (let item of res.data.data) {
                        this.data.semesterArr.push(item.name)
                    }
                    this.setData({ teacherSemesterData: res.data.data })
                    for (let [index, item] of res.data.data[0].weeks.entries()) {
                        item.startDate = item.startDate.substr(5)
                        item.endDate = item.endDate.substr(5)
                        console.log(item.current)
                        if (item.current) {
                            this.data.content.index = index
                            this.data.content.scrollLeft = index * 92
                        }
                        if (!this.data.content.index) {
                            this.data.content.index = 0
                        }
                    }
                    this.data.content.eachCycle = res.data.data[0].weeks
                    this.data.content.date = res.data.data[0].startDate + "~" + res.data.data[0].endDate
                    this.setData({
                        semesterArr: this.data.semesterArr,
                        content: this.data.content,
                        teacherId: teacherId,
                        teacherSemesterId: res.data.data[0].id,
                        scrollLeft: this.data.content.scrollLeft
                    })
                    console.log(this.data.content.index)
                    appInstance.ajax("/courseTable/getWeekItems", { teacherId: teacherId, termId: res.data.data[0].id, startDate: this.data.teacherSemesterData[0].weeks[this.data.content.index].startDate }, "get", (res) => {
                        console.log(res)
                        this.data.content.switch = [{ name: '课程信息' }, { name: '我的学生' }]
                        this.data.content.switchIndex = 0
                        this.data.content.course = res.data.list
                        this.setData({ content: this.data.content })
                    })
                    appInstance.ajax("/teacher/getStudents", { termId: res.data.data[0].id, teacherId: teacherId }, "get", (res) => {
                        for (var item of res.data.data) {
                            item.comIndex = 0
                            item.keyInput = ""
                        }
                        wx.hideLoading()
                        this.data.content.student = res.data.data
                        this.setData({ content: this.data.content })
                    })
                });
            })
            this.setData({ sign: 2 })
        }

    },
    onReady: function() {

        // 页面渲染完成
    },
    scroll(e) {
        this.setData({ scrollLeft: e.detail.scrollLeft })
    },
    onShow: function(options) {
        if (wx.getStorageSync("teacher") == 2) {
            wx.setStorageSync("sign", 2)
        }

    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    semesterChange(e) {
        var appInstance = getApp()

        if (wx.getStorageSync("sign") == 1) {
            console.log(this.data.semester, e)
            appInstance.ajax("/student/getSignUpCourse", { termId: this.data.semester[e.detail.value].id, studentId: this.data.studentId }, "get", (res) => {
                res.data.data.semester = this.data.term
                res.data.data.studentId = this.data.studentId
                console.log(res.data.data)
                this.setData({ course: res.data.data, index: e.detail.value })
            });
        } else {
            console.log(this.data.teacherSemesterData)
            var obj = JSON.parse(JSON.stringify(this.data.teacherSemesterData[e.detail.value]))
            for (let item of obj.weeks) {
                item.startDate = item.startDate.substr(5)
                item.endDate = item.endDate.substr(5)
            }
            this.data.content.eachCycle = obj.weeks
            this.data.content.index = 0
            this.data.content.date = obj.startDate + "~" + obj.endDate
            this.setData({ content: this.data.content, teacherSemesterId: obj.id })
            appInstance.ajax("/teacher/getStudents", { termId: this.data.teacherSemesterId, teacherId: this.data.teacherId }, "get", (res) => {
                console.log(res)
                this.data.content.student = res.data.data
                this.setData({ content: this.data.content, index: e.detail.value })
            })

        }

    },
    changeWeek(e) {
        var appInstance = getApp()
        this.data.content.index = e.currentTarget.dataset.index
        this.data.content.scrollLeft = this.data.scrollLeft
        appInstance.ajax("/courseTable/getWeekItems", { teacherId: this.data.teacherId, termId: this.data.teacherSemesterId, startDate: this.data.teacherSemesterData[this.data.index].weeks[e.currentTarget.dataset.index].startDate }, "get", (res) => {
            console.log(res)
            this.data.content.course = res.data.list
            this.setData({ content: this.data.content })
        })
    },
    switch (e) {
        this.data.content.switchIndex = e.currentTarget.dataset.index
        this.setData({ content: this.data.content })
    },
    commenting(e) {
        for (var [index, item] of this.data.content.student.entries()) {
            if (index != e.currentTarget.dataset.index) {
                this.data.content.student[index].comIndex = 0
            }
        }
        if (this.data.content.student[e.currentTarget.dataset.index].comIndex == 0) {
            this.data.content.student[e.currentTarget.dataset.index].comIndex = 1
        } else {
            this.data.content.student[e.currentTarget.dataset.index].comIndex = 0
        }
        console.log(this.data.content)
        this.setData({ content: this.data.content })
    },
    bindKeyInput(e) {
        console.log(e)
        this.data.content.student[e.currentTarget.dataset.index].keyInput = e.detail.value
        this.setData({ content: this.data.content })
    },
    comSubmit(e) {
        var date = new Date()
        this.data.content.student[e.currentTarget.dataset.index].comments.push({
            comment: this.data.content.student[e.currentTarget.dataset.index].keyInput,
            courseDetailId: this.data.content.student[e.currentTarget.dataset.index].courseDetail.id,
            createTime: date.getFullYear() + "-" + addZero((date.getMonth() + 1)) + "-" + addZero(date.getDate()) + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds()),
            id: 1,
            studentId: this.data.content.student[e.currentTarget.dataset.index].id,
            teacherId: this.data.teacherId
        })

        function addZero(num) {
            return num < 10 ? '0' + num : '' + num
        }
        var appInstance = getApp()
        appInstance.ajax("/comment/add", { teacherId: this.data.teacherId, courseDetailId: this.data.content.student[e.currentTarget.dataset.index].courseDetail.id, studentId: this.data.content.student[e.currentTarget.dataset.index].id, comment: this.data.content.student[e.currentTarget.dataset.index].keyInput }, "post", (res) => {
            console.log(res)
            if (res.data.code == 1) {
                this.data.content.student[e.currentTarget.dataset.index].keyInput = ""
                this.setData({ content: this.data.content })
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 5000
                })
            }
        })

    },
    url: function(e) {
        wx.setStorageSync("teacher", 2)
        wx.setStorageSync("sign", 1)
        wx.navigateTo({
            url: `/pages/student/myCourse/myLesson/myLesson?studentId=${e.currentTarget.dataset.nstudentid}`
        })
    },
    url1: function(e) {
        wx.setStorageSync("teacher", 2)
        wx.setStorageSync("sign", 1)
        wx.navigateTo({
            url: `/pages/student/myCourse/myLeave/myLeave?studentId=${e.currentTarget.dataset.nstudentid}`
        })
    }
})