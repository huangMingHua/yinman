module.exports = app => {
    class User extends app.Service {
        get db() {
                return this.ctx.conn ? this.ctx.conn : this.app.mysql;
            } *
            findById(id) {
                console.log(id);
                // console.log('==================test dev=====================');
                const user = yield app.mysql.get('user', { id });
                return user;
            }

        *
        findByOpenId(openId) {
            // console.log('==================test dev=====================');
            const user = yield app.mysql.get('user', { openId });
            return user;
        } *
        findByUnionid(unionid) {
            // console.log('==================test dev=====================');
            const user = yield app.mysql.get('user', { unionid });
            return user;
        } *
        getUnionid(unionid) {

            let result = yield app.mysql.get('user', { unionid })
            return result
        }

        *
        add(wxHead, wxName, openId, state, remarks, sex, isDisable, attentionTime, lastInteraction, unionid, publicOpenId) {
            const info = yield this.getUnionid(unionid);
            if (info == null) {
                console.log(wxName)
                var a = yield app.mysql.insert('user', {
                    wxHead,
                    wxName,
                    openId,
                    state,
                    remarks: '',
                    sex,
                    isDisable: 0,
                    attentionTime,
                    lastInteraction,
                    unionid,
                    publicOpenId
                });
                return a.insertId;
            }
            return info.id;
        } *
        addOrUpdate(wxHead, wxName, openId, state, sex) {
            const info = yield this.findByOpenId(openId);
            let now = app.moment();
            if (info == null) {
                // var a = yield app.mysql.insert('user', { 
                //     wxHead, 
                //     wxName, 
                //     openId, 
                //     state, 
                //     remarks: '', 
                //     sex, 
                //     isDisable: 0,
                //     attentionTime:now.format('YYYY-MM-DD hh:mm:ss'), 
                //     lastInteraction: now.format('YYYY-MM-DD hh:mm:ss')
                //   });
                //   var result = '数据添加成功';
            } else {
                //const lastInteraction = now.format('YYYY-MM-DD hh:mm:ss');
                info.wxHead = wxHead;
                info.wxName = wxName;
                info.sex = sex;
                info.lastInteraction = now.format('YYYY-MM-DD HH:mm:ss');
                var a = yield this.update(info);
                if (a) {
                    var result = '数据更新成功';
                } else {
                    var result = '数据未更新';
                }
            }
            return result;
        } *
        getPaging(page, limit) {
            const list = yield app.mysql.select('user', { limit: Number(limit), offset: (page - 1) * limit });
            const totalCount = yield app.mysql.query('select count(*) from user');
            for (const item of list) {
                //if (item.state == 0) {
                item.student = yield this.ctx.service.student.getByUserId(item.id);
                if (item.state == 2) {
                    item.teacher = yield this.ctx.service.teacher.getByUserId(item.id)
                }
                //}
            }
            const result = {
                list,
                totalCount: totalCount[0]['count(*)'],
            };
            return result;
        } *
        update(data) {
            const result = yield this.db.update('user', data);
            return result.affectedRows === 1;
        } *
        getByName(wxName, state, page, limit) {
            // let where = {};
            // if (state) {
            //     where = app.lodash.assign(where, { state });
            // }
            // if (wxName) {
            //     where = app.lodash.assign(where, { wxName });
            // }
            // console.log(where)
            // const list = yield app.mysql.select('user', { where, limit: Number(limit), offset: (page - 1) * limit });
            // const totalCount = yield app.mysql.count('user', where);
            const list = yield app.mysql.query(`select * from user where state like '${state}%' and wxName like '%${wxName}%' limit  ${(page - 1) * limit} ,${Number(limit)}`);
            let totalCount = yield app.mysql.query(`select count(*) from user  where state like '${state}%' and wxName like '%${wxName}%'`);
            totalCount = totalCount[0]['count(*)']
            for (const item of list) {
                //if (item.state == 0) {
                item.student = yield this.ctx.service.student.getByUserId(item.id);
                if (item.state == 2) {
                    item.teacher = yield this.ctx.service.teacher.getByUserId(item.id)
                }
            }
            // const count = yield app.mysql.query('select count(*) from user where ');
            const result = {
                list,
                totalCount
            };
            return result;
        } *
        getById(id) {
            const result = yield app.mysql.get('user', { id });
            return result;
        }
    }
    return User;
};