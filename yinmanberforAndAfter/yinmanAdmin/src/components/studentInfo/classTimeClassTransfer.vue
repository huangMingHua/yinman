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
                    <strong>{{teacher.name}}</strong>
                </div>
                <div>
                    <span>课程：</span>
                    <strong>{{course.name}}</strong>
                </div>
                <div>
                    <span>类型：</span>
                    <strong>学期课</strong>
                </div>
                <div>
                    <span>时间：</span>
                    <strong>{{courseTableItem.startTime+'~'+courseTableItem.endTime}}</strong>
                </div>
                <div>
                    <span>满员人数：</span>
                    <strong>{{courseTableDetail.number}}</strong>
                </div>
                <div>
                    <span>等级：</span>
                    <strong>{{courseTableDetail.level}}</strong>
                </div>
                <div>
                    <span>教室：</span>
                    <strong>{{classroom.name}}</strong>
                </div>
            </div>
        </div>
        <div class="applyMakeUp">
            <div class="title">
                转班信息
            </div>
            <div class="makeUpDetail">
                <div class="row">
                    <span>学期：</span>
                    <el-select v-model="termId" placeholder="请选择" @change='termFn'>
                        <el-option
                        v-for="item in terms"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="row">
                    <span>课程：</span>
                    <el-select v-model="courseTableDetailId1" placeholder="请选择" @change="courseChange">
                        <el-option
                        v-for="item in courseTableDetails"
                        :key="item.id"
                        :label="item.course.name+' '+item.startTime+' '+levels[item.level-1].name+' '+item.teacher.name+' '+item.duration+'分钟'"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="row">
                    <span>转班原因：</span>
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="reason">
                    </el-input>
                </div>
            </div>
        </div>
        <div class="btns">
            <el-button  @click="cacel">
              取消
            </el-button>
            <el-button type="primary" @click="submit" >
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
                teacher: {},
                courseTableDetail: {},
                courseTableItem:{},
                courseTableDetailStudent: {},
                course: {},
                classroom: {},
                options: [
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }, {
                        value: '选项4',
                        label: '龙须面'
                    }, {
                        value: '选项5',
                        label: '北京烤鸭'
                    }
                ],
                value: '',
                termId: '', 
                courseTableDetailId1: '',
                terms:[],
                courseTableDetails: [],
                levels: [
                    {
                    id: 1,
                    name: '无等级'
                    },
                    {
                    id: 2,
                    name: 'A'
                    },
                    {
                    id: 3,
                    name: 'B'
                    },
                    {
                    id: 4,
                    name: 'C'
                    },
                    {
                    id: 5,
                    name: 'D'
                    },
                ],
                courseTableItems: [],
                reason: '',
                courseTableItemId: '',
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.$http.get('/api/term/getTermListForCourse').then((response)=>{
                    let res = response.data;
                    if (res.code) {
                        this.terms = res.data;   
                    } else {
                        this.$message(res.msg);
                    }
                })
                this.$http.get('/api/courseTable/getClassTimeClasstransfer',{params:{courseTableDetailId:this.courseTableDetailId,studentId:this.studentId}}).then((response)=>{
                    let res = response.data;
                    if (res.code) {
                        let {teacher,student,courseTableDetail,courseTableItem,courseTableDetailStudent,classroom,course} = res.data;
                        this.student = student;
                        this.teacher = teacher;
                        this.courseTableDetail = courseTableDetail;
                        this.courseTableItem = courseTableItem;
                        this.classroom = classroom;
                        this.course = course;
                        this.courseTableDetailStudent = courseTableDetailStudent;
                    } else {
                        this.$message(res.msg);
                    }
                })
            },
            termFn(){
                this.courseTableDetailId1=""
                this.$http.get('/api/courseTable/getClassTimeClasstransferByTermId',{params:{termId:this.termId,courseTableDetailId:this.courseTableDetailId}}).then((response)=>{
                    let res = response.data;
                    if (res.code) {
                       this.courseTableDetails = res.data.courseTableDetails;   
                    } else {
                       this.$message(res.msg);
                    }
                })
            },
            courseChange(){
                this.$http.get('/api/courseTable/getListEvenClassDetail',{params:{courseTableDetailId:this.courseTableDetailId1}}).then((response)=>{
                    let res = response.data;
                    if (res.code) {
                        this.courseTableItems = res.data;   
                    } else {
                        this.$message(res.msg);
                    }
                }) 
            },
            makeUpTimeFn(){
                
            },
            teacherChangeFn (index) {
                
            },
            cacel(){
                   this.$emit('cacelClassTimeClassTransfer');
            },
            submit () {
                if(!this.termId){
                   return this.$message('请选择学期');
                }
                if (!this.courseTableDetailId||!this.studentId) {
                    return this.$message('缺少参数');
                }
                if (!this.courseTableDetailId1) {
                    return this.$message('请选择转班课程');
                }
                if (!this.reason) {
                    return this.$message('请输入转班原因');
                }
                this.$http.post('/api/courseTable/classTimeClassTransfer',{courseTableDetailId:this.courseTableDetailId,classTransferCourseTableDetailId:this.courseTableDetailId1,studentId:this.studentId,reason:this.reason}).then((response)=>{
                    let res = response.data;
                    if (res.code) {
                        this.$emit('cacelClassTimeClassTransfer');
                    } else {
                        this.$message(res.msg);
                    }
                })  
            }
        }
    }
</script>
<style  lang="less" scoped>
    .box{
        margin: 0 20px;
        width: 500px;
        text-align: left;
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
                        vertical-align: middle;
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