module.exports = app => {
    class CourseTableController extends app.Controller { *
        add(weekNum) {
            let req = this.ctx.request.body;

            // let rule = {
            //     weekNum: 'number',
            // };
            // this.ctx.validate(rule);
            if (!req.courseTable.teacherId || req.courseTable.teacherId <= 0) {
                this.ctx.body = { result: false, msg: '请选择教师' };
                return;
            }

            delete req.courseTable.id;
            var term = yield this.ctx.service.term.getById(req.courseTable.termId);
            if (term == null) {
                this.ctx.body = { result: false, msg: '学期不存在' };
                return;
            }
            if (term.endDate < app.moment()) {
                this.ctx.body = { result: false, msg: '当前学期已经结束' };
                return;
            }
            var startDate = app.moment(term.startDate).format('YYYY-MM-DD');
            var endDate = app.moment(term.endDate).format('YYYY-MM-DD');

            var info = yield this.ctx.service.courseTable.findByTeacherId(req.courseTable.teacherId);
            if (info != null) {
                this.ctx.body = { code: 0, msg: '当前老师已经创建了课程，无法重复创建' };
                return;
            }
            var courseTable = yield this.ctx.service.courseTable.add(
                req.courseTable.teacherId,
                term.id,
                startDate,
                endDate
            );
            var details = [];
            for (let i = 0; i < req.weeks.length; i++) {
                let item = req.weeks[i];
                item.teacherId = courseTable.teacherId;
                item.courseTableId = courseTable.id;
                var startTime = app.moment(item.startTime).format('HH:mm:ss');
                var endTime = app.moment(item.endTime).format('HH:mm:ss');
                var detail = yield this.ctx.service.courseTableDetail.add(
                    item.courseTableId,
                    item.teacherId,
                    item.courseName,
                    item.level,
                    item.number,
                    item.duration,
                    item.classroomId,
                    item.dayOfWeek,
                    startTime,
                    endTime,
                    '空闲'
                );
                details.push(detail);
            }

            let tempDate = app.moment(courseTable.startDate);
            while (tempDate <= app.moment(courseTable.endDate)) {
                var dayOfWeek = app.moment.weekdays(tempDate.day());
                var list = app.lodash.filter(details, { 'dayOfWeek': dayOfWeek });
                for (let j = 0; j < list.length; j++) {
                    let item = list[j];
                    yield this.ctx.service.courseTableItem.add(item.courseTableId,
                        item.id,
                        item.teacherId,
                        app.moment(tempDate).format('YYYY-MM-DD'),
                        item.startTime,
                        item.endTime,
                        item.classroomId,
                        item.courseName,
                        item.number,
                        item.duration,
                        item.level,
                        "空闲",
                        "",
                        term.id
                    );
                }
                tempDate = tempDate.add(1, 'days');
            }


            this.ctx.body = { result: true, data: courseTable.id };
        }





        *
        update() {
            var req = this.ctx.request.body;
            if (!req.courseTable.id || req.courseTable.id == '') {
                this.ctx.body = { result: false, msg: '对象不存在' };
                return;
            }

            var courseTable = yield this.ctx.service.courseTable.findById(req.courseTable.id);


            yield this.ctx.service.courseTable.update({ id: courseTable.id }, {
                number: req.courseTable.number,
                coursetype: req.courseTable.coursetype,
            });

            var minDate = app.lodash.min(req.weeks, function(m) {
                return m.date;
            });
            var startDate = app.moment(minDate.date).day(1); //周一
            var endDate = app.moment(minDate.date).day(7); //周日
            yield this.ctx.service.courseTableItem.delete(courseTable._id, startDate, endDate);

            for (var i = 0; i < req.weeks.length; i++) {
                let item = req.weeks[i];
                item.teacherId = courseTable.teacherId;
                item.courseTableId = courseTable._id;
                item.date = app.moment(item.date).second(0).minute(0).hour(0);

                yield this.ctx.model.courseTableItem.create(item);
            }
            yield this.ctx.service.courseTable.updateDateRange(courseTable._id);
            this.ctx.body = { result: true, data: courseTable._id };
            //
            //
        }

        *
        copy() {
                var req = this.ctx.request.body;
                var courseTable = yield this.ctx.service.courseTable.findById(req.courseTable._id);
                var weekNum = req.weekNum;
                for (var j = 0; j < weekNum; j++) {
                    var monday = app.moment(courseTable.endDate).add(j * 7 + 1, 'days').day(1);
                    for (var i = 0; i < req.weeks.length; i++) {
                        let item = req.weeks[i];
                        var info = {};
                        info.teacherId = courseTable.teacherId;
                        info.courseTableId = courseTable._id;

                        info.date = app.moment(monday).add(app.moment(item.date).day() - 1, 'days').second(0).minute(0).hour(0);

                        info.startTime = item.startTime;
                        info.endTime = item.endTime;
                        info.classroomId = item.classroomId;
                        info.courseId = item.courseId;

                        yield this.ctx.model.courseTableItem.create(info);
                    }
                }
                yield this.ctx.service.courseTable.updateDateRange(courseTable._id);
                this.ctx.body = { result: true };
            }
            /**
             * 排课列表
             */
            *
            getList() {
                var termId = this.ctx.request.query.termId || 0;
                if (termId == 0) {
                    //this.ctx.body = '请传入学期编号';
                    //return;
                    termId = yield this.ctx.service.term.getCurrentId();
                }
                var term = yield this.ctx.service.term.getById(termId);
                var details = yield this.ctx.service.courseTableDetail.getList(termId);
                //this.ctx.logger.info(details);

                var details1 = app.lodash.groupBy(details, 'teacherId');
                //this.ctx.logger.info(details1);
                var list = [];
                for (let teacherId in details1) {

                    var teacher = yield this.ctx.service.teacher.findById(teacherId);
                    // this.ctx.logger.info(teacher);
                    var maxStartDate = app.lodash.maxBy(details1[teacherId], function(o) {
                        return o.startDate;
                    }).startDate;
                    var maxEndDate = app.lodash.minBy(details1[teacherId], function(o) {
                        return o.endDate;
                    }).endDate;

                    list.push({
                        teacher,
                        term,
                        maxStartDate,
                        maxEndDate
                    });
                }
                this.ctx.body = list;
            }

        *
        getBaseData() {
            // var termId = this.ctx.request.query.termId || 0;
            // if(termId == 0){
            //     //this.ctx.body = '请传入学期编号';
            //     //return;
            //     termId = yield this.ctx.service.term.getCurrentId();
            // }
            var terms = yield this.ctx.service.term.getAll();
            var teachers = yield this.ctx.service.teacher.getAll();

            var courses = yield this.ctx.service.course.getAll();

            var classrooms = yield this.ctx.service.classroom.getAll();
            //this.ctx.body = 'adfasfdsf';
            //return;
            this.ctx.response.body = {
                terms,
                teachers,
                courses,
                classrooms
            };
        }


        *
        getById() {
            var id = this.ctx.request.query.id;
            var courseTable = yield this.ctx.service.courseTable.findById(id);
            var canEdit = false;
            var details = yield this.ctx.service.courseTableDetail.getByCourseTableId(id);
            var details1 = [];
            for (var index = 1; index <= 7; index++) {
                let dayOfWeek = app.moment.weekdays()[index % 7];
                var obj = {
                    dayOfWeek: dayOfWeek,
                    list: []
                };
                let list = app.lodash.filter(details, { 'dayOfWeek': dayOfWeek });
                for (var j = 0; j < list.length; j++) {
                    var item = list[j];
                    //item.startTime = app.moment(item.startTime)._d;
                    // var course = yield this.ctx.service.course.getById(item.courseId);
                    // if (course) {
                    //     item.courseName = course.name;
                    // }
                    var classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                    if (classroom) {
                        item.classroomName = classroom.name;
                    }
                    var students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(item.id);


                    item.students = [];
                    // if(canEdit){
                    //     canEdit = !(students.length>0);
                    // }

                    for (var k = 0; k < students.length; k++) {
                        var ss = yield this.ctx.service.student.getById(students[k].studentId);
                        item.students.push(ss);
                    }
                    obj.list.push(item);
                }
                details1.push(obj);
            }

            this.ctx.body = {
                data: {
                    courseTable,
                    canEdit,
                    details: details1
                }
            }
        }


        //获取老师正在进行的课程信息
        *
        getByTeacherId1() {
            var req = this.ctx.request.query;
            var teacherId = req.teacherId;
            var now = app.moment();

            var info = yield this.ctx.service.courseTable.findByTeacherId(teacherId);
            if (info == null) {
                var msg = '当前老师没有课程表，请联系管理员';
                this.ctx.body = { result: false, msg: msg };
                return;
            }

            var tempDate = info.startDate;
            var index = 1;
            var result = [];
            while (tempDate < info.endDate) {
                result.push({
                    label: '第' + index + '周',
                    startDate: app.moment(tempDate).format('YYYY-MM-DD'),
                    endDate: app.moment(tempDate).day(7).format('YYYY-MM-DD')
                });
                index++;
                tempDate = app.moment(tempDate).add(7, 'days');
            }
            var teacher = yield this.ctx.service.teacher.findById(info.teacherId);

            this.ctx.body = {
                data: {
                    list: result,
                    info: {
                        id: info.id,
                        teacher: teacher,
                        number: info.number,
                        coursetype: info.coursetype,
                        startDate: info.startDate,
                        endDate: info.endDate
                    }
                }
            };
        }


        /* 获取一周的课程表 */
        *
        getWeekItemsForWx() {
            //id, startDate
            //var req = this.ctx.request.query;
            var id = this.ctx.request.query.id;
            var startDate = app.moment(this.ctx.request.query.startDate);
            var endDate = app.moment(startDate).day(7);
            var list = yield this.ctx.service.courseTableItem.find(id, startDate, endDate);

            //list.forEach(function(item){
            //  item.date = app.moment(item.date);
            //});
            //var list1 = app.lodash.clone(list.);

            for (var i = 0; i < list.length; i++) {
                list[i]._doc.date = app.moment(list[i]._doc.date).format('YYYY-MM-DD');
                //list[i]._doc.courseName = 'asdfadf';
                list[i]._doc.startTime = app.moment(list[i]._doc.startTime).format('h:mm')
                list[i]._doc.endTime = app.moment(list[i]._doc.endTime).format('h:mm')
                var course = yield this.ctx.service.course.getById(list[i].courseId);

                if (course) {
                    list[i]._doc.courseName = course.name;
                }
                var classroom = yield this.ctx.service.classroom.getById(list[i].classroomId);
                if (classroom) {
                    list[i]._doc.classroomName = classroom.name;
                }
                //this.ctx.service.course.getById(list[i].courseId).name

            }
            var result = [];
            for (var i = 0; i < 7; i++) {
                var date = app.moment(startDate).add(i, 'days');
                var tempList = app.lodash.filter(list, function(m) {
                    return date.isSame(m.date, 'year') && date.isSame(m.date, 'month') && date.isSame(m.date, 'day');
                });
                result.push({
                    date: date,
                    label: app.moment.weekdays(date.day()),
                    list: tempList
                });
            }

            this.ctx.body = { data: result };
        }


        //通过老师Id获取一周的课程表
        *
        getByTeacherId() {
                let termId = this.ctx.request.query.termId || 0;
                let teacherId = this.ctx.request.query.teacherId || 0;
                let studentId = this.ctx.request.query.studentId || 0;

                let term = yield this.ctx.service.term.getById(termId);
                //var result = yield this.ctx.service.courseTable.getByTeacherId(teacherId);
                //this.ctx.logger.info(app.moment.weekdays());
                let details = [];
                let week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
                let detailList = yield this.ctx.service.courseTableDetail.getList(termId, teacherId);
                for (let i = 0; i < week.length; i++) {
                    let detailList1 = app.lodash.filter(detailList, { 'dayOfWeek': week[i] });
                    for (let j = 0; j < detailList1.length; j++) {
                        let classroom = yield this.ctx.service.classroom.getById(detailList1[j].classroomId);
                        detailList1[j].classroomName = classroom.name;
                        detailList1[j].checked = yield this.ctx.service.courseTableDetailStudent.hasSignUp(detailList1[j].id, studentId);
                        detailList1[j].canSelected = detailList1[j].status == '空闲' || detailList1[j].checked;
                    }
                    // yield detailList.map(item =>{
                    //     item.checked = this.ctx.service.courseTableDetailStudent.hasSignUp(item.id, studentId);
                    //     item.canSelected = item.status == '空闲';
                    // });
                    details.push({
                        dayOfWeek: week[i],
                        list: detailList1
                    })
                }
                let startDate = app.moment(term.startDate);
                let endDate = app.moment(term.endDate);

                var tempDate = app.moment(startDate);
                //var days = (endDate - startDate)/86400000;  //(1000*3600*24)
                var days = endDate.diff(startDate, 'days');
                var index = 0;
                var center = [];
                for (let i = 0; i <= days; i++) {
                    tempDate = app.moment(startDate).add(i, 'day');
                    if (tempDate.format('YYYY-MM-DD') == startDate.format('YYYY-MM-DD') || tempDate.weekday() == 0) {
                        index++;
                        let endDate = app.moment(tempDate).weekday(6);
                        if (endDate > endDate) {
                            endDate = app.moment(endDate);
                        }
                        center.push({
                            lable: "第" + index + "周",
                            startDate: app.moment(tempDate).format("YYYY.MM.DD"),
                            endDate: app.moment(endDate).format('YYYY.MM.DD')
                        });
                    }
                }

                //courseTable.startDate = courseTable.startDate.format("YYYY.MM.DD")
                //courseTable.endDate = courseTable.endDate.format("YYYY.MM.DD");

                var result = {
                    startDate: startDate.format("YYYY.MM.DD"),
                    endDate: endDate.format("YYYY.MM.DD"),
                    eachCycle: center,
                    details: details
                }

                this.ctx.body = result
            }
            //通过表格id获取每周的日期
            // * getWeeklyDetails() {

        //     var courseArray = []
        //     var date = JSON.parse(date)
        //     var everyDate = []

        //     function getEveryDate(startDate, endDate) {
        //         if (startDate == app.moment(endDate).add(1, 'days').format("YYYY.MM.DD")) {
        //             return
        //         }
        //         everyDate.push(startDate)
        //         getEveryDate(app.moment(startDate).add(1, 'days').format("YYYY.MM.DD"), endDate)
        //     }
        //     getEveryDate(date.startDate, date.endDate)
        //     var week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
        //     for (var i = 0; i < everyDate.length; i++) {
        //         var course = yield app.mysql.select("course_table_item", { where: { "teacherId": teacherId, "date": everyDate[i] } })
        //         for (var j = 0; j < course.length; j++) {
        //             course[j].startTime = course[j].startTime.substring(0, 5)
        //             course[j].endTime = course[j].endTime.substring(0, 5)
        //         }
        //         for (var j = 0; j < week.length; j++) {
        //             if (week[j] == app.moment(everyDate[i]).format("dddd")) {
        //                 courseArray.push({ lable: app.moment(everyDate[i]).format("dddd"), course: course })
        //             }
        //         }
        //     }
        //     //var result = yield this.ctx.service.courseTableItem.getWeeklyDetails(this.ctx.request.query.teacherId, this.ctx.request.query.eachCycle)
        //     this.ctx.body = courseArray;
        // } 
        
            * getTeacherCourseTable() {
                var result = yield this.ctx.service.courseTableItem.getTeacherCourseTable(this.ctx.request.query.tableId, "2017-06-05")
            } 
            * getStudentAll() {
                var result = yield this.ctx.service.courseTableItem.getStudentAll(this.ctx.request.query.teacherId)
                this.ctx.body = result
            } 
            * getStudentByTableItemId() {
                var tableItem = yield this.ctx.service.courseTableItem.getById(this.ctx.request.query.tableItemId)
                var courseTableDetail = yield this.ctx.service.courseTableDetail.findById(tableItem.courseTableDetailId)
                var teacher = yield this.ctx.service.teacher.findById(tableItem.teacherId)
                var teacherUser = yield this.ctx.service.user.findById(teacher.userId)
                var classroom = yield this.ctx.service.classroom.getById(tableItem.classroomId)

                var tableItemStudent = yield this.ctx.service.courseTableItem.getStudent(tableItem.id)
                var student = []
                for (var i = 0; i < tableItemStudent.length; i++) {
                    var everyStudent = yield this.ctx.service.student.getById(tableItemStudent[i].studentId)
                    var everyStudentUser = yield this.ctx.service.user.findById(everyStudent.userId)
                    student.push({ everyStudent: everyStudent, everyStudentUser: everyStudentUser })
                }
                //courseTable.startDate = app.moment(courseTable.startDate).format('YYYY.MM.DD')
                //courseTable.endDate = app.moment(courseTable.endDate).format('YYYY.MM.DD')
                this.ctx.body = {
                    tableItem: tableItem,
                    teacher: teacher,
                    teacherUser: teacherUser,
                    courseTableDetail: courseTableDetail,
                    //courseTable: courseTable,
                    classroom: classroom,
                    student: student
                }
            }
            //通知的学生判断可补课次数大于0，且需要补课的课程名称、等级、人数（1对1、1对多）、时长一致，方可显示。
            * getMakeUpStudents(){
                let {courseName, level, number, duration} = this.ctx.request.body
                //获取是否有请假的学生
                let makeUpStudents = yield this.ctx.service.courseTable.getMakeUpStudents()
                let students = []
                if(typeof makeUpStudents === 'object' && makeUpStudents.length){
                    
                    //调课比请假大的话再来筛选 补课的课程名称、等级、人数（1对1、1对多）、时长一致。
                    for (let i=0;i<makeUpStudents.length;i++) {
                        //查询符合条件的学生的课程
                        let eachStudentCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(makeUpStudents[i].courseTableDetailId)
                        if(courseName === eachStudentCourseTableDetail.courseName && level === eachStudentCourseTableDetail.level && Number(number) === Number(eachStudentCourseTableDetail.number) && Number(duration) === Number(eachStudentCourseTableDetail.duration)){
                          //筛选成功获取学生信息返回出去
                          console.log(1111)
                          let student = yield this.ctx.service.student.getById(makeUpStudents[i].studentId)
                          students.push(student) 
                        }
                    }
                }
                this.success(students)
            }
    }
    return CourseTableController;
};