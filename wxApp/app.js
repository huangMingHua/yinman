App({
    globalData: {
        appid: 'wxdc06b91aef63b7b4', //appid需自己提供，此处的appid我随机编写  
        secret: '8196ad0809542cf54fd0df55382a05fe', //secret需自己提供，此处的secret我随机编写  
        user: null,
        displayPersonalCenter: false,
        cookie: ''
    },
    onLaunch: function(options) {
        var This = this
    },
    getUserInfo: function(cb) {
        var This = this
        if (this.globalData.user != null) {
            This.ajax("/user/getByOpenId", { openId: this.globalData.user.openId }, "get", (res) => {
                This.globalData.user = res.data.msg
                wx.setStorageSync('_id', This.globalData.user.id)
                typeof cb == 'function' && cb(This.globalData.user);
            });
        } else {
            wx.login({
                success: function(res) {
                    console.log(res)
                    if (res.code) {
                        //发起网络请求
                        This.ajax("/user/wxLoginByCode", { code: res.code }, "post", function(res) {
                            if (res.data.errcode) {
                                wx.showToast({
                                    title: res.data.errmsg
                                })
                                return
                            } else if (!res.data.code || res.data.code != 1) {
                                wx.showToast({
                                    title: res.data.msg,
                                })
                            }
                            for (var item in res.header) {
                                if (item.toLowerCase() == 'set-cookie') {
                                    This.globalData.cookie = res.header[item].split(';')
                                }
                            }

                            var id = res.data.data.id
                            This.globalData.displayPersonalCenter = true
                            var openId = res.data.data.openid
                            wx.getUserInfo({
                                success: function(res) {
                                    console.log(res)
                                    var userInfo = {}
                                    userInfo.wxHead = res.userInfo.avatarUrl
                                    wx.setStorageSync("wxHead", res.userInfo.avatarUrl)
                                    userInfo.wxName = res.userInfo.nickName
                                    userInfo.openId = openId
                                    userInfo.sex = res.userInfo.gender
                                    userInfo.state = 0
                                    This.ajax("/user/addOrUpdate", { userInfo: userInfo }, "post", function(res) {
                                            This.ajax("/user/getByOpenId", { openId: openId }, "get", (res) => {
                                                This.globalData.user = res.data.msg
                                                wx.setStorageSync('_id', id)
                                                typeof cb == 'function' && cb(This.globalData.user);
                                                // wx.redirectTo({
                                                //   url: '/pages/home/home',
                                                // })
                                            });
                                        })
                                        //获取用户信息

                                }
                            })
                        })
                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                    }
                }
            });
        }
    },
    onShow: function(options) {
        // Do something when show.
    },
    onHide: function() {
        // Do something when hide.
    },
    onError: function(msg) {
        console.log(msg)
    },
    ajax: function(urls, datas, mode, cb) {
        var cookie = this.globalData.cookie[0]
        wx.request({
            url: 'http://192.168.0.90:7001' + urls,
            data: datas,
            method: mode,
            header: {
                'content-type': 'application/json',
                cookie
            },
            success: function(res) {
                cb(res);
            }
        })
    },
    prompt: function(titleStr, time) {
        wx.showToast({
            title: titleStr,
            icon: 'loading',
            duration: time
        })
    },
    Phone: function(number) {
        wx.makePhoneCall({
            phoneNumber: number //仅为示例，并非真实的电话号码
        })
    }
})