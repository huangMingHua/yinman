module.exports = app => {
    class TermController extends app.Controller { *
        getAll() {
                var list = yield this.ctx.service.term.getAll();
                for (let item of list) {
                    item.startDate = this.ctx.helper.formatDate(item.startDate);
                    item.endDate = this.ctx.helper.formatDate(item.endDate);
                }
                this.ctx.body = list;
            } *
            getList() {
                const query = this.ctx.request.query
                var list = yield this.ctx.service.term.getList(query.pageIndex, query.limit);
                for (let item of list.list) {
                    item.startDate = this.ctx.helper.formatDate(item.startDate);
                    item.endDate = this.ctx.helper.formatDate(item.endDate);
                }
                this.ctx.body = list;
            } *
            delete() {
                let id = this.ctx.request.body.id;
                let term = yield this.service.term.getById(id);
                if (term == null || term.isDelete) {
                    this.fail('数据不存在');
                    return;
                }
                var courseTableDetails = yield this.service.courseTableDetail.getList(id);
                if (courseTableDetails.length > 0) {
                    this.fail('该学期下有课程信息，无法删除');
                    return;
                }
                term.isDelete = true;
                yield this.service.term.update(term);
                this.success();
            }


        *
        add() {
                let { name, startDate, endDate, classHour, belowclassHour, higherThanClassHour, teacherClassHour, teacherBelowclassHour, teacherHigherThanClassHour } = this.ctx.request.body;
                if (app.lodash.trim(name) == '') {
                    this.fail('名称不能为空');
                    return;
                }
                if (classHour == '' || belowclassHour == '' || higherThanClassHour == '' || teacherClassHour == '' || teacherBelowclassHour == '' || teacherHigherThanClassHour == '') {
                    this.fail('请假内容不能为空');
                    return;
                }
                if (parseInt(classHour, 10) != classHour || parseInt(belowclassHour, 10) != belowclassHour || parseInt(higherThanClassHour, 10) != higherThanClassHour || parseInt(teacherClassHour, 10) != teacherClassHour || parseInt(teacherBelowclassHour, 10) != teacherBelowclassHour || parseInt(teacherHigherThanClassHour, 10) != teacherHigherThanClassHour) {
                    this.fail('请输入整数');
                    return;
                }
                startDate = app.moment(startDate);
                if (!startDate.isValid()) {
                    this.fail('开始时间错误');
                    return;
                }
                endDate = app.moment(endDate);
                if (!endDate.isValid()) {
                    this.fail('结束时间错误');
                    return;
                }
                if (endDate <= startDate) {
                    this.fail('开始时间必需小于结束时间');
                    return;
                }
                yield this.service.term.add(name, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), classHour, belowclassHour, higherThanClassHour, teacherClassHour, teacherBelowclassHour, teacherHigherThanClassHour);
                this.success();
            } *
            update() {
                const body = this.ctx.request.body
                const startDate = body.startDate
                const endDate = body.endDate

                if (app.lodash.trim(body.name) == '') {
                    this.fail('名称不能为空');
                    return;
                }
                if (body.classHour == '' || body.belowclassHour == '' || body.higherThanClassHour == '' || body.teacherClassHour == '' || body.teacherBelowclassHour == '' || body.teacherHigherThanClassHour == '') {
                    this.fail('请假内容不能为空');
                    return;
                }
                if (parseInt(body.classHour, 10) != body.classHour || parseInt(body.belowclassHour, 10) != body.belowclassHour || parseInt(body.higherThanClassHour, 10) != body.higherThanClassHour || parseInt(body.teacherClassHour, 10) != body.teacherClassHour || parseInt(body.teacherBelowclassHour, 10) != body.teacherBelowclassHour || parseInt(body.teacherHigherThanClassHour, 10) != body.teacherHigherThanClassHour) {
                    this.fail('请输入整数');
                    return;
                }
                if (app.lodash.trim(body.name) == '') {
                    this.fail('名称不能为空');
                    return;
                }
                body.startDate = app.moment(body.startDate);
                if (!body.startDate.isValid()) {
                    this.fail('开始时间错误');
                    return;
                }
                body.endDate = app.moment(body.endDate);
                if (!body.endDate.isValid()) {
                    this.fail('结束时间错误');
                    return;
                }
                if (body.endDate <= body.startDate) {
                    this.fail('开始时间必需小于结束时间');
                    return;
                }

                // var list = yield this.service.term.getAll();
                // for (let item of list) {
                //     if (item.id != body.id) {
                //         if (this.ctx.helper.durationConflict(item.startDate, item.endDate, body.startDate, body.endDate)) {
                //             this.fail('时间冲突，请检查数据');
                //             return;
                //         }
                //     }
                // }
                let term = yield this.service.term.getById(body.id)
                if (!term) {
                    this.fail('该学期不存在');
                    return
                }
                let courseTableDetail = yield this.ctx.service.courseTableDetail.getByTermId(body.id)
                if (courseTableDetail) {
                    this.fail('该学期已使用，不能修改');
                    return
                }
                term.name = body.name
                term.startDate = startDate
                term.endDate = endDate
                term.belowClass = body.classHour
                term.numberOfRequests1 = body.belowclassHour
                term.numberOfRequests2 = body.higherThanClassHour
                term.teacherBelowClass = body.teacherClassHour
                term.teacherNumberOfRequests1 = body.teacherBelowclassHour
                term.teacherNumberOfRequests2 = body.teacherHigherThanClassHour
                yield this.service.term.update(term);
                this.success()
            }
    }
    return TermController;
}