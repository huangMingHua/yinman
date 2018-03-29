<template>
    <div>
    	<div>
        <span class="left">课程：</span>
        <el-select class="right" disabled="disabled" v-model="details.courseName" placeholder="请选择">
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
        <el-input class="right" disabled="disabled" v-model="details.level.name" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <span class="left">人数：</span>
        <el-input class="right" disabled="disabled" v-model="details.number" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <span class="left">教室：</span>
        <el-select  v-model="details.classroomName"  class="right" placeholder="请选择">
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
          disabled="disabled"
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
        <span class="left" disabled="disabled">下课时间：</span>
        <strong>{{details.endTime}}</strong>
      </div>
    </div>
</template>
<script>
export default {
    props:[
      'id'
    ],
    name: 'course-table-item-edit',
    data() {
      return {
        course: '',
        courses: [],
        level: '',
        start: '07:00',
        classrooms: [],
        details: {
          courseName: '',
          number: 0,
          duration: '',
          classroomName: '',
          level: '',
          startTime: '',
          endTime: '',
          id: ''
        },
        disabled:true,
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
        courseNameId: 0,
        classroomId: 0
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
        this.$http.get(`/api/courseTable/getByDetailItemId?id=${this.id}`).then((res)=>{
          if (typeof res==='object'&&res.data.code) {
            let {date, course, courseName,number, classroomId,classroom, level, type,startTime, endTime, duration} = res.data.data
            this.courseNameId = courseName;
            this.classroomId = classroomId
            this.details={
              courseName: course.name,
              number,
              duration,
              id: this.id,
              classroomName: classroom.name,
              level: this.levels[level-1],
              startTime,
              endTime
            }
          }else{
            alert('数据出错')
          }
        })
      },
      timeFn(){
        if (parseInt(this.duration)!=this.duration||!this.duration) {
           return 
        }
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
        this.details.endTime= this.zerofill(newDate.getHours()) + ':' + this.zerofill(newDate.getMinutes())
      },
      submit(){
        if (!this.details.duration) {
          return this.$message('请填写时长')
        }
        if (!this.details.classroomName) {
          return this.$message('请选择教室')
        }
        if (!this.id) {
          return this.$message('课程id不能为空')
        }
        if (typeof this.details.classroomName === 'string') {
           this.details.classroomName = this.classroomId
        }
        this.details.level = this.details.level.id
        this.details.courseName = this.courseNameId
        this.$http.post('/api/courseTable/uodate',this.details).then((res)=>{
          if (typeof res==='object'&&res.data.code) {
            this.$emit('cancelEmit')
            this.details = {
              courseName: '',
              number: 0,
              duration: '',
              classroomName: '',
              level: '',
              startTime: '',
              endTime: '',
              id: ''
            }
            this.id=0
          } else {
            this.$message({message: res.data.msg, type: 'error'});

          }
        });
      }
    },
    watch: {
      id() {
        this.init();
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