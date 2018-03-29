module.exports = app => {
  class signUpCurriculum extends app.Service {
    *
        saveCurriculum(studentId, curriculumId, userId, state, createTime, specialRequirements) {
          const result = yield app.mysql.insert('sign_up_curriculum', {
            studentId,
            curriculumId,
            userId,
            state,
            changeCurriculumId: curriculumId,
            createTime,
            specialRequirements,
          });
          return result;
        }
    *
        addClassTimeClass(studentId, curriculumId, userId, state, createTime, specialRequirements, classTimeNum) {
          const result = yield app.mysql.insert('sign_up_curriculum', {
            studentId,
            curriculumId,
            userId,
            state,
            changeCurriculumId: curriculumId,
            createTime,
            specialRequirements,
            classTimeNum,
          });
          return result;
        }
    * getListByStudentIdAndchangeCurriculumIdAndstate(studentId, curriculumId) {
      const result = yield app.mysql.query(`select * from sign_up_curriculum where studentId=${studentId} AND changeCurriculumId = ${curriculumId} AND (state='待确认' or state='已确认')`);
      return result;
    }
    *
            getByStudentIdAndState1(studentId) {
              const result = yield app.mysql.query(`select * from sign_up_curriculum where studentId=${studentId} and state='已确认'`);
              return result;
            } *
            getAll(page, limit, state) {
              let aCurriculum = [];
              let nTotalCount = 0;
              if (state) {
                aCurriculum = yield app.mysql.query(`SELECT * FROM sign_up_curriculum WHERE state='${state}' ORDER BY state='待确认' DESC,id DESC`);
                const totalCount = yield app.mysql.query(`select count(*) from sign_up_curriculum  where state = '${state}'`);
                nTotalCount = totalCount[0]['count(*)'];
              } else {
                aCurriculum = yield app.mysql.query('SELECT * FROM sign_up_curriculum  ORDER BY state=\'待确认\' DESC,id DESC');
                nTotalCount = yield app.mysql.count('sign_up_curriculum');
              }
              const result = {
                aCurriculum,
                nTotalCount,
              };
              return result;
            } *
            getsignUpCurriculumByCurriculumId(curriculumId) {
              const result = yield app.mysql.query('select * from sign_up_curriculum where  (state=\'待确认\' or state=\'已确认\')');
              const aData = [];
              for (let i = 0; i < result.length; i++) {
                if (curriculumId == result[i].changeCurriculumId) {
                  aData.push(result[i]);
                }
              }
              return aData;
            }
           
    *
            getsignUpCurriculumByState() {
              const result = yield app.mysql.query('select * from sign_up_curriculum where  (state=\'待确认\' or state=\'已确认\')');
              return result;
            }
    *
            getsignUpCurriculumByCurriculumIdAndConfirmed(curriculumId) {
              const result = yield app.mysql.query('select * from sign_up_curriculum where state=\'已确认\'');
              const aData = [];
              for (let i = 0; i < result.length; i++) {
                if (result[i].curriculumId == curriculumId && !result[i].changeCurriculumId) {
                  aData.push(result[i]);
                } else if (result[i].changeCurriculumId == curriculumId) {
                  aData.push(result[i]);
                }
              }
              return aData;
            } *
            getsignUpCurriculumByCurriculumIdAndState(curriculumId) {
              const result = yield app.mysql.query('select * from sign_up_curriculum where (state=\'已确认\' or state=\'已停课\' or state=\'已转课\')');
              const aData = [];
              for (let i = 0; i < result.length; i++) {
                if (result[i].curriculumId == curriculumId && !result[i].changeCurriculumId) {
                  aData.push(result[i]);
                } else if (result[i].changeCurriculumId == curriculumId) {
                  aData.push(result[i]);
                }
              }
              return aData;
            } *
            getStudentCurriculum(studentId) {
              const result = yield app.mysql.select('sign_up_curriculum', { where: { studentId } });
              return result;
            } *
            getByStudentIdAndState(studentId) {
              const result = yield app.mysql.query(`select * from sign_up_curriculum where studentId=${studentId} and (state='待确认' or state='已确认')`);
              return result;
            } *
            getEnrolmentInfo(studentId) {
              console.log(studentId);
              const result = yield app.mysql.query(`select * from  sign_up_curriculum  where state!=0 and studentId=${studentId}`);
              console.log(result);
              for (let i = 0; i < result.length; i++) {
                result[i].times = yield app.mysql.select('sign_up_curriculum_time', { where: { sign_up_curriculum_id: result[i].id } });
              }
              return result;
            } *
            getById(id) {
              const result = yield app.mysql.get('sign_up_curriculum', { id });
              return result;
            } *
            changeState(id, state) {
              const result = yield app.mysql.update('sign_up_curriculum', { id, state });
              return result;

            } *
            getListByState(curriculumId, state) {
              const result = yield app.mysql.select('sign_up_curriculum', { where: { curriculumId, state } });
              return result;
            } *
            getSignCurriculum(studentId,termId) {
              const aCurriculum = yield app.mysql.query(`select * from  sign_up_curriculum  where  studentId=${studentId}`);
              return aCurriculum;
            } *
            update(info) {
              const result = yield app.mysql.update('sign_up_curriculum', info);
              return result;
            } *
            getSignCurriculumByStudentIdAndCurriculumIdAndState(studentId, curriculumId, state) {
              const result = yield app.mysql.select('sign_up_curriculum', { where: { studentId, state } });
              let data = {};
              for (const item of result) {
                if (item.changeCurriculumId && item.changeCurriculumId == curriculumId) {
                  data = item;
                } else if (item.curriculumId == curriculumId) {
                  data = item;
                }
              }
              return data;
            }
    }
  return signUpCurriculum;
};
