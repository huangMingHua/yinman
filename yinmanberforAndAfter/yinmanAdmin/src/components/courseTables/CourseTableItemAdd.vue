<template>
    <div>
      <div>
        <span class="left">课程类型：</span>
        <el-radio v-model="details.type" label="预约试课">预约试课</el-radio>
        <el-radio v-model="details.type" label="补课">补课</el-radio>
        <el-radio v-model="details.type" label="课时课">课时课</el-radio>
      </div>
    	<div>
        <span class="left">课程：</span>
        <el-select class="right"  v-model="details.courseNameId" placeholder="请选择">
          <el-option
            v-for = "item in courses"
            :key = "item.id"
            :label = "item.name"
            :value = "item.id">
          </el-option>
        </el-select>
      </div>
      <div>
        <span class="left">等级：</span>
        <el-select class="right"  v-model="details.level" placeholder="请选择">
          <el-option
            v-for = "item in levels"
            :key = "item.id"
            :label = "item.name"
            :value = "item.id">
          </el-option>
        </el-select>
      </div>
      <div>
        <span class="left">人数：</span>
        <el-input class="right"  v-model="details.number" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <span class="left">教室：</span>
        <el-select  v-model="details.classroomId"  class="right" placeholder="请选择">
          <el-option
            v-for="item in classrooms"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div>
        <span class="left">上课时间：</span>
        <el-time-select
          class = "right"
          v-model = "details.startTime"
          @change = "timeFn"
          :picker-options="{
            start: start,
            step: '00:5',
            end: '21:00'
          }"
          placeholder="选择时间">
        </el-time-select>
      </div>
      <div>
        <span class="left">时长：</span>
        <el-input class="right" v-model="details.duration" @change="durationFn" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <span class="left" >下课时间：</span>
        <strong class="right">{{details.endTime}}</strong>
      </div>
    </div>
</template>
<script>
export default {
    props:[
      "termId",
      "teacherId",
      "startTime",
      "date"
    ],
    name: 'course-table-item-add',
    data() {
      return {
        course: '',
        courses: [],
        level: '',
        start: '07:00',
        classrooms: [],
        details: {
          courseNameId: '',
          type: '',
          number: '',
          duration: '',
          classroomId: '',
          level: '',
          startTime: this.startTime,
          endTime: '',
          date: this.date,
          termId: this.termId,
          teacherId: this.teacherId
        },
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
      }
    },
    created() {
      this.init();
    },
    methods: {
    	//初始化 课程
      init() {
        this.$http.get('/api/course/getAll').then((res)=>{
          if (typeof res==='object' && res.data) {
            this.courses = res.data;
          }else{
            alert('数据出错')
          }
        });
        this.$http.get('/api/classroom/getAll').then((res)=>{
          if(typeof res === 'object'&&res.data){
              this.classrooms = res.data;
          }else{
            alert('数据出错')
          }
        });
      //   this.$http.get(`/api/courseTable/getByDetailItemId?id=${this.id}`).then((res)=>{
      //     if (typeof res==='object'&&res.data.code) {
      //       let {date, course, courseName,number, classroomId,classroom, level, type,startTime, endTime, duration} = res.data.data
      //       this.courseNameId = courseName;
      //       this.classroomId = classroomId
      //       this.details={
      //         courseName: course.name,
      //         number,
      //         duration,
      //         id: this.id,
      //         classroomName: classroom.name,
      //         level: this.levels[level-1],
      //         startTime,
      //         endTime
      //       }
      //     }else{
      //       alert('数据出错')
      //     }
      //   })
      },
      timeFn(){
        if (parseInt(this.duration)!=this.duration||!this.duration) {
           return 
        }
        this.endTimeFn()
      },
      //开始时间存在算出结束时间
      durationFn() {
         if (isNaN(this.details.duration)) {
            return this.$message('不是数字')
         }
         if (parseInt(this.details.duration)!=this.details.duration) {
            return this.$message('不是整数')
         }
         if (!this.details.startTime) {
            return
         }
         this.endTimeFn()
      },
      //补零
      zerofill(num){
        return num<10?'0'+num:''+num
      },
      //结束时间
      endTimeFn(){
        let newDate = new Date('2018-1-1 '+this.details.startTime)
        newDate.setMinutes(newDate.getMinutes()+Number(this.details.duration))
        this.details.endTime = this.zerofill(newDate.getHours()) + ':' + this.zerofill(newDate.getMinutes())
      },
      submit(){
        this.$http.post('/api/courseTable/addItem',this.details).then((res)=>{
          if (typeof res.data === 'object'&&res.data.code) {
              this.$emit('addCourseSuccess')
              this.details = {
                courseNameId: '',
                type: '',
                number: '',
                duration: '',
                classroomId: '',
                level: '',
                startTime: this.startTime,
                endTime: '',
                date: this.date,
                termId: this.termId,
                teacherId: this.teacherId
              }
          }else{
            this.$message(res.data.msg)
          }
        });
      }
    },
    watch: {
      termId(newId){
        this.details.termId = newId;
        this.details.startTime = this.startTime;
        this.details.teacherId = this.teacherId;
      },
      startTime(newStartTime){
        this.details.startTime = newStartTime;
      },
      date(newDate){
        this.details.date = newDate;
      },
      teacherId(newTeacherId){
        this.details.teacherId = newTeacherId;  
      }
    },
}
</script>
<style  lang="less" scoped>
   .left{
    display: inline-block;
    width: 100px;
    text-align: left;
    height: 40px;
  }
  .right{
    display: inline-block;
    width: 200px;
  }
  .el-date-editor.right{
    width: 200px;
  }
</style>