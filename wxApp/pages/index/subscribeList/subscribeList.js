// pages/index/subscribeList/subscribeList.js
Page({
    data: {
        listArray: [],
        prompt: ["预约成功后注意事项：", `音曼音乐课堂地址：上海浦东新区上南路3899弄35号02别墅xx琴房xx老师（对应预约的教室和老师）。靠近华夏西路，上南路中环，地铁6号在线南路站1号口。`, "电话：13524160481, 13564281815（王老师）", "每个试上学员［仅提供一次］免费试上机会，请准时上课。如遇特殊情况，请「务必提前一天」取消预约。未提前取消，或旷课，则不再享有免费试上机会。"],
        index: 0
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "预约试课"
        })
        if (this.data.index == 0) {
          if (options._id != 0) {
            wx.setStorageSync("studentId", options._id)
                //  // 页面初始化 options为页面跳转所带来的参数
            var appInstance = getApp();
            appInstance.ajax("/bookingCourse/getBookingInfoToId", { studentId: options._id }, "get", (res) => {
                console.log(res)
                this.setData({ listArray: res.data, index: 1 })
            });
          }else{
            wx.setStorageSync("studentId", 0)
            this.addStudent()
          }
        }

    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        if (this.data.index == 1) {
            //  // 页面初始化 options为页面跳转所带来的参数
            var appInstance = getApp();
            appInstance.ajax("/bookingCourse/getBookingInfoToId", { studentId: wx.getStorageSync("studentId") }, "get", (res) => {
                console.log(res)
                this.setData({ listArray: res.data, index: 1 })
            });
        }
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    btn: function() {
      
      if (wx.getStorageSync('studentId') != 0) {
        wx.navigateTo({
          url: "/pages/index/class/appointmentList/studentReservationInformation/studentReservationInformation"
        })
      }else{
        this.addStudent()
      }
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
  addStudent() {
    wx.showModal({
      title: '提示',
      content: '请先添加学生后再报名！',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/index/class/class?from=booking'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})