module.exports = app => {
  class bookingStudent extends app.Service {
    *
        saveStudent(obj) {
          console.log(obj);
          const isStudent = yield app.mysql.get('booking_student', { userId: obj.userId, name: obj.name });
          const result = {};
          if (!isStudent) {
            const ERR_ok = yield app.mysql.insert('booking_student', obj);
            console.log(ERR_ok);
            if (ERR_ok.affectedRows == 1) {
              result.code = 1;
              result.msg = '添加成功';
            } else {
              result.code = 0;
              result.msg = '添加失败';
            }
          } else {
            result.code = 0;
            result.msg = '该学生已存在！';
          }
          return result;
        } *
            getStudentAll(userId) {
                // console.log('==================test dev=====================');
              const user = yield app.mysql.select('booking_student', { where: { userId } });
              return user;
                // yield this.ctx.model.bookingStudent.find({ userId: this.ctx.request.query.userId }).then((res) => {
                //                 if (res) {
                //                     this.ctx.body = res
                //                 }
                //             })
            } *
            update(body) {

              if (!body.singleUser.curriculum.confirmedTime || body.singleUser.curriculum.confirmedTime.trim() == '') {
                yield app.mysql.update('booking_course', {
                  id: body.singleUser.curriculum.id,
                  state: body.singleUser.curriculum.state,
                  auditing: 0,
                  confirmedTime: body.singleUser.curriculum.confirmedTime,
                });
              } else {
                body.singleUser.curriculum.confirmedTime = app.moment(body.singleUser.curriculum.confirmedTime).format('YYYY-MM-DD h:mm:ss');
                yield app.mysql.update('booking_course', {
                  id: body.singleUser.curriculum.id,
                  state: body.singleUser.curriculum.state,
                  auditing: body.singleUser.curriculum.auditing,
                  confirmedTime: body.singleUser.curriculum.confirmedTime,
                  disabled: 1,
                });
              }
              yield app.mysql.update('booking_student', {
                id: body.singleUser.student.id,
                name: body.singleUser.student.name,
                sex: body.singleUser.student.sex,
                school: body.singleUser.student.school,
                parentName: body.singleUser.student.parentName,
                telephone: body.singleUser.student.telephone,
                basics: body.singleUser.student.basics,
                introduceBaby: body.singleUser.student.introduceBaby,
                address: body.singleUser.student.address,
                dateOfBirth: body.singleUser.student.dateOfBirth,
              });
            } *
            getById(id) {
              const result = yield app.mysql.get('booking_student', { id });
              return result;
            } *
            updateInfo(body) {
              const result = yield app.mysql.update('booking_student', body);
              return result;
            } *
            deleteUser(id) {
              const result = yield app.mysql.delete('booking_student', { id });
              return result;
            } *
            getNoReserved(page, limit) {
              const student = yield app.mysql.select('booking_student');
              const curriculum = [];
              for (var i = 0; i < student.length; i++) {
                const isNull = yield app.mysql.get('booking_course', { studentId: student[i].id });
                if (!isNull) {
                  curriculum.push(student[i]);
                }
              }
              const list = [];
              for (var i = (page - 1) * limit; i < page * limit; i++) {
                if (curriculum[i]) {
                  list.push(curriculum[i]);
                }
              }
              const restult = {
                pages: Math.ceil(curriculum.length / 10),
                list,
              };
              return restult;
            }

    }
  return bookingStudent;
};
