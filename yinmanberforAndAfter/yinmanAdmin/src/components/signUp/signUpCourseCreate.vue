<template>
    <div>
    	<div>
        	<span class="left">星期：</span>
        	<strong class="right">{{day}}</strong>
        </div>
        <div>
        	<span class="left">学期：</span>
        	<strong class="right">{{termData.name}}</strong>
        </div>
        <div>
        	<span class="left">课程周期：</span>
        	<strong class="right">{{termStartDate}}至{{termEndDate}}</strong>
        </div>
        <div>
        	<span class="left">教师：</span>
        	<strong class="right">{{teacherName}}</strong>
        </div>
        <div>
        	<span class="left">课程：</span>
        	<el-select v-model="course" class="right" placeholder="请选择">
		        <el-option
		          v-for="item in courses"
		          :key="item.id"
		          :label="item.name"
		          :value="item.id">
		        </el-option>
		    </el-select>
        </div>
        <div>
        	<span class="left" >人数：</span>
        	<el-input v-model="people"  class="right" placeholder="请输入内容"></el-input>
        </div>
        <div>
        	<span class="left" >教室：</span>
        	<el-select v-model="classroom"  class="right" placeholder="请选择">
		        <el-option
		          v-for="item in classrooms"
		          :key="item.id"
		          :label="item.name"
		          :value="item.id">
		        </el-option>
		      </el-select>
        </div>
        <div>
        	<span class="left">等级：</span>
        	<el-select v-model="level" class="right"  placeholder="请选择">
		        <el-option
		          v-for = "item in levels"
		          :key = "item.id"
		          :label = "item.name"
		          :value = "item.id">
		        </el-option>
		    </el-select>
        </div>
        <div>
        	<span class="left">上课时间：</span>
        	<el-time-select
        	  class="right"
    			  v-model="time"
    			  @change="timeFn"
    			  :picker-options="{
    			    start: start,
    			    step: '00:5',
    			    end: '21:00'
    			  }"
    			  placeholder="选择时间">
			    </el-time-select>
        </div>
        <div>
        	<span class="left" >时长：</span>
        	<el-input v-model="duration" @change="durationFn" class="right" placeholder="请输入内容"></el-input>
        </div>
        <div>
        	<span class="left">下课时间：</span>
        	<strong class="right">{{endTime}}</strong>
        </div>
        <div style="margin:10px 0">
          <span >本课程有{{count}}课时</span>
          <strong>可请假：{{belowNum}}次</strong>
        </div>
        <div>
          <span class="left">设置请假次数：</span>
          <el-input-number class="right" v-model="belowNum2"  :min="0" :max="100"></el-input-number>
        </div>
    </div>
</template>
<script>
export default {
    props:[
       "day",
       "termData",
       "termStartDate",
       "termEndDate",
       "teacherName",
       "startTime"
    ],
    name: 'student-sign-up',
    data() {
      return{
        courses: [],
        course: '',
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
        classrooms: [],
        classroom: '',
        level: '',
        time: '',
        start: '07:00',
        endTime: '',
        duration: '',
        people: '',
        belowNum2: 0,
      }
    },
    created() {
      this.init()  
    },
    computed: {
      belowNum() {
        //计算这个学期有几节课
        if (!this.termData.startDate||!this.termData.endDate) {
          return 
        }
        let startDate = new Date(this.termData.startDate);
        let endDate = new Date(this.termData.endDate);
        let days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        let count = 0;
        let num = 1;
        let classTimes = 0
        while(num){
          //当开始日期年月日和结束日期相等时表示这学期结束了
          if (startDate.getFullYear() === endDate.getFullYear()&& startDate.getMonth() === endDate.getMonth() && startDate.getDate() === endDate.getDate()) {
            //因为最后一天也算判断最后算不算
            if(days[startDate.getDay()] === this.day){
              count+=1
            }
            //当num=0退出循环
            num = 0
          }else{
            if(days[startDate.getDay()] === this.day){
              count+=1
            }
            startDate.setDate(startDate.getDate()+1)
          }
        }
        //判断范围
        if (count <= this.termData.belowClass1) {
          classTimes = this.termData.numberOfRequests1
        }else if(count > this.termData.belowClass1&&count<=this.termData.belowClass2){
          classTimes = this.termData.numberOfRequests2
        }else{
          classTimes = this.termData.numberOfRequests3
        }
        this.belowNum2 = classTimes
        return classTimes
      },
      count(){
         //计算这个学期有几节课
        if (!this.termData.startDate||!this.termData.endDate) {
          return 
        }
        let startDate = new Date(this.termData.startDate);
        let endDate = new Date(this.termData.endDate);
        let days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        let count = 0;
        let num = 1;
        let classTimes = 0
        while(num){
          //当开始日期年月日和结束日期相等时表示这学期结束了
          if (startDate.getFullYear() === endDate.getFullYear()&& startDate.getMonth() === endDate.getMonth() && startDate.getDate() === endDate.getDate()) {
            //因为最后一天也算判断最后算不算
            if(days[startDate.getDay()] === this.day){
              count+=1
            }
            //当num=0退出循环
            num = 0
          }else{
            if(days[startDate.getDay()] === this.day){
              count+=1
            }
            startDate.setDate(startDate.getDate()+1)
          }
        }
        return count
      }
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
	    	console.log(res)
	        if(typeof res === 'object'&&res.data){
	            this.classrooms = res.data;
	        }else{
	          alert('数据出错')
	        }
	    });
      },
      //时长存在算出结束时间
      timeFn(){
        if (parseInt(this.duration)!=this.duration||!this.duration) {
           return 
      	}
  	    this.endTimeFn()
      },
      //开始时间存在算出结束时间
      durationFn() {
      	 if (isNaN(this.duration)) {
            return this.$message('不是数字')
      	 }
      	 if (parseInt(this.duration)!=this.duration) {
            return this.$message('不是整数')
      	 }
      	 if (!this.time) {
            return
      	 }
      	 this.endTimeFn()
      },
      //结束时间
      endTimeFn(){
        let newDate = new Date('2018-1-1 '+this.time)
      	newDate.setMinutes(newDate.getMinutes()+Number(this.duration))
      	this.endTime= this.zerofill(newDate.getHours()) + ':' + this.zerofill(newDate.getMinutes())
      },
      //补领
      zerofill(num){
        return num<10?'0'+num:''+num
      },
      submit(data){
      	if (!this.course) {
          return this.$message('请选择课程名称')
      	}
      	if (!this.level) {
          return this.$message('请选择等级')
      	}
      	if (!this.time) {
          return this.$message('请选择上课时间')
      	}
      	if (!this.duration) {
          return this.$message('请填写时长')
      	}
      	if (!this.classroom) {
          return this.$message('请选择教室')
      	}
        let totalLeave = 0
        if (this.belowNum2!==this.belowNum) {
          totalLeave = this.belowNum2
        }else{
          totalLeave = this.belowNum
        }
      	data.courseNameId = this.course;
      	data.level = this.level;
      	data.startTime = this.time;
      	data.duration = this.duration;
      	data.endTime = this.endTime;
      	data.classroomId = this.classroom;
      	data.dayOfWeek = this.day;
      	data.number = this.people;
        data.totalLeave = totalLeave
      	this.$http.post('/api/courseTable/addDetail',data).then((res)=>{
          if(res.data.code){
           this.$emit('addCourseSuccess')
          }else{
            this.$message(res.data.msg)
          }
	      });
      },
      clearData(){
          
      }
    },
    watch:{
      startTime(newData,oldDate){
        this.courses = [];
        this.course = '';
        this.classrooms = [];
        this.classroom = '';
        this.level = '';
        this.time = '';
        this.start = '07:00';
        this.endTime = '';
        this.duration ='';
        this.people ='';
        this.belowNum2 = 0;
        this.init();
        this.time = newData;
      }
    }
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