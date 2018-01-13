'use strict';

module.exports = app => {
    class voiceIntroductionController extends app.Controller { *
        saveOrUpdatevoiceIntroductionInfo() {
                if (this.ctx.request.body.id == '') {
                    console.log(111)
                    var result = yield app.mysql.insert('voiceintroduction', { content: this.ctx.request.body.content });
                    this.ctx.body = {
                        msg: '成功',
                    };
                } else {
                    var result = yield app.mysql.update('voiceintroduction', { id: this.ctx.request.body.id, content: this.ctx.request.body.content });
                    this.ctx.body = {
                        msg: '成功',
                    };
                }
            } *
            get() {
                const res = yield app.mysql.select('voiceintroduction');
                this.ctx.body = {
                    res: res[0],
                };
            }
    }
    return voiceIntroductionController;
};