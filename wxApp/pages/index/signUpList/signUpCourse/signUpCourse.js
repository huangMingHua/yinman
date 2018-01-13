// pages/index/signUpList/signUpCourse/signUpCourse.js
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        aWeek: ['请选择'],
        weekIndex: 0,
        curriculums: ['请选择'],
        index: 0,
        aTeacher: ['请选择'],
        teacherIndex: 0,
        arrayDay: ['每周一', '每周二', '每周三', '每周四', '每周五'],
        indexDay: 0,
        telFun: "咨询电话",
        btn: "确认报名",
        show: true,
        disab: false,
        id: "",
        state: null,
        aCourse: [],
        iClassRoom: '',
        sInput: '',
        aTermData: [],
        aTerm: ['请选择'],
        termIndex: 0,
        aCycle: ['请选择'],
        cycleIndex: 0,
        aCycleDate: [],
        remarks: '',
        aTeacherId: [],
        number: '',
        sTerm: '',
        sCourse: '',
        sTeacher: '',
        sDay: '',
        sWeek: '',
        remarksLength: 0,
        aTeacherId: [],
        sTerm: '',
        sCourse: '',
        sTeacher: '',
        sDay: '',
        sWeek: '',
        remarksLength: 0,
        iNumber: '',
        iClassRoom1: '',
        sName: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "我要报名"
        })
        var appInstance = getApp();
        var date = new Date
        this.setData({
            timeEnd: this.addZero(date.getHours()) +
                ":" + this.addZero(date.getMinutes()),
            time: this.addZero(date.getHours()) + ":" +
                this.addZero(date.getMinutes())
        })
        if (options._id) {
            appInstance.ajax("/signUpCurriculum/getById", { _id: options._id }, "get", (res) => {
                if (res.data.course) {
                    console.log(res.data)
                    this.data.curriculums[0] = res.data.course.courseName
                    this.data.aTeacher[0] = res.data.teacher.name
                    if (res.data.startCourseTableItemId) {
                        res.data.changeCourse.startDate = res.data.startCourseTableItem.date
                    }
                    this.data.aCycle[0] = res.data.course.startDate + "~" + res.data.course.endDate

                    this.data.aTerm[0] = res.data.term.name
                    this.data.aWeek[0] = res.data.course.dayOfWeek + " " + res.data.course.startTime + "~" + res.data.course.endTime
                    WxParse.wxParse('article', 'html', res.data.course.curriculum.courseDescription, this, 5);
                    this.iClassRoom = res.data.classroom.name
                    this.number = res.data.course.number
                } else {
                    console.log(res.data.afterCourseDeleTeSaveInfo)
                    res.data.afterCourseDeleTeSaveInfo = JSON.parse(res.data.afterCourseDeleTeSaveInfo)
                    this.data.curriculums[0] = res.data.afterCourseDeleTeSaveInfo.courseName
                    this.data.aTeacher[0] = res.data.afterCourseDeleTeSaveInfo.oTeacher.name
                    this.data.aTerm[0] = res.data.afterCourseDeleTeSaveInfo.term.name
                    WxParse.wxParse('article', 'html', res.data.afterCourseDeleTeSaveInfo.curriculum.courseDescription, this, 5);
                    let startDate = new Date(res.data.afterCourseDeleTeSaveInfo.startDate)
                    let endDate = new Date(res.data.afterCourseDeleTeSaveInfo.endDate)
                    let startDateMonth = startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 : '0' + (startDate.getMonth() + 1)
                    let startDateDate = startDate.getDate() + 1 > 9 ? startDate.getDate() : '0' + startDate.getDate()
                    let endDateMonth = endDate.getMonth() + 1 > 9 ? endDate.getMonth() + 1 : '0' + (endDate.getMonth() + 1)
                    let endDateDate = endDate.getDate() + 1 > 9 ? endDate.getDate() : '0' + endDate.getDate()
                    this.data.aCycle[0] = startDate.getFullYear() + "-" + startDateMonth + "-" + startDateDate + "~" + endDate.getFullYear() + "-" + endDateMonth + "-" + endDateDate
                    this.data.aWeek[0] = res.data.afterCourseDeleTeSaveInfo.dayOfWeek + " " + res.data.afterCourseDeleTeSaveInfo.startTime + "~" + res.data.afterCourseDeleTeSaveInfo.endTime
                    this.iClassRoom = res.data.afterCourseDeleTeSaveInfo.oClassroom.name
                    this.number = res.data.afterCourseDeleTeSaveInfo.number
                }
                if (res.data.state == "已取消" || res.data.state == "已停课" || res.data.state == "已拒绝" || res.data.state == "已确认" || res.data.state == "已转课") {
                    this.setData({ show: false })
                }

                this.setData({
                    btn: '取消',
                    disab: true,
                    id: res.data.id,
                    curriculums: this.data.curriculums,
                    aTeacher: this.data.aTeacher,
                    aCycle: this.data.aCycle,
                    aWeek: this.data.aWeek,
                    show: this.data.show,
                    state: res.data.state,
                    aTerm: this.data.aTerm,
                    iClassRoom: this.iClassRoom,
                    sInput: res.data.specialRequirements,
                    number: this.number
                })
                if (res.data.changeCurriculumId && res.data.changeCourse) {
                    this.setData({
                        sTerm: "更改为：" + res.data.changeCourse.term.name,
                        sTeacher: "更改为：" + res.data.changeCourse.teacher.name,
                        sDay: "更改为：" + res.data.changeCourse.dayOfWeek + " " + res.data.changeCourse.startTime + "~" + res.data.changeCourse.endTime,
                        sWeek: "更改为：" + res.data.changeCourse.startDate + "~" + res.data.changeCourse.endDate,
                        iNumber: "更改为：" + res.data.changeCourse.number,
                        iClassRoom1: "更改为：" + res.data.changeCourse.classroom.name,
                    })
                }
            });
        } else {
            appInstance.ajax("/courseTable/getTerm", "", "get", (res) => {
                console.log(res)
                if (res.data.code == 1) {
                    for (let [index, item] of res.data.data.entries()) {
                        this.data.aTerm[index + 1] = item.name
                    }
                    this.setData({ aTerm: this.data.aTerm, aTermData: res.data.data })
                }
            })
            appInstance.ajax("/student/getById", { id:wx.getStorageSync('studentId')}, "get", (res) => {   if(!!res.data){
              this.setData({ sName: res.data.name})
             }
            })
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
    payment: function() {
        let timeStamp = new Date().getTime()
        wx.requestPayment({
            'timeStamp': (timeStamp / 1000).toString(),
            'nonceStr': timeStamp.toString().substr(0, 20),
            'package': 'wx2017033010242291fcfe0db70013231072',
            'signType': 'MD5',
            'paySign': 'appId=wxdc06b91aef63b7b4&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=' + (timeStamp / 1000).toString() + '&key=rhino2sfsdksdfas12df12sdfsdfsdsd',
            'success': function(res) {
                console.log('成功', res)
            },
            'fail': function(res) {
                console.log('失败', res)
            },
            'complete': function(res) {}
        })
    },
    add: function() {
        if (this.data.btn == "取消") {
            return
        }
        //  添加dateArr，通过dateArr循环删除的内容，并把相关的初始值赋给dateArr
        var date = new Date
            // console.log(date.getMonth()+1)
        if (this.data.dateArr.length < 2) {
            this.data.dateArr.push({
                indexDay: 0,
                timeStart: this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes()),
                timeEnd: this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes())
            })
            this.setData({ dateArr: this.data.dateArr })
        }
    },
    del: function(event) {
        if (this.data.btn == "取消") {
            return
        }
        // 删除dateArr相关一项
        var index = event.currentTarget.dataset.index
        this.data.dateArr.splice(index - 1, 1)
        this.setData({ dateArr: this.data.dateArr })
    },
    addZero: function(obj) {
        //  把获取的时间小于10改成01
        var str = ""
        return str = obj < 10 ? "0" + obj : "" + obj
    },
    bindCurriculumChange: function(e) {
        // 改变添加的序号
        this.setData({
            index: e.detail.value
        })
        var appInstance = getApp();
        if (e.detail.value != 0) {
            appInstance.ajax("/courseTable/getApplicableCourseByCourseNameAndTermId", { courseName: this.data.curriculums[e.detail.value], termId: this.data.aTermData[this.data.termIndex - 1].id }, "get", (res) => {
                if (res.data.code == 1) {
                    console.log(res)
                    WxParse.wxParse('article', 'html', res.data.data[0].course.courseDescription, this, 5);
                    this.data.aTeacher = ['请选择']
                    for (let [index, item] of res.data.data.entries()) {
                        this.data.aTeacher[index + 1] = item.teacherName.name
                    }
                    if (res.data.data.length == 0) {
                        this.data.aTeacher = ['请选择']
                    }
                    this.setData({
                        aTeacher: this.data.aTeacher,
                        aTeacherId: res.data.data,
                        teacherIndex: 0,
                        aWeek: ['请选择'],
                        weekIndex: 0,
                        aCycle: ['请选择'],
                        cycleIndex: 0,
                        iClassRoom: ''
                    })
                }
            })
        } else {
            this.setData({
                aTeacher: ['请选择'],
                teacherIndex: 0,
                aWeek: ['请选择'],
                weekIndex: 0,
                aCycle: ['请选择'],
                cycleIndex: 0,
                iClassRoom: ''
            })
        }
    },
    bindTeacherChange: function(e) {
        this.setData({
            teacherIndex: e.detail.value
        })
        var appInstance = getApp();
        if (e.detail.value != 0) {
          appInstance.ajax("/courseTable/getApplicableCourseByCourseNameAndTeacherNameAndTermId", { courseName: this.data.curriculums[this.data.index], teacherName: this.data.aTeacherId[this.data.teacherIndex - 1].teacherName.id, studentId: wx.getStorageSync('studentId'), termId: this.data.aTermData[this.data.termIndex - 1].id }, "get", (res) => {
                console.log(res)
                if (res.data.code == 1) {
                    for (let [index, item] of res.data.data.entries()) {
                        this.data.aWeek[index + 1] = item.dayOfWeek + ' ' + item.startTime + '~' + item.endTime
                    }
                    if (res.data.data.length == 0) {
                        this.data.aWeek = ['请选择']
                    }
                    this.setData({ aWeek: this.data.aWeek, weekIndex: 0, aCycle: ['请选择'], cycleIndex: 0, iClassRoom: '' })
                }
            })
        } else {
            this.setData({ aWeek: ['请选择'], weekIndex: 0, aCycle: ['请选择'], cycleIndex: 0, iClassRoom: '' })
        }
    },
    bindTermChange: function(e) {
        this.setData({
            termIndex: e.detail.value
        })
        var appInstance = getApp();
        if (e.detail.value != 0) {
            appInstance.ajax("/courseTable/getApplicableCourseByTermId", { termId: this.data.aTermData[this.data.termIndex - 1].id, studentId: wx.getStorageSync('studentId') }, "get", (res) => {
                if (res.data.code == 1) {
                    for (let [index, item] of res.data.data.entries()) {
                        this.data.curriculums[index + 1] = item.courseName
                    }
                    if (res.data.data.length == 0) {
                        this.data.curriculums = ['请选择']
                    }
                    this.setData({
                        curriculums: this.data.curriculums,
                        aWeek: ['请选择'],
                        weekIndex: 0,
                        index: 0,
                        aTeacher: ['请选择'],
                        teacherIndex: 0,
                        aCycle: ['请选择'],
                        cycleIndex: 0,
                        iClassRoom: ''
                    })
                }
            })
        } else {
            this.setData({
                aWeek: ['请选择'],
                weekIndex: 0,
                curriculums: ['请选择'],
                index: 0,
                aTeacher: ['请选择'],
                teacherIndex: 0,
                aCycle: ['请选择'],
                cycleIndex: 0,
                iClassRoom: ''
            })
        }
    },
    bindWeekChange: function(e) {
        this.setData({
            weekIndex: e.detail.value
        })
        var appInstance = getApp();
        if (e.detail.value != 0) {
            appInstance.ajax("/courseTable/getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek", { courseName: this.data.curriculums[this.data.index], teacherName: this.data.aTeacherId[this.data.teacherIndex - 1].teacherName.id, termId: this.data.aTermData[this.data.termIndex - 1].id, week: this.data.aWeek[e.detail.value] }, "get", (res) => {
                    if (res.data.code == 1) {
                        if (res.data.data.length > 1) {
                            this.data.aCycle[0] = ['请选择']
                            for (let [index, item] of res.data.data.entries()) {
                                this.data.aCycle[index + 1] = item.startDate + '~' + item.endDate
                            }
                            this.setData({ aCycleDate: res.data.data, iClassRoom: '', remarks: "" })
                        } else if (res.data.data.length == 1) {
                            console.log(res.data.data)
                            this.data.remarks = res.data.data[0].remarks
                            this.data.aCycle[0] = res.data.data[0].startDate + '~' + res.data.data[0].endDate
                            this.setData({
                                iClassRoom: res.data.data[0].classroom.name,
                                remarks: this.data.remarks,
                                number: res.data.data[0].number
                            })
                        }
                        this.setData({ aCycle: this.data.aCycle, aCourse: res.data.data })
                    } else {
                        console.log('出错')
                    }
                })
                // this.setData({ iClassRoom: this.data.aCourse[e.detail.value-1].classroom.name})
        } else {
            this.setData({
                aCycle: ['请选择'],
                cycleIndex: 0,
                iClassRoom: '',
                remarks: ""
            })
        }
    },
    bindCycleChange(e) {
        this.setData({
            cycleIndex: e.detail.value
        })
        if (e.detail.value != 0) {
            console.log(this.data.aCycleDate[e.detail.value - 1].number)
            this.data.remarks = this.data.aCycleDate[e.detail.value - 1].remarks ? this.data.aCycleDate[e.detail.value - 1].remarks :
                this.setData({
                    iClassRoom: this.data.aCycleDate[e.detail.value - 1].classroom.name,
                    remarks: this.data.aCycleDate[e.detail.value - 1].remarks,
                    number: this.data.aCycleDate[e.detail.value - 1].number
                })
        }
    },
    bindTextAreaBlur(e) {
        this.data.sInput = e.detail.value
        this.setData({ sInput: this.data.sInput, remarksLength: this.data.sInput.length })
    },
    submit: function() {
        console.log(this.data.aInput)
        var appInstance = getApp();
        if (this.data.id != "") {
            var This = this
            wx.showModal({
                title: '提示',
                content: '确认取消报名？',
                success: function(res) {
                    if (res.confirm) {
                        appInstance.ajax("/signUpCurriculum/changeState", { id: This.data.id, state: '取消' }, "post", (res) => {
                            wx.showToast({
                                title: "取消成功！",
                                duration: 5000
                            })
                            setTimeout(function() {
                                wx.navigateBack({
                                    url: '/pages/index/signUpList/signUpList?_id=' + wx.getStorageSync("studentId")
                                })
                            }, 1000)
                        });
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            return
        }
        this.setData({ sTerm: '', sCourse: '', sTeacher: '', sDay: '', sWeek: '' })
        if (this.data.termIndex == 0) {
            this.setData({ sTerm: '请选择学期' })
        } else if (this.data.index == 0) {
            this.setData({ sCourse: '请选择课程' })
        } else if (this.data.teacherIndex == 0) {
            this.setData({ sTeacher: '请选择教师' })
        } else if (this.data.weekIndex == 0) {
            this.setData({ sDay: '请选择星期' })
        } else if (this.data.cycleIndex == 0 && this.data.aCycle[0] == '请选择') {
            this.setData({ sWeek: '请选择周期' })
        } else {
            if (this.data.aCycle[0] == '请选择') {
                this.data.cycleIndex--
            }
            var This = this
            wx.showModal({
                title: '提示',
                content: '请于报名后48小时内付费，则可保留时间、名额，过期则需重新报名。',
                success: function(res) {
                    if (res.confirm) {
                        appInstance.ajax("/signUpCurriculum/saveCurriculum", { studentId: wx.getStorageSync('studentId'), curriculumId: This.data.aCourse[This.data.cycleIndex].id, specialRequirements: This.data.sInput }, "post", (res) => {
                            if (res.data.code == 1) {
                                wx.navigateBack({
                                    url: '/pages/index/signUpList/signUpList?_id=' + wx.getStorageSync("studentId")
                                })
                            } else {
                                wx.showToast({
                                    title: res.data.msg,
                                    duration: 5000
                                })
                            }
                        });
                    } else if (res.cancel) {

                    }
                }
            })

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