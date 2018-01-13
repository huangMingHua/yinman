// pages/class/class.js
// const regeneratorRuntime = require('../../../lib/regenerator-runtime/runtime')
Page({
    data: {
        array: ["请选择"],
        index: 0,
        dateArr: [],
        telFun: '预约热线',
        number: {
            phone: "021-50836037",
            mobile: "13524160481"
        },
        show: true,
        btn: "提交",
        date: '2016-09-01',
        userInfo: {

        },
        man: '',
        girl: '',
        basics: '',
        unBasics: '',
        sName: '',
        sSex: '',
        sSchool: '',
        sParentName: '',
        sTelphone: '',
        sHomeAddress: '',
        sBasic: '',
        remarksLength: 0,
        from:''
    },
    onLoad: function(option) {
        var date = new Date()
        var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
        var dates = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
        this.setData({ date: date.getFullYear() + "-" + month + "-" + dates })
        wx.setNavigationBarTitle({
            title: "学生信息"
        })
        var appInstance = getApp();
        if(option.from){
          this.setData({from: option.from})
        }
        if (option.fn == "edit") {
            appInstance.ajax("/student/getById", { id: option._id }, "get", (res) => {
                console.log(res)
                if (res.data.sex == "男") {
                    this.data.man = res.data.sex
                } else {
                    this.data.girl = res.data.sex
                }
                if (res.data.basics == "0基础") {
                    this.data.basics = res.data.basics
                } else {
                    this.data.unBasics = res.data.basics
                }
                console.log(res)
                this.setData({ userInfo: res.data, man: this.data.man, girl: this.data.girl, basics: this.data.basics, unBasics: this.data.unBasics })
            })
        }
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    longClink() {
        wx.scanCode({
            success: (res) => {
                console.log(res)
            }
        })
    },
    formSubmit: function(e) {
        var appInstance = getApp();
        //提交
        this.setData({ sName: "", sSex: "", sSchool: "", sParentName: "", sTelphone: "", sHomeAddress: "", sBasic: "" })
        if (e.detail.value.name.trim() == "") {
            this.setData({ sName: "宝宝姓名不能为空" })
        } else if (e.detail.value.sex == "") {
            this.setData({ sSex: "宝宝性别不能为空" })
        } else if (e.detail.value.school.trim() == "") {
            this.setData({ sSchool: "就读学校不能为空" })
        } else if (e.detail.value.parentName.trim() == "") {
            this.setData({ sParentName: "家长姓名不能为空" })
        } else if (e.detail.value.telephone.trim() == "") {
            this.setData({ sTelphone: "联系电话不能为空" })
        } else if (isNaN(e.detail.value.telephone) || e.detail.value.telephone.length !== 11) {
            this.setData({ sTelphone: "请填写正确的手机号！" })
        } else if (e.detail.value.address.trim() == "") {
            this.setData({ sHomeAddress: "家庭住址不能为空" })
        } else if (e.detail.value.basics == "") {
            this.setData({ sBasic: "音乐经历不能为空" })
        } else {
            e.detail.value.dateOfBirth = this.data.date
            if (!this.data.userInfo.id) {
                e.detail.value.userId = wx.getStorageSync('_id')
                e.detail.value.createTime = new Date().getTime()
                e.detail.value.booking = 0
                e.detail.value.sign_up = 0
                appInstance.ajax("/student/saveStudentInfo", e.detail.value, "post", (res) => {
                    console.log(res)
                    if (res.data.code == 1) {
                        wx.showToast({
                            title: res.data.msg,
                            duration: 5000
                        })
                        if(this.data.from=='sign'){
                          wx.showModal({
                            title: '提示',
                            content: '是否继续报名',
                            success: function (re) {
                              if (re.confirm) {
                                setTimeout(function () {
                                  wx.setStorageSync('studentId', res.data.data.insertId)
                                  wx.redirectTo({
                                    url: "/pages/index/signUpList/signUpCourse/signUpCourse"
                                  })
                                }, 1000)
                              } else if (re.cancel) {
                                wx.redirectTo({
                                  url: `/pages/index/signUpList/signUpList?_id=${res.data.data.insertId}&fn=order&index=0`
                                })
                              }
                            }
                          })
                          
                        } else if (this.data.from == 'booking'){
                          wx.showModal({
                            title: '提示',
                            content: '是否继续预约',
                            success: function (re) {
                              if (re.confirm) {
                                setTimeout(function () {
                                  wx.setStorageSync('studentId', res.data.data.insertId)
                                  wx.redirectTo({
                                    url: "/pages/index/class/appointmentList/studentReservationInformation/studentReservationInformation"
                                  })
                                }, 1000)
                              } else if (re.cancel) {
                                wx.redirectTo({
                                  url: `/pages/index/subscribeList/subscribeList?_id=${res.data.data.insertId}&fn=order&index=0`
                                })
                              }
                            }
                          })
                        }else{
                          setTimeout(function () {
                            wx.navigateBack({
                              url: '/pages/index/class/appointmentList/appointmentList'
                            })
                          }, 1000)
                        }
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            duration: 5000
                        })
                    }

                })
            } else {
                console.log(e.detail.value.introduceBaby)
                e.detail.value.id = this.data.userInfo.id
                var userInfo = {}
                userInfo.address = e.detail.value.address
                userInfo.basics = e.detail.value.basics
                userInfo.dateOfBirth = e.detail.value.dateOfBirth
                userInfo.id = e.detail.value.id
                userInfo.introduceBaby = e.detail.value.introduceBaby
                userInfo.name = e.detail.value.name
                userInfo.parentName = e.detail.value.parentName
                userInfo.school = e.detail.value.school
                userInfo.sex = e.detail.value.sex
                userInfo.telephone = e.detail.value.telephone
                appInstance.ajax("/student/updateStudentInfo", { userInfo: userInfo }, "post", (res) => {
                    console.log(res)
                    if (res.data.code == 1) {
                        wx.showToast({
                            title: "修改成功！",
                            duration: 5000
                        })
                        setTimeout(function() {
                            wx.navigateBack({
                                url: '/pages/index/class/appointmentList/appointmentList'
                            })
                        }, 1000)
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            duration: 5000
                        })
                    }

                })

            }

        }
    },
    introduceBaby(e) {
        console.log(e)
        this.setData({ remarksLength: e.detail.value.length })
    },
    calling: function(e) {
        var appInstance = getApp();
        appInstance.Phone(e.currentTarget.dataset.phone)
    },
    delete(e) {
        var This = this
        wx.showModal({
            title: '提示',
            content: '确认删除',
            success: function(res) {
                if (res.confirm) {
                    var appInstance = getApp();
                    appInstance.ajax("/student/deleteUser", { id: This.data.userInfo.id }, "post", (res) => {
                        if (res.data.code == 1) {
                            This.onShow()
                            wx.setStorageSync('idx', wx.getStorageSync('idx') - 1)
                            wx.showToast({
                                title: '删除成功',
                                duration: 5000
                            })
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 2000)
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