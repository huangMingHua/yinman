// pages/student/studentList/studentList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        users: [],
        index: 0



    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "预约试课"
        })
        if (this.data.index == 0) {
            var appInstance = getApp();
            appInstance.ajax("/student/getByStudent", { userId: wx.getStorageSync('_id') }, "get", (res) => {
                this.setData({ users: res.data, index: 1 })
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
        if (this.data.index == 1) {
            var appInstance = getApp();
            appInstance.ajax("/student/getByStudent", { userId: wx.getStorageSync('_id') }, "get", (res) => {
                this.setData({ users: res.data })
            });

        }
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
    delete(e) {
        console.log(e)
        var This = this
        wx.showModal({
            title: '提示',
            content: '确认删除',
            success: function(res) {
                if (res.confirm) {
                    var appInstance = getApp();
                    appInstance.ajax("/student/deleteUser", { id: e.currentTarget.dataset.id }, "post", (res) => {
                        if (res.data.code == 1) {
                            wx.showToast({
                                title: '删除成功',
                                duration: 5000
                            })
                            This.onShow()
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
    }
})