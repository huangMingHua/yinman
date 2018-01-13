// pages/index/contact/contact.js
Page({
    data: {
        telFun: "咨询热线"
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
                title: "联系我们"
            })
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