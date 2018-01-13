module.exports = app => {
    /**
     * 续课
     */
    class RenewController extends app.Controller { *
        getList() {
            const page = this.ctx.request.query.page || 1;
            const limit = this.ctx.request.query.limit || 10;
            const studentId = this.ctx.request.query.studentId || 0;
            const termId = this.ctx.request.query.termId || 0;
            let paged = yield this.service.renew.getList(page, limit, termId, studentId);
            //console.log(paged, page, limit);
            for (let item of paged.list) {
                let detail = yield this.service.courseTableDetail.getById(item.courseDetailId);
                detail.teacherName = (yield this.service.teacher.getById(detail.teacherId)).name;
                item.detail = detail;

                let student = yield this.service.student.getById(item.studentId);
                let studentUser = yield this.service.user.getById(student.userId);
                item.student = {
                    name: student.name,
                    wxHead: studentUser.wxHead,
                    wxName: studentUser.wxName,
                    remarks: studentUser.remarks,
                    sex: studentUser.sex,
                };

                let term = yield this.service.term.getById(item.termId);
                item.times = JSON.parse(item.times);
                item.term = term;
                item.updateTime = this.ctx.helper.formatDateTime(item.updateTime);
                item.createTime = this.ctx.helper.formatDateTime(item.createTime);
            }
            this.ctx.body = paged;
        }

        *
        check() {
            const id = this.ctx.request.body.id || 0;
            const v = this.ctx.request.body.v;

            let info = yield this.service.renew.getById(id);
            if (info == null) {
                this.fail('未找到对象');
                return;
            }


            if (v) {
                info.state = '已通过';
            } else {
                info.state = '已拒绝';
            }
            yield this.service.renew.update(info);
            this.success();
        }
    }
    return RenewController;
}