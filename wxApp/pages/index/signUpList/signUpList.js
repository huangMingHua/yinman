// pages/index/signUpList/signUpList.js
Page({
    data: {
        telFun: "咨询电话",
        userInfo: [],
        index: 0
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "我要报名"
        })
        if (this.data.index == 0) {
          if (options._id!=0) {
            console.log(111)
            wx.setStorageSync("studentId", options._id)
            var appInstance = getApp();
            appInstance.ajax("/signUpCurriculum/getStudentCurriculum", { "studentId": options._id }, "get", (res) => {
              console.log(res)
              this.setData({ userInfo: res.data, index: 1 })
            });
          }else {
            wx.setStorageSync("studentId", 0)
            this.addStudent() 
          }
        }
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        if (this.data.index == 1) {
            var appInstance = getApp();
            appInstance.ajax("/signUpCurriculum/getStudentCurriculum", { "studentId": wx.getStorageSync("studentId") }, "get", (res) => {
                console.log(res)
                this.setData({ userInfo: res.data })
            });
        }
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    signUp: function() {
      if (wx.getStorageSync('studentId') != 0) {
        wx.navigateTo({
          url: "/pages/index/signUpList/signUpCourse/signUpCourse"
        }) 
      }else{
        this.addStudent()
      }
    },
    onUnload: function() {
        // 页面关闭
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
    addStudent () {
      wx.showModal({
        title: '提示',
        content: '请先添加学生后再报名！',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/index/class/class?from=sign'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  }
})