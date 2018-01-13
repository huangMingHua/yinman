// pages/signUp/signUp.js
Page({
    data: {
        telFun: "咨询电话",
        man: "",
        girl: "",
        date: '2016-09-01',
        student: [],
        name: "",
        man: "",
        girl: "",
        school: "",
        parentName: "",
        telephone: "",
        address: "",
        index: 0

    },
    onLoad: function(option) {
        wx.setNavigationBarTitle({
            title: "我要报名"
        })
        var appInstance = getApp();
        if (option.fn == "edit") {
            appInstance.ajax("/student/getById", { id: option._id }, "get", (res) => {
                console.log(res)
                if (res.data.sex == "男") {
                    this.data.man = res.data.sex
                } else {
                    this.data.girl = res.data.sex
                }
                this.setData({
                    name: res.data.name,
                    man: this.data.man,
                    girl: this.data.girl,
                    date: res.data.dateOfBirth,
                    school: res.data.school,
                    parentName: res.data.parentName,
                    telephone: res.data.telephone,
                    address: res.data.address
                })
            })
        }


    },
    onShow: function() {
        // 页面显示

    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    change: function(e) {
        for (var i = 0; i < this.data.student.length; i++) {
            if (this.data.student[i].name == e.detail.value) {
                if (this.data.student[i].sex == "男") {
                    this.setData({ man: this.data.student[i].sex })
                } else {
                    this.setData({ girl: this.data.student[i].sex })
                }
                this.setData({
                    date: this.data.student[i].dateOfBirth,
                    school: this.data.student[i].school,
                    parentName: this.data.student[i].parentName,
                    telephone: this.data.student[i].telephone,
                    address: this.data.student[i].address,
                })

            }
        }

    },
    formSubmit: function(e) {
        var appInstance = getApp();
        if (e.detail.value.name.trim() == "") {
            appInstance.prompt("宝宝姓名不能为空!", 1000)
        } else if (e.detail.value.sex == "") {
            appInstance.prompt("宝宝性别不能为空!", 1000)
        } else if (e.detail.value.school.trim() == "") {
            appInstance.prompt("就读学校不能为空!", 1000)
        } else if (e.detail.value.parentName.trim() == "") {
            appInstance.prompt("家长姓名不能为空!", 1000)
        } else if (e.detail.value.telephone.trim() == "") {
            appInstance.prompt("联系电话不能为空!", 1000)
        } else if (isNaN(e.detail.value.telephone) || e.detail.value.telephone.length !== 11) {
            appInstance.prompt("请填写正确的手机号！!", 1000)
        } else if (e.detail.value.address.trim() == "") {
            appInstance.prompt("家庭住址不能为空!", 1000)
        } else {
            e.detail.value.dateOfBirth = this.data.date
            e.detail.value.userId = wx.getStorageSync('_id')
            e.detail.value.createTime = new Date().getTime()
            appInstance.ajax("/student/saveStudentInfo", { userInfo: e.detail.value }, "post", function(res) {
                console.log(res)
                if (res.data.code == 1) {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 5000
                    })
                    setTimeout(function() {
                        wx.navigateBack({
                            url: '/pages/student/studentList/studentList'
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
    }
})