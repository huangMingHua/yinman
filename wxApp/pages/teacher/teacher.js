// pages/student/student.js
Page({
    data: {
        url: 1,
        signUrl: "",
        headInfo: {
            head: "",
            name: "",
            tel: ""
        },
        sign: "",
        students: [],
        idx: 0,
        studentId: 0,
        urlIndex: 2
    },
    onLoad: function(options) {
        console.log(options)
        wx.setNavigationBarTitle({
            title: "个人中心"
        })
        if (options && options.urlindex) {
            this.setData({ urlIndex: options.urlindex })
            if (options.urlindex == 0) {
                wx.setNavigationBarTitle({
                    title: "个人中心"
                })
            } else if (options.urlindex == 1) {
                wx.setNavigationBarTitle({
                    title: "展示中心"
                })
            } else {
                wx.setNavigationBarTitle({
                    title: "关于音曼"
                })
            }
        }
        // 判断是不是已经预约
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        var app = getApp()
        app.getUserInfo((user) => {
            if (user.isDisable == 1) {
                this.setData({ url: 0 })
                wx.showToast({
                    title: `你已被禁用
          个人中心禁止访问`,
                    icon: 'loading',
                    duration: 5000
                })
                return
            }
            // 页面初始化 options为页面跳转所带来的参数
            var appInstance = getApp();
            appInstance.ajax("/user/getByOpenId", { openId: appInstance.globalData.user.openId }, "get", (res) => {
                console.log(res)
                var state = res.data.msg.state
                wx.setStorageSync("sign", state)
                this.data.headInfo.name = appInstance.globalData.user.wxName
                this.data.headInfo.head = appInstance.globalData.user.wxHead
                this.setData({ headInfo: this.data.headInfo, sign: state })
            });
        })
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    courseTo: function() {
        if (this.data.url == 1) {
            wx.navigateTo({
                url: `/pages/student/myCourse/myCourse?studentId=${this.data.studentId}`
            })
        }
    },
    lessonTo: function() {
        if (this.data.url == 1) {
            wx.navigateTo({
                url: `/pages/teacher/changeClass/changeClass`
            })
        }

    },
    instructionTo: function() {
        wx.navigateTo({
            url: "/pages/student/onlineInstruction/videoList/videoList?studentId="
        })
    },
    classTo: function() {
        wx.navigateTo({
            url: `/pages/index/subscribeList/subscribeList?_id=${this.data.studentId}&fn=order`
        })
    },
    enrollTo: function() {
        wx.navigateTo({
            url: `/pages/index/signUpList/signUpList?_id=${this.data.studentId}&fn=order`
        })
    },
    telUs: function() {
        wx.navigateTo({
            url: "/pages/index/contact/contact"
        })
    },
    switchStudent(e) {
        this.setData({ idx: e.currentTarget.dataset.index, studentId: this.data.students[e.currentTarget.dataset.index].id })
    },
    url(e) {
        console.log(e)
        this.setData({ urlIndex: e.currentTarget.dataset.urlindex })
        if (e.currentTarget.dataset.urlindex == 0) {
            wx.setNavigationBarTitle({
                title: "个人中心"
            })
        } else if (e.currentTarget.dataset.urlindex == 1) {
            wx.setNavigationBarTitle({
                title: "展示中心"
            })
        } else {
            wx.setNavigationBarTitle({
                title: "关于音曼"
            })
        }
    }
})