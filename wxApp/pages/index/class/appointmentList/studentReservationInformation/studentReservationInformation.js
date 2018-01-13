// pages/index/class/appointmentList/studentReservationInformation/studentReservationInformation.js
var WxParse = require('../../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        curriculums: ["请选择"],
        teachers: ["请选择"],
        index: 0,
        index1: 0,
        dateIndex: 0,
        btn: "提交",
        show: true,
        telFun: '预约热线',
        number: {
            phone: "021-50836037",
            mobile: "13524160481"
        },
        dateArr: ['请选择'],
        disab: false,
        id: "",
        state: "",
        sConfirmedTime: '',
        teachersData: [],
        courseName: null,
        dateData: [],
        dateId: null,
        iClassRoom: '',
        requirementVlaue: '',
        requirement: '',
        courseDescription: '',
        sCourse: '',
        sTime: '',
        sTeacher: '',
        sClassRoom: '',
        remarksLength: 0,
        studentName:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "预约试课"
        })
        var appInstance = getApp();
        appInstance.ajax("/courseTable/getBookingCourse", "", "get", (res) => {
            for (let item of res.data.data) {
                if (item) {
                    this.data.curriculums.push(item.courseName)
                }
            }
            this.setData({ curriculums: this.data.curriculums })
        });
        appInstance.ajax("/student/getById", {id: wx.getStorageSync('studentId')}, "get", (res) => {
          console.log(res)
          this.data.studentName = res.data.name
          this.setData({ studentName: this.data.studentName})
        });
        if (options._id) {
            appInstance.ajax("/bookingCourse/getById", { id: options._id }, "get", (res) => {
                if (res.data.courseTableItemId) {
                    if (res.data.state == "已取消" || res.data.state == '已试听' || res.data.state == '未试听' || res.data.state == '已拒绝') {
                        this.setData({ show: false })
                    }
                    console.log(res)
                    if (res.course) {
                        this.data.curriculums[0] = res.data.course.courseName
                        this.data.teachers[0] = res.data.course.teacherName.name
                        this.data.dateArr[0] = res.data.course.date + " " + res.data.course.startTime + " - " + res.data.course.endTime
                        this.data.iClassRoom = res.data.course.classroom.name
                        WxParse.wxParse('article', 'html', res.data.course.curriculum.courseDescription, this, 5);
                    } else {
                        this.data.curriculums[0] = res.data.afterCourseDeleTeSaveInfo.courseName
                        this.data.teachers[0] = res.data.afterCourseDeleTeSaveInfo.teacherName.name
                        this.data.dateArr[0] = res.data.afterCourseDeleTeSaveInfo.date + " " + res.data.afterCourseDeleTeSaveInfo.startTime + " - " + res.data.afterCourseDeleTeSaveInfo.endTime
                        this.data.iClassRoom = res.data.afterCourseDeleTeSaveInfo.classroom.name
                        WxParse.wxParse('article', 'html', res.data.afterCourseDeleTeSaveInfo.curriculum.courseDescription, this, 5);
                    }
                    
                    this.setData({
                        disab: true,
                        btn: "取消",
                        id: options._id,
                        state: res.data.state,
                        curriculums: this.data.curriculums,
                        teachers: this.data.teachers,
                        dateArr: this.data.dateArr,
                        iClassRoom: this.data.iClassRoom,
                        requirementVlaue: res.data.requirement,
                    })
                    if (res.data.changeCourse) {
                        this.setData({
                            sTime: "更改为：" + res.data.changeCourse.date + " " + res.data.changeCourse.startTime + "-" + res.data.changeCourse.endTime,
                            sTeacher: "更改为：" + res.data.changeCourse.teacherName.name,
                            sClassRoom: "更改为：" + res.data.changeCourse.classroom.name
                        })
                    }

                }
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    bindTeachersChange: function(e) {
        console.log(this.data.teachersData)
            //通过index所选的课程

        for (var i = 0; i < this.data.dateData.length; i++) {
            if (this.data.dateData[i].date + " " + this.data.dateData[i].startTime + '~' + this.data.dateData[i].endTime == this.data.dateArr[this.data.dateIndex] && this.data.dateData[i].teacherId == this.data.teachersData[e.detail.value - 1].id) {
                console.log(this.data.dateData[i])
                this.setData({
                    index: e.detail.value,
                    dateId: this.data.dateData[i].id,
                    iClassRoom: this.data.dateData[i].classroom.name
                })
            }
        }
    },
    bindCurriculumsChange: function(e) {
        //通过index所选的课程
        this.setData({
            index1: e.detail.value
        })
        if (e.detail.value > 0) {
            var appInstance = getApp();
            // console.log(this.data.curriculums[e.detail.value])
            // appInstance.ajax("/courseTable/getBookingCourseTime", { teacherId: this.data.teacherId, courseName: this.data.curriculums[e.detail.value] }, "get", (res) => {
            //   for (let item of res.data.data) {
            //     this.data.dateArr.push(item.date + " " + item.startTime + "~" + item.endTime)
            //   }
            //   this.setData({ dateArr: this.data.dateArr, dateData: res.data.data})
            // });
            // console.log(this.data.curriculums[e.detail.value])

            var appInstance = getApp();
            var index = 0
            appInstance.ajax("/courseTable/getBookingCourseTime", { courseName: this.data.curriculums[e.detail.value] }, "get", (res) => {
                this.data.dateArr = ['请选择']
                for (let item of res.data.data) {
                    if (item) {
                        this.data.dateArr[index + 1] = item.date + " " + item.startTime + "~" + item.endTime
                        index++
                    }
                }
                var courseDescription = ''
                console.log(res.data.data)
                if (res.data.data[0].course.courseDescription) {
                    WxParse.wxParse('article', 'html', res.data.data[0].course.courseDescription, this, 5);
                }
                this.setData({
                    dateArr: this.data.dateArr,
                    dateData: res.data.data,
                    courseDescription: courseDescription,
                    dateIndex: 0,
                    index: 0,
                    iClassRoom: ''
                })
            });
        } else {
            this.setData({
                dateArr: ['请选择'],
                dateIndex: 0,
                teachers: ["请选择"],
                index: 0,
                iClassRoom: ''
            })
        }
    },
    bindDateChange(e) {
        this.setData({
            dateIndex: e.detail.value
        })
        var appInstance = getApp();
        var index = 0
        if (e.detail.value > 0) {
            console.log(this.data.dateData[e.detail.value - 1])
            appInstance.ajax("/courseTable/getBookingCourseTeacher", { courseName: this.data.curriculums[this.data.index1], date: this.data.dateData[e.detail.value - 1] }, "get", (res) => {
                if (res.data.code == 1) {
                    let index = 0
                    for (var i = 0; i < res.data.data.length; i++) {
                        if (res.data.data[i]) {
                            this.data.teachers[index + 1] = res.data.data[i].name
                            index++
                        }
                    }
                    this.setData({
                        teachers: this.data.teachers,
                        teachersData: res.data.data,
                        courseName: this.data.curriculums[e.detail.value],
                        index: 0,
                        iClassRoom: ''
                    })
                } else {
                    return
                }
            });
        } else {
            this.setData({
                teachers: ["请选择"],
                index: 0,
                iClassRoom: ''
            })
        }
        // console.log(this.data.curriculums, e.detail.value)
        // var appInstance = getApp();
        // appInstance.ajax("/classRoom/getById", { courseName: this.data.curriculums[e.detail.value] }, "get", (res) => {
        //   if (res.data.code == 1) {
        //     let index = 0
        //     for (var i = 0; i < res.data.data.length; i++) {
        //       this.data.teachers[index++]=res.data.data[i].name
        //       index++
        //     }
        //     this.setData({ teachers: this.data.teachers, teachersData: res.data.data, courseName: this.data.curriculums[e.detail.value] })
        //   } else {
        //     return
        //   }
        // });
    },
    telephone: function() {
        wx.makePhoneCall({
            phoneNumber: '021-50836037' //仅为示例，并非真实的电话号码
        })
    },
    mobilePhone: function() {
        wx.makePhoneCall({
            phoneNumber: '13524160481' //仅为示例，并非真实的电话号码
        })
    },
    bindTimeChange: function(e) {
        //默认显示的时间
        this.setData({
            "dateData.time": e.detail.value
        })
    },
    bindDateChange1: function(e) {
        //添加的时间段的年月份
        var index = e.currentTarget.dataset.index
        this.data.dateArr[index].date = e.detail.value
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            dateArr: this.data.dateArr
        })
    },
    bindTimeChange1: function(e) {
        //添加的时间段时间
        var index = e.currentTarget.dataset.index
        this.data.dateArr[index].time = e.detail.value
        this.setData({
            dateArr: this.data.dateArr
        })
    },
    add: function(event) {
        if (this.data.btn == "取消") {
            return
        }
        //添加时间段
        var date = new Date
            // console.log(date.getMonth()+1)
        if (this.data.dateArr.length < 2) {
            this.data.index++
                this.data.dateArr.push({
                    date: date.getFullYear() + "-" + this.addZero(date.getMonth() + 1) + "-" + this.addZero(date.getDate()),
                    time: this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes()),
                })
            this.setData({ dateArr: this.data.dateArr })
        }
    },
    del: function(event) {
        if (this.data.btn == "取消") {
            return
        }
        //删除时间段
        var index = event.currentTarget.dataset.index
        this.data.dateArr.splice(index - 1, 1)
        this.setData({ dateArr: this.data.dateArr })
    },
    addZero: function(obj) {
        //添加0
        console.log(obj)
        var str = ""
        return str = obj < 10 ? "0" + obj : "" + obj
    },
    requirement: function(e) {
        this.setData({ requirementVlaue: e.detail.value, remarksLength: e.detail.value.length })
    },
    submit: function() {
        var appInstance = getApp();
        if (this.data.id != "") {
            var This = this
            let sConfirmedTime = new Date(this.data.sConfirmedTime).getTime()
            wx.showModal({
                title: '提示',
                content: '确认取消预约试课？',
                success: function(res) {
                    console.log(This.data.id)
                    if (res.confirm) {
                        appInstance.ajax("/bookingCourse/cancel", { id: This.data.id }, "post", (res) => {
                            if (res.data.code == 1) {
                                wx.showToast({
                                    title: "取消成功！",
                                    duration: 5000
                                })
                                setTimeout(function() {
                                    wx.navigateBack({
                                        url: '/pages/index/subscribeList/subscribeList?_id=' + wx.getStorageSync("studentId")
                                    })
                                }, 1000)
                            } else {
                                wx.showToast({
                                    title: res.data.msg,
                                    duration: 5000
                                })
                            }
                        });
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            return
        }
        this.setData({ sCourse: '', sTime: '', sTeacher: '' })
        if (this.data.index1 == 0) {
            this.setData({ sCourse: '请选择课程' })
        } else if (this.data.dateIndex == 0) {
            this.setData({ sTime: '请选择时间' })
        } else if (this.data.index == 0) {
            this.setData({ sTeacher: '请选择老师' })
        } else {
            var times = []
            times.push(this.data.dateData)
            for (var i = 0; i < this.data.dateArr.length; i++) {
                times.push(this.data.dateArr[i])
            }
            var curriculumInfo = {}
            var date = new Date()
            curriculumInfo.createTime = date.getFullYear() + ":" + (date.getMonth() + 1) + ":" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
            curriculumInfo.times = times
            curriculumInfo.studentId = wx.getStorageSync('studentId')
            curriculumInfo.state = '待确认'
            curriculumInfo.courseTableItemId = this.data.dateId
            curriculumInfo.auditing = 0
            curriculumInfo.requirementVlaue = this.data.requirementVlaue
            appInstance.ajax("/bookingCourse/saveBookingInfo", curriculumInfo, "post", (res) => {
                if (res.data.code == 1) {
                    wx.showToast({
                        title: '添加成功',
                        duration: 5000
                    })
                    setTimeout(function() {
                        wx.navigateBack({
                            url: '/pages/index/subscribeList/subscribeList?_id=' + wx.getStorageSync("studentId")
                        })
                    }, 1000)
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 5000
                    })
                }

            });
        }
    },
    downPic(data) {
        // wx.previewImage({
        //   current: 'https://wx.yinmanyinyue.com/public/files/animamusic.jpg', // 当前显示图片的http链接
        //   urls: ['https://wx.yinmanyinyue.com/public/files/animamusic.jpg'] // 需要预览的图片http链接列表
        // })
        wx.getSavedFileList({
            success: function(res) {
                if (res.fileList.length > 0) {
                    for (var i = 0; i < res.fileList.length; i++) {
                        wx.removeSavedFile({
                            filePath: res.fileList[i].filePath,
                            complete: function(res) {
                                console.log(res)
                            }
                        })
                    }
                }
            }
        })
        var url = data.currentTarget.dataset.down
        console.log(url)
        wx.downloadFile({
            url: url,
            success: function(res) {
                console.log(res)
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: function(res) {
                        console.log(res.savedFilePath)
                        var savedFilePath = res.savedFilePath
                        wx.saveImageToPhotosAlbum({
                            filePath: savedFilePath,
                            success(res) {
                                wx.showToast({
                                    title: '下载成功',
                                    icon: 'success',
                                    duration: 5000
                                })
                            }
                        })
                        console.log("下载成功")
                    },
                    fail: function(err) {
                        wx.showToast({
                            title: err.errMsg,
                            icon: 'loading',
                            duration: 5000
                        })
                    },
                    complete: function(obj) {
                        console.log(obj)
                    }
                })
            },
            fail: function(err) {
                wx.showToast({
                    title: err.errMsg,
                    icon: 'loading',
                    duration: 5000
                })
            }
        })
    },
})