'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    *
        changeRemarks() {
          const id = this.ctx.request.body.editInfo.id;
          const remarks = this.ctx.request.body.editInfo.remarks;
          const user = yield this.ctx.service.user.findById(id);
          if (!user) {
            this.fail('用戶不存在');
            return;
          }
          user.remarks = remarks;
          const ERR_OK = yield this.ctx.service.user.update(user);
          this.success();
        } *
            addOrUpdate() {
              const req = this.ctx.request.body;
              const getAccessToken = yield app.curl('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxdc06b91aef63b7b4&secret=8196ad0809542cf54fd0df55382a05fe', {
                dataType: 'json',
              });
              const getUnionid = yield app.curl(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${getAccessToken.data.access_token}&openid=${req.userInfo.openId}&lang=zh_CN`, {
                dataType: 'json',
              });
              const result = yield this.ctx.service.user.addOrUpdate(req.userInfo.wxHead, req.userInfo.wxName, req.userInfo.openId, req.userInfo.state, req.userInfo.sex, getUnionid.data.unionid);
              this.ctx.body = {
                msg: result,
              };
            } * changeIsDisable() {
              const id = this.ctx.request.body.id;
              const isDisable = this.ctx.request.body.isDisable;
              const user = yield this.ctx.service.user.findById(id);
              if (!user.id) {
                this.fail('用戶不存在');
                return;
              }
              user.isDisable = isDisable;
              const ERR_OK = yield this.ctx.service.user.update(user);
              this.success();
            }

    *
        change() {
          const req = this.ctx.request.body;
          const userInfo = yield this.ctx.service.user.findById(req.editInfo.id);
          if (userInfo == null) {
            this.fail('用戶不存在');
            return;
          }
          if (req.editInfo.state == 2) {
            this.fail('你已经是教师');
            return;
          }
          const creatTime = app.moment().format('YYYY-MM-DD HH:mm:ss');
          const insertId = yield this.ctx.service.teacher.add(req.editInfo.id, userInfo.wxName, '', '', '', '', creatTime, '');
          userInfo.state = 2;
          userInfo.remarks = req.editInfo.remarks;
          const user = yield this.ctx.service.user.update(userInfo);
          if (insertId > 0) {
            this.success({ teacherId: insertId });
          } else {
            this.fail('添加失败');
          }
        }

    *
        getByOpenId() {
            // const username = this.ctx.cookies.get('username', {
            //     encrypt: true,
            // })
          const openId = this.ctx.request.query.openId;
          const result = yield this.ctx.service.user.findByOpenId(openId);
          this.ctx.body = {
            msg: result,
          };
        }

    *
        getPaging() {
          const result = yield this.ctx.service.user.getPaging(this.ctx.request.query.pageIndex, this.ctx.request.query.limit);
          this.ctx.body = result;
        } *
            getAllTeacher() {
              const req = this.ctx.request.query;
              const n = yield this.ctx.model.user.find({ state: 2 });
              if (n.length > 0) {
                this.ctx.body = {
                  state: 1,
                  msg: n,
                };
              }
            } *
            getByName() {
              const result = yield this.ctx.service.user.getByName(this.ctx.request.body.wxName, this.ctx.request.body.identity, this.ctx.request.body.pageIndex, this.ctx.request.body.limit);
              this.ctx.body = result;
            } *
            getById() {
              const user = yield this.ctx.service.user.getById(this.ctx.request.query.id);
              const students = yield this.ctx.service.student.getByUserId(user.id);
              user.students = students;
              this.ctx.body = user;
            }

    *
        login() {
          const username = this.ctx.request.body.username;
          const password = this.ctx.request.body.password;

          if (username == 'admin' && password == 'asdlfkjl2324') {
            this.ctx.cookies.set('adminname', username, {
              encrypt: true,
            });
            this.success();
            return;
          }
          this.fail('用户名或密码错误');
        }

    *
        logout() {
          this.ctx.cookies.set('adminname', null);
          this.success();
        }
            // 微信小程序登陆，用code换取openid
    *
            wxLoginByCode() {
              const code = this.ctx.request.body.code || '';
              if (app.lodash.trim(code) == '') {
                this.fail('请传入code');
                return;
              }
              const result = yield this.ctx.curl('https://api.weixin.qq.com/sns/jscode2session?appid=' + app.config.wxApp.appid + '&secret=' + app.config.wxApp.secret + '&js_code=' + code + '&grant_type=authorization_code', {
                dataType: 'json',
              });
              console.log(result);
                    // this.ctx.logger.info(result.data);
              if (result.data.errcode) {
                this.ctx.body = result.data;
                    // this.ctx.body = {name:'taun'}
                return;
              }
              const now = app.moment();
              let user = yield this.service.user.findByUnionid(result.data.unionid);
              if (user == null) {
                const userOpen = yield this.service.user.findByOpenId(result.data.openid);
                if (userOpen) {
                  user = userOpen;
                  console.log('没有关注公众号不做处理');
                } else {
                  const id = yield this.service.user.add('', '', result.data.openid, 1, '', 0, 0, now.format('YYYY-MM-DD HH:mm:ss'), now.format('YYYY-MM-DD HH:mm:ss'), result.data.unionid);
                  user = yield this.service.user.getById(id);
                }
              } else {
                if (!user.openId) {
                  user.openId = result.data.openid;
                  yield this.ctx.service.user.update(user);
                }
              }
              this.ctx.cookies.set('username', user.id.toString(), {
                encrypt: true,
              });
              this.success({
                id: user.id,
                openid: user.openId,
              });
            }
    }
  return UserController;
};
