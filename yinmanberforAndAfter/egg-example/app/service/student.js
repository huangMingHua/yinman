module.exports = app => {
  class student extends app.Service {
    *
        findById(id) {
          return yield this.getByUserId(id);
        } *
            add(name, sex, school, parentName, telephone, address, basics, introduceBaby, dateOfBirth, userId,
                createTime, updateTime, booking, sign_up, hasCourseTable = 0) {
              const result = yield app.mysql.insert('student', {
                name,
                sex,
                school,
                parentName,
                telephone,
                address,
                basics,
                introduceBaby,
                dateOfBirth,
                userId,
                createTime,
                updateTime,
                booking,
                sign_up,
                hasCourseTable,
              });
              return result;
            } *
            getById(id) {
              const student = yield app.mysql.get('student', { id });
              return student;
            } *
            getByUserId(id) {
                // console.log('==================test dev=====================');
              const student = yield app.mysql.select('student', { where: { userId: id } });
              return student;
            } *
            update(info) {
              const result = yield this.app.mysql.update('student', info);
              const updateSuccess = result.affectedRows === 1;
              return updateSuccess;
            } *
            deleteUser(id) {
              const result = yield app.mysql.delete('student', { id });
              return result;
            } *
            getNoReserved(page, limit) {
              const list = yield app.mysql.select('student', { where: { booking: 0, sign_up: 0 }, limit: Number(limit), offset: (page - 1) * limit });
              const totalCount = yield app.mysql.query('select count(*) from student where booking=0 and sign_up=0');
              for (let i = 0; i < list.length; i++) {
                console.log(list[i].userId);
                list[i].user = yield app.mysql.get('user', { id: list[i].userId });
              }
              const restult = {
                totalCount,
                list,
              };
              return restult;
            } *
            getNoReservedQuery(studentName, parentName, page, limit) {
                // let where = {};
                // if (studentName) {
                //     where = app.lodash.assign(where, { name: studentName });
                // }
                // if (parentName) {
                //     where = app.lodash.assign(where, { parentName });
                // }
                // const list = yield app.mysql.select('student', { where, limit: Number(limit), offset: (page - 1) * limit });
                // const totalCount = yield app.mysql.count('student', where);
              const list = yield app.mysql.query(`select * from student where  booking= 0 and sign_up = 0 and name like '%${studentName}%' and parentName like '%${parentName}%' limit  ${(page - 1) * limit} ,${Number(limit)}`);
              let totalCount = yield app.mysql.query(`select count(*) from student  where booking= 0 and sign_up = 0 and  name like '%${studentName}%' and parentName like '%${parentName}%'`);
              totalCount = totalCount[0]['count(*)'];
              for (let i = 0; i < list.length; i++) {
                list[i].user = yield app.mysql.get('user', { id: list[i].userId });
              }
                // const count = yield app.mysql.query('select count(*) from user where ');
              const result = {
                list,
                totalCount,
              };
              return result;
            }
    }
  return student;
};
