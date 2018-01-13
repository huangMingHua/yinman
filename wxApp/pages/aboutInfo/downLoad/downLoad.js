// pages/aboutInfo/downLoad/downLoad.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 1,
        video: [],
        audio: [],
        pic: [],
        picUrl: [],
        musicPath: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "下载中心"
        })
        var appInstance = getApp()
            //获取用户信息

        this.getAudio()

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
    video() {
        this.setData({ index: 0 })
        this.getVideo()

    },
    music(e) {
        if (this.data.musicPath != e.currentTarget.dataset.src) {
            wx.playBackgroundAudio({
                dataUrl: e.currentTarget.dataset.src,
                title: '',
                coverImgUrl: ''
            })
            this.setData({ musicPath: e.currentTarget.dataset.src })
        } else {

            wx.stopBackgroundAudio()
        }

    },
    audio() {
        this.setData({ index: 1 })
        this.getAudio()
    },
    pic() {
        this.setData({ index: 2 })
        this.getPic()
    },
    downPic(data) {
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
    downVideo(data) {

        var url = data.currentTarget.dataset.down
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
        console.log(url)
        wx.downloadFile({
            url: url,
            header: { url: url },
            success: function(res) {
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: function(res) {
                        var savedFilePath = res.savedFilePath
                        wx.saveVideoToPhotosAlbum({
                            filePath: savedFilePath,
                            success(res) {
                                wx.showToast({
                                    title: '下载成功',
                                    icon: 'success',
                                    duration: 5000
                                })
                            }
                        })

                    },
                    fail: function(err) {
                        wx.showToast({
                            title: err.errMsg,
                            icon: 'loading',
                            duration: 5000
                        })
                    },
                    complete: function(obj) {
                        console.log(222)
                    }
                })
            },
            fail: function(err) {
                console.log(111)
                wx.showToast({
                    title: err.errMsg,
                    icon: 'loading',
                    duration: 5000
                })
            }
        })
    },
    getVideo() {
        var appInstance = getApp()
        appInstance.ajax("/downloadPic/getList", { pageIndex: 1, limit: 100, type: 'video' }, "get", (res) => {
            console.log(res)
            this.setData({ video: res.data.list })
        });
    },
    getAudio() {
        var appInstance = getApp()
        appInstance.ajax("/downloadPic/getList", { pageIndex: 1, limit: 100, type: 'audio' }, "get", (res) => {
            console.log(res)
            this.setData({ audio: res.data.list })
        });
    },
    getPic() {
        var appInstance = getApp()
        appInstance.ajax("/downloadPic/getList", { pageIndex: 1, limit: 100, type: 'image' }, "get", (res) => {
            console.log(res)
            for (var i = 0; i < res.data.list.length; i++) {
                this.data.picUrl.push(res.data.list[i].path)
            }
            this.setData({ pic: res.data.list })
            this.setData({ picUrl: this.data.picUrl })
        });

    },
    preview(e) {
        var url = []
        url.push(e.currentTarget.dataset.down)
        console.log(e)
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: url // 需要预览的图片http链接列表
        })
    }
})