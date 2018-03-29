<template>
    <div class="box">
        <div class="student">
            <strong>学生：{{student.name}}</strong>
        </div>
        <div class="oldCourseDetail">
            <div class="title">
                原课程信息
            </div>
            <div class="courseDetail">
                <div>
                    <span>教师：</span>
                    <strong>{{course.teacherName}}</strong>
                </div>
                <div>
                    <span>课程：</span>
                    <strong>{{course.course.name}}</strong>
                </div>
                <div>
                    <span>类型：</span>
                    <strong>学期课</strong>
                </div>
                <div>
                    <span>上课时间：</span>
                    <strong>{{course.dayOfWeek}}{{course.startTime}}{{course.endTime}}</strong>
                </div>
                <div>
                    <span>满员人数：</span>
                    <strong>{{course.number}}</strong>
                </div>
                <div>
                    <span>等级：</span>
                    <strong>{{course.level}}</strong>
                </div>
                <div>
                    <span>教室：</span>
                    <strong>{{course.classroom.name}}</strong>
                </div>
            </div>
        </div>
        <div class="applyMakeUp">
            <div class="title">
                <span>申请补课</span><em>注：（本课程你可以申请{{courseTableDetailStudent.numberOfChangeClass}}次补课）</em>
            </div>
            <div class="makeUpDetail">
                <div>
                    <span>教师：</span>
                    <el-select class="select" v-model="teacherIndex" @change="teacherChangeFn" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in teachers"
                            :key="item.teacher.id"
                            :label="item.teacher.name"
                            :value="index">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <span>补课时间：</span>
                    <el-select class="select" v-model="makeUpTimeId" @change="makeUpTimeFn" placeholder="请选择">
                        <el-option
                        v-for="item in makeUpTimes"
                        :key="item.id"
                        :label="item.date+' '+item.startTime+'~'+item.endTime"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <span>教室：</span>
                    <el-input class="input" :disabled="true" v-model="classroomName" placeholder="请输入地址" type="text"></el-input>
                </div>
            </div>
        </div>
        <div class="carefal">
            <div><img src="../../assets/images/prompt.png" /><span>温馨提示</span></div>
            <p>1、每学期每节课因私原因仅限请假{{courseTableDetailStudent.allNumberOfChangeClass}}次，本课程你已请假{{courseTableDetailStudent.allNumberOfChangeClass-courseTableDetailStudent.numberOfleave}}次，剩余{{courseTableDetailStudent.numberOfleave}}次，已补课{{courseTableDetailStudent.numberOfChangeClass}}次</p>
            <p>2、请提前2天请假，2天内的课程请假算作旷课，不能补课</p>
        </div>
        <div class="btns">
            <el-button  @click="cacel">
              取消
            </el-button>
            <el-button type="primary" @click="submit" :disabled="disabled">
              确认
            </el-button>
        </div>
    </div>
</template>
<script>
    export default{
        props: ["courseTableDetailId","studentId"],
        data () {
            return {
                student: {},
                disabled: false,
                course: {},
                courseTableItems: [],
                courseTableDetailStudent: {},
                teachers: [],
                teacherIndex: '',
                makeUpTimes: [],
                makeUpTimeId: '',
                classroomName: '' 
            }
        },
        mounted () {
            this.init();
            
        },
        methods: {
            init () {
                this.student = {};
                this.disabled = false;
                this.course = {};
                this.courseTableItems = [];
                this.courseTableDetailStudent = {};
                this.teachers = [];
                this.teacherIndex = '';
                this.makeUpTimes = [];
                this.makeUpTimeId = '';
                this.classroomName= ''; 
                this.$http.get('/api/student/getFreeListByCourseTableDetailId',{params:{courseTableDetailId: this.courseTableDetailId,studentId: this.studentId}}).then((response)=>{
                    let res = response.data
                    if (res.code) {
                        let {detail, courseTableDetailStudent, courseTableItems} = res.data
                        this.courseTableDetailStudent=courseTableDetailStudent;
                        if (courseTableDetailStudent.numberOfleave == 0) {
                            this.$message('你本节课调课次数已用完');
                            this.disabled = true;
                        }else if ((courseTableDetailStudent.allNumberOfChangeClass - courseTableDetailStudent.numberOfleave) - (courseTableDetailStudent.allNumberOfChangeClass - courseTableDetailStudent.numberOfChangeClass) == 0) {
                            this.$message('你没有补课次数，不需要补课');
                             this.disabled = true;
                        }
                        this.course = detail;
                    }else{
                        this.$message(res.msg)
                    }
                })
                this.$http.get("/api/courseTableChangeClass/getMakeupDataForStudent", {params:{courseTableDetailId: this.courseTableDetailId,studentId: this.studentId }}).then((response) => {
                    let res = response.data
                    if (res) {
                        this.teachers = res.teachers;
                        console.log(this.teachers);
                    }else{
                        this.$message(res.msg)
                    }
                })
                this.$http.get('/api/student/getById',{params:{id: this.studentId}}).then((response)=>{
                    let res = response.data
                    if (res) {
                        this.student=res;
                    }else{
                        this.$message(res.msg)
                    }
                })
            },
            makeUpTimeFn(){
                for (let item of this.makeUpTimes) {
                    if (this.makeUpTimeId == item.id) {
                        this.classroomName = item.classroomName;
                    }
                }
            },
            teacherChangeFn (index) {
                this.makeUpTimes = this.teachers[index].classes;
                console.log(this.makeUpTimes)
            },
            cacel(){
                this.$emit('cacelApplyMakeUp', 0)
            },
            submit () {
                if (!this.makeUpTimeId) {
                    this.$message('请选择补课时间');
                }
                let teacherId = this.teachers[this.teacherIndex].teacher.id;
                this.$http.post("/api/courseTableChangeClass/addMakeup", {
                    courseTableDetailId: this.courseTableDetailId,
                    currentTeacher: teacherId,
                    toCourseTableItemId: this.makeUpTimeId,
                    reason: "",
                    studentId: this.studentId,
                }).then((response) => {
                    let res = response.data
                    if (res.code == 1) {
                        this.$message("调课成功")
                        setTimeout(()=>{
                            this.$emit('cacelApplyMakeUp',1)
                        },500)
                    } else {
                        this.$message(res.msg)
                    }
                })
            }
        },
        watch:{
            courseTableDetailId(newDate, oldDate){
                if (newDate != 0) {
                    this.init();
                }
            }
        }
    }
</script>
<style  lang="less" scoped>
    .box{
        margin: 0 20px;
        width: 500px;
        .student {
            height: 30px;
            line-height: 30px;
        }
        .oldCourseDetail {
            .title {
                padding-left: 16px;
                height: 40px;
                line-height: 40px;
                font-size: 15px;
                color: #434343;
                background-color: #eef1f6;
                border: 1px solid #dfe6ec;
            }
            .courseDetail{
                border: 1px solid #dfe6ec;
                div{
                    height: 40px;
                    line-height: 40px;
                    span{
                        display: inline-block;
                        width: 80px;
                        text-align: right; 
                    }
                    strong{
                        color: #797979;
                    }
                }
            }
        }
        .applyLeave{
            .title {
                margin-top: 20px;
                padding-left: 16px;
                height: 40px;
                line-height: 40px;
                font-size: 15px;
                color: #434343;
                background-color: #eef1f6;
                border: 1px solid #dfe6ec;
            }
            .leaveDetail{
                border: 1px solid #dfe6ec;
                padding-bottom: 20px;
                div{
                    padding-top:10px;
                    padding-left: 20px;
                    span{
                        vertical-align: middle;
                        i{
                            margin-right: 2px;
                            vertical-align: middle;
                            color: red;
                        }
                    }
                    .select,.textarea{
                        width: 300px;
                        vertical-align: middle;
                    }
                }
            }
        }
        .applyMakeUp{
            .title {
                margin-top: 20px;
                padding-left: 16px;
                height: 40px;
                line-height: 40px;
                font-size: 15px;
                color: #434343;
                background-color: #eef1f6;
                border: 1px solid #dfe6ec;
                em{
                    margin: 0 5px;
                    font-size: 13px;
                    font-style: normal;
                    color: #f94141;
                }
                strong{
                    font-size: 13px;
                    color: #797979;
                }
            }
            .makeUpDetail{
                padding-bottom: 20px;
                border: 1px solid #dfe6ec;
                div{
                    padding-top:10px;
                    padding-left: 20px;
                    span{
                        display: inline-block;
                        width: 70px;
                        text-align:right;
                        vertical-align: middle;
                    }
                    .select,.input{
                        width: 300px;
                    }
                }
            }
        }
        .carefal {
            padding-top: 18px;
            img {
                width: 27px;
                height: 24px;
                vertical-align: middle;
                margin-right: 10px;
                padding-left: 10px; 
            }
            span{
                color: red;
            }
            p{
                padding-left: 10px;
                font-size: 13px;
                color: #797979;
            }
        }
        .btns{
            border-top: 1px solid #dfe6ec;
            padding-top: 10px;
            text-align:center;
        }
    }
</style>