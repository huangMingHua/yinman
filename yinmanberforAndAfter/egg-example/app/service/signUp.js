module.exports = app => {
  class signUp extends app.Service {
    *
        getAll() {
          const student = yield app.mysql.select('student');
          const result = [];
          for (const item of student) {
            const user = yield app.mysql.get('user', { id: item.userId });
            const info = {
              student: item,
              user,
            };
            result.push(info);
          }
          return result;

                //   var result = [];
                //   var distinct=[]
                //   const curriculums = yield this.ctx.model.signUpCurriculum.find({state:{$ne:0}});
                //   for (var i = 0; i < curriculums.length; i++) {
                //             var index=-1
                //             for(var j=0;j<distinct.length;j++){
                //                 if(curriculums[i].studentId==distinct[j].studentId){
                //                     index=j
                //                     distinct[j].curriculums.push(curriculums[i].curriculum)
                //                     distinct[j].times.push(curriculums[i].times)
                //                 }
                //             }
                //             if(index==-1){
                //                  distinct.push({curriculums:[curriculums[i].curriculum],studentId:curriculums[i].studentId,userId:curriculums[i].userId,times:[curriculums[i].times],createTime:curriculums[i].createTime})
                //             }
                //   }
                //   for(var i=0;i<distinct.length;i++){
                //       var user=yield this.ctx.service.user.findById(distinct[i].userId)
                //       console.log(distinct[i].studentId)
                //       var student=yield this.ctx.service.student.findById({_id:distinct[i].studentId})
                //       result.push({
                //               curriculums:distinct[i],
                //               student:student[0],
                //               user:user
                //       })
                //   }
                //   this.ctx.body = {
                //     data : result,
                //     msg:'',
                //     state:1,
                //     page:Math.ceil(distinct.length/10),
                //   }
                // return student;
        } *
            query(studentName, parentName, page, limit) {
                // let where = {
                //     sign_up: 1
                // };
                // if (studentName) {
                //     where = app.lodash.assign(where, { name: studentName });
                // }
                // if (parentName) {
                //     where = app.lodash.assign(where, { parentName });
                // }
                // const student = yield app.mysql.select('student', { where, limit: Number(limit), offset: (page - 1) * limit });
              const student = yield app.mysql.query(`select * from student where sign_up=1 and name like '%${studentName}%' and parentName like '%${parentName}%' limit  ${(page - 1) * limit} ,${Number(limit)}`);
              let totalCount = yield app.mysql.query(`select count(*) from student  where sign_up=1 and name like '%${studentName}%' and parentName like '%${parentName}%'`);
              totalCount = totalCount[0]['count(*)'];
              const list = [];
              for (const item of student) {
                const user = yield app.mysql.get('user', { id: item.userId });
                const curriculums = yield app.mysql.select('sign_up_curriculum', { where: { studentId: item.id } });
                const info = {
                  student: item,
                  user,
                  curriculums,
                };
                list.push(info);
              }
              const result = {
                list,
                totalCount,
              };
              return result;

            } *
            getList(pageIndex, limit) {
              const student = yield app.mysql.select('student', { where: { sign_up: 1 }, limit: Number(limit), offset: (pageIndex - 1) * limit });
              console.log(student);
              const totalCount = yield app.mysql.query('select count(*) from student where sign_up=1');
              const list = [];
              for (const item of student) {
                const user = yield app.mysql.get('user', { id: item.userId });
                const signUpCurriculum = yield app.mysql.select('sign_up_curriculum', { where: { studentId: item.id } });
                for (const it of signUpCurriculum) {
                  it.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(it.curriculumId);
                  it.courseTableDetail.course = yield this.ctx.service.course.getById(it.courseTableDetail.courseNameId);
                }
                const info = {
                  student: item,
                  user,
                  signUpCurriculum,
                };
                list.push(info);
              }
              const result = {
                list,
                totalCount: totalCount[0]['count(*)'],
              };
              return result;
            } *
            relationalInfo(body) {
              for (let i = 0; i < body.relationalInfo.length; i++) {
                const item = body.relationalInfo[i];
                const detail = yield this.ctx.service.courseTableDetail.findById(item.courseTableDetailId);
                const students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(detail.id);
                const student = yield app.mysql.get('course_table_detail_student', { courseTableDetailId: detail.id, studentId: item.studentId });
                const everyStudent = yield this.ctx.service.student.getById(item.studentId);
                const user = yield app.mysql.update('user', { id: everyStudent.userId, state: 1 });
                console.log(detail.number, students.length);
                if (detail.number == students.length) {
                  const result = `该老师的${detail.courseName}课已满`;
                  return result;
                }
                if (student) {
                  const result = `该老师的${detail.courseName}课已报过名`;
                  return result;
                }
                yield this.ctx.service.courseTableDetailStudent.add(item.studentId,
                        item.courseTableDetailId, '正常');
                const few = yield this.ctx.service.courseTableItem.getEachCycle(detail.courseTableId);
                for (let j = 0; j < few.length; j++) {
                  yield this.ctx.service.courseTableItemStudent.add(
                            few[j].id,
                            item.studentId,
                            '正常'
                        );
                }

              }
              const result = '添加成功';
              return result;
            } *
            editPersonalInfo(body) {
              const result = yield this.ctx.service.student.update(body);
              return result;
            }


    }
  return signUp;
};
