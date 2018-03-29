module.exports = app => {
  class TermController extends app.Controller {
    *
        getAll() {
          const list = yield this.ctx.service.term.getAll();
          for (const item of list) {
            item.startDate = this.ctx.helper.formatDate(item.startDate);
            item.endDate = this.ctx.helper.formatDate(item.endDate);
          }
          this.ctx.body = list;
        } *
            getList() {
              const query = this.ctx.request.query;
              const list = yield this.ctx.service.term.getList(query.pageIndex, query.limit);
              for (const item of list.list) {
                item.startDate = this.ctx.helper.formatDate(item.startDate);
                item.endDate = this.ctx.helper.formatDate(item.endDate);
              }
              this.ctx.body = list;
            } *
            delete() {
              const id = this.ctx.request.body.id;
              const term = yield this.service.term.getById(id);
              if (term == null || term.isDelete) {
                this.fail('数据不存在');
                return;
              }
              const courseTableDetails = yield this.service.courseTableDetail.getList(id);
              if (courseTableDetails.length > 0) {
                this.fail('该学期下有课程信息，无法删除');
                return;
              }
              term.isDelete = true;
              yield this.service.term.update(term);
              this.success();
            }


    * add() {
      let { name, startDate, endDate, classHour, classHour1, belowclassHour, belowclassHour1, higherThanClassHour, registrationNotes, noticeOfReservation } = this.ctx.request.body;
      if (app.lodash.trim(name) == '') {
        this.fail('名称不能为空');
        return;
      }
      if (classHour == '' || classHour1 == '' || belowclassHour == '' || belowclassHour1 == '' || higherThanClassHour == '') {
        this.fail('请假内容不能为空');
        return;
      }
      if (parseInt(classHour, 10) != classHour || parseInt(classHour1, 10) != classHour1 || parseInt(belowclassHour, 10) != belowclassHour || parseInt(belowclassHour1, 10) != belowclassHour1 || parseInt(higherThanClassHour, 10) != higherThanClassHour) {
        this.fail('请输入整数');
        return;
      }
      startDate = app.moment(startDate);
      if (!startDate.isValid()) {
        this.fail('开始时间错误');
        return;
      }
      endDate = app.moment(endDate);
      if (!endDate.isValid()) {
        this.fail('结束时间错误');
        return;
      }
      if (!registrationNotes) {
        this.fail('报名须知不能空');
        return;
      }
      if (!noticeOfReservation) {
        this.fail('预约须知不能空');
        return;
      }
      if (endDate <= startDate) {
        this.fail('开始时间必需小于结束时间');
        return;
      }
      yield this.service.term.add(name, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), classHour, classHour1, belowclassHour, belowclassHour1, higherThanClassHour, registrationNotes, noticeOfReservation);
      this.success();
    }
        // 学期更新
    * update() {
      let { id, name, startDate, endDate, classHour, classHour1, belowclassHour, belowclassHour1, higherThanClassHour, registrationNotes, noticeOfReservation } = this.ctx.request.body;
      if (app.lodash.trim(name) == '') {
        this.fail('名称不能为空');
        return;
      }
      if (classHour == '' || classHour1 == '' || belowclassHour == '' || belowclassHour1 == '' || higherThanClassHour == '') {
        this.fail('请假内容不能为空');
        return;
      }
      if (parseInt(classHour, 10) != classHour || parseInt(classHour1, 10) != classHour1 || parseInt(belowclassHour, 10) != belowclassHour || parseInt(belowclassHour1, 10) != belowclassHour1 || parseInt(higherThanClassHour, 10) != higherThanClassHour) {
        this.fail('请输入整数');
        return;
      }
      if (app.lodash.trim(name) == '') {
        this.fail('名称不能为空');
        return;
      }
      startDate = app.moment(startDate);
      if (!startDate.isValid()) {
        this.fail('开始时间错误');
        return;
      }
      endDate = app.moment(endDate);
      if (!endDate.isValid()) {
        this.fail('结束时间错误');
        return;
      }
      if (endDate <= startDate) {
        this.fail('开始时间必需小于结束时间');
        return;
      }

      const term = yield this.service.term.getById(id);
      if (!term) {
        this.fail('该学期不存在');
        return;
      }
      const courseTableDetail = yield this.ctx.service.courseTableDetail.getByTermId(id);
      if (courseTableDetail) {
        this.fail('该学期已使用，不能修改');
        return;
      }
      term.name = name;
      term.startDate = this.ctx.request.body.startDate;
      term.endDate = this.ctx.request.body.endDate;
      term.belowClass1 = classHour;
      term.belowClass2 = classHour1;
      term.numberOfRequests1 = belowclassHour;
      term.numberOfRequests2 = belowclassHour1;
      term.numberOfRequests3 = higherThanClassHour;
      term.registrationNotes = registrationNotes;
      term.noticeOfReservation = noticeOfReservation;
      yield this.service.term.update(term);
      this.success();
    }
            // 小程序获取教师列表 规则小程序显示的刚进去显示的内容 必须这个学期有课这个学期显示开始时间最晚的那个
    * getTeacherList() {
      const { studentId = 0 } = this.ctx.request.query;

      const list = yield this.ctx.service.term.getTeacherList();
      console.log(list)
      if (studentId) { 
        for (let i = 0; i < list.length; i++) {
          const signUpList = yield this.ctx.service.signUpCurriculum.getListByStudentIdAndchangeCurriculumIdAndstate(studentId, list[i].courseTableDetailId);
          if (signUpList.length > 0) {
            list.splice(i, 1);
            i = -1;
          }
        }
      }
      this.success(list);
    }
    //得到有课程的学期
    * getTermListForCourse() {
        let list = yield this.ctx.service.term.getAll();
        let filterTerm = [];
        for (let item of list) { 
          let courseTableDetail = yield this.ctx.service.courseTableDetail.getByTermIdAndOpenEnrollmentAndIsDelAndCourseTableItemId(item.id); 
          if (courseTableDetail.length > 0) { 
              filterTerm.push(item);
          }
        }
      return this.success(filterTerm);
    }
  }
  return TermController;
};
