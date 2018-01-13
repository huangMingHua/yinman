// pages/student/onlineInstruction/onlineInstruction.js
Page({
    data: {
        prompt: ["增值服务项目", "报名本项目学员，可以在下次回课之前上传自己的弹奏视频，由教师通过网络进行一次批改。", ""],
        video: '',
        student: {},
        title: '',
        explain: ''
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "在线指导"
        })
        console.log(options)
        var appInstance = getApp();
        appInstance.ajax("/student/getById", { id: options._id }, "get", (res) => {
            console.log(res)
            this.setData({ student: res.data })
        });
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
    //上传
    chooseImg: function() {
        var This = this
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function(res) {
                if (res.duration && res.duration >= 60) {
                    wx.showToast({
                        title: '视频只能在60秒以内',
                        icon: 'loading',
                        duration: 5000,
                        mask: true
                    })
                    return
                }
                This.setData({ video: res.tempFilePath })
            }
        })
    },
    //提交事件
    submit: function(e) {
        var This = this
        if (e.detail.value.title == "") {
            wx.showToast({
                title: '视频标题不能为空',
                icon: 'success',
                duration: 5000,
                mask: true
            })
            return
        }
        if (this.data.video == '') {
            wx.showToast({
                title: '请选择视频',
                icon: 'success',
                duration: 5000,
                mask: true
            })
            return
        }
        wx.showToast({
            title: '正在上传',
            icon: 'success',
            duration: 1000000,
            mask: true
        })
        wx.uploadFile({
            url: 'https://wx.yinmanyinyue.com/onlineGuide/add', //仅为示例，非真实的接口地址
            filePath: this.data.video,
            name: 'file',
            formData: {
                studentId: this.data.student.id,
                title: e.detail.value.title,
                explain: e.detail.value.explain
            },
            success: function(res) {
                console.log(res)
                if (JSON.parse(res.data).code == 1) {
                    wx.showToast({
                        title: '上传成功',
                        icon: 'success',
                        duration: 5000,
                        mask: true
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            url: `/pages/student/onlineInstruction/videoList/videoList?studentId=${This.data.student.id}`
                        })
                    }, 5000)
                } else {
                    wx.showToast({
                        title: JSON.parse(res.data).msg,
                        icon: 'success',
                        duration: 5000,
                        mask: true
                    })
                }
            }
        })

    },
})