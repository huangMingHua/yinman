<template>
  <div class="body">
    <div class="header">
      <div class='teacher'>
        <span>教师：</span>
        <span>{{teacher}}</span>
      </div>
      <div class="term">
        <span>学期名称：</span>
        <el-select v-model="term"  @change="termFn"  placeholder="请选择">
          <el-option
            :no-match-text='term'
            v-for="item in terms"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span class="termStartEnd">学期起止：</span>
        <em style="font-style:normal">{{termStartDate}} 至 {{termEndDate}}</em>
        <a><router-link  :to="{ name: '/courseTable/addDetail', params: { teacherId: $route.query.teacherId } }" class='el-button--text'>为他排课</router-link>
        </a>
      </div>
    </div>
    <div class="week">
        <el-button type="text" style="padding:10px;color:white;" @click="prevWeek()" :disabled="!canPrevWeek"><<上一周</el-button>
          <em>
        {{ weekIndex }}
              <span>{{ currentStartDate | viewDate }}</span>~
              <span>{{ currentEndDate | viewDate }}</span>
          </em>
        <!-- <el-button type="text" style="padding:10px;" @click="currentWeek()" >•</el-button> -->
        <el-button type="text" style="padding:10px;color:white;" @click="nextWeek()" :disabled="!canNextWeek">下一周>></el-button>
    </div>
    
    <table  border='1'>
      <thead>
        <tr>
          <td width="9%">时间</td>
          <td width="13%">星期一</td>
          <td width="13%">星期二</td>
          <td width="13%">星期三</td>
          <td width="13%">星期四</td>
          <td width="13%">星期五</td>
          <td width="13%">星期六</td>
          <td width="13%">星期日</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item,index in aMinute" :class="(index+1)%12===0 ? 'bold' : ''">
          <td :rowspan="interval" v-if="index%interval===0" class="bold">{{item[0].date}}</td>
          <td @click="item[0].day === 0 ? '' : addCourse(0, item[0].date)" @mousemove="item[0].id?modifyCourse(0, item[0].date, item[0].id, $event):''" @mouseleave="item[0].id?noModifyCourse(0, item[0].date, item[0].id, $event):''" :rowspan="item[0].day === 0? item[0].interval : 1" v-if="item[0].isShow"
          :style="{'background-color':item[0].day === 0 && item[0].isShow ? item[0].color : null,'color':'white'}">
              <img v-if="item[0].type=='补课'" :src="makeUpPic"/> <img v-if="item[0].type=='预约试课'" :src="bookingCoursePic"/><img v-if="item[0].type=='正式课程'" :src="termClassPic"/><img v-if="item[0].type=='课时课'" :src="classTimePic"/>{{item[0].class}}<span v-if="item[0].class">({{item[0].contrast}})</span>
          </td>
          <td @click="item[1].day === 1 ? '' : addCourse(1, item[1].date)" @mousemove="item[1].id ?modifyCourse(1, item[1].date, item[1].id, $event):''" @mouseleave="item[1].id?noModifyCourse(1, item[1].date, item[1].id, $event):''" :rowspan="item[1].day === 1 ? item[1].interval : 1" v-if="item[1].isShow"
          :style="{'background-color':item[1].day === 1&& item[1].isShow ? item[1].color:null,'color':'white'}">
              <img v-if="item[1].type=='补课'" :src="makeUpPic"/> <img v-if="item[1].type=='预约试课'" :src="bookingCoursePic"/><img v-if="item[1].type=='正式课程'" :src="termClassPic"/><img v-if="item[1].type=='课时课'" :src="classTimePic"/>{{item[1].class}}<span v-if="item[1].class">({{item[1].contrast}})</span>
          </td>
          <td @click="item[2].day === 2 ? '' : addCourse(2,item[2].date)" @mousemove="item[2].id?modifyCourse(2, item[2].date, item[2].id, $event):''" @mouseleave="item[2].id?noModifyCourse(2, item[2].date, item[2].id, $event):''" :rowspan="item[2].day === 2 ? item[2].interval : 1" v-if="item[2].isShow"
          :style="{'background-color' : item[2].day === 2 && item[2].isShow ? item[2].color:null,'color':'white'}">
              <img v-if="item[2].type=='补课'" :src="makeUpPic"/> <img v-if="item[2].type=='预约试课'" :src="bookingCoursePic"/><img v-if="item[2].type=='正式课程'" :src="termClassPic"/><img v-if="item[2].type=='课时课'" :src="classTimePic"/>{{item[2].class}}<span v-if="item[2].class">({{item[2].contrast}})</span>
          </td>
          <td @click="item[3].day === 3 ? '' : addCourse(3, item[3].date)" @mousemove="item[3].id?modifyCourse(3, item[3].date, item[3].id, $event):''" @mouseleave="item[3].id?noModifyCourse(3, item[3].date, item[3].id, $event):''" :rowspan="item[3].day===3?item[3].interval:1" v-if="item[3].isShow"
          :style="{'background-color' : item[3].day === 3 && item[3].isShow ? item[3].color:null,'color':'white'}">
              <img v-if="item[3].type=='补课'" :src="makeUpPic"/> <img v-if="item[3].type=='预约试课'" :src="bookingCoursePic"/><img v-if="item[3].type=='正式课程'" :src="termClassPic"/><img v-if="item[3].type=='课时课'" :src="classTimePic"/>{{item[3].class}}<span v-if="item[3].class">({{item[3].contrast}})</span>
          </td>
          <td @click="item[4].day === 4 ? '' : addCourse(4, item[4].date)" @mousemove="item[4].id ?modifyCourse(4, item[4].date, item[4].id, $event):''" @mouseleave="item[4].id?noModifyCourse(4, item[4].date, item[4].id, $event):''" :rowspan="item[4].day === 4 ? item[4].interval : 1" v-if="item[4].isShow"
          :style="{'background-color':item[4].day === 4 && item[4].isShow ? item[4].color : null,'color':'white'}">
              <img v-if="item[4].type=='补课'" :src="makeUpPic"/> <img v-if="item[4].type=='预约试课'" :src="bookingCoursePic"/><img v-if="item[4].type=='正式课程'" :src="termClassPic"/><img v-if="item[4].type=='课时课'" :src="classTimePic"/>{{item[4].class}}<span v-if="item[4].class">({{item[4].contrast}})</span>
          </td>
          <td @click="item[5].day === 5 ? '' : addCourse(5, item[5].date)" @mousemove="item[5].id ? modifyCourse(5, item[5].date, item[5].id, $event):''" @mouseleave="item[5].id ? noModifyCourse(5, item[5].date, item[5].id, $event):''" :rowspan="item[5].day === 5 ? item[5].interval : 1" v-if="item[5].isShow"
          :style="{'background-color':item[5].day === 5 && item[5].isShow ? item[5].color : null,'color':'white'}">
              <img v-if="item[5].type=='补课'" :src="makeUpPic"/> <img v-if="item[5].type=='预约试课'" :src="bookingCoursePic"/><img v-if="item[5].type=='正式课程'" :src="termClassPic"/><img v-if="item[5].type=='课时课'" :src="classTimePic"/>{{item[5].class}}<span v-if="item[5].class">({{item[5].contrast}})</span>
          </td>
          <td @click="item[6].day === 6 ? '' : addCourse(6, item[6].date)" @mousemove="item[6].id ? modifyCourse(6, item[6].date, item[6].id, $event):''" @mouseleave="item[6].id ? noModifyCourse(6, item[6].date, item[6].id, $event):''" :rowspan="item[6].day === 6 ? item[6].interval : 1" v-if="item[6].isShow"
          :style="{'background-color' : item[6].day === 6 && item[6].isShow ?  item[6].color : null,'color':'white'}">
             <img v-if="item[6].type=='补课'" :src="makeUpPic"/> <img v-if="item[6].type=='预约试课'" :src="bookingCoursePic"/><img v-if="item[6].type=='正式课程'" :src="termClassPic"/><img v-if="item[6].type=='课时课'" :src="classTimePic"/>{{item[6].class}}<span v-if="item[6].class">({{item[6].contrast}})</span>
          </td>
        </tr>
      </tbody>
    </table>
    <el-dialog
      :title="this.title"
      :visible.sync="isEdit"
      size="tiny"
      >
      <course-table-item-edit ref = "Edit" :id="details.id" @cancelEmit="cancelEmit"></course-table-item-edit>
      <div>
        <el-button @click="cancelEmit">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="this.title"
      :visible.sync="isAdd"
      size="tiny"
      >
      <course-table-item-add ref = "Add" :termId='termId1'  :date='date' @cancelAdd="cancelAdd" :startTime="startTime" :teacherId='teacherId' @addCourseSuccess="addCourseSuccess"></course-table-item-add>
      <div>
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
    <div id="detail" ref="detail" @mousemove="show" @mouseleave="noShow">
        <div class="detail-title">{{details.courseName}}</div>
        <div class="detail-body">
          <div class="detail-body-title">
            课程信息
          </div>
          <div class="detail-body-row">
            <span>课程类型：</span>
            <strong>{{details.type}}</strong>
          </div>
          <div class="detail-body-row">
            <span>出勤/满员人数：</span>
            <strong>{{details.number}}</strong>
          </div>
          <div class="detail-body-row">
            <span>班级：</span>
            <strong>{{details.classroomName}}</strong>
          </div>
          <div class="detail-body-row">
            <span>等级：</span>
            <strong>{{details.level.name}}</strong>
          </div>
          <div class="detail-body-row">
            <span>上课时间：</span>
            <strong>{{details.startTime}}</strong>
          </div>
          <div class="detail-body-row">
            <span>下课时间：</span>
            <strong>{{details.endTime}}</strong>
          </div>
          <div class="detail-body-row">
            <div  v-if="details.students.length>0">
              <el-button type="primary" class="switch" @click="changeClassFn(details.id)" v-if="details.type!=='课时课'">教师申请调课</el-button>
              <el-button @click="classTimeLeaveFn(details.id)" type="primary" class="switch" v-else>请假</el-button>
              <a href="javascript:;" v-if="details.type!=='课时课'" @click="leaveAndMakeUpRecordForTeacherFn(details.id,details.teacherId)">教师调课记录</a>
            </div>
          </div>
        </div>
        <div class="students">
          <div class="students-title">
            学生信息
          </div>
          <table>
            <tr v-for="item,index of details.students"><td>{{index+1}}</td><td>{{item.name}}</td><td><a href="javascript:;" v-if="details.type!=='课时课'" @click="leaveAndMakeUpRecordFn(details.id,item.id)">请假补课记录</a><a href="javascript:;" v-else @click="classTimeleaveAndMakeUpRecordFn(details.id,item.id)">请假记录</a></td></tr>
          </table>
        </div>
        <div class="btns">
          <el-button @click="del">删除</el-button>
          <el-button @click="editCourse" type="primary">编辑</el-button>
        </div>
    </div>
    <el-dialog title="教师调课记录"   :visible.sync="isLeaveAndMakeUpRecordForTeacher" :close-on-click-modal='false'  label-position="left">
      <leave-and-make-up-record-for-teacher  :courseTableItemId="courseTableItemId" :teacherId="teacherId"></leave-and-make-up-record-for-teacher> 
    </el-dialog>
    <el-dialog
      title="教师调课"
      :visible.sync="isChangeClass"
      size="tiny"
      @close="changeClassCancelFn"
      >
      <course-table-switch-item-for-teacher ref = "changeClass" @changeClassCancelFn="changeClassCancelFn" :changeClassId="changeClassId">
      </course-table-switch-item-for-teacher>
      <div>
        <el-button @click="changeClassCancelFn(1)">取 消</el-button>
        <el-button type="primary" @click="submitChangeClass">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="教师请假"
      :visible.sync="isClassTimeLeave"
      size="tiny"
      @close="cancelLeaveFn"
      >
      <course-table-leave-item-for-teacher ref = "changeClass" @classTimeLeaveCancelFn="classTimeLeaveCancelFn" :changeClassId="changeClassId">
      </course-table-leave-item-for-teacher>
      <div>
        <el-button @click="cancelLeaveFn">取 消</el-button>
        <el-button type="primary" @click="submitChangeClass">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请假补课记录"   :visible.sync="isLeaveAndMakeUpRecord" :close-on-click-modal='false'  label-position="left">
      <leave-and-make-up-record  :courseTableItemId="courseTableItemId" :studentId="studentId"></leave-and-make-up-record> 
    </el-dialog>
    <el-dialog title="请假记录"   :visible.sync="isClassTimeLeaveAndMakeUpRecord" :close-on-click-modal='false'  label-position="left">
      <class-time-leave-record  :courseTableItemId="courseTableItemId" :studentId="studentId"></class-time-leave-record> 
    </el-dialog>
  </div>
</template>
<script>
import classTimeLeaveRecord from '../studentInfo/classTimeLeaveRecord1';
import CourseTableItemEdit from './CourseTableItemEdit';
import CourseTableItemAdd from './CourseTableItemAdd';
import classTimePic from '@/assets/images/classTime.png';
import bookingCoursePic from '@/assets/images/bookingCourse.png';
import makeUpPic from '@/assets/images/makeUp.png';
import termClassPic from '@/assets/images/termClass.png';
import leaveAndMakeUpRecord from '../studentInfo/leaveAndMakeUpRecord1'
import leaveAndMakeUpRecordForTeacher from '../studentInfo/leaveAndMakeUpRecordForTeacher1'
import CourseTableSwitchItemForTeacher from './CourseTableSwitchItemForTeacher';
import CourseTableLeaveItemForTeacher from './CourseTableLeaveItemForTeacher';
export default {
  name: 'course-table-add-detail',
  props: {
    termId: Number,
    teacherId: Number
  },
  data() {
    return {
      classTimePic:classTimePic,
      termClassPic:termClassPic,
      bookingCoursePic:bookingCoursePic,
      makeUpPic:makeUpPic,
      aMinute: [],
      interval: 12,
      term: '',
      terms:[],
      termData: '',
      termStartDate: '2018-1-1',
      termEndDate: '2018-1-1',
      teacher: '',
      teacherName: '',
      currentStartDate: '',
      currentEndDate: '',
      dialogVisible: false,
      title: '创建课程',
      day: '',
      isAdd: false,
      isChangeClass: false,
      changeClassId: 0,
      startTime: '',
      signUpTime: [],
      isEdit: false,
      data:{},
      studentId:'',
      courseTableDetailId:'',
      courseTableItemId:'',
      details:{
        id: 0,
        courseCycle: '',
        courseName: '',
        number: 0,
        classroomName:'',
        level: '',
        startTime: '',
        endTime: '',
        students:[]
      },
      termId1: 0,
      date:'',
      timer: null,
      isLeaveAndMakeUpRecord:false,
      isClassTimeLeave:false,
      isLeaveAndMakeUpRecordForTeacher:false,
      isClassTimeLeaveAndMakeUpRecord:false,
      href:`#/courseTable/addDetail`,
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
            ]
       
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
  computed: {
    canPrevWeek:function(){
      return this.data.startDate &&
        this.currentStartDate >= this.$moment(this.data.startDate);
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
  methods: {
    calculationDifference(){
      let newSignUpTime = []
      this.aMinute = []
      //老师报名的课将小时改为时间戳
      for (let i = 0;i < this.signUpTime.length; i++) {
        let startDate = '2018-1-1 '+this.signUpTime[i].startTime;
        let endDate = '2018-1-1 '+this.signUpTime[i].endTime;
        let lattice = 5;
        let startTime=new Date(startDate).getTime()
        let endTime=new Date(endDate).getTime()
        console.log(this.signUpTime[i].contrast,1111);
        newSignUpTime.push({
          interval: this.totalLatticeFn(startDate,endDate,lattice),
          startTime,
          endTime,
          contrast : this.signUpTime[i].contrast,
          type:this.signUpTime[i].type,
          id: this.signUpTime[i].id,
          day: this.signUpTime[i].day,
          color: this.signUpTime[i].color,
          class: this.signUpTime[i].class
        })
      }
      //计算时差 画出显示图效果
      let startDate = '2018-1-1 7:00'
      let endDate = '2018-1-1 21:00'
      let lattice = 5
      let newDate=new Date(startDate)
      for(let i = 0;i < (this.totalLatticeFn(startDate,endDate,lattice)+1);i++){
        let date = this.zerofill(newDate.getHours())+':'+this.zerofill(newDate.getMinutes())
        let time = new Date('2018-1-1 '+date).getTime()
        this.aMinute.push(this.eachSeaven(time,newSignUpTime,date))
        newDate.setMinutes(newDate.getMinutes()+lattice)　
      }
    },
    //每行7个
    eachSeaven(time,newSignUpTime,date){
      let datas=[]
      for(let i = 0;i < 7; i++){
        datas.push({
          isShow: true,
          class: '',
          color: '#999',
          day: -1,
          interval: 1,
          date
        })
      }
      for (let j = 0;j < newSignUpTime.length; j++) {
        //时间重叠开始画画第一个画出并且合并
        if (time === newSignUpTime[j].startTime) {
          console.log( newSignUpTime[j].contrast)
          datas[newSignUpTime[j].day].id = newSignUpTime[j].id;
          datas[newSignUpTime[j].day].contrast = newSignUpTime[j].contrast;
          datas[newSignUpTime[j].day].color = newSignUpTime[j].color;
          datas[newSignUpTime[j].day].type = newSignUpTime[j].type;
          datas[newSignUpTime[j].day].class = newSignUpTime[j].class;
          datas[newSignUpTime[j].day].day = newSignUpTime[j].day;
          datas[newSignUpTime[j].day].interval = newSignUpTime[j].interval;
        }else if(time>newSignUpTime[j].startTime&&time<newSignUpTime[j].endTime){
          //在这时间内由于第一个画出并且合并其他都消失
          datas[newSignUpTime[j].day].isShow = false;
          datas[newSignUpTime[j].day].day = newSignUpTime[j].day;
        }
      }
      return datas
    },
    modifyCourse(index, startTime, id, e){
      let num = 1;
      let dom=e.currentTarget;
      //获取这个模板到左边的距离
      let templateLeft = 0;
      //获取这个模板到上边的距离
      let templateTop = 0;
      //获取节点到父级的距离直到body结束
      while (num) {
        if (dom.tagName==='BODY') {
          num = 0;
        } else {
          templateLeft += dom.offsetLeft;
          templateTop += dom.offsetTop;
          //修改节点
          dom = dom.offsetParent
        }
      }
      let detailPosition={
        top: 0,
        left: 0
      }
      //屏幕的宽度和高度
      let documentWidth = document.documentElement.offsetWidth;
      let documentHeight = document.documentElement.offsetWidth;
      //如果弹框超过了屏幕的高度就在节点上面显示不超过就在下面显示
      if ( templateTop+e.currentTarget.offsetHeight>documentHeight ) {
        detailPosition.top = templateTop+'px';
      }else{
        detailPosition.top = templateTop+e.currentTarget.offsetHeight+'px';
      }
      //同上
      if ( templateLeft + e.currentTarget.offsetWidth+this.$refs.detail.offsetWidth > documentWidth ) {
        detailPosition.left = documentWidth-this.$refs.detail.offsetWidth-e.currentTarget.offsetWidth +'px';
      }else{
        detailPosition.left = templateLeft+e.currentTarget.offsetWidth+'px';
      }
      //算出弹框的距离
      this.$refs.detail.style.left = detailPosition.left;
      this.$refs.detail.style.top = detailPosition.top;
      this.$refs.detail.style.display = "block";
      this.$http.get(`/api/courseTable/getByDetailItemId?id=${id}`).then((res)=>{
        console.log(res)
        if (typeof res==='object'&&res.data.code) {
          let {date, course, number, classroom, level,students, type,startTime, endTime, teacherId,duration,id} = res.data.data
          this.details={
            courseName: course.name,
            number,
            id,
            students,
            duration,
            classroomName: classroom.name,
            level: this.levels[level-1],
            teacherId,
            type,
            startTime,
            endTime
          }
        }else{
          alert('数据出错')
        }
      })
    },
    //复原
    currentWeek() {
      this.currentStartDate = this.defaultDate;  //this.$moment().weekday(0);
    },
    //下一周数据
    nextWeek() {
      this.currentStartDate = this.$moment(this.currentStartDate).weekday(7);
      this.isTerm(this.term)
    },
    //上一周数据
    prevWeek() {
      this.currentStartDate = this.$moment(this.currentStartDate).weekday(-7);
      this.isTerm(this.term)
    },
    classTimeLeaveFn(courseTableItemId){
      this.isClassTimeLeave = true;
      this.changeClassId = courseTableItemId;
    },
    noModifyCourse(){
      this.timer=setTimeout(()=>{
         this.$refs.detail.style.display = "none";
      },500)
    },
    show(){
      clearTimeout(this.timer)
    },
    submitChangeClass(){
       this.$refs.changeClass.submit();
    },
    noShow(){
      this.$refs.detail.style.display = "none";
    },
    leaveAndMakeUpRecordFn(courseTableItemId=0,studentId=0){
      this.isLeaveAndMakeUpRecord = true;
      this.courseTableItemId = courseTableItemId;
      this.studentId = studentId;
    },
    classTimeleaveAndMakeUpRecordFn(courseTableItemId=0,studentId=0){
      this.isClassTimeLeaveAndMakeUpRecord = true;
      this.courseTableItemId = courseTableItemId;
      this.studentId = studentId;
    },
    //算出格子
    totalLatticeFn(startDate,endDate,lattice){
       //计算时差 画出显示图效果
      let startMinuteTimes = new Date(startDate).getTime();
      let endMinuteTimes = new Date(endDate).getTime();
      let differMin = (endMinuteTimes - startMinuteTimes)/1000/60;
      //每五分钟1个格子能画出多少个格子
      let latticeNum = differMin / lattice ;
      return latticeNum;
    },
    //补零
    zerofill(num){
      return num<10?'0'+num:''+num
    },
    //初始化 学期和老师
    init(){
        if (this.teacherId > 0) {
            this.$http.get('/api/term/getAll').then((res)=>{
              if(typeof res==='object'&&res.data){
                this.terms=res.data;
              }else{
                alert('数据出错')
              }
            }).then(()=>{
              if (this.$route.params.teacherId != 0) {
                this.termFn(this.$route.query.termId||this.$route.params.termId)
              }
            });
        } else {
                
        }
    },
    //画图
    createCourse(termId, teacherId){
      this.signUpTime = [];
      // console.log(this.termId)
      // if (!this.termId) {
        this.termId1 =  termId
      // }
      this.$http.get('/api/courseTable/getWeekItems', { 
        params:{
          teacherId: teacherId, 
          termId: termId,
          startDate: this.currentStartDate.format('YYYY-MM-DD')
        }}).then((res) => {
          if (typeof res === 'object' && res.data) {
            this.teacher = res.data.name
            this.termStartDate = this.$moment(res.data.startDate).format('YYYY-MM-DD')
            this.termEndDate = this.$moment(res.data.endDate).format('YYYY-MM-DD')
            let days=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
            for (let i = 0;i < res.data.list.length; i++) {
              console.log(res.data.list[i])
              for(let j = 0; j< res.data.list[i].list.length; j++){
                this.signUpTime.push({
                  id: res.data.list[i].list[j].id,
                  contrast:`${res.data.list[i].list[j].students.length}/${res.data.list[i].list[j].number}`,
                  day: i,
                  type:res.data.list[i].list[j].type,
                  startTime: res.data.list[i].list[j].startTime,
                  endTime: res.data.list[i].list[j].endTime,
                  color: res.data.list[i].list[j].course.color,
                  class: res.data.list[i].list[j].course.name
                })
              }
            }
            this.data = res.data
            this.calculationDifference();
            //默认学期
            if(this.defaultDate == null){
              if(this.$moment() >= this.$moment(this.data.startDate) && this.$moment() <= this.$moment(this.data.endDate)){
                this.defaultDate = this.$moment().weekday(0)
              }
              else{
                this.defaultDate = this.$moment(this.data.startDate)
                this.currentStartDate = this.defaultDate.weekday(0)
                this.currentEndDate = this.$moment(this.currentStartDate).day(7);
              }
            }
          }else{
            this.$message('数据出错')
          }
      });
    },
    leaveAndMakeUpRecordForTeacherFn(courseTableItemId=0,teacherId=0){
      this.isLeaveAndMakeUpRecordForTeacher = true;
      this.courseTableItemId = courseTableItemId;
      this.teacherId = teacherId;
    },
    //学期选择相对应的周期显示改变
    termFn( termId = this.terms[this.terms.length-1].id ){
      for(let item of this.terms){
         let date = new Date(item.startDate);
         let nowDate = new Date(); 
        if (item.id == termId) {
          if(date.getTime()>nowDate.getTime()){
           this.currentStartDate = this.$moment(item.startDate).weekday(0);
          }else{
            this.currentStartDate = this.$moment().weekday(0);
          }
        }
        if (item.name == termId) {
          if(date.getTime()>nowDate.getTime()){
            this.currentStartDate = this.$moment(item.startDate).weekday(0);
          }else{
            this.currentStartDate = this.$moment().weekday(0);
          }
        }
      }
      this.isTerm(termId)
    },
    classTimeLeaveCancelFn(){
      this.isClassTimeLeave = false
    },
    //判断this.term是id还是string
    isTerm(termId){
      this.currentEndDate = this.$moment(this.currentStartDate).day(7);
      for(let item of this.terms){
        if (item.id == termId) {
          this.term = item.name;
          this.createCourse(termId, this.$route.query.teacherId||this.$route.params.teacherId);
        }
        if (item.name == termId) {
          this.term = item.name;
          this.createCourse(item.id, this.$route.query.teacherId||this.$route.params.teacherId);
        }
      }
    },
    editCourse(){
      this.isEdit = true
    },
    changeClassFn(courseTableItemId){
      this.isChangeClass = true;
      this.changeClassId = courseTableItemId;
    },
    changeClassCancelFn(num=0){
      this.isChangeClass = false;
      this.changeClassId = 0
      if(!num){
        this.isTerm(this.term) 
      }
    },
    cancelLeaveFn(){
      this.isClassTimeLeave = false;
      this.changeClassId = 0;
    },
    //删除某节课
    del(){
      this.$confirm('确定要删除吗？',{ closeOnClickModal:false}).then(()=>{
          this.$http.post('/api/courseTable/deleteItem', { id: this.details.id }).then((res) => {
              var data = res.data;
              if (data.code == 1) {
                  this.$message({
                      message: '删除成功',
                      type: 'success'
                  });
                  this.isTerm(this.term)
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
    //添加课程成功
    addCourseSuccess(){
      this.isAdd = false;
      this.isTerm(this.term)
    },
    //添加报名课程
    addCourse(num,startTime){
      this.date = this.$moment(this.currentStartDate).weekday(num)
      this.startTime = startTime 
      this.isAdd = true;
    },
    cancelAdd(){
      this.isAdd = false;
    },
    //教师改变
    teacherFn(teacherId){
      for(let item of this.teachers){
        if (item.teacher.id === teacherId) {
          this.teacherName = item.teacher.name;
        }
      }
    },
    submitEdit(){
      this.$refs.Edit.submit()
    },
    submitAdd(){
      this.$refs.Add.submit()
    },
    cancelEmit(){
      this.isEdit = false;
      this.init()
    }
  },
  watch: {
    // currentStartDate(newVal, oldVal) {
    //   this.currentEndDate = this.$moment(this.currentStartDate).day(7);
    //   this.termFn(this.term)
    // },
  },
  components:{
    CourseTableItemEdit,
    CourseTableItemAdd,
    CourseTableSwitchItemForTeacher,
    leaveAndMakeUpRecord,
    leaveAndMakeUpRecordForTeacher,
    CourseTableLeaveItemForTeacher,
    classTimeLeaveRecord
  }
}
</script>
<style  lang="less" scoped>
  .body{
    padding: 0 34px;
  }
  .header{
    position: relative;
    text-align: center;
    line-height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
    .teacher{
      text-align: left;
      color:#333333;
      font-weight: bold;
    }
    .term{
      text-align: left;
    }
    .termStartEnd{
      margin-left: 34px;
    }
    a{
      position: absolute;
      right: 35px;
      width: 118px;
      height: 38px;
      line-height: 38px;
      background-color: #38bca4;
      color: white;
      text-align: center;
      border-radius: 30px;
      text-decoration: none;
    }
  }
  .week{
    background-color:#38bca4;
    width: 496px;
    height: 34px;
    margin: 20px auto;
    color:white;
    em{
      display: inline-block;
      width: 310px;
      height: 32px;
      line-height: 32px;
      font-style: normal;
      background-color:white;
      color: black;
      vertical-align: middle;
      margin-top: -1px;
    }
  }
  table {
    width: 100%;
    border-color: #b3b3b3;
    border-collapse:collapse;
    tbody {
      tr {
        border-bottom: 1px solid #e5e5e5;
        text-align:left;
        font-size: 12px;
        td{
          white-space: nowrap;  
          padding-left:5px;
          img{
            margin-right: 10px;
            vertical-align: middle;
          }
        }
      }
      .bold {
        border-bottom: 1px solid #b3b3b3;
      }
    }
  }
  #detail{
    position: absolute;
    left: 0;
    top: 0;
    background-color: white;
    border-radius: 5px;
    text-align: left;
    .detail-title{
      padding-left: 10px;
      color: white;
      height: 40px;
      line-height: 40px;
      background-color: #f43793;
    }
    .detail-body{
      margin: 30px;
      border: 1px solid #dfe6ec;
      .detail-body-title{
        padding-left: 10px;
        width: 518px;
        height: 40px;
        line-height: 40px;
        box-sizing:border-box;
        background-color:#eef1f6;
      }
      .detail-body-row{
        margin: 10px 0;
        .switch{
          margin-left: 20px;
        }
        a{
          text-decoration:none;
          color:#7bbffe;
        }
      }
    }
    .students{
      margin: 30px;
      border: 1px solid #dce4e9;
      .students-title{
        padding: 10px;
        font-size: 18px;
        font-weight:bold;
        background-color:#edf0f5;
      }
      table{
        margin: 0;
        border: 1px solid #e3eaee;
        tr{
          td:nth-child(1){
            width: 50px;
          }
          td:nth-child(2){
            width: 112px;
          }
        }
        td{
          text-align: center;
          height: 40px;
          border: 1px solid #e3eaee;
          a{
            color: #57b5ff;
            box-sizing:border-box;
            text-align:right;
            text-decoration:none; 
          }
        }
      }
    }
    span{
      display: inline-block;
      width: 150px;
      text-align:right;
    }
    .isChecked {
      margin-right: 10px;
    }
    display: none;
    .btns{
      text-align:center;
    }
  }

</style>
