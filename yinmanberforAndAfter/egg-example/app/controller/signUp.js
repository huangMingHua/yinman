/**
 * Created by rhino on 2017-04-14.
 */
module.exports = app => {
    class SignUpController extends app.Controller { *
        getAll() {
                const result = yield this.ctx.service.signUp.getAll();
                console.log(result);
                this.ctx.body = result;
            } *
            getList() {
                const result = yield this.ctx.service.signUp.getList(this.ctx.request.query.pageIndex, this.ctx.request.query.limit);
                this.ctx.body = result;
            }
            /**
             * 添加或更新报名信息
             */
            *
            addOrUpdate() {
                const data = this.ctx.request.body.data;
                const studentId = this.ctx.request.body.studentId;
                const ctx = this.ctx;

                const result = yield app.mysql.beginTransactionScope(function*(conn) {
                    ctx.conn = conn;
                    let student = yield ctx.service.student.getById(studentId);
                    if (student == null) {
                        return {
                            code: 0,
                            msg: "学生不存在",
                        }
                    }
                    let user = yield ctx.service.user.getById(student.userId);
                    // if (user.state != 1) {
                    //     user.state = 1; //把用户身份变成学生家长
                    //     yield ctx.service.user.update(user);
                    // }

                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        const detail = yield ctx.service.courseTableDetail.findById(item.id);

                        if (item.checked === true) {
                            const student = yield ctx.service.courseTableDetailStudent.get(detail.id, studentId);
                            if (student) {
                                // this.ctx.body = `该老师的${detail.courseName}课已报过名`
                                // return;
                                continue;
                            }
                            // var students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(detail.id);
                            if (detail.status == '') {
                                const msg = `该老师的${detail.courseName}课已满`;
                                return {
                                    code: 0,
                                    msg: msg,
                                }
                            }
                            yield ctx.service.courseTableDetailStudent.add(
                                studentId,
                                item.id,
                                '正常',
                                detail.termId);
                            const items = yield ctx.service.courseTableItem.getByCourseTableDetailId(detail.id);
                            for (const ii of items) {
                                yield ctx.service.courseTableItemStudent.add(
                                    ii.id,
                                    studentId,
                                    '正常',
                                    detail.termId
                                );
                            }
                        } else {
                            const detailStudent = yield ctx.service.courseTableDetailStudent.get(detail.id, studentId);
                            if (detailStudent != null) {
                                const switchCount = yield ctx.service.courseTableItemSwitch.countByFromCourseTableDetailId(detail.id, studentId);
                                if (switchCount > 0) {
                                    return {
                                        code: 0,
                                        msg: '改学生有当前课程的请假记录，无法取消'
                                    };
                                }
                                yield ctx.service.courseTableDetailStudent.delete(detail.id, studentId);

                                const itemList = yield ctx.service.courseTableItem.getByCourseTableDetailId(detail.id);
                                for (let k = 0; k < itemList.length; k++) {
                                    yield ctx.service.courseTableItemStudent.delete(itemList[k].id, studentId);
                                }
                            }
                        }
                    }

                    var termIds = yield ctx.service.courseTableDetailStudent.getTermIds(student.id);

                    student.hasCourseTable = termIds.length > 0;
                    student.sign_up = 1
                    yield ctx.service.student.update(student);
                    return { code: 1 };
                }, ctx);
                this.ctx.body = result;
            } *
            query() {
                console.log(this.ctx.request.body)
                let body = this.ctx.request.body
                const result = yield this.ctx.service.signUp.query(body.studentName, body.parentName, body.pageIndex, body.limit)
                this.success(result);
            } *
            getRelationalInfo() {
                const studentId = this.ctx.request.query.studentId;
                // var studentCourses = yield this.ctx.service.courseTable.findStudentCourse(studentId);
                // var result = []
                // for (var i = 0; i < studentCourses.length; i++) {
                //     var courseTableDetail = yield this.ctx.service.courseTableDetail.findById(studentCourses[i].courseTableDetailId);
                //     var courseTable = yield this.ctx.service.courseTable.findById(courseTableDetail.courseTableId);
                //     var classroom = yield this.ctx.service.classroom.getById(courseTableDetail.classroomId);
                //     var teacher = yield this.ctx.service.teacher.findById(courseTableDetail.teacherId);
                //     courseTable.startDate = app.moment(courseTable.startDate).format("YYYY.MM.DD")
                //     courseTable.endDate = app.moment(courseTable.endDate).format("YYYY.MM.DD")
                //     result.push({
                //         courseTableDetail: courseTableDetail,
                //         courseTable: courseTable,
                //         classroom: classroom,
                //         teacher: teacher
                //     })
                // }
                // this.ctx.body = result

                const termIds = yield this.ctx.service.courseTableDetailStudent.getTermIds(studentId);
                const terms = yield this.ctx.service.term.getTerms(termIds);
                this.ctx.body = terms;
            } *
            editPersonalInfo() {
                const result = yield this.ctx.service.signUp.editPersonalInfo(this.ctx.request.body);
                this.ctx.body = result;
            }
            /**
             * 删除报名信息
             */
            *
            delete() {
                // let studentId = this.ctx.request.body.studentId;
                // let termId = this.ctx.request.body.termId;
                // let list = yield this.ctx.service.courseTableDetailStudent.getList(termId, studentId);
                // for(let i=0; i<list.length; i++){
                //     let detailStudent = list[i];
                //     if (detailStudent != null) {
                //         yield this.ctx.service.courseTableDetailStudent.delete(detailStudent.courseTableDetailId, studentId);

                //         let itemList = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(detailStudent.courseTableDetailId);
                //         for (let k = 0; k < itemList.length; k++) {
                //             yield this.ctx.service.courseTableItemStudent.delete(itemList[k].id, studentId);
                //         }
                //     }
                // }
                this.success();
            }

    }
    return SignUpController;
};