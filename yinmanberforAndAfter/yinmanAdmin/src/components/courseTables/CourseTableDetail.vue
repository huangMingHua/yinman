<template>
  <div class="body">
    <div class="header">
      <div class="teacher">
        <span>教师：</span>
        <el-select v-if="this.$route.params.teacherId==0" v-model="teacher"  placeholder="请选择" @change="teacherFn">
          <el-option
            v-for="item in teachers"
            :key="item.teacher.id"
            :label="item.teacher.name"
            :value="item.teacher.id">
          </el-option>
        </el-select>
        <span v-else="this.$route.params.teacherId">{{teacher}}</span>
        <a><router-link  :to="{ path: '/courseTable/viewItems', query: { teacherId: $route.params.teacherId } }" class='el-button--text'>每周课表</router-link></a>
      </div>
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
      <span style="margin-left: 10px;">学期起止：</span>
      <em style="font-style:normal">{{termStartDate}} 至 {{termEndDate}}</em>
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
          <td @click="item[0].day === 0 ? '' : emitCourse(0, item[0].date)" @mousemove="item[0].id?modifyCourse(0, item[0].date, item[0].id, $event, item[0].type):''" @mouseleave="item[0].id?noModifyCourse(0, item[0].date, item[0].id, $event):''" :rowspan="item[0].day === 0? item[0].interval : 1" v-if="item[0].isShow"
          :style="{'background-color':item[0].day === 0 && item[0].isShow ? item[0].color : null,'color':'white'}">
              {{item[0].class}}<span v-if="item[0].class">({{item[0].contrast}})</span><img v-if="item[0].openEnrollment=='是'" src="../../assets/images/open.png"/><img v-if="item[0].openEnrollment=='否'" src="../../assets/images/close.png"/>
          </td>
          <td @click="item[1].day === 1 ? '' : emitCourse(1, item[1].date)" @mousemove="item[1].id ?modifyCourse(1, item[1].date, item[1].id, $event, item[1].type):''" @mouseleave="item[1].id?noModifyCourse(1, item[1].date, item[1].id, $event):''" :rowspan="item[1].day === 1 ? item[1].interval : 1" v-if="item[1].isShow"
          :style="{'background-color':item[1].day === 1&& item[1].isShow ? item[1].color:null,'color':'white'}">
              {{item[1].class}}<span v-if="item[1].class">({{item[1].contrast}})</span><img v-if="item[1].openEnrollment=='是'" src="../../assets/images/open.png"/><img v-if="item[1].openEnrollment=='否'" src="../../assets/images/close.png"/>
          </td>
          <td @click="item[2].day === 2 ? '' : emitCourse(2,item[2].date)" @mousemove="item[2].id?modifyCourse(2, item[2].date, item[2].id, $event, item[2].type):''" @mouseleave="item[2].id?noModifyCourse(2, item[2].date, item[2].id, $event):''" :rowspan="item[2].day === 2 ? item[2].interval : 1" v-if="item[2].isShow"
          :style="{'background-color' : item[2].day === 2 && item[2].isShow ? item[2].color:null,'color':'white'}">
              {{item[2].class}}<span v-if="item[2].class">({{item[2].contrast}})</span><img v-if="item[2].openEnrollment=='是'" src="../../assets/images/open.png"/><img v-if="item[2].openEnrollment=='否'" src="../../assets/images/close.png"/>
          </td>
          <td @click="item[3].day === 3 ? '' : emitCourse(3, item[3].date)" @mousemove="item[3].id?modifyCourse(3, item[3].date, item[3].id, $event, item[3].type):''" @mouseleave="item[3].id?noModifyCourse(3, item[3].date, item[3].id, $event):''" :rowspan="item[3].day===3?item[3].interval:1" v-if="item[3].isShow"
          :style="{'background-color' : item[3].day === 3 && item[3].isShow ? item[3].color:null,'color':'white'}">
              {{item[3].class}}<span v-if="item[3].class">({{item[3].contrast}})</span><img v-if="item[3].openEnrollment=='是'" src="../../assets/images/open.png"/><img v-if="item[3].openEnrollment=='否'" src="../../assets/images/close.png"/>
          </td>
          <td @click="item[4].day === 4 ? '' : emitCourse(4, item[4].date)" @mousemove="item[4].id ?modifyCourse(4, item[4].date, item[4].id, $event, item[4].type):''" @mouseleave="item[4].id?noModifyCourse(4, item[4].date, item[4].id, $event):''" :rowspan="item[4].day === 4 ? item[4].interval : 1" v-if="item[4].isShow"
          :style="{'background-color':item[4].day === 4 && item[4].isShow ? item[4].color : null,'color':'white'}">
              {{item[4].class}}<span v-if="item[4].class">({{item[4].contrast}})</span><img v-if="item[4].openEnrollment=='是'" src="../../assets/images/open.png"/><img v-if="item[4].openEnrollment=='否'" src="../../assets/images/close.png"/>
          </td>
          <td @click="item[5].day === 5 ? '' : emitCourse(5, item[5].date)" @mousemove="item[5].id ? modifyCourse(5, item[5].date, item[5].id, $event, item[5].type):''" @mouseleave="item[5].id ? noModifyCourse(5, item[5].date, item[5].id, $event):''" :rowspan="item[5].day === 5 ? item[5].interval : 1" v-if="item[5].isShow"
          :style="{'background-color':item[5].day === 5 && item[5].isShow ? item[5].color : null,'color':'white'}">
              {{item[5].class}}<span v-if="item[5].class">({{item[5].contrast}})</span><img v-if="item[5].openEnrollment=='是'" src="../../assets/images/open.png"/><img v-if="item[5].openEnrollment=='否'" src="../../assets/images/close.png"/>
          </td>
          <td @click="item[6].day === 6 ? '' : emitCourse(6, item[6].date)" @mousemove="item[6].id ? modifyCourse(6, item[6].date, item[6].id, $event, item[6].type):''" @mouseleave="item[6].id ? noModifyCourse(6, item[6].date, item[6].id, $event):''" :rowspan="item[6].day === 6 ? item[6].interval : 1" v-if="item[6].isShow"
          :style="{'background-color' : item[6].day === 6 && item[6].isShow ? item[6].color : null,'color':'white'}">
              {{item[6].class}}<span v-if="item[6].class">({{item[6].contrast}})</span><img v-if="item[6].openEnrollment=='是'"  src="../../assets/images/open.png"/><img v-if="item[6].openEnrollment=='否'" src="../../assets/images/close.png"/>
          </td>
        </tr>
      </tbody>
    </table>
    <el-dialog
      :title="this.title"
      :visible.sync="dialogVisible"
      size="tiny"
      @close='clearData'
      >
      <sign-up-course-create ref = "child" :termData = 'termData' :termStartDate = "termStartDate" :startTime = 'startTime' :termEndDate = "termEndDate" @addCourseSuccess='addCourseSuccess' :teacherName="teacherName"  :day="day"></sign-up-course-create>
      <div>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <div id="detail" ref="detail" @mousemove="show" @mouseleave="noShow">
        <div class="detail-title">{{details.courseName}}</div>
        <div class="detail-body">
          <div class="detail-body-title">课程信息</div> 
          <div v-if="details.courseCycle" class="detail-body-row">
            <span>课程周期：</span>
            <strong>{{details.courseCycle}}</strong>
          </div>
          <div v-if="details.type" class="detail-body-row">
            <span>课程类型：</span>
            <strong>{{details.type}}</strong>
          </div>
          <div class="detail-body-row">
            <span>课程：</span>
            <strong>{{details.courseName}}</strong>
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
            <span>已报/满员人数：</span>
            <strong>{{details.number}}</strong>
          </div>
          <div  class="detail-body-row"> 
            <span>是否开放报名：</span>
            <input type="checkbox" :checked="isChecked" class="isChecked" @change="isOpenFn"> 
          </div>
          <div  class="detail-body-row"> 
            <a href="javascript:;" @click="leaveAndMakeUpRecordForTeacherFn(details.id,details.teacherId)">教师调课记录</a>
          </div>
        </div>
        <div class="students">
          <div class="students-title">
            学生信息
          </div>
          <table>
            <tr v-for="item,index of details.students"><td>{{index+1}}</td><td>{{item.student.name}}</td><td><a href="javascript:;" @click="leaveAndMakeUpRecordFn(details.id,item.student.id)">请假补课记录</a></td></tr>
          </table>
        </div>
        <div class="btns">
          <el-button @click="del">删除</el-button>
        </div>
    </div>
    <el-dialog title="请假补课记录"   :visible.sync="isLeaveAndMakeUpRecord" :close-on-click-modal='false'  label-position="left">
      <leave-and-make-up-record  :courseTableDetailId="courseTableDetailId" :studentId="studentId"></leave-and-make-up-record> 
    </el-dialog>
    <el-dialog title="教师调课记录"   :visible.sync="isLeaveAndMakeUpRecordForTeacher" :close-on-click-modal='false'  label-position="left">
      <leave-and-make-up-record-for-teacher  :courseTableDetailId="courseTableDetailId" :teacherId="teacherId"></leave-and-make-up-record-for-teacher> 
    </el-dialog>
  </div>
</template>
<script>
import signUpCourseCreate from '../signUp/signUpCourseCreate'
import leaveAndMakeUpRecord from '../studentInfo/leaveAndMakeUpRecord'
import leaveAndMakeUpRecordForTeacher from '../studentInfo/leaveAndMakeUpRecordForTeacher'
export default {
  name: 'course-table-add-detail',
  props: {
    termId: Number,
    teacherId: Number
  },
  data() {
    return {
      aMinute: [],
      interval: 12,
      terms: [],
      term: '',
      termData: '',
      termStartDate: '2018-1-1',
      termEndDate: '2018-1-1',
      teachers: [],
      teacher: '',
      teacherName: '',
      dialogVisible: false,
      title: '创建课程',
      day: '',
      startTime: '',
      signUpTime: [
      ],
      isChecked: 'false',
      details:{
        id: 0,
        courseCycle: '',
        courseName: '',
        number: 0,
        classroomName:'',
        level: '',
        type: '',
        startTime: '',
        endTime: ''
      },
      timer: null,
      isLeaveAndMakeUpRecord: false,
      isLeaveAndMakeUpRecordForTeacher: false,
      href:'',
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
      courseTableDetailId: '',
      studentId: '',
      teacherId: '' 
    }
  },
  created() {
    this.init();
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
        newSignUpTime.push({
          interval: this.totalLatticeFn(startDate,endDate,lattice),
          startTime,
          endTime,
          openEnrollment: this.signUpTime[i].openEnrollment,
          contrast: this.signUpTime[i].contrast,
          type: this.signUpTime[i].type,
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
      for(let i=0;i<7;i++){
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
          datas[newSignUpTime[j].day].id = newSignUpTime[j].id;
          datas[newSignUpTime[j].day].color = newSignUpTime[j].color;
          datas[newSignUpTime[j].day].class = newSignUpTime[j].class;
          datas[newSignUpTime[j].day].contrast = newSignUpTime[j].contrast;
          datas[newSignUpTime[j].day].openEnrollment = newSignUpTime[j].openEnrollment;
          datas[newSignUpTime[j].day].day = newSignUpTime[j].day;
          datas[newSignUpTime[j].day].interval = newSignUpTime[j].interval;
          datas[newSignUpTime[j].day].type = newSignUpTime[j].type;
        }else if(time>newSignUpTime[j].startTime&&time<newSignUpTime[j].endTime){
          //在这时间内由于第一个画出并且合并其他都消失
          datas[newSignUpTime[j].day].isShow = false;
          datas[newSignUpTime[j].day].day = newSignUpTime[j].day;
        }
      }
      return datas
    },
    modifyCourse(index, startTime, id, e, type){
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
      console.log(templateLeft + e.currentTarget.offsetWidth+this.$refs.detail.offsetWidth,documentWidth)
      if ( templateLeft + e.currentTarget.offsetWidth+this.$refs.detail.offsetWidth > documentWidth ) {
        detailPosition.left = documentWidth-this.$refs.detail.offsetWidth-e.currentTarget.offsetWidth +'px';
      }else{
        detailPosition.left = templateLeft+e.currentTarget.offsetWidth+'px';
      }
      //算出弹框的距离
      this.$refs.detail.style.left = detailPosition.left;
      this.$refs.detail.style.top = detailPosition.top;
      this.$refs.detail.style.display = "block";
      //判断是不是课时课
      if (type==='课时课') {
         this.$http.get(`/api/courseTable/getByDetailItemId?id=${id}`).then((res)=>{
          console.log(type)
          if (typeof res==='object'&&res.data.code) {
            let {date, course, courseNameId,number, classroomId,classroom, level, type,startTime, endTime, duration,id} = res.data.data
            console.log(course.name)
            this.courseNameId = courseNameId;
            this.classroomId = classroomId

            this.details={
              courseName: course.name,
              number,
              duration,
              id: this.id,
              classroomName: classroom.name,
              level: this.levels[level-1],
              startTime,
              endTime,
              type,
            }
          }else{
            alert('数据出错')
          }
        })
      } else {
          this.getDetail(id)
      }
      
    },
    //获取detail
    getDetail(id){
      this.$http.get(`/api/courseTable/getByDetailId?id=${id}`).then((res)=>{
          if (typeof res === 'object' && res.data.code) {
            let {startDate, endDate, course, number, classroom, level, startTime, endTime,openEnrollment, id,students,teacherId} = res.data.data
            let startDate1 = new Date(res.data.data.startDate)
            let endDate1 = new Date(res.data.data.endDate)
            let courseCycle = startDate1.getFullYear()+'-'+this.zerofill(startDate1.getMonth()+1)+'-'+this.zerofill(startDate1.getDate())+'至'+endDate1.getFullYear()+'-'+this.zerofill(endDate1.getMonth()+1)+'-'+this.zerofill(endDate1.getDate())
            if(openEnrollment === '是'){
              this.isChecked = true
            }else{
              this.isChecked = false
            }
            this.details = {
              courseCycle,
              courseName: course.name,
              number,
              id,
              classroomName: classroom.name,
              level:this.levels[level-1],
              startTime,
              teacherId,
              endTime,
              students
            }
          }else{
            alert('数据出错')
          }
        })
    },
    //是否开放
    isOpenFn () {
      let open = '否'
      if (!this.isChecked) {
        open = '是'
      }
      this.$http.post(`/api/courseTable/changeOpen`,{id : this.details.id,openEnrollment : open}).then((res)=>{
        if (res.data.code) {
          this.$message('修改成功')
          this.createCourse(this.returnTermId(),Number(this.$route.params.teacherId));
          this.getDetail(this.details.id)
        } else {
          this.$message('修改失败')
        }
      })
    },
    leaveAndMakeUpRecordFn(courseTableDetailId=0,studentId=0){
      this.isLeaveAndMakeUpRecord = true;
      this.courseTableDetailId = courseTableDetailId;
      this.studentId = studentId;
    },
    leaveAndMakeUpRecordForTeacherFn(courseTableDetailId=0,teacherId=0){
      this.isLeaveAndMakeUpRecordForTeacher = true;
      this.courseTableDetailId = courseTableDetailId;
      this.teacherId = teacherId;
    },
    //删除某学期的课
    del() {
        this.$confirm('确定要删除吗？',{closeOnClickModal:false}).then(()=>{
            this.$http.post('/api/courseTable/delete', { id: this.details.id }).then((res) => {
                var data = res.data;
                if (data.code == 1) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.createCourse(this.returnTermId(),Number(this.$route.params.teacherId));
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
    noModifyCourse(){
      this.timer=setTimeout(()=>{
         this.$refs.detail.style.display = "none";
      },500)
    },
    show(){
      clearTimeout(this.timer)
    },
    noShow(){
      this.$refs.detail.style.display = "none";
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
      this.$http.get('/api/term/getAll').then((res)=>{
        if(typeof res==='object'&&res.data){
          this.terms=res.data;
        }else{
          alert('数据出错')
        }
      }).then(()=>{
        if (this.$route.params.termId != 0  && this.$route.params.teacherId != 0) {
          this.termFn(this.$route.params.termId)
        }
      });
      this.$http.get('/api/teacher/getAll').then((res)=>{
        if(typeof res==='object'&&res.data){
            this.teachers=res.data;
        }else{
          alert('数据出错')
        }
      }).then(()=>{
          if ( this.$route.params.teacherId != 0) {
            for (let i=0;i<this.teachers.length;i++) {
              if (this.teachers[i].teacher.id===Number(this.$route.params.teacherId)) {
                this.teacher = this.teachers[i].teacher.name
              }
            }
            this.teacherFn(Number(this.$route.params.teacherId))
          }
      });
    },
    //画表
    createCourse(termId, teacherId){
      this.href=`/courseTable/viewItems?teacherId=${teacherId}&termId=${termId}`
      this.signUpTime = [];
      this.$http.get(`/api/teacher/getCourseDetails?termId=${termId}&teacherId=${teacherId}`).then((res)=>{
        if (typeof res === 'object' && res.data) {
          let days=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
          for (let i = 0;i < res.data.data.details.length; i++) {
            for(let j = 0; j < res.data.data.details[i].list.length; j++){
              this.signUpTime.push({
                id: res.data.data.details[i].list[j].id,
                day: i,
                type: res.data.data.details[i].list[j].type,
                startTime: res.data.data.details[i].list[j].startTime,
                endTime: res.data.data.details[i].list[j].endTime,
                color: res.data.data.details[i].list[j].course.color,
                class: res.data.data.details[i].list[j].course.name,
                openEnrollment:res.data.data.details[i].list[j].openEnrollment,
                contrast:`${res.data.data.details[i].list[j].students.length}/${res.data.data.details[i].list[j].number}`
              })
            }
          }
          this.calculationDifference();
        }else{
          alert('数据出错')
        }
      })
    },
    //添加课程成功
    addCourseSuccess(){
      this.dialogVisible = false
      this.createCourse(this.returnTermId(),Number(this.$route.params.teacherId))
    },
    //添加报名课程
    emitCourse(num,startTime){
      let days=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
      this.day=days[num]
      if(!this.term){
        return this.$message('请选择学期')
      }
      if(!this.teacher){
        return this.$message('请选择教师')
      }
      this.startTime = startTime
      this.dialogVisible = true;
    },
    //学期选择相对应的周期显示改变
    termFn(termId=this.terms[this.terms.length-1].id){
            console.log(termId)
      for(let item of this.terms){
        if (item.id == termId) {
          this.term = item.name
          this.termData = item
          this.termStartDate = item.startDate;
          this.termEndDate = item.endDate
          this.createCourse(termId, Number(this.$route.params.teacherId))
        }
      }
    },
    //教师改变
    teacherFn(teacherId){
      for(let item of this.teachers){
        if (item.teacher.id === teacherId) {
          this.teacherName = item.teacher.name;
        }
      }
    },
    returnTermId(){
      let term
      if (isNaN(this.term)) {
        for(let item of this.terms){
          if(this.term === item.name){
            term = item.id   
          }
        }
      }else{
        term = this.term
      }
      return term
    },
    clearData(){
      this.$refs.child.clearData()
    },
    submit(){
      let teacher
      //id与name转换
      if (isNaN(this.teacher)) {
        teacher = this.$route.params.teacherId
      }else{
        teacher = this.teacher
      }
      this.$refs.child.submit({termId: this.returnTermId(),teacherId: teacher})
    }
  },
  watch: {

  },
  components:{
    signUpCourseCreate,
    leaveAndMakeUpRecord,
    leaveAndMakeUpRecordForTeacher
  }
}
</script>
<style  lang="less" scoped>
  .body{
    padding: 0 34px;
  }
  .header{
    text-align: left;
    line-height: 40px;
    padding: 0 20px;
    .teacher{
      position: relative;
      font-weight: bold;
      padding: 10px 0;
      a{
        position: absolute;
        right: 0;
        width: 120px;
        height: 36px;
        border: 1px solid #38bca5;
        text-align: center;
        line-height: 36px;
        text-decoration: none;
        color: #38bca5;
        border-radius: 30px;
      }
    }
  }
  table {
    width: 100%;
    margin-top: 10px;
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
            margin-left: 10px;
            vertical-align:middle;    
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
    padding: 10px;
    border-radius: 5px;
    text-align: left;
    background-color: white;
    .detail-title{
      padding-left: 20px; 
      height: 30px;
      line-height: 30px;
      color: white;
      background-color: #f43793;
    }
    .detail-body{
      margin: 30px;
      border: 1px solid #dce4e9;
      .detail-body-title{
        padding: 10px;
        width: 400px;
        font-size: 18px;
        font-weight:bold;
        background-color:#edf0f5;
      }
    }
    .detail-body-row{
      margin: 5px 0;
      a{
        display: inline-block;
        color: #57b5ff;
        width: 150px;
        padding-right: 10px;
        box-sizing:border-box;
        text-align:right;
        text-decoration:none; 
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
    .students{
      margin: 30px;
      border: 1px solid #dce4e9;
      .students-title{
        padding: 10px;
        width: 400px;
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
    display: none;
  }
  .btns{
    text-align:center;
  }
</style>
