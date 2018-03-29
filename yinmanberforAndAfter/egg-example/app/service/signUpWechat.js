module.exports = app => {
  class signUpWechat extends app.Service {
    *
        add(courseTableDetailStudentId) {
          const result = yield app.mysql.insert('sign_up_wetchat', {
            courseTableDetailStudentId,
            isSend: 0,
          });
          return result.insertId;
        } *
            getListByIsSend(isSend) {
              const list = yield app.mysql.select('sign_up_wetchat', { where: { isSend } });
              if (isSend === 0) {
                for (const item of list) {
                  const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(item.courseTableDetailStudentId);
                  if (!courseTableDetailStudent) {
                    continue;
                  }
                  const aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailStudent.courseTableDetailId);
                  for (const i of aCourseTableItem) {
                    const courseTableItem = yield this.ctx.service.courseTableItemStudent.getStudentByCourseTableItemIdAndStudentId(i.id, courseTableDetailStudent.studentId);
                    if (courseTableItem[0]) {
                      item.courseTableItem = i;
                      break;
                    }
                  }
                  courseTableDetailStudent.courseTableDetailStudentId = courseTableDetailStudent.id;
                  delete courseTableDetailStudent.id;
                  item.courseTableDetailStudent = courseTableDetailStudent;
                }
              }
              if (isSend !== 0) {
                for (const item of list) {
                  item.courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(item.courseTableDetailStudentId);
                  const aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(item.courseTableDetailStudent.courseTableDetailId);
                  item.courseTableItem = aCourseTableItem[aCourseTableItem.length - 1];
                }
              }
              return list;
    }
    
    *
            update(info) {
              yield app.mysql.update('sign_up_wetchat', info);
            }
    }
  return signUpWechat;
};
