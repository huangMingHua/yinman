'use strict';
const wechat = require('co-wechat');


module.exports = app => {
  class WechatController extends app.Controller {
    *
        home() {
            // this.ctx.request.query.echostr
            // this.success(this.ctx.request.query.echostr)
          console.log(1111);
          this.ctx.body = '111';
        }
    }
  WechatController.prototype.wechat = wechat(
        '123456'
    ).middleware(function* () {
      const message = this.weixin;
        // this.ctx.body = 'hehe'
      const getAccessToken = yield app.curl('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx47a24f23f864ba75&secret=7aa7251fe9d96a8d3d3074795ffeb9d0', {
        dataType: 'json',
      });
      const getListUser = yield app.curl(`https://api.weixin.qq.com/cgi-bin/user/get?access_token=${getAccessToken.data.access_token}`, {
        dataType: 'json',
      });
        // const getUnionid = yield app.curl(`https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=${getAccessToken.data.access_token}`, {
        //     dataType: 'json',
        //     method: 'POST',
        //     contentType: 'json',
        // });
      if (message.Event === 'subscribe') {
        for (let i = 0; i < getListUser.res.data.data.openid.length; i++) {
          const getUnionid = yield app.curl(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${getAccessToken.data.access_token}&openid=${getListUser.res.data.data.openid[i]}&lang=zh_CN`, {
            dataType: 'json',
          });
          const user = yield this.service.user.getUnionid(getUnionid.data.unionid);
          console.log('关注', user);
          if (user) {
            console.log('关注1');
            user.publicOpenId = getListUser.res.data.data.openid[i];
            yield this.service.user.update(user);
            this.ctx.body = '关注成功';
          } else {
            console.log('关注2');
            const id = yield this.service.user.add(getUnionid.data.headimgurl, getUnionid.data.nickname, '', 1, '', getUnionid.data.sex, 1, app.moment().format('YYYY-MM-DD HH:mm:ss'), app.moment().format('YYYY-MM-DD HH:mm:ss'), getUnionid.data.unionid, getListUser.res.data.data.openid[i]);
            this.ctx.body = '关注成功';
          }
        }
      }
      yield app.curl(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${getAccessToken.data.access_token}`, {
        dataType: 'json',
        method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        contentType: 'json',
        data: {
          button: [{
            type: 'miniprogram',
            name: '关于音曼',
            url: 'https://wx.yinmanyinyue.com/public/index.html#/login',
            appid: 'wxdc06b91aef63b7b4',
            pagepath: 'pages/student/student?urlindex=2',
          }, {
            name: '展示中心',
            sub_button: [{
              type: 'miniprogram',
              name: '光荣榜',
              url: 'https://wx.yinmanyinyue.com/public/index.html#/login',
              appid: 'wxdc06b91aef63b7b4',
              pagepath: 'pages/aboutInfo/honorRoll/honorRoll',
            },
            {
              type: 'view',
              name: '下载中心',
              url: 'https://pan.baidu.com/wap/link?surl=1o8zaHNc&from=singlemessage&isappinstalled=0',
            },
            ],
          }, {
            type: 'miniprogram',
            name: '个人中心',
            url: 'https://wx.yinmanyinyue.com/public/index.html#/login',
            appid: 'wxdc06b91aef63b7b4',
            pagepath: 'pages/student/student?urlindex=0',
          }],
        },
      });
    });
  return WechatController;
};
