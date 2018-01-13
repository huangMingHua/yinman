module.exports = app => {
    class Teacher extends app.Service { *
        add(userId, name, identityCategory, sex, dateOfBirth, phoneNumber, createTime, upDateTime) {
            const result = yield app.mysql.insert('teacher', {
                userId,
                name,
                identityCategory,
                sex,
                dateOfBirth,
                phoneNumber,
                createTime,
                upDateTime: app.moment().format('YYYY-MM-DD HH:mm')
            });
            return result.insertId;
        }

        *
        getAll() {
                //console.log('==================test dev=====================');
                const result = yield app.mysql.select('teacher');
                return result;
            } *
            getList(page, limit) {
                var teachers = yield app.mysql.select("teacher", { limit: limit, offset: (page - 1) * limit })
                var totalCount = yield app.mysql.query("select count(*) from teacher")
                totalCount = totalCount[0]['count(*)']
                let list = []
                for (let item of teachers) {
                    const user = yield this.ctx.service.user.getById(item.userId)
                    list.push({ teacher: item, user: user })
                }
                var result = {
                    list,
                    totalCount
                }
                return result
            }

        *
        getById(id) {
            return yield this.findById(id);
        }

        *
        getByUserId(userId) {
            let result = yield app.mysql.get('teacher', { userId: userId })
            return result
        }

        /**
         * 
         * @param {Number} id 
         */
        *
        query(teacherName, professorCourse, telephone, page, limit) {
                console.log(teacherName, professorCourse, telephone, page, limit)
                    // const teachers = yield app.mysql.query(`select * from teacher where  name like '${teacherName}%' and professorCourse like '${professorCourse}%' and phoneNumber like '${telephone}%' limit  ${(page - 1) * limit} ,${Number(limit)}`);
                const teachers = yield app.mysql.query(`select * from teacher where  name like '%${teacherName}%' and phoneNumber like '%${telephone}%' limit  ${(page - 1) * Number(limit)} ,${Number(limit)}`);
                console.log(teachers)
                let totalCount = yield app.mysql.query(`select count(*) from teacher  where name like '%${teacherName}%' and phoneNumber like '%${telephone}%'`);
                totalCount = totalCount[0]['count(*)']
                let list = []
                for (let item of teachers) {
                    const user = yield this.ctx.service.user.getById(item.userId)
                    list.push({ teacher: item, user: user })
                }
                var result = {
                    list,
                    totalCount
                }
                return result
            } *
            findById(id) {
                const result = yield app.mysql.get('teacher', { id });
                return result;
            } *
            update(info) {
                console.log(info)
                const result = yield app.mysql.update('teacher', info)
                return result
            }
    }
    return Teacher;
};