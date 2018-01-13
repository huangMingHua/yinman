// pages/student/myCourse/myStudent/myComment/myComment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        comment: [],
        teacher: {},
        user: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        var appInstance = getApp()
            // console.log(wx.getStorageSync("studentCourse"))
            // this.setData({ info: wx.getStorageSync("studentCourse")})
            // var info = wx.getStorageSync("studentCourse")
        appInstance.ajax("/comment/getComment", { courseId: options.courseTableDetailId, teacherId: wx.getStorageSync('_id'), studentId: options.studentId }, "get", (res) => {
            console.log(res.data)
            this.setData({ comment: res.data.comment, teacher: res.data.teacher, user: res.data.user, info: res.data.info })
        });

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

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },
    formSubmit(e) {
        var This = this
        var appInstance = getApp()
        if (e.detail.value.input.length == 0) {
            wx.showToast({
                title: '不能为空',
                icon: 'loading',
                duration: 5000
            })
        } else {
            var date = new Date()
            var info = wx.getStorageSync("studentCourse")
            appInstance.ajax("/comment/saveEvaluate", { courseId: info.courseInfo.id, teacherId: wx.getStorageSync('_id'), studentId: info.student.id, comment: e.detail.value.input, creatDate: date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + " " + date.getHours() + "." + date.getMinutes() }, "post", function(res) {
                console.log(res.data)
                This.data.comment.push(res.data.comment)
                This.setData({
                    comment: This.data.comment,
                    teacher: res.data.teacher,
                    user: res.data.user
                })
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 5000
                })
            });


        }

    }
})