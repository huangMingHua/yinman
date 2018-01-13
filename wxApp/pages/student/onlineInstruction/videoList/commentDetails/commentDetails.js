// pages/student/onlineInstruction/videoList/commentDetails/commentDetails.js
Page({
    data: {
        videoInfo: {},
        sign: null,
        teacherId: null
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "视频详情"
        })
        this.setData({ sign: wx.getStorageSync('sign') })
        var appInstance = getApp();
        appInstance.ajax("/onlineGuide/getById", { id: options.id }, "get", (res) => {
            console.log(res)
            if (res.data.code == 1) {
                this.setData({ videoInfo: res.data.data })
            } else {
                wx.showToast({
                    title: '获取信息错误',
                    icon: 'success',
                    duration: 5000
                })
            }
        });
        if (wx.getStorageSync('sign') == 2) {
            appInstance.ajax("/teacher/getByUserId", { userId: wx.getStorageSync('_id') }, "get", (res) => {
                this.setData({ teacherId: res.data.data.id })
            });
        }
        // 页面初始化 options为页面跳转所带来的参数
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
    formSubmit(e) {
        console.log({ id: this.data.videoInfo.id, teacherId: this.data.teacherId, content: e.detail.value.content })
        var appInstance = getApp();
        appInstance.ajax("/onlineGuide/addContent", { id: this.data.videoInfo.id, teacherId: this.data.teacherId, content: e.detail.value.content }, "post", (res) => {
            if (res.data.code == 1) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 5000
                })
                setTimeout(() => {
                    wx.navigateBack({
                        url: '/pages/student/onlineInstruction/videoList/videoList?studentId='
                    })
                }, 2000)
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 5000
                })
            }
        });
    }
})