'use strict';
module.exports = app => {
    // const isLogin = app.middlewares.isLogin();
    const isAdmin = app.role.can('isAdmin');
    app.redirect('/', '/public/index.html', 302);

    require('./router/courseTable')(app);
    // app.post('/', 'home.getSign');

    app.all('/wechat/home', 'wechat.wechat');


    app.get('/curriculum/getAll', 'curriculum.getAll');
    app.get('/curriculum/getPaging', 'curriculum.getPaging');
    app.get('/curriculum/query', 'curriculum.query');
    app.post('/curriculum/add', isAdmin, 'curriculum.add');
    app.post('/curriculum/delete', isAdmin, 'curriculum.delete');
    app.post('/curriculum/deleteMulit', isAdmin, 'curriculum.deleteMulit');
    // 預約課程
    app.post('/bookingCourse/saveBookingInfo', 'bookingCourse.saveBookingInfo');
    app.post('/bookingCourse/delete', isAdmin, 'bookingCourse.delete');
    app.get('/bookingCourse/getById', 'bookingCourse.getById');
    app.post('/bookingCourse/cancel', 'bookingCourse.cancel');
    app.post('/bookingCourse/backEndCancel', 'bookingCourse.backEndCancel');
    app.get('/bookingCourse/getAll', 'bookingCourse.getAll');
    //app.get('/bookingCourse/query', 'bookingCourse.query');
    app.post('/bookingCourse/confirm', isAdmin, 'bookingCourse.confirm');
    app.post('/bookingCourse/changeState', isAdmin, 'bookingCourse.changeState');
    app.post('/bookingCourse/listened', isAdmin, 'bookingCourse.listened');
    app.get('/bookingCourse/getBookingInfoToId', 'bookingCourse.getBookingInfoToId');
    app.post('/bookingCourse/getQueryList', 'bookingCourse.getQueryList');

    //報名課程
    app.post('/signUpCurriculum/saveCurriculum', 'signUpCurriculum.saveCurriculum');
    app.get('/signUpCurriculum/getStudentCurriculum', 'signUpCurriculum.getStudentCurriculum');
    app.post('/signUpCurriculum/saveBackstageStudent', 'signUpCurriculum.saveBackstageStudent');
    app.post('/signUpCurriculum/check', 'signUpCurriculum.check');
    app.post('/signUpCurriculum/changeState', 'signUpCurriculum.changeState');
    app.get('/signUpCurriculum/getById', 'signUpCurriculum.getById');
    app.get('/signUpCurriculum/changeState', 'signUpCurriculum.changeState');
    app.get('/signUpCurriculum/getEnrolmentInfo', 'signUpCurriculum.getEnrolmentInfo');
    app.get('/signUpCurriculum/getSignCurriculum', 'signUpCurriculum.getSignCurriculum');
    app.get('/signUpCurriculum/getSignUpCourseOtherTime', 'signUpCurriculum.getSignUpCourseOtherTime');
    app.get('/signUpCurriculum/getWeekById', 'signUpCurriculum.getWeekById');
    app.post('/signUpCurriculum/confirm', 'signUpCurriculum.confirm');
    app.post('/signUpCurriculum/backEndCancel', 'signUpCurriculum.backEndCancel');
    app.post('/signUpCurriculum/getByState', 'signUpCurriculum.getByState');

    app.get('/signUp/getAll', 'signUp.getAll');
    app.get('/signUp/getList', 'signUp.getList');
    app.post('/signUp/addOrUpdate', 'signUp.addOrUpdate');
    app.post('/signUp/delete', 'signUp.delete');
    //app.get('/signUp/getRelationalInfo', 'signUp.getRelationalInfo');
    app.post('/signUp/editPersonalInfo', 'signUp.editPersonalInfo');
    app.post('/signUp/query', 'signUp.query');

    app.get('/student/getByStudent', 'student.getByStudent');
    app.post('/student/saveStudentInfo', 'student.saveStudentInfo');
    app.post('/student/updateStudentInfo', 'student.updateStudentInfo');
    app.get('/student/getSignUpCourse', 'student.getSignUpCourse');
    app.get('/student/getById', 'student.getById');
    app.post('/student/deleteUser', 'student.deleteUser');
    app.get('/student/getNoReserved', 'student.getNoReserved');
    app.get('/student/getSignUpTerms', 'student.getSignUpTerms');
    app.get('/student/getCourseSwitch', 'student.getCourseSwitch');
    app.get('/student/getFreeListByCourseTableDetailId', 'student.getFreeListByCourseTableDetailId');
    app.get('/student/getRenewData', 'student.getRenewData');
    app.post('/student/addRenew', 'student.addRenew');
    app.post('/student/getNoReservedQuery', 'student.getNoReservedQuery');

    app.post('/course/add', isAdmin, 'course.add');
    app.post('/course/update', isAdmin, 'course.update');
    app.post('/course/delete', isAdmin, 'course.delete');
    app.get('/course/query', 'course.query');
    app.get('/course/getAll', 'course.getAll');
    app.get('/course/getPaging', 'course.getPaging');
    //app.post('/classroomCreation', 'classroomCreation.fun');

    /* 教室管理 */
    app.get('/classroom/getAll', 'classroom.getAll');
    // app.get('/classroom/query', 'classroom.query');
    app.post('/classroom/add', isAdmin, 'classroom.add');
    app.post('/classroom/delete', isAdmin, 'classroom.delete');
    app.post('/classroom/update', isAdmin, 'classroom.update');
    // app.post('/classroom/deleteMulit', isAdmin, 'classroom.deleteMulit');

    /* 结束 */

    app.post('/teacher/update', 'teacher.update');
    app.post('/teacher/query', 'teacher.query');
    //app.get('/teacher/get', 'teacher.get');
    app.get('/teacher/getAll', 'teacher.getAll');
    app.get('/teacher/getList', 'teacher.getList');
    app.get('/teacher/getById', 'teacher.getById');
    app.get('/teacher/getByUserId', 'teacher.getByUserId');
    app.get('/teacher/getCourseSwitch', 'teacher.getCourseSwitch');
    app.get('/teacher/getTerms', 'teacher.getTerms');
    app.get('/teacher/getCourseDetails', 'teacher.getCourseDetails');
    app.get('/teacher/getStudents', 'teacher.getStudents');
    app.get('/teacher/getStudentsByDetailId', 'teacher.getStudentsByDetailId');
    app.get('/teacher/getStudentsByItemId', 'teacher.getStudentsByItemId');


    app.post('/teachernItroduction/saveOrUpdateTeacherInfo', isAdmin, 'teachernItroduction.saveOrUpdateTeacherInfo');
    app.get('/teachernItroduction/getAll', 'teachernItroduction.getAll');
    app.get('/teachernItroduction/getById', 'teachernItroduction.getById');
    app.get('/teachernItroduction/getList', 'teachernItroduction.getList');
    app.post('/teachernItroduction/delete', isAdmin, 'teachernItroduction.delete');

    app.post('/competitionPresentation/saveOrUpdateCompetitionInfo', isAdmin, 'competitionPresentation.saveOrUpdateCompetitionInfo');
    app.get('/competitionPresentation/getAll', 'competitionPresentation.getAll');
    app.get('/competitionPresentation/getById', 'competitionPresentation.getById');
    app.get('/competitionPresentation/getList', 'competitionPresentation.getList');
    app.post('/competitionPresentation/delete', isAdmin, 'competitionPresentation.delete');

    app.post('/honorRoll/saveOrUpdateCompetitionInfo', isAdmin, 'honorRoll.saveOrUpdatehonorRollInfo');
    //app.get('/honorRoll/getAll', 'honorRoll.getAll');
    app.get('/honorRoll/getById', 'honorRoll.getById');
    app.get('/honorRoll/getList', 'honorRoll.getList');
    app.post('/honorRoll/delete', isAdmin, 'honorRoll.delete');

    app.post('/rhythmCourse/saveOrUpdateCourseInfo', isAdmin, 'rhythmCourse.saveOrUpdateCourseInfo');
    app.get('/rhythmCourse/getAll', 'rhythmCourse.getAll');
    app.get('/rhythmCourse/getById', 'rhythmCourse.getById');
    app.get('/rhythmCourse/getList', 'rhythmCourse.getList');
    app.post('/rhythmCourse/delete', isAdmin, 'rhythmCourse.delete');

    // app.post('/downloadAudio/saveOrUpdateAudioInfo', 'downloadAudio.saveOrUpdateAudioInfo');
    // app.get('/downloadAudio/getAll', 'downloadAudio.getAll');
    // app.get('/downloadAudio/getById', 'downloadAudio.getById');
    // app.get('/downloadAudio/getList', 'downloadAudio.getList');
    // app.post('/downloadAudio/delete', 'downloadAudio.delete');

    // app.post('/downloadVideo/saveOrUpdateVideoInfo', 'downloadVideo.saveOrUpdateVideoInfo');
    // app.get('/downloadVideo/getAll', 'downloadVideo.getAll');
    // app.get('/downloadVideo/getById', 'downloadVideo.getById');
    // app.get('/downloadVideo/getList', 'downloadVideo.getList');
    // app.post('/downloadVideo/delete', 'downloadVideo.delete');

    app.post('/exerciseVideo/saveOrUpdateVideoInfo', 'exerciseVideo.saveOrUpdateVideoInfo');
    // app.get('/exerciseVideo/getAll', 'exerciseVideo.getAll');
    app.get('/exerciseVideo/getById', 'exerciseVideo.getById');
    app.get('/exerciseVideo/getList', 'exerciseVideo.getList');
    app.post('/exerciseVideo/delete', isAdmin, 'exerciseVideo.delete');

    app.post('/downloadPic/saveOrUpdatePicInfo', isAdmin, 'downloadPic.saveOrUpdatePicInfo');
    // app.get('/downloadPic/getAll', 'downloadPic.getAll');
    app.get('/downloadPic/getById', 'downloadPic.getById');
    app.get('/downloadPic/getList', 'downloadPic.getList');
    app.post('/downloadPic/delete', isAdmin, 'downloadPic.delete');

    app.post('/onlineGuide/add', 'onlineGuide.add');
    app.get('/onlineGuide/getList', 'onlineGuide.getList');
    app.post('/onlineGuide/delete', 'onlineGuide.delete');
    app.get('/onlineGuide/getById', 'onlineGuide.getById');
    app.post('/onlineGuide/addContent', 'onlineGuide.addContent');

    //app.post('/user/merge', 'user.merge');
    app.post('/user/addOrUpdate', 'user.addOrUpdate');
    app.post('/user/change', 'user.change');
    app.get('/user/getByOpenId', 'user.getByOpenId');
    app.get('/user/getAllTeacher', 'user.getAllTeacher');
    app.get('/user/getPaging', isAdmin, 'user.getPaging');
    app.post('/user/changeRemarks', 'user.changeRemarks');
    app.post('/user/changeIsDisable', 'user.changeIsDisable');
    app.post('/user/getByName', 'user.getByName');
    app.get('/user/getById', 'user.getById');
    app.post('/user/login', 'user.login');
    app.post('/user/logout', 'user.logout');
    app.post('/user/wxLoginByCode', 'user.wxLoginByCode');

    app.post('/studentRelatedCourse/saveAssociation', 'studentRelatedCourse.saveAssociation');
    app.get('/studentRelatedCourse/getByteacherId', 'studentRelatedCourse.getByteacherId');
    app.get('/studentRelatedCourse/getById', 'studentRelatedCourse.getById');
    app.get('/studentRelatedCourse/getByCourseInfo', 'studentRelatedCourse.getByCourseInfo');
    app.get('/studentRelatedCourse/getStudentData', 'studentRelatedCourse.getStudentData');
    //app.get('/studentRelatedCourse/getByAssociationId', 'studentRelatedCourse.getByAssociationId');

    app.get('/config/getAll', isAdmin, 'config.getAll');
    app.post('/config/update', isAdmin, 'config.update');

    app.post('/courseAdjustmentRecord', 'courseAdjustmentRecord.fun');
    app.get('/getCourseAdjustmentRecord', 'courseAdjustmentRecord.get');
    app.post('/continuedEducation', 'continuedEducation.fun');
    app.get('/getContinuedEducation', 'continuedEducation.get');
    app.post('/comment/add', 'comment.add');
    app.get('/comment/getComments', 'comment.getComments');
    app.post('/upload/upload', 'upload.upload');
    app.post('/abrsm/saveOrUpdateAbrsmInfo', 'abrsm.saveOrUpdateAbrsmInfo');
    app.get('/abrsm/get', 'abrsm.get');
    app.post('/voiceIntroduction/saveOrUpdatevoiceIntroductionInfo', 'voiceIntroduction.saveOrUpdatevoiceIntroductionInfo');
    app.get('/voiceIntroduction/get', 'voiceIntroduction.get');

    app.get('/term/getAll', isAdmin, 'term.getAll');
    app.get('/term/getList', isAdmin, 'term.getList');
    app.post('/term/update', isAdmin, 'term.update');
    app.post('/term/add', isAdmin, 'term.add');
    app.post('/term/delete', isAdmin, 'term.delete');

    app.get('/renew/getList', 'renew.getList');
    app.post('/renew/check', 'renew.check');

    app.post('/schoolTransferCourse/createCourseInfo', 'schoolTransferCourse.createCourseInfo');
    app.get('/schoolTransferCourse/getAll', 'schoolTransferCourse.getAll');

    app.get('/signUpCurriculum/getAll', 'signUpCurriculum.getAll');
};