<template>
    <div >
        <div class="p-hidden">
            <div style="position:relative;">
                <span style="position: absolute;left:100px;font-size:30px;top:20px;">周课表</span>
                <span style="width:400px">
                    {{ teacherId > 0 ? '教师姓名': '学生姓名' }}：{{ data.name }}
                </span>
                </span class="headSpan">
                <span>
                    课程周期
                </span>
                <span class="headSpan">
                    {{ data.startDate | viewDate }} 至 {{ data.endDate | viewDate }}
                </span>
                <span style="position:absolute;right:20px;">
                    <router-link class="el-button el-button--text" :to="{ name: '/courseTable/addDetail', params: { teacherId:this.$route.query.teacherId, termId:this.$route.query.termId } }">编辑报名课表</router-link> </span>
            </div>
            <div style=" text-align:center;">
                <div>
                    <el-button type="text" style="padding:10px;" @click="prevWeek()" :disabled="!canPrevWeek"><<上一周</el-button>
                    <el-button type="text" style="padding:10px;" @click="currentWeek()" >•</el-button>
                    <el-button type="text" style="padding:10px;" @click="nextWeek()" :disabled="!canNextWeek">下一周>></el-button>
                </div>

                <table cellpadding=0 cellspacing=0 border=0 class="table">
                    <tr>
                        <td colspan="15">
                            {{ weekIndex }}
                            <span>{{ currentStartDate | viewDate }}</span>~
                            <span>{{ currentEndDate | viewDate }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            星期
                        </td>
                        <td>
                            课程
                        </td>
                        <td>
                            类型
                        </td>
                        <td>
                            等级
                        </td>
                        <td>人数</td>
                        <td>时长(分钟)</td>
                        <td>
                            教室
                        </td>
                        <td>
                            开始时间
                        </td>
                        <td>
                            结束时间
                        </td>
                        <td>
                          预约学生
                        </td>
                        <td>
                            学生
                        </td>
                        <td>教师</td>
                        <td>备注</td>
                        <td>状态</td>
                        <td>
                            添加
                        </td>
    
                    </tr>
                    <tbody v-for="(day,idx) in data.list">
                        <tr>
                            <td>
                                {{ day.dayOfWeek }}({{ day.date | viewShortDate }})
                            </td>
                            <td colspan="13">
                                
                            </td>
                            <td>
                                <el-button size="mini" @click="add(day)" v-if="teacherId>0">添加</el-button>
                            </td>
                        </tr>
                        <tr v-for="(item,index) in day.list">
                            <td></td>
                            <td>
                                {{ item.courseName }}
                            </td>
                            <td>
                                {{ item.type }}
                            </td>
                             <td>
                                {{ item.level }}
                            </td>
                            <td>
                                {{ item.number }}
                            </td>
                            <td>
                                {{ item.duration }}
                            </td>
                            <td>
                                {{ item.classroomName }}
                                
                            </td>
                            <td>
                                {{ item.startTime | viewHouAndSec}}
                            </td>
                            <td>
                                {{ item.endTime | viewHouAndSec}}
                            </td>
                            <td>
                                <span v-for="it in item.aStudentName">{{it.name}}&nbsp&nbsp</span>
                            </td>
                            <td>
                                <div>
                                    <div v-for="(sss, i) in item.students">
                                        <router-link style="color: #20a0ff;" :to="{ path:'/studentInfo', query:{ studentId : sss.student.id }}">{{sss.student.name}} </router-link> <span v-if="sss.status=='正常'" style="curse:pointer">（出勤）</span> <span v-if="sss.status=='转课'" style="color: red;cursor: pointer;" @click="transferTheClassShowFn(item,i)">已转班</span><span v-if="sss.status=='停课'" @click='suspendClass(item,i)' style="color: red;cursor:pointer;">{{ sss.status=='停课'?'已'+sss.status:sss.status }}</span>&nbsp<span v-if="sss.status=='补课'"  style="color: red;">{{ sss.status }}</span>
                                        <a href="javascript:;" v-if="sss.student.switch&&sss.status=='停课'" @click="showSwitchDetail(sss.student.switch.id)" style="color:red">已请假</a>
                                        <el-button :disabled="sss.numberOfleave&&sss.numberOfleave>0?false:true"  type="text" v-if="!sss.student.switch&&day.date1==1" @click="studentChangeClass(item.id, sss.student.id)" >调课</el-button>
                                        <el-button :disabled="sss.numberOfleave&&sss.numberOfleave>0?false:true" type="text" v-if="!sss.student.switch&&day.date1==1" @click="studentLeave(item.id, sss.student.id,sss.status)">请假</el-button>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <router-link :to="{ path:'/teacherInfo', query:{ teacherId: item.teacher.id } }" style="color: #20a0ff;">{{ item.teacher.name}}</router-link>
                                <span type="text" v-if="item.students.length==1&&item.students[0].teacherStatus" style="color:red">补课</span>
                                <el-button type="text" :disabled="item.students[0].allNumberOfChangeClassForTeacher&&item.students[0].allNumberOfChangeClassForTeacher>0?false:true" @click="teacherLeave(item.id,item.students[0].student.id)" v-if="item.status != '老师请假' && item.students.length == 1 && item.number == 1&&new Date()<new Date(day.date)">调课</el-button>
                            </td>
                            <td>
                                <span v-if="item.remarks">{{ item.remarks.originalDate | viewDate}} 集体调课至 {{ item.remarks.nowDate | viewDate}}<br>原因：{{ item.remarks.iReason}}</span>
                            </td>
                            <td>
                                <span>{{item.students.length+item.aStudentName.length}}/{{item.number}}</span>
                            </td>
                            <td>
                                <div v-if="item.status != '老师请假'">
                                    <el-button type="text" @click="edit(item)">编辑</el-button>
                                    <el-button type="text" @click="del(item.id)">删除</el-button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                 <el-dialog title="停课" size="tiny" v-model="isSuspendClassShowes" :close-on-click-modal='false' label-position="left">
                      <suspend-classes :name='name'  :curriculum='curriculum' :level='level' :suspensionDate='suspensionDate' :reason='reason'></suspend-classes>
                </el-dialog>
                <el-dialog :title="title" size="tiny" v-model="isShow" :close-on-click-modal='false' @close="closeFn">
                    <div>
                        <div class='class'>
                            <div class="inlineBlock">
                                <span class="warn">*</span><strong>课程类型</strong>
                            </div>
                            <el-radio-group v-model="newItem.type" @change="classTypeFn"   v-if="title=='添加临时课程'" 
                            >
                                <el-radio class="radio"  label="预约试课">预约试课</el-radio>
                                <el-radio class="radio"  label="补课">补课</el-radio>
                                <el-radio class="radio"  label="加课">加课</el-radio>
                            </el-radio-group>
                        </div>
                        <div class='class'>
                            <div class="inlineBlock">
                                <span class="warn">*</span><strong>课程</strong>
                            </div>
                            <el-select v-model="newItem.courseName"  placeholder="请选择" :disabled="newItem.id > 0">
                                <el-option v-for="course in baseData.courses" :key="course.name" :label="course.name" :value="course.name">
                                </el-option>
                            </el-select>
                        </div>
                        <div class='class'>
                            <div class="inlineBlock">
                                <span class="warn">*</span><strong>等级</strong>
                            </div>
                            <el-select v-model="newItem.level" :disabled="newItem.id > 0">
                               <el-option v-for="level in levels" :key="level" :label="level" :value="level"></el-option>
                            </el-select>
                        </div>
                        <div class='class'>
                            <div class="inlineBlock">
                                <span class="warn">*</span><strong>人数</strong>
                            </div>
                            <el-input v-model="newItem.number"  class="number" placeholder="输入学生数量" :maxlength="10" :disabled="newItem.id>0"></el-input>
                        </div>
                        <div class='class'>
                            <div class="inlineBlock">
                                <span class="warn">*</span><strong>教室</strong>
                            </div>
                            <el-select v-model="newItem.classroomId" @change="selectClassroom" placeholder="请选择">
                                <el-option v-for="classroom in baseData.classrooms" :key="classroom.name" :label="classroom.name" :value="classroom.id"></el-option>
                            </el-select>
                        </div>
                        <div class='class'>
                            <div class="inlineBlock">
                                <span class="warn">*</span><strong>上课时间</strong>
                            </div>
                            <el-time-select v-model="newItem.startTime" class="time" :picker-options="{
                                start: '06:30',
                                step: '00:5',
                                end: '24:00'
                            }" placeholder="选择时间："  :disabled="newItem.id > 0">
                            </el-time-select>
                        </div>
                        <div class='class'>
                            <div class="inlineBlock">
                                <span class="warn">*</span><strong>时长</strong>
                            </div>
                            <el-input v-model="newItem.duration" @change='classTypeDurationFn' style="width:190px" :maxlength="10"></el-input>分钟
                        </div>
                        <div class='class'>
                            <div class="inlineBlock">
                                <span class="warn">*</span><strong>下课时间：</strong>
                            </div>
                            <span style="margin-left:44px"> {{ newItem.endTime }}</span>
                        </div>
                        <div class='class' v-show="students.length>0">
                            <div class="take-care">   
                                以下学生符合补课条件，选中可发送补课条件提醒通知：
                                <el-checkbox v-model="isSelect" @change="isSelectFn">全选</el-checkbox>
                            </div>
                            <ul class="sel-student">
                                <li v-for="(item, index) in students" :key="item.id">
                                  <el-checkbox v-model="item.isSelect" @change='eachSelectFn(item)'>{{item.name}}</el-checkbox>
                                </li>
                            </ul>
                        </div>
                        <div class='class'>
                            <el-button class='cancel' @click="isShow = false">取消</el-button>
                            <el-button type="primary" @click="saveAdd()">{{ newItem.id > 0 ? '更新': '立即创建' }}</el-button>
                        </div>
                    </div>
                    <!-- <el-form   :show-message='false'  :model="newItem" :rules="rules" >
                       <el-form-item label="课程类型：" v-if="title=='添加临时课程'" prop="type" class="suspendClassShow">
                            <el-radio-group v-model="newItem.type" @change="classTypeFn">
                                <el-radio class="radio"  label="预约试课">预约试课</el-radio>
                                <el-radio class="radio"  label="补课">补课</el-radio>
                                <el-radio class="radio"  label="加课">加课</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="课程：" prop="courseName" class="suspendClassShow">
                            <el-select v-model="newItem.courseName"  placeholder="请选择" :disabled="newItem.id > 0">
                                <el-option v-for="course in baseData.courses" :key="course.name" :label="course.name" :value="course.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="等级：" prop="level" class="suspendClassShow">
                            <el-select v-model="newItem.level" :disabled="newItem.id > 0">
                               <el-option v-for="level in levels" :key="level" :label="level" :value="level"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="人数："  prop="number" class="suspendClassShow">
                            <el-input v-model="newItem.number"  class="number" placeholder="输入学生数量" :maxlength="10" :disabled="newItem.id>0"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="教室：" prop="classroomId" class="suspendClassShow">
                            <el-select v-model="newItem.classroomId" @change="selectClassroom" placeholder="请选择">
                                <el-option v-for="classroom in baseData.classrooms" :key="classroom.name" :label="classroom.name" :value="classroom.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上课时间：" prop="startTime" class="suspendClassShow">
                            <el-time-select v-model="newItem.startTime" class="time" :picker-options="{
                                start: '06:30',
                                step: '00:5',
                                end: '24:00'
                            }" placeholder="选择时间："  :disabled="newItem.id > 0">
                            </el-time-select>
                        </el-form-item>
                        <el-form-item label="时长：" prop="duration" class="suspendClassShow">
                            <el-input v-model="newItem.duration" @change='classTypeDurationFn' style="width:190px" :maxlength="10"></el-input>分钟
                        </el-form-item>
                        <el-form-item label="下课时间：" style="text-align:left" prop="endTime" class="suspendClassShow">
                           <span style="margin-left:44px"> {{ newItem.endTime }}</span>
                        </el-form-item>
                        <el-form-item class="suspendClassShow"> 
                            <div>以下学生符合补课条件，选中可发送补课条件提醒通知：<el-checkbox v-model="isSelect">全选</el-checkbox></div>
                            <ul><li></li></ul>
                        </el-form-item>
                        <el-form-item class="suspendClassShow"> 
                            <el-button @click="isShow = false">取消</el-button>
                            <el-button type="primary" @click="saveAdd()">{{ newItem.id > 0 ? '更新': '立即创建' }}</el-button>
                        </el-form-item>
                    </el-form> -->
                </el-dialog>
                <el-dialog title="教师调课" size="tiny" v-model="showSwitch" :close-on-click-modal='false'>
                    <course-table-switch :id="switchCourseId" :nStudentId="nStudentId" @cancel="cancel" @success="init"></course-table-switch>
                </el-dialog>
                <el-dialog title="学生调课" size="tiny" v-model="showStudentSwitch" :close-on-click-modal='false' v-if="showStudentSwitch">
                    <course-table-switch-for-student :id="switchCourseId" :studentId="currentStudentId" @cancel="cancel" @success="init"></course-table-switch-for-student>
                </el-dialog>
                <el-dialog title="学生请假" size="tiny" v-model="showStudentLeave" :close-on-click-modal='false' v-if="showStudentLeave">
                    <course-table-leave-for-student :id="switchCourseId" :teacherId='teacherId' :studentId="currentStudentId" :sStatus="sStatus" @cancel="cancel" @success="init"></course-table-leave-for-student>
                </el-dialog>
                <el-dialog title="调课详情" size="tiny" v-model="isShowSwitchDetail" :close-on-click-modal='false'>
                    <course-table-switch-detail :id="switchId"></course-table-switch-detail>
                </el-dialog>
                <el-dialog title="转班" size="tiny" v-model="isTransferTheClassShow" :close-on-click-modal='false' >
                       <el-form  label-width="200px" class="demo-ruleForm">
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
                                {{suspensionDate | viewDate}}
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
            </div>
        </div>
    </div>
</template>
<script>
import CourseTableSwitch from './CourseTableSwitch';
import CourseTableSwitchDetail from  './CourseTableSwitchDetail';
import CourseTableSwitchForStudent from  './CourseTableSwitchForStudent';
import CourseTableLeaveForStudent from  './CourseTableLeaveForStudent';
import suspendClasses from './suspendClasses'
export default {
    name: 'course-table-item',
    props: {
        teacherId : Number, 
        termId: Number,
        studentId: Number
    },
    data() {
        return {
            baseData: {
                courses: [], teachers: [], classrooms: [],
            },
            currentStartDate:null,
            currentEndDate:null,
            defaultDate: null,
            data:{},
            weekArray: [],
            canEdit: true,
            isShow:false,
            showSwitch: false,
            showStudentSwitch: false,
            isSuspendClassShowes:false,
            newItem:{
                id: 0,
                termId: this.termId,
                teacherId: this.teacherId,
                date:null,
                courseName:'',
                classroomId:'',
                startTime: '',
                endTime: '',
                level:'',
                number:'',
                duration:'',
                type:''
            },
             rules: {
                type: [
                    { required: true, message: '课程类型不能为空',trigger: 'blur' },
                ],
                level: [
                    { required: true, message: '等级不能为空' ,trigger: 'blur'},
                ],
                courseName: [
                     { required: true, message: '课程名不能为空',trigger: 'blur' },
                ],
                number: [
                     { required: true, message: '人数不能为空',trigger: 'blur' },
                ],
                classroomId: [
                     { required: true, message: '教室不能为空',trigger: 'blur' },
                ],
                startTime: [
                    { required: true, message: '上课时间不能为空',trigger: 'blur' },
                ],
                duration: [
                    { required: true, message: '时长不能为空' ,trigger: 'blur'},
                ]
            },
            levels:['无等级', 'A','B','C','D'],
            switchCourseId:0,
            currentStudentId:0,
            switchId:0,
            isShowSwitchDetail:false,
            name:'',
            curriculum:'',
            suspensionDate:'',
            reason:'',
            level:'',
            isTransferTheClassShow:false,
            currentCycle:'',
            classTransferCourseTableDetailDate:'',
            sShiftReason:'',
            sShiftStartDate:'',
            showStudentLeave:false,
            sStatus: '',
            nStudentId:'',
            title:'添加临时课程',
            students:[],
            isSelect:true
        }
    },
    computed: {
        canPrevWeek:function(){
            return this.data.startDate &&
                this.currentStartDate >= this.$moment(this.data.startDate);
                //this.currentStartDate.format('YYYY-MM-DD') != moment(this.courseTable.startDate).format('YYYY-MM-DD');
        },
        canNextWeek: function(){
            return this.data.startDate &&
                this.currentEndDate <= this.$moment(this.data.endDate);
        },
        weekIndex: function(){
            var index = this.$moment.getWeekIndex(this.data.startDate, this.data.endDate, 
                this.$moment(this.currentStartDate));
                return '第'+index+'周';
        }
    },
    created() {
        this.$http.get('/api/courseTable/getBaseData').then((res) => {
            this.baseData = res.data;
        });
        this.currentStartDate = this.$moment().weekday(0);
        this.currentEndDate = this.$moment(this.currentStartDate).weekday(6);
        this.init();
    },
    methods: {
        init() {
            this.showSwitch = false;
            this.showStudentSwitch = false;
            this.showStudentLeave=false;
            this.loadInfo();
        },
        btnBack() {
            this.$emit('cancel');
        },
        showOption(idx, index, obj) {
            this.idx = idx  
            this.index = index
        },
        add(item) {
            this.title='添加临时课程'
            this.newItem = {
                id: 0,
                termId: this.termId,
                teacherId: this.teacherId,
                date:this.$moment(item.date),
                courseName:'',
                classroomId:'',
                startTime: '',
                endTime: '',
                level:'',
                number:'',
                duration:'',
                type:''
            };
            this.isShow = true;
        },
        edit(item){
            //this.newItem.id = item.id;
            this.title='编辑本周课程'
            Object.assign(this.newItem, item);
            this.isShow = true;
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
                                type: 'warning',
                                closeOnClickModal:false
                                }).then(() => {
                                
                                }).catch(() => {
                                   this.newItem.classroomId=""     
                                });
                    }
                }
            }
        },
        saveAdd(){
            if(!this.newItem.type){
              this.$message('课程类型不能为空')
               return
            }else if(!this.newItem.courseName){
               this.$message('课程名不为空')
               return
            }else if(!this.newItem.number){
               this.$message('人数不能为空')
               return
            }else if(!this.newItem.classroomId){
               this.$message('教室不能为空')
               return
            }else if(!this.newItem.startTime){
               this.$message('上课时间不能为空')
               return
            }else if(!this.newItem.duration){
               this.$message('时长不能为空')
               return
            }
            if(this.students.length>0){
                this.newItem.students = this.students
            }
            this.$http.post('/api/courseTable/addItem', this.newItem).then((res) => {
                var data = res.data;
                if(data.code == 1){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.isShow = false;
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
        },
        currentWeek() {
            this.currentStartDate = this.defaultDate;  //this.$moment().weekday(0);
        },
        nextWeek() {
            this.currentStartDate = this.$moment(this.currentStartDate).weekday(7);
            console.log('nextWeek');
        },
        prevWeek() {
            this.currentStartDate = this.$moment(this.currentStartDate).weekday(-7);
        },
        select(key, keypath) {
            //this.courseTable.teachrId = key;
            // for (var i = 0; i < this.baseData.teachers.length; i++) {
            //   var teacher = this.teacherArray[i];
            //   if (teacher.wxId == key) {
            //     this.teacherValue =teacher.teacherName
            //   }
            // }
        },
        suspendClass(sss,i){
              this.isSuspendClassShowes=true
              this.$http.get('/api/courseTable/getSuspendClassByStudentIdAndCourseTableDetailId', { 
                    params:{
                        studentId: sss.students[i].student.id, 
                        courseTableDetailId: sss.courseTableDetailId
                    }}).then((res) => {
                   if(res.data.code==1){
                       console.log(res.data.data)
                       this.name=sss.students[i].student.name
                       this.curriculum=sss.courseName
                       this.suspensionDate=JSON.parse(res.data.data.courseTableDetailStudent.courseTableItem).date
                       this.reason=res.data.data.courseTableDetailStudent.reasonsForSuspension
                       this.level=JSON.parse(res.data.data.courseTableDetailStudent.courseTableItem).level
                   }
                 }); 
        },
        transferTheClassShowFn(sss,i){
          console.log(sss,i,sss.students[i].courseTableItemStudent)
          this.isTransferTheClassShow=true
          this.level=sss.students[i].courseTableDetail.level
          this.name=sss.students[i].student.name
          this.curriculum=sss.students[i].courseTableDetail.courseName
          this.reason=sss.students[i].courseTableItemStudent.reasonsForSuspension
          this.sShiftReason=sss.students[i].courseTableItemStudent.shiftReasons
          let startDate=new Date(sss.students[i].courseTableDetail.startDate)
          let endDate=new Date(sss.students[i].courseTableDetail.endDate)
          this.currentCycle=startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+'至'+endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()+' '+sss.students[i].courseTableDetail.dayOfWeek+' '+sss.students[i].courseTableDetail.startTime+'~'+sss.students[i].courseTableDetail.endTime
        //   suspensionDate
          this.$http.get('/api/courseTable/getByDetailId?id='+sss.students[i].courseTableItemStudent.classTransferCourseTableDetailId).then((res) => {
                  if(res.data.code==1){
                     let startDate=new Date(sss.students[i].courseTableItemStudent.shiftStartDate.date)
                     let endDate=new Date(res.data.data.endDate)
                     this.classTransferCourseTableDetailDate=startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+'至'+endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()+' '+res.data.data.dayOfWeek+' '+res.data.data.startTime+'~'+res.data.data.endTime
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
                sss.students[i].courseTableItemStudent.courseTableItem=JSON.parse(sss.students[i].courseTableItemStudent.courseTableItem)
                this.suspensionDate=sss.students[i].courseTableItemStudent.courseTableItem.date
                sss.students[i].courseTableItemStudent.shiftStartDate=JSON.parse(sss.students[i].courseTableItemStudent.shiftStartDate)
                this.sShiftStartDate=sss.students[i].courseTableItemStudent.shiftStartDate.date
        },
        loadInfo() {
            if(this.teacherId > 0){
                this.$http.get('/api/courseTable/getWeekItems', { 
                    params:{
                        teacherId: this.teacherId, 
                        termId: this.termId,
                        startDate: this.currentStartDate.format('YYYY-MM-DD')
                    }}).then((res) => {
                        for(let i=0;i<res.data.list.length;i++){
                           let date=new Date()
                           date.setDate(date.getDate()+2)
                           if(new Date(res.data.list[i].date).getTime()>date.getTime()){
                             res.data.list[i].date1=1
                           }else{
                             res.data.list[i].date1=0
                           }
                        }
                        
                    this.data = res.data
                    this.weekArray = res.data.list
                    if(this.defaultDate == null){
                        //console.log(this.$moment() >= this.$moment(this.data.startDate), this.$moment() <= this.data.endDate);
                        if(this.$moment() >= this.$moment(this.data.startDate) && this.$moment() <= this.$moment(this.data.endDate)){
                            this.defaultDate = this.$moment().weekday(0)
                        }
                        else{
                            this.defaultDate = this.$moment(this.data.startDate)
                            this.currentStartDate = this.defaultDate.weekday(0)
                        }
                    }
                });
            }
            else{
                this.$http.get('/api/courseTable/getWeekItemsForStudent', { 
                    params:{
                        studentId: this.studentId, 
                        termId: this.termId,
                        startDate: this.currentStartDate.format('YYYY-MM-DD')
                    }}).then((res) => {
                        if(this.weekIndex=="第-1周"){
                           this.currentStartDate = this.$moment(res.data.startDate).weekday(0);
                           this.currentEndDate = this.$moment(this.currentStartDate).weekday(6);
                        }
                        console.log(res.data)
                        this.data = res.data;
                        this.weekArray = res.data.list;
                });
            }
        },
        teacherLeave(id, nStudentId) {
            console.log(nStudentId)
            this.nStudentId=nStudentId
            this.switchCourseId = id;
            this.showSwitch = true;
        },
        studentLeave(id, studentId,status){
            this.sStatus=status
            this.switchCourseId = id;
            this.currentStudentId = studentId;
            this.showStudentLeave=true
        },
        studentChangeClass(id, studentId){
            this.switchCourseId = id;
            this.currentStudentId = studentId;
            this.showStudentSwitch = true;
        },
        //课程类型的改变
        classTypeFn(type){
            this.students = [];
            this.isSelect = true;
            //如果其他输入框没填，
            if(!this.newItem.type){
                return
            }else if(!this.newItem.courseName){
                return
            }else if(!this.newItem.number){
                return
            }else if(!this.newItem.classroomId){
                return
            }else if(!this.newItem.startTime){
                return
            }else if(!this.newItem.duration){
                return
            }
            //如果选中补课并且输入框都填写执行
            this.classTypeDurationFn()
        },
        //课程类型时长改变
        classTypeDurationFn(){
            if(this.newItem.type!=='补课'){
               return
            }
            //如果其他输入框没填，给出提示
            if(!this.newItem.type){
                this.$message('课程类型不能为空')
                return
            }else if(!this.newItem.courseName){
                this.$message('课程名不为空')
                return
            }else if(!this.newItem.number){
                this.$message('人数不能为空')
                return
            }else if(!this.newItem.classroomId){
                this.$message('教室不能为空')
                return
            }else if(!this.newItem.startTime){
                this.$message('上课时间不能为空')
                return
            }else if(!this.newItem.duration){
                this.$message('时长不能为空')
                return
            }
            this.$http.post('/api/courseTable/getMakeUpStudents',this.newItem).then((res)=>{
                    if (res.data.code==1) {
                        for (let item of res.data.data) {
                            if (this.isSelect) {
                                item.isSelect = true
                            }
                        }
                        this.students = res.data.data 
                    }
            }).catch( (error) => {
                alert('学生数据出错'+error.response.data);
            });
        },
        //发送模板消息全选
        isSelectFn(){
            for(let item of this.students){
                item.isSelect=this.isSelect;
            }
        },
        //学生的模板消息的选择
        eachSelectFn(){
            for(let item of this.students){
                if(!item.isSelect){
                    this.isSelect=false
                    break
                }
                this.isSelect=true
            }
        },
        //课程类型弹框关闭
        closeFn(){
            this.students = [];
            this.isSelect = true
        },
        del(id){
            this.$confirm('确定要删除吗？',{ closeOnClickModal:false}).then(()=>{
                this.$http.post('/api/courseTable/deleteItem', { id: id }).then((res) => {
                    var data = res.data;
                    if  (data.code == 1) {
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
        cancel(){
            //this.switchCourseId = id;
            this.showSwitch = false;
            this.showStudentSwitch = false;
            this.showStudentLeave = false;
        },
        showSwitchDetail(id){
            this.switchId = id;
            this.isShowSwitchDetail = true;
        }
    },
    watch: {
        currentStartDate(newVal, oldVal) {
            this.currentEndDate = this.$moment(this.currentStartDate).day(7);
            // console.log(this.$moment.getWeekIndex(this.data.startDate, this.data.endDate, 
            //     this.$moment(this.currentStartDate)));
            this.weekArray = [];
            this.loadInfo();
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
        CourseTableSwitch,
        CourseTableSwitchDetail,
        'course-table-switch-for-student': CourseTableSwitchForStudent,
        suspendClasses,
        CourseTableLeaveForStudent
    }
    
}
</script>
<style  lang="less" scoped>
.number ,.el-date-editor.time{
    width: 217px;
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
    height: 36px;
    width: auto;
    line-height: 36px;
    text-align: center;
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
.class{
    text-align: left;
    margin-top:10px;
}
.warn{
    left: 0;
    margin-left: 100px;
}
.inlineBlock{
    display: inline-block;
    width: 200px;
    strong{
        margin-left:10px;
    }
}
.take-care{
    margin-left:80px;
}
.sel-student{
    overflow:hidden;
    margin:auto;
    padding:0;
    width:480px;
    li{
        float:left;
        list-style:none;
        width:120px;
        text-align:center;
        margin-top:20px;
    }
}
.cancel{
    margin-left:220px;
}

</style>