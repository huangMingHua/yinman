'use strict';
module.exports = app => {
    // app.get('/courseTable/getTableByTeacherId', 'courseTable.getTableByTeacherId');
    app.post('/courseTable/add', 'courseTable.courseTable.add');
    app.post('/courseTable/getMakeUpStudents', 'courseTable.courseTable.getMakeUpStudents');
    app.post('/courseTable/update', 'courseTable.courseTable.update');

    app.post('/courseTable/copy', 'courseTable.courseTable.copy');
    app.get('/courseTable/getBaseData', 'courseTable.courseTable.getBaseData');
    app.get('/courseTable/getById', 'courseTable.courseTable.getById');
    app.get('/courseTable/getByTeacherId', 'courseTable.courseTable.getByTeacherId');
    app.get('/courseTable/getWeekItemsForWx', 'courseTable.courseTable.getWeekItemsForWx');
    //app.get('/courseTable/getWeeklyDetails', 'courseTable.courseTable.getWeeklyDetails');
    app.get('/courseTable/getTeacherCourseTable', 'courseTable.courseTable.getTeacherCourseTable');
    app.get('/courseTable/getStudentAll', 'courseTable.courseTable.getStudentAll');
    app.get('/courseTable/getStudentByTableItemId', 'courseTable.courseTable.getStudentByTableItemId');
    app.get('/courseTable/getByTeacherId1', 'courseTable.courseTable.getByTeacherId1');
    app.get('/courseTable/getList', 'courseTable.courseTable.getList');

    app.post('/courseTable/delete', 'courseTable.courseTableDetail.delete');
    //app.get('/courseTable/getInfo', 'courseTable.courseTableDetail.getInfo');
    app.post('/courseTable/addDetail', 'courseTable.courseTableDetail.addDetail');
    app.get('/courseTable/getnLeaveLengthAndnChangeClassLengthBycourseTableItemId', 'courseTable.courseTableDetail.getnLeaveLengthAndnChangeClassLengthBycourseTableItemId');
    //app.get('/courseTable/getListByTeacherId', 'courseTable.courseTableDetail.getListByTeacherId');

    app.post('/courseTable/delete', 'courseTable.courseTableDetail.delete');
    app.get('/courseTable/getInfo', 'courseTable.courseTableDetail.getInfo');
    app.post('/courseTable/addDetail', 'courseTable.courseTableDetail.addDetail');
    app.post('/courseTable/changeOpen', 'courseTable.courseTableDetail.changeOpen');
    app.post('/courseTable/suspendClasses', 'courseTable.courseTableDetail.suspendClasses');
    app.post('/courseTable/transferTheClass', 'courseTable.courseTableDetail.transferTheClass');
    app.post('/courseTable/getSuspension', 'courseTable.courseTableDetail.getSuspension');
    app.post('/courseTable/clearCourse', 'courseTable.courseTableDetail.clearCourse');
    app.get('/courseTable/getAllSuspensionAndClasstransfer', 'courseTable.courseTableDetail.getAllSuspensionAndClasstransfer');
    app.get('/courseTable/getTerm', 'courseTable.courseTableDetail.getTerm');
    app.get('/courseTable/getListByTeacherId', 'courseTable.courseTableDetail.getListByTeacherId');
    app.get('/courseTable/getByDetailId', 'courseTable.courseTableDetail.getById');
    app.get('/courseTable/getNumberOfChangeClass', 'courseTable.courseTableDetail.getNumberOfChangeClassByCourseTableDetailIdAndStudentId');
    app.get('/courseTable/getByDetailItemId', 'courseTable.courseTableItem.getById');
    app.get('/courseTable/getApplicableCourse', 'courseTable.courseTableDetail.getApplicableCourse');
    app.get('/courseTable/getApplicableCourseByCourseNameAndTermId', 'courseTable.courseTableDetail.getApplicableCourseByCourseNameAndTermId');
    app.get('/courseTable/getApplicableCourseByCourseNameAndTeacherNameAndTermId', 'courseTable.courseTableDetail.getApplicableCourseByCourseNameAndTeacherNameAndTermId');
    app.get('/courseTable/getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek', 'courseTable.courseTableDetail.getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek');
    app.get('/courseTable/getApplicableCourseByTermId', 'courseTable.courseTableDetail.getApplicableCourseByTermId');

    app.post('/courseTable/addItem', 'courseTable.courseTableItem.addItem');
    app.post('/courseTable/deleteItem', 'courseTable.courseTableItem.deleteItem');
    app.get('/courseTable/getWeekItems', 'courseTable.courseTableItem.getWeekItems');
    app.get('/courseTable/getClassBerforsuspendClasses', 'courseTable.courseTableItem.getClassBerforsuspendClasses');
    app.get('/courseTable/getWeekItemsForStudent', 'courseTable.courseTableItem.getWeekItemsForStudent');
    app.get('/courseTable/levelLength', 'courseTable.courseTableItem.levelLength');
    app.get('/courseTable/getSuspendClassByStudentIdAndCourseTableDetailId', 'courseTable.courseTableDetail.getSuspendClassByStudentIdAndCourseTableDetailId');
    app.get('/courseTable/getBookingCourseTeacher', 'courseTable.courseTableItem.getBookingCourseTeacher');
    app.get('/courseTable/getBookingCourse', 'courseTable.courseTableItem.getBookingCourse');
    app.get('/courseTable/getBookingCourseTime', 'courseTable.courseTableItem.getBookingCourseTime');
    app.get('/courseTable/getBookingCourseOtherTime', 'courseTable.courseTableItem.getBookingCourseOtherTime');
    app.get('/courseTable/getWeekById', 'courseTable.courseTableItem.getWeekById');

    app.get('/courseTableLeave/getLeaveData', 'courseTable.courseTableLeave.getLeaveData');
    app.post('/courseTableLeave/addLeave', 'courseTable.courseTableLeave.addLeave');
    app.get('/courseTableLeave/getLeaveDataForStudent', 'courseTable.courseTableLeave.getLeaveDataForStudent');
    app.get('/courseTableLeave/getLeaveDetail', 'courseTable.courseTableLeave.getLeaveDetail');
    app.get('/courseTableLeave/getList', 'courseTable.courseTableLeave.getList');
    app.get('/courseTableLeave/getListBystudentIdAndTermId', 'courseTable.courseTableLeave.getListBystudentIdAndTermId');

    app.get('/courseTableChangeClass/getChangeClassData', 'courseTable.courseTableChangeClass.getChangeClassData');
    app.post('/courseTableChangeClass/getChangeClassDataForStudentByTeacherId', 'courseTable.courseTableChangeClass.getChangeClassDataForStudentByTeacherId');
    app.post('/courseTableChangeClass/getMakeupDataForStudentByTeacherId', 'courseTable.courseTableChangeClass.getMakeupDataForStudentByTeacherId');
    app.post('/courseTableChangeClass/addChangeClass', 'courseTable.courseTableChangeClass.addChangeClass');
    app.post('/courseTableChangeClass/addMakeup', 'courseTable.courseTableChangeClass.addMakeup');
    app.get('/courseTableChangeClass/getChangeClassDataForStudent', 'courseTable.courseTableChangeClass.getChangeClassDataForStudent');
    app.get('/courseTableChangeClass/getMakeupDataForStudent', 'courseTable.courseTableChangeClass.getMakeupDataForStudent');
    app.get('/courseTableChangeClass/getLeaveDetail', 'courseTable.courseTableChangeClass.getLeaveDetail');
    app.get('/courseTableChangeClass/getList', 'courseTable.courseTableChangeClass.getList');
    app.get('/courseTableChangeClass/getListByTermIdAndstundetId', 'courseTable.courseTableChangeClass.getListByTermIdAndstundetId');
    app.get('/courseTableChangeClass/getChangeClassByCourseTableDetailIdAndStudentId', 'courseTable.courseTableChangeClass.getChangeClassByCourseTableDetailIdAndStudentId');

    app.post('/courseTableChangeClassForTeacher/addChangeClass', 'courseTable.courseTableChangeClassForTeacher.addChangeClass');
    app.get('/courseTableChangeClassForTeacher/getBeforeChangeClassDate', 'courseTable.courseTableChangeClassForTeacher.getBeforeChangeClassDate');
    app.get('/courseTableChangeClassForTeacher/getList', 'courseTable.courseTableChangeClassForTeacher.getList');
    app.get('/courseTableChangeClassForTeacher/getListByTeacherIdAndtermId', 'courseTable.courseTableChangeClassForTeacher.getListByTeacherIdAndtermId');
    // app.get('/courseTableLeave/getSwitchData', 'courseTable.courseTableLeave.getSwitchData');
    // app.post('/courseTableLeave/addLeave', 'courseTable.courseTableLeave.addLeave');
    // app.get('/courseTableLeave/getSwitchDataForStudent', 'courseTable.courseTableLeave.getSwitchDataForStudent');
    // app.get('/courseTableLeave/getSwitchDetail', 'courseTable.courseTableLeave.getSwitchDetail');
    // app.get('/courseTableLeave/getList', 'courseTable.courseTableLeave.getList');
};