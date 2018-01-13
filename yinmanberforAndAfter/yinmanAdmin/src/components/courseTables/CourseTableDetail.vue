<template>
    <div >
        <div class="p-hidden">
            <div style="position:relative">
                <span style="position:absolute;left:4%;font-size:30px;">报名课表</span>
                <span>
                    学期：<el-select v-model="term">
                        <el-option v-for="item in baseData.terms" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                </span>
                <span>
                    课程周期
                </span>
                <span class="headSpan">
                    <!--<el-date-picker v-model="courseTable.startDate" type="date" placeholder="选择日期" :disabled="!canEdit">
                    </el-date-picker>-->
                    {{ term.startDate | viewDate }} 至 {{ term.endDate | viewDate }}
                </span>
                <span style="width:400px">教师姓名
                    <el-select v-model="teacher" placeholder="请选择">
                        <el-option v-for="item in baseData.teachers" :key="item.id" :label="item.name" :value="item">
                        </el-option>
                    </el-select>
                </span>
                <span style="position:absolute;right:20px;">
                    <router-link class="el-button el-button--text" :to="{ path: '/courseTable/viewItems', query: { teacherId: teacher.id, termId:term.id } }">查看周课表</router-link>
                </span>
            </div>
            <div style=" text-align:center;">
                <table cellpadding=0 cellspacing=0 border=0 class="table">
                    <tr>
                        <td>
                            星期
                        </td>
                        <td>
                            时间
                        </td>
                        <td>
                            课程名称
                        </td>
                        <td style="width: 600px;">
                            学生
                        </td>
                        <td>学生人数</td>
                        <td>等级</td>
                        <td>时长(分钟)</td>
                        <td>
                            教室
                        </td>
                        
                        <td>开始日期</td>
                        <td>结束日期</td>
                        
                        <td>课程说明</td>
                        <td>
                            操作
                        </td>
                        <td>
                            添加和删除
                        </td>
    
                    </tr>
                    <tbody v-for="(day,idx) in weekArray">
                        <tr>
                        <td>
                            {{ day.dayOfWeek }}
                        </td>
                        <td colspan="11">
                            
                        </td>
                        <td>
                            <el-button size="mini" @click="add(day.dayOfWeek)" v-if="canEdit">添加</el-button>
                        </td>
                        </tr>
                        <tr v-for="(item,index) in day.list">
                            <td></td>
                            <td>
                                {{ item.startTime | viewHouAndSec }}-{{ item.endTime | viewHouAndSec}}  
                            </td>
                            <td style="width:189px;">
                                {{ item.courseName }}
                            </td>
                            <td>
                                <div v-for="(sss, i) in item.aSignUpStudent" v-if="item.courseTableDetailStudent[i]">
                                    <span v-if="sss.startDate">
                                        <router-link style="color: #20a0ff;" :to="{ path:'/studentInfo', query:{ studentId : sss.studentId }}">{{ sss.name }} </router-link> {{ sss.startDate| viewDate }}~{{ sss.endDate | viewDate}}
                                        <span v-if="item.courseTableDetailStudent[i].status=='停课'" style="color: red;cursor: pointer;" @click="suspendClassesShowFn(item.id,item,i,sss.startDate,sss.endDate)">已停课</span> <el-button type="text" v-if="item.courseTableDetailStudent[i].status=='正常'" @click="suspendClassesFn(item.id,item,i,sss.startDate,sss.endDate)">停课</el-button>
                                        <span v-if="item.courseTableDetailStudent[i].status=='转课'" style="color: red;cursor: pointer;" @click="transferTheClassShowFn(item.id,item,i,sss.startDate,sss.endDate)">已转班</span><el-button type="text" v-if="item.courseTableDetailStudent[i].status=='停课'&& item.number==1&&item.courseTableDetailStudent[i].classTransferCourseTableDetailId==null"  @click="transferTheClassFn(item.id,item,i)">转班</el-button>
                                    </span>
                                    <span v-else>
                                        <router-link style="color: #20a0ff;" :to="{ path:'/studentInfo', query:{ studentId : sss.studentId }}">{{ sss.name }} </router-link> <span v-if="item.courseTableDetailStudent[i].status=='停课'" style="color: red;cursor: pointer;" @click="suspendClassesShowFn(item.id,item,i,sss.startDate,sss.endDate)">已停课</span> <el-button type="text" v-if="item.courseTableDetailStudent[i].status=='正常'" @click="suspendClassesFn(item.id,item,i)">停课</el-button>
                                           <span v-if="item.courseTableDetailStudent[i].status=='转课'" style="color: red;cursor: pointer;" @click="transferTheClassShowFn(item.id,item,i,sss.startDate,sss.endDate)">已转班</span><el-button type="text" v-if="item.courseTableDetailStudent[i].status=='停课'&& item.number==1&&item.courseTableDetailStudent[i].classTransferCourseTableDetailId==null"  @click="transferTheClassFn(item.id,item,i)">转班</el-button>
                                    </span>
                                </div>
                            </td>
                            <td>
                                {{ item.number }}
                            </td>
                            <td>
                                {{ item.level }}
                            </td>
                            <td>
                                {{ item.duration }}
                            </td>
                            <td>
                                {{ item.classroomName }}
                            </td>
                            <td>
                                {{ item.startDate | viewDate }}
                            </td>
                            <td>
                                {{ item.endDate | viewDate }}
                            </td>
                            
                             <td>
                                <span v-if="aRemarks[idx]" :title="item.course.courseDescription">
                                    {{ aRemarks[idx][index] }}
                                    </span>
                            </td>
                            <td title="1、该功能可关闭，关闭时学生不能再报名此课程，但不影响已报名的学生。
2、有学生报名此课程待审核时，该功能不可关闭。">
                              <el-checkbox v-model="item.openEnrollment" @change="isOpen(item)">开放报名</el-checkbox>
                              <el-button type='text' v-if="item.number==1&&item.courseTableDetailStudent[0]&&(item.courseTableDetailStudent[0].status=='停课'||item.courseTableDetailStudent[0].status=='转课')" v-model="item.clearCourse" :disabled='item.clearCourse' style="margin-left:10px;" @change="clearCourse(item)"  @click="clearCourse(item)">清空课程</el-button> 
                            </td>
                            <td>
                                <el-button size="mini" @click="del(item)" v-if="canEdit">删除</el-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <el-dialog title="添加报名课程"  size="tiny" v-model="isShowAdd" :close-on-click-modal='false'>
                    <el-form  label-width="200px" :show-message='false' :model="newItem" :rules="rules" label-position="right">
                        <el-form-item class="suspendClassShow day">
                            {{ newItem.dayOfWeek }}
                        </el-form-item>
                        <el-form-item label="教师：" class="suspendClassShow" >
                            {{ teacher.name }}
                        </el-form-item>
                        <el-form-item label="课程："  prop='courseName'  class="suspendClassShow">
                            <el-select v-model="newItem.courseName" placeholder="请选择">
                                <el-option v-for="course in baseData.courses" :key="course.name" :label="course.name" :value="course.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="等级：" prop='level' class="suspendClassShow">
                            <el-select v-model="newItem.level">
                                    <el-option v-for="level in levels" :key="level" :label="level" :value="level"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="人数：" prop='number' class="suspendClassShow">
                            <el-input v-model="newItem.number" class="number" placeholder="输入学生数量" :maxlength="10"></el-input>
                        </el-form-item>
                        <el-form-item label="教室："  prop='classroomId' class="suspendClassShow">
                            <el-select v-model="newItem.classroomId" @change="selectClassroom" placeholder="请选择">
                                <el-option v-for="classroom in baseData.classrooms" :key="classroom.name" :label="classroom.name" :value="classroom.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上课时间：" prop='startTime' class="suspendClassShow">
                            <el-time-select v-model="newItem.startTime" class="time" :picker-options="{
                                start: '06:30',
                                step: '00:5',
                                end: '24:00'
                            }" placeholder="选择时间：">
                            </el-time-select>
                        </el-form-item>
                        <el-form-item label="时长：" prop='duration' class="suspendClassShow">
                            <el-input v-model="newItem.duration"  class="min" :maxlength="10"></el-input> 分钟
                        </el-form-item>
                        <el-form-item label="下课时间：" class="suspendClassShow">
                            <!--<el-time-select v-model="newItem.endTime">
                            </el-time-select>-->
                            {{ newItem.endTime }}
                        </el-form-item>
                        <el-form-item label="开始时间：" class="suspendClassShow">
                            <el-date-picker
                                class="time"
                                v-model="newItem.startDate"
                                type="date"
                                placeholder="选择日期："
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间："  class="suspendClassShow">
                            <el-date-picker
                                class="time"
                                v-model="newItem.endDate"
                                type="date"
                                placeholder="选择日期："
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="设置学生请假次数：" class="setLeave">
                            低于：<el-input v-model="newItem.classHour" class="classHour" @change="classHourFn" ></el-input>课时，可请：<el-input v-model="newItem.belowclassHour" class="classHour" ></el-input>次假<br />
                            高于：<em>{{classHour}}</em>课时，可请：<el-input v-model="newItem.higherThanClassHour" class="classHour" ></el-input>次假
                        </el-form-item>
                        <el-form-item label="设置老师请假次数：" class="setLeave">
                            低于：<el-input v-model="newItem.teacherClassHour" class="classHour" @change="teacherClassHourFn" ></el-input>课时，可请：<el-input v-model="newItem.teacherBelowclassHour" class="classHour" ></el-input>次假<br />
                            高于：<em>{{teacherClassHour}}</em>课时，可请：<el-input v-model="newItem.teacherHigherThanClassHour" class="classHour" ></el-input>次假
                        </el-form-item> 
                        <el-form-item class="suspendClassShow">
                            <el-button @click="isShowAdd = false">取消</el-button>
                            <el-button type="primary" @click="saveAdd('newItem')">立即创建</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
                    <el-dialog title="停课" size="tiny" v-model="isSuspendClasses" :close-on-click-modal='false' label-position="left">
                       <el-form :model="suspendClassesForm" :rules="suspendClasses" ref="suspendClassesForm" label-width="180px" class="demo-ruleForm">
                            <el-form-item label="姓名：" prop="name" class="suspendClassShow">
                                {{name}}
                            </el-form-item>
                            <el-form-item label="课程："  class="suspendClassShow">
                                {{curriculum}}
                            </el-form-item>
                            <el-form-item label="等级：" class="suspendClassShow">
                                {{level}}
                            </el-form-item>
                            <el-form-item label="课程结束日期：" prop="suspensionDate">
                                <el-select v-model="suspendClassesForm.suspensionDate" @change="getClassBerforsuspendClasses" style="width:100%;" placeholder="请选择">
                                    <el-option
                                    v-for="item in weekCycle"
                                    :key="item.id"
                                    :label="item.date"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="停课原因："  prop="reason">
                                <el-input  type="textarea"
                                           :rows="2"
                                           placeholder="请输入内容"
                                           v-model="suspendClassesForm.reason"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="停课日期前课时数："  class="suspendClassShow">
                                <div>{{aChangeClass.length}}</div>
                                <div style="color:red;font-size:12px;">注：停课日期（含）之后的调课、请假、补课会删除</div>
                             </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="suspensionBack">取 消</el-button>
                                <el-button type="primary" @click="submitSuspension('suspendClassesForm')">提 交</el-button>
                            </el-form-item>
                      </el-form>
                    </el-dialog>
                    <el-dialog title="停课" size="tiny" v-model="isSuspendClassShowes" :close-on-click-modal='false' label-position="left">
                       <suspend-classes :name='name' :curriculum='curriculum' :level='level' :suspensionDate='suspensionDate' :reason='reason'></suspend-classes>
                    </el-dialog>
                     <el-dialog title="转班"  v-model="isTransferTheClass" :close-on-click-modal='false' >
                       <el-form :model="transferTheClassForm" :rules="transferTheClasses" ref="transferTheClassForm" label-width="300px" class="demo-ruleForm">
                            <el-form-item label="姓名："  class="suspendClassShow">
                                {{name}}
                            </el-form-item>
                            <el-form-item label="课程："  class="suspendClassShow">
                                {{curriculum}}
                            </el-form-item>
                            <el-form-item label="人数：" class="suspendClassShow">
                                {{number}}
                            </el-form-item>
                            <el-form-item label="等级：" class="suspendClassShow">
                                {{level}}
                            </el-form-item>
                            <el-form-item label="原课程周期：" class="suspendClassShow">
                                {{currentCycle}}
                            </el-form-item>
                             <el-form-item label="课程截止日期：" class="suspendClassShow">
                                {{suspensionDate|viewDate}}
                            </el-form-item>
                            <el-form-item label="转班课程周期：" prop="changeCurriculumId" class="suspendClassShow" >
                                <el-select v-model="transferTheClassForm.changeCurriculumId" style="width:460px" @change="changeCurriculum" placeholder="请选择">
                                    <el-option
                                    v-for="item in aOptions"
                                    :key="item.id"
                                    :label="item.teacher.name+' '+item.startDate+'至'+item.endDate+' '+item.dayOfWeek+item.startTime+'~'+item.endTime+' '+item.number+'人, '+item.level"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="课程开始日期：" prop="startDate" class="suspendClassShow" >
                                <el-select v-model="transferTheClassForm.startDate" style="width:200px"  placeholder="请选择">
                                    <el-option
                                    v-for="item in aStartDate"
                                    :key="item.id"
                                    :label="item.date|viewDate"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="转班原因："  prop="reason">
                                <el-input  type="textarea"
                                           :rows="2"
                                           placeholder="请输入内容"
                                           v-model="transferTheClassForm.reason"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item >
                                <el-button @click="transferTheClassBack">取 消</el-button>
                                <el-button type="primary" @click="submitTransferTheClass('transferTheClassForm')">提 交</el-button>
                            </el-form-item>
                      </el-form>
                    </el-dialog> 
                     <el-dialog title="转班" size="tiny" v-model="isTransferTheClassShow" :close-on-click-modal='false' >
                       <el-form :model="transferTheClassForm"  ref="transferTheClassForm" label-width="200px" class="demo-ruleForm">
                            <el-form-item label="姓名："  class="suspendClassShow">
                                {{name}}
                            </el-form-item>
                            <el-form-item label="课程："  class="suspendClassShow">
                                {{curriculum}}
                            </el-form-item>
                            <el-form-item label="等级：" class="suspendClassShow">
                                {{level}}
                            </el-form-item>
                            <el-form-item label="课程截止日期：" prop="suspensionDate" class="suspendClassShow">
                                {{suspensionDate|viewDate}}
                            </el-form-item>
                            <el-form-item label="停课原因：" class="suspendClassShow">
                                {{reason}}
                            </el-form-item>
                            <el-form-item label="原课程周期："  class="suspendClassShow">
                                {{currentCycle}}
                            </el-form-item>
                            <el-form-item label="转班原因：" class="suspendClassShow">
                                {{sShiftReason}}
                            </el-form-item>
                            <el-form-item label="转班后课程开始日期：" class="suspendClassShow">
                                {{sShiftStartDate | viewDate}}
                            </el-form-item>
                            <el-form-item label="转班后的课程周期："  class="suspendClassShow">
                                {{classTransferCourseTableDetailDate}}
                            </el-form-item>
                      </el-form>
                    </el-dialog> 
                    <el-dialog title="清空课程" size="tiny" v-model="isClearCourse" :close-on-click-modal='false' >
                       <el-form :model="clearCourseForm" :rules="clearCourseTime" ref="clearCourseForm" label-width="200px" class="demo-ruleForm">
                            <el-form-item label="姓名："  class="suspendClassShow">
                                {{name}}
                            </el-form-item>
                            <el-form-item label="课程："  class="suspendClassShow">
                                {{curriculum}}
                            </el-form-item>
                            <el-form-item label="课程开始日期："  class="suspendClassShow">
                                {{startDate | viewDate }}
                            </el-form-item>
                            <el-form-item label="课程截止日期："  class="suspendClassShow">
                                {{endDate | viewDate }}
                            </el-form-item>
                            <el-form-item label="清空开始日期："  class="suspendClassShow">
                                <el-select v-model="clearCourseForm.changeCurriculumId" @change="changeClearCourse" placeholder="请选择">
                                    <el-option
                                    v-for="item in aClearCourese"
                                    :key="item.id"
                                    :label="item.date"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="清空结束日期："  class="suspendClassShow">
                                {{ term.endDate | viewDate }}
                            </el-form-item>
                            <el-form-item label="注意："  class="suspendClassShow">
                                清空开始日期后有{{nLeaveLength}}次请假，{{nChangeClass}}次补课
                            </el-form-item>
                            <el-form-item >
                                <el-button @click="clearCourseBack">取 消</el-button>
                                <el-button type="primary" @click="submitClearCourse('clearCourseForm')">提 交</el-button>
                            </el-form-item>
                      </el-form>
                    </el-dialog> 

    </div>
