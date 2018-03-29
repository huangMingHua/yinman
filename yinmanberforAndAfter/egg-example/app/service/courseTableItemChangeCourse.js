module.exports = app => {
  class courseTableItemSwitch extends app.Service {
    *
        add(reason, studentId, createTime, courseTableDetailItemId, courseTableDetailId, one) {
          const result = yield app.mysql.insert('course_table_item_change_class', {
            reason,
            studentId,
            createTime,
            courseTableDetailItemId,
            courseTableDetailId,
            one,
          });
          if (result.insertId > 0) {
            return yield this.getById(result.insertId);
          }
          return null;
        }

    *
        getById(id) {
          const info = yield app.mysql.get('course_table_item_leave', { id });
          return info;
        }

    *
        getByCourseTableDetailItemIdAndStudentIdAndOne(courseTableDetailItemId, studentId, one) {

          const o = yield app.mysql.get('course_table_item_change_class', { courseTableDetailItemId, studentId, one });

          return o;
    }
    *
    getByToCourseTableItemIdAndOne(courseTableDetailItemId,  one) {

          const o = yield app.mysql.get('course_table_item_change_class', { courseTableDetailItemId, one});
             
          return o;
    }
    *
    getByToCourseTableItemIdAndOnes(courseTableDetailItemId,  one) {

      const o = yield app.mysql.select('course_table_item_change_class', { where: { courseTableDetailItemId, one } });
             
          return o;
    }
    *
            getByCourseTableDetailIdAndStudentIdAndOne(courseTableDetailId, studentId, one) {
              const aList = yield app.mysql.select('course_table_item_change_class', { where: { courseTableDetailId, studentId, one } });
              return aList;
        }
        *
        getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId) {
          const aList = yield app.mysql.select('course_table_item_change_class', { where: { courseTableDetailId, studentId} });
          return aList;
        }
        * getByCourseTableDetailItemIdAndOne(courseTableDetailItemId, one) {

          const list = yield app.mysql.select('course_table_item_change_class', { courseTableDetailItemId, one });

          return list;
        }
            // *
            //     getByToCourseTableItemIdAndStudentId(fromCourseTableItemId, studentId) {

        //         const odd = yield app.mysql.get('course_table_item_switch', { fromCourseTableItemId, studentId });

        //         return odd;
        //     }
        /**
         * 根据学期获取学生调课信息
         * @param {*} termId
         * @param {*} teacherId
         * @param {*} studentId
         */
    *
        getStudentSwitchs(termId, studentId) {
          const list = yield app.mysql.select('course_table_item_leave', {
            where: {
              termId,
              studentId,
            },
          });
          return list;
        }

    *
        getTeacherSwitchs(termId, teacherId) {
          const list = yield app.mysql.select('course_table_item_leave', {
            where: {
              termId,
              teacherId,
            },
          });
          return list;
        } *
            getListByTermIdAndstundetId(termId, studentId) {
              const list = yield app.mysql.query(`SELECT  *,course_table_item_change_class.createTime as createTime1 FROM course_table_item_change_class LEFT JOIN course_table_item ON course_table_item_change_class.courseTableDetailItemId=course_table_item.id WHERE termId=${termId} AND studentId=${studentId}`);
              console.log(list);
              return list;
            } 

    *
        getTeacherSwitchs1(courseTableDetailId, teacherId) {
          const list = yield app.mysql.select('course_table_item_change_class', {
            where: {
              courseTableDetailId: courseTableDetailId,
              teacherId,
            },
          });
          return list;
        }

    *
        update(info) {
          const o = yield app.mysql.update('course_table_item_change_class', info);
          return o;
        } *
            get(toCourseTableItemId, studentId) {
              const info = yield app.mysql.get('course_table_item_leave', {
                toCourseTableItemId,
                studentId,
              });
              return info;
            }
            /**
             * 统计某学生在某节课请过几次假
             * @param {Number} fromCourseTableDetailId
             * @param {Number} studentId
             */
    *
            countByFromCourseTableDetailId(fromCourseTableDetailId, studentId) {
              const count = yield app.mysql.query('select count(*) from course_table_item_leave where fromCourseTableDetailId = ? and studentId = ?', [ fromCourseTableDetailId, studentId ]);
              return count[0]['count(*)'];
            }

    *
        getList(page, termId, limit) {
                // console.log((page - 1) * limit, limit)
                // const list = yield app.mysql.query('course_table_item_leave', {
                //     where: { termId: termId },
                //     orders: [
                //         ['id', 'desc']
                //     ],
                //     limit: limit,
                //     offset: (page - 1) * limit
                // });
          const list = yield app.mysql.query(`
                SELECT
                course_table_item_change_class.id,
                course_table_item_change_class.reason,
                course_table_item_change_class.studentId,
                course_table_item_change_class.createTime,
                courseTableDetailItemId,
                course_table_item.teacherId,
                course_table_item.number,
                course_table_item.level,
                course_table_item.date,
                course_table_item.startTime,
                course_table_item.endTime,
                course_table_item.courseName,
                course_table_item.classroomId,
                dayOfWeek
                FROM  course_table_item_change_class
                LEFT JOIN course_table_item ON course_table_item_change_class.courseTableDetailItemId=course_table_item.id 
                LEFT JOIN course_table_detail ON course_table_item.courseTableDetailId=course_table_detail.id WHERE course_table_item.termId=? LIMIT ${Number(limit)} OFFSET ${(page - 1) * Number(limit)}`, [ termId ]);
          const count = yield app.mysql.query('select count(*) from course_table_item_change_class LEFT JOIN course_table_item ON course_table_item_change_class.courseTableDetailItemId=course_table_item.id WHERE termId=?', [ termId ]);
          const result = {
            list,
            total: count[0]['count(*)'],
          };
          return result;
        } *
            getListByCourseTableDetailItemId(courseTableDetailItemId) {
              const list = yield app.mysql.select('course_table_item_change_class', { where: { courseTableDetailItemId } });
              return list;
            }

    *
            deleteId(id) {
              const result = yield app.mysql.delete('course_table_item_change_class', { id });
            } *
            getChangeClassByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId) {
              const list = yield app.mysql.select('course_table_item_change_class', { where: { courseTableDetailId, studentId, one: 1 } });
              return list;
            }
            *
            getByCourseTableDetailIdAndTeacherId(courseTableDetailId, teacherId) {
              const aList = yield app.mysql.select('course_table_item_change_class', { where: { courseTableDetailId, teacherId} });
              return aList;
            }
            *
            getByCourseTableDetailItemIdAndTeacherIdAndOne(courseTableDetailItemId, teacherId,one) {
              const item = yield app.mysql.get('course_table_item_change_class',  { courseTableDetailItemId, teacherId,one} );
              return item;
            }
    }
  return courseTableItemSwitch;
};