</template>
<script>
import suspendClasses from './suspendClasses'
export default {
    name: 'course-table-add-detail',
    props: {
        termId: Number,
        teacherId: Number
    },
    data() {
        return {
            baseData: {
                courses: [], teachers: [], classrooms: [], terms:null
            },
            term: {},
            teacher: {},
            weekNum: "",
            weekArray: [],
            aRemarks:[],
            canEdit: true,
            weekDays:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
            levels:['无等级', 'A','B','C','D'],
            isShowAdd: false,
            newItem:{
                termId:0,
                teacherId:0,
                courseName:'',
                classroomId:'',
                startTime: '',
                endTime: '',
                level:'',
                number:'',
                duration:'',
                dayOfWeek:'',
                remarks:'',
                startDate:new Date(),
                endDate: new Date(),
                classHour:'',
                belowclassHour:'',
                higherThanClassHour:'',
                teacherClassHour:'',
                teacherBelowclassHour:'',
                teacherHigherThanClassHour:''
            },
            classHour:'',
            teacherClassHour:'',
            isSuspendClasses:false,
            isSuspendClassShowes:false,
            isTransferTheClassShow:false,
            isTransferTheClass:false,
            isClearCourse:false,
            suspendClassesForm: {
                reason: '',
                suspensionDate:''
            },
            transferTheClassForm: {
                changeCurriculumId:'',
                reason:'',
                startDate:''
            },
            clearCourseForm: {
                changeCurriculumId:''
            },
            suspendClasses: {
                suspensionDate: [
                    { required: true, message: '请选择停课时间' ,trigger: 'blur'},
                ],
                reason:[
                    { required: true, message: '请选择停课时间' ,trigger: 'blur'},
                ]
            },
            transferTheClasses: {
                changeCurriculumId: [
                    { required: true, message: '请选择更改课程周期' ,trigger: 'blur'},
                ],
                reason:[
                    { required: true, message: '' ,trigger: 'blur'},
                ],
                startDate:[
                    { required: true, message: '' ,trigger: 'blur'},
                ]
            },
            clearCourseTime: {
                changeCurriculumId: [
                    { required: true, message: '请选择清空时间' ,trigger: 'blur'},
                ]
            },
            rules: {
                courseName: [
                    { required: true, message: '请选择课程' ,trigger: 'blur' },
                ],
                level: [
                    { required: true, message: '请选择等级' ,trigger: 'blur'}
                ],
                number: [
                    {  required: true, message: '请输入人数' ,trigger: 'blur'}
                ],
                classroomId: [
                    {  required: true, message: '请选择教室' ,trigger: 'blur' }
                ],
                startTime: [
                    {  required: true, message: '请选择上课时间' ,trigger: 'blur'}
                ],
                duration: [
                    { required: true, message: '请输入时长' ,trigger: 'blur'}
                ]
            },
            weekCycle:[],
            courseTableDetailStudentId:0,
            originalCourseTableDetailDate:'',
            classTransferCourseTableDetailDate:'',
            name:'',
            aOptions:[],
            currentCycle:'',
            curriculum:'',
            originalCourseTableDetailStudentId:'',
            studentId:0,
            aClearCourese:[],
            startDate:'',
            endDate:'',
            suspensionDate:'',
            reason:'',
            level:'',
            aChangeClass:[],
            number:0,
            aStartDate:[],
            sShiftReason:'',
            sShiftStartDate: '',
            nLeaveLength: 0,
            nChangeClass: 0,
            clearCourseStudentId:0
        }
    },
    created() {
        //this.weekDays = moment.weekdays();
        this.$http.get('/api/courseTable/getBaseData').then((res) => {
                this.baseData = res.data;
                this.term = _.find(this.baseData.terms, { id: this.termId }) || {};
                this.teacher = _.find(this.baseData.teachers, { id: this.teacherId }) || {};
            });
        this.init();
    },
    methods: {
        init() {
            //this.currentStartDate = moment().day(1);
            
                this.loadInfo();

            
        },
    
        btnBack() {
            this.$emit('cancel');
        },
        add(day) {
            this.newItem ={
                termId: 0,
                teacherId: 0,
                courseName: '',
                classroomId: '',
                startTime: '',
                endTime: '',
                level: '',
                number: '',
                duration: '',
                dayOfWeek: '',
                remarks: '',
                startDate: new Date(),
                endDate: new Date(),
                classHour: '',
                belowclassHour: '',
                higherThanClassHour: '',
                teacherClassHour: '',
                teacherBelowclassHour: '',
                teacherHigherThanClassHour: ''
            }
            this.newItem.classHour = this.term.belowClass
            this.newItem.belowclassHour = this.term.numberOfRequests1
            this.newItem.higherThanClassHour = this.term.numberOfRequests2
            this.newItem.teacherClassHour = this.term.teacherBelowClass
            this.newItem.teacherBelowclassHour = this.term.teacherNumberOfRequests1
            this.newItem.teacherHigherThanClassHour = this.term.teacherNumberOfRequests2
            this.classHour = this.newItem.classHour
            this.teacherClassHour = this.term.teacherBelowClass
            this.newItem.termId = this.term.id;
            this.newItem.teacherId = this.teacher.id;
            this.newItem.dayOfWeek = day;
            this.newItem.startDate = this.term.startDate;
            this.newItem.endDate = this.term.endDate;
            this.isShowAdd = true;
        },
        selectClassroom(val){
            if(this.newItem.courseName==""){
               this.$message('请先选择课程')    
               this.newItem.classroomId=""
               return     
            }
             for(let item of this.baseData.classrooms){
                if(item.id==val){
                    if(this.newItem.courseName.indexOf("钢琴")!==-1&&item.isPiano==0){
                          this.$confirm('该教室没有钢琴，确认选择该教室？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                closeOnClickModal:false,
                                type: 'warning'
                            }).then(() => {
                            
                            }).catch(() => {
                                this.newItem.classroomId=""     
                            });
                    }
                }
            }
        },
        
        saveAdd(formName){
            let {courseName, level, number, classroomId, startTime, duration,classHour, belowclassHour, higherThanClassHour, teacherClassHour, teacherBelowclassHour, teacherHigherThanClassHour}=this.newItem
            if(courseName==''){
                this.$message('请选择课程')
                return
            }
            if(level==''){
                this.$message('请选择等级')
                return
            }
            if(number==''){
                this.$message('请选择人数')
                return
            }
            if(classroomId==''){
                this.$message('请选择教室')
                return
            }
            if(startTime==''){
                this.$message('请选择上课时间')
                return
            }
            if(duration==''){
                this.$message('请输入时长')
                return
            }
            if(classHour == '' || belowclassHour == '' || higherThanClassHour == '' || teacherClassHour == '' || teacherBelowclassHour == '' || teacherHigherThanClassHour == ''){
                this.$message('请设置请假次数')
                return
            }
            this.$http.post('/api/courseTable/addDetail', this.newItem).then((res)=>{
                var data = res.data;
                    if (data.code == 1) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.isShowAdd = false;
                        this.init();
                    }
                    else {
                        //alert(data.msg);
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                    }
            });
        },
        del(item) {
            this.$confirm('确定要删除吗？',{closeOnClickModal:false}).then(()=>{
                this.$http.post('/api/courseTable/delete', { id: item.id }).then((res) => {
                    var data = res.data;
                    if (data.code == 1) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.loadInfo();
                    }
                    else {
                        //alert(data.msg);
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                    }
                });
            });
        },
        isOpen(item){
           this.$confirm('你确定修改开放操作吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                if(!item.openEnrollment){
                  item.openEnrollment='否'
                }else{
                   item.openEnrollment='是'  
                }
                this.$http.post('/api/courseTable/changeOpen', { id: item.id,openEnrollment:item.openEnrollment}).then((res) => {
                    if (res.data.code == 1) {
                        this.loadInfo();
                    }
                    else {
                        this.loadInfo()
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                }); 
                item.openEnrollment=!item.openEnrollment      
            });   
        },
        classHourFn(){
            this.classHour=this.newItem.classHour
        },
        loadInfo() {
            this.aRemarks=[]
            if(!this.term.id || !this.teacher.id) {
                this.weekArray = [];
                this.canEdit = true;
                for (var index = 1; index <= 7; index++) {
                    this.weekArray.push({
                        dayOfWeek: this.$moment.weekdays()[index % 7],
                        list: []
                    });
                }    
                return;
            }
            this.$http.get('/api/teacher/getCourseDetails?termId='+ this.term.id +'&teacherId=' + this.teacher.id).then((res) => {
                this.courseTable = res.data.data.courseTable || {
                    id:null,
                    teacherId: this.teacher.id,
                    termId : this.term.id
                };
                for(let [idx,item] of res.data.data.details.entries()){
                    console.log(item)
                    let arr=[]
                    for(let [index,it] of item.list.entries()){
                        if(it.openEnrollment=='否'){
                            it.openEnrollment=false       
                        }else if(it.openEnrollment=='是'){
                            it.openEnrollment=true
                        }else{
                            it.openEnrollment=false
                        }
                        if(it.clearCourse=='否'){
                            it.clearCourse=false       
                        }else if(it.clearCourse=='是'){
                            it.clearCourse=true
                        }else{
                            it.clearCourse=false
                        }
                        if(it.course.courseDescription&&it.course.courseDescription.length>10){
                           it.course.courseDescription=it.course.courseDescription.replace(/<[^<>]+>/g,'').replace(/<\/[^<>]+>/g,'')
                           arr[index]=it.course.courseDescription.substring(0,3)+'...'
                        }else{
                         it.course.courseDescription=it.course.courseDescription.replace(/<[^<>]+>/g,'').replace(/<\/[^<>]+>/g,'')
                         arr[index]=it.course.courseDescription.replace(/<\/[^<>]+>/g)
                       }
                    }
                    this.aRemarks[idx]=arr
                }
                this.weekArray = res.data.data.details;
                this.canEdit = res.data.data.canEdit;
            });
        },
        suspendClassesFn(id, item, i, startDate = '', endDate = '') {
            this.aChangeClass = []
             this.suspendClassesForm={
                reason: '',
                suspensionDate:'',
            }
            this.level=item.level
            this.curriculum = item.courseName
            this.studentId = item.students[i].id
            this.name=item.students[i].name
            this.courseTableDetailStudentId=item.courseTableDetailStudent[i].id
            this.isSuspendClasses=true;
            this.$http.get('/api/signUpCurriculum/getWeekById?id='+id+'&startDate='+startDate+'&endDate='+endDate).then((res) => {
                  if(res.data.code==1){
                      this.weekCycle=res.data.data.aCourseItem
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
        },
        suspendClassesShowFn(id, item, i, startDate = '', endDate = '') {
               console.log(id,item,i,startDate,endDate)
               this.reason=item.courseTableDetailStudent[i].reasonsForSuspension
               this.isSuspendClassShowes=true;
               this.curriculum=item.courseName
               this.name=item.students[i].name
               this.level=item.level
               this.$http.get('/api/signUpCurriculum/getWeekById?id='+id+'&startDate='+startDate+'&endDate='+endDate).then((res) => {
                  if(res.data.code==1){
                          this.suspensionDate=JSON.parse(res.data.data.courseTableDetailStudent.courseTableItem).date   
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
        },
        suspensionBack(){
              this.isSuspendClasses=false;
        },
        getClassBerforsuspendClasses() {
            this.$http.get('/api/courseTable/getClassBerforsuspendClasses/?suspensionDateId=' + this.suspendClassesForm.suspensionDate+'&studentId='+this.studentId).then((res) => {
                if (res.data.code==1){
                    this.aChangeClass=res.data.data
                } else {
                    console.log('获取停课之前的课时出错')
                }
            })
        },
        transferTheClassBack(){
              this.aStartDate=[]
              this.isTransferTheClass=false;
              this.transferTheClassForm={
                changeCurriculumId:'',
                reason:'',
                startDate:''
              }
        },
        transferTheClassShowFn(id,item,i,startDates='',endDates=''){
          this.isTransferTheClassShow=true
          this.level=item.level
          this.number=item.number
          this.name=item.aSignUpStudent[i].name
          this.curriculum=item.courseName
          this.reason=item.courseTableDetailStudent[i].reasonsForSuspension
          this.sShiftReason=item.courseTableDetailStudent[i].shiftReasons
          let startDate=new Date(item.startDate)
          let endDate=new Date(item.endDate)
          this.currentCycle=startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+'至'+endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()+' '+item.dayOfWeek+' '+item.startTime+'~'+item.endTime
          this.$http.get('/api/courseTable/getByDetailId?id='+item.courseTableDetailStudent[i].classTransferCourseTableDetailId).then((res) => {
                  if(res.data.code==1){
                      console.log(res.data)
                     let startDate=new Date(item.courseTableDetailStudent[i].shiftStartDate.date)
                     let endDate=new Date(res.data.data.endDate)
                     this.classTransferCourseTableDetailDate=startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+'至'+endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()+' '+res.data.data.dayOfWeek+' '+res.data.data.startTime+'~'+res.data.data.endTime
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
                item.courseTableDetailStudent[i].courseTableItem=JSON.parse(item.courseTableDetailStudent[i].courseTableItem)
            this.suspensionDate = item.courseTableDetailStudent[i].courseTableItem.date
            item.courseTableDetailStudent[i].shiftStartDate=JSON.parse(item.courseTableDetailStudent[i].shiftStartDate)
            this.sShiftStartDate=item.courseTableDetailStudent[i].shiftStartDate.date

        },
        submitSuspension(formName){
                 if(!this.suspendClassesForm.suspensionDate){
                    this.$message({
                                    type: 'error',
                                    message: '请选择课程结束日期'
                                }); 
                            return    
                 }
                 if(!this.suspendClassesForm.reason){
                    this.$message({
                                    type: 'error',
                                    message: '请输入停课原因'
                                }); 
                            return    
                 }
                       this.$confirm("是否确定停课", '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                this.$http.post('/api/courseTable/suspendClasses',{id:this.courseTableDetailStudentId,courseTableItemId:this.suspendClassesForm.suspensionDate,reasonsForSuspension:this.suspendClassesForm.reason}).then((res)=>{
                                    this.isSuspendClasses=false
                                     this.init();
                                })
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消停课'
                                });          
                            });
        },
        transferTheClassFn(id,item,i){
            console.log(item)
            this.suspensionDate=JSON.parse(item.courseTableDetailStudent[i].courseTableItem).date
             this.name=item.aSignUpStudent[i].name
             this.isTransferTheClass=true
             this.number=item.number
             this.originalCourseTableDetailStudentId=item.courseTableDetailStudent[i].id
             this.studentId=item.students[i].id
             this.curriculum=item.courseName
             let startDate=new Date(item.startDate)
             let endDate=new Date(item.endDate)
             this.level=item.level
             this.currentCycle=startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+'至'+endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()+' '+item.startTime+'~'+item.endTime
             this.$http.get('/api/signUpCurriculum/getSignUpCourseOtherTime?id='+item.id).then((res) => {
                  if(res.data.code==1){
                       this.aOptions=res.data.data
                       if(this.aOptions.length==0){
                            this.transferTheClassForm.changeCurriculumId='' 
                       }
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
        },
        changeCurriculum(){
                if(!this.transferTheClassForm.changeCurriculumId){
                        return
                }
              this.$http.get('/api/courseTable/getWeekById?courseTableDetailId='+this.transferTheClassForm.changeCurriculumId).then((res) => {
                  if(res.data.code==1){
                      this.aStartDate=res.data.data
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
        },
        submitTransferTheClass(formName){
            // transferTheClassForm: {
            //     changeCurriculumId:'',
            //     reason:''
            // }
                 if(!this.transferTheClassForm.changeCurriculumId){
                     this.$message('请选择转班课程周期')
                     return
                 }
                 if(!this.transferTheClassForm.startDate){
                     this.$message('请选择课程开始日期')
                     return
                 }
                 if(!this.transferTheClassForm.reason){
                     this.$message('请输入转班原因')
                     return
                 }
                    this.$confirm('是否确定转班?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                this.$http.post('/api/courseTable/transferTheClass',{originalCourseTableDetailStudentId:this.originalCourseTableDetailStudentId,studentId:this.studentId,courseTableDetailId:this.transferTheClassForm.changeCurriculumId,reason:this.transferTheClassForm.reason,courseTableItemId:this.transferTheClassForm.startDate}).then((res)=>{
                                    if(res.data.code==1){
                                        this.isTransferTheClass=false  
                                         this.init();
                                    }else{
                                        this.$message(res.data.msg)
                                    }
                                })
                            }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });          
                            });
                   
                
        },
        clearCourse(item) {
            this.clearCourseStudentId=item.students[0].id
            this.isClearCourse=true
            this.name=item.aSignUpStudent[0].name
            this.curriculum=item.courseName
            this.startDate=item.aSignUpStudent[0].startDate==''?this.term.startDate:item.aSignUpStudent[0].startDate
            this.$http.post('/api/courseTable/getSuspension',{id:item.courseTableDetailStudent[0].id}).then((res)=>{
                    if(res.data.code==1){
                         this.endDate=res.data.data.suspensionDate.date
                         this.aClearCourese=res.data.data.aCousrTableItems
                    }else{
                        this.$message(res.data.msg)
                    }
                })
        },
        clearCourseBack(){
            this.isClearCourse=false
        },
        teacherClassHourFn(){
            this.teacherClassHour=this.newItem.teacherClassHour
        },
        submitClearCourse(formName){
            console.log(this.clearCourseForm.changeCurriculumId)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                       this.$confirm('是否确定请空日期', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                this.$http.post('/api/courseTable/clearCourse',{id:this.clearCourseForm.changeCurriculumId,studentId:this.clearCourseStudentId}).then((res)=>{
                                    this.isClearCourse=false
                                     this.init();
                                })
                            }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消清空课程'
                            });          
                            });
                   
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        changeClearCourse() {
             this.$http.get("/api/courseTable/getnLeaveLengthAndnChangeClassLengthBycourseTableItemId?courseTableItemId="+this.clearCourseForm.changeCurriculumId).then((res) => {
                 if (res.data.code==1){
                       console.log(res.data.data)
                       this.nLeaveLength=res.data.data.aLeave.length
                       this.nChangeClassLength=res.data.data.aChangeClass.length
                 } else {
                     console.log('获取清空开始日期的请假和补课后台数据出错')
                 }
             })

        }
    },
    watch: {
        term(newVal, oldVal){
            this.loadInfo();
        },
        teacher(newVal, oldVal){
            this.loadInfo();
        },
        termId(newVal, oldVal){
            console.log('ccccc');
            this.term = _.find(this.baseData.terms, { id: this.termId }) || {};
        },
        teacherId(newVal, oldVal){
            console.log('change teacher id')
            this.teacher = _.find(this.baseData.teachers, { id: this.teacherId }) || {};
        },
        newItem: {
            handler: function(newVal, oldVal){
                if(this.newItem.startTime != '' && this.newItem.duration){
                    var date = this.$moment('2017-01-01 '+ this.newItem.startTime);
                    this.newItem.endTime = date.add(this.newItem.duration, 'minutes').format('HH:mm');
                }
            },
            deep: true
        }
    },
    components:{
      suspendClasses
    }
}
</script>
<style  lang="less" scoped>
.number,.el-date-editor.time{
    width: 217px;
}
.min{
    width: 190px;
}
.el-form{
    width:900px;
}
.el-form-item .el-form-item__content{
    text-align: left;
    margin: 0 auto !important;
}
.table {
    border-collapse: collapse;
    // width: 1100px;
    margin-top: 10px;
}

.table>tr>td, .table>tbody>tr>td {
    border: 1px solid #bfcbd9;
    padding: 0;
    margin: 0;
    font-size: 13px;
    width: 160px;
    min-height: 36px;
    line-height: 36px;
    text-align: center;
}

// .table tr>td div {
//     height: 36px;
//     line-height: 36px;
// }
.day .el-form-item__content{
   font-size: 30px !important;
}
.button {
    text-align: left;
    margin: 50px 0 0 40%;
}

.input {
    width: 300px;
}

.p-hidden {
    // height: 450px;
    overflow: auto;
}

.headSpan {
    display: inline-block;
    width: 200px;
    height: 36px;
    line-height: 36px;
}
.suspendClassShow{
    text-align: left;
}
.setLeave{
        text-align: left;
        .classHour{
          width: 40px;
        }
         em{
            display:inline-block;
            padding: 3px 10px;
            font-style: normal;
            width: 40px;
            height: 36px;
            line-height: 30px;
            vertical-align: middle;
            border:1px solid #bfcbd9;
            border-radius: 4px;
            box-sizing: border-box;
          }
      }
</style>