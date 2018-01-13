<template>
  <div>
    <div class="suspendClassShow" style="padding-left:102px;">本课程你已请假{{courseTableDetailStudent.allNumberOfChangeClass-courseTableDetailStudent.numberOfleave}}次，剩余{{courseTableDetailStudent.numberOfleave}}次，补课{{courseTableDetailStudent.allNumberOfChangeClass-courseTableDetailStudent.numberOfChangeClass}}次，剩余{{courseTableDetailStudent.numberOfChangeClass}}次</div> 
    <div class="suspendClassShow" style="padding-left:100px;font-size:12px;color:red">(注：一次调课= 一次请假 + 一次补课)</div> 
    <el-form :model="oChangecourse" :rules="rules" ref="ruleForm" label-width="185px" class="demo-ruleForm">
        <el-form-item label="学生姓名："  class='reMargin'>
            {{sStudentName}}
        </el-form-item>
        <el-form-item label="课程名称：" class='reMargin'>
            {{oCourseTableDetail.sCourseName}}
        </el-form-item>
        <el-form-item label="时长：" class='reMargin'>
             {{oCourseTableDetail.nDuration}}
        </el-form-item>
        <el-form-item label="周期：" class='reMargin'>
             {{oCourseTableDetail.sStartDate | viewDate}}~{{oCourseTableDetail.sEndDate | viewDate}} {{oCourseTableDetail.sDayOfWeek}}{{oCourseTableDetail.sStartTime | viewHouAndSec}}~{{oCourseTableDetail.sEndTime | viewHouAndSec}}
        </el-form-item>
        <el-form-item label="教师：" prop="nTeacherId">
            <el-select v-model="oChangecourse.nTeacherId" @change="fChangeTeacher">
                <el-option v-for="item in aTeacher" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="请选择补课时间：" prop="nMakeupId">
            <el-select v-model="oChangecourse.nMakeupId" >
                 <el-option v-for="item in aChangeClass"  :key="item.id" 
                       :label=" (item.date +' '+item.dayOfWeek+' '+item.startTime + '-' +item.endTime )" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button @click="back" style="margin-left:30px;">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
   props:['nStudentId','nCourseTableDetailId'],
   data() {
      return {
        oChangecourse: {
          nTeacherId:'',
          nMakeupId:'',
          sReason:''
        },
        sStudentName:'',
        oCourseTableDetail:{
           sCourseName:'',
           nDuration:'',
           sStartDate:'',
           sEndDate:'',
           sStartTime:'',
           sEndTime:'',
           sDayOfWeek:''
        },
        aTeacher:[],
        aChangeClass:[],
        courseTableDetailStudent:{},
        rules: {
          nTeacherId: [
            { required: true,type: 'number', message: '请选教师', trigger: 'change' }
          ],
          nMakeupId: [
            { required: true,type: 'number', message: '请选择补课时间', trigger: 'change' }
          ],
          sReason: [
            { required: true, message: '请输入请假原因', trigger: 'change' }
          ]
        }
      }
    },
    created(){
         this.fGetStudentInfo()
         this.fGetCourseTabaleDetail()
         this.getNumberOfChangeClass()
        //  this.courseTableChangeClass/getMakeupDataForStudent
        this.getMakeupDataForStudent()
    },
    methods: {
        fGetStudentInfo(){
            if(this.nStudentId){
                this.$http.get('/api/student/getById',{params:{id:this.nStudentId}}).then((res)=>{
                   this.sStudentName=res.data.name
                })
            }else{
                console.log('没有传学生id或者传的错误值')
            }
        },
        fGetCourseTabaleDetail(){
            if(this.nCourseTableDetailId){
                this.$http.get('/api/courseTable/getByDetailId',{params:{id:this.nCourseTableDetailId}}).then((res)=>{
                   if(res.data.code==1){
                       let {courseName,dayOfWeek,startDate,endDate,startTime,endTime,duration}=res.data.data
                       this.oCourseTableDetail.sCourseName=courseName
                       this.oCourseTableDetail.nDuration=duration
                       this.oCourseTableDetail.sStartDate=startDate
                       this.oCourseTableDetail.sEndDate=endDate
                       this.oCourseTableDetail.sStartTime=startTime
                       this.oCourseTableDetail.sEndTime=endTime
                   }
                })
            }else{
                console.log('没有课程id或者传的错误值')
            } 
        },
        getNumberOfChangeClass(){
           if(this.nStudentId&&this.nCourseTableDetailId){
                this.$http.get('/api/courseTable/getNumberOfChangeClass',{params:{courseTableDetailId:this.nCourseTableDetailId, studentId:this.nStudentId}}).then((res)=>{
                  if(res.data.code==1){
                      this.courseTableDetailStudent=res.data.data
                   }
                })
           }else{
              console.log('没有传学生id或者传的错误值&&没有课程id或者传的错误值') 
           }
        },
        getMakeupDataForStudent(){
           if(this.nStudentId&&this.nCourseTableDetailId){
                this.$http.get('/api/courseTableChangeClass/getMakeupDataForStudent',{params:{courseTableDetailId:this.nCourseTableDetailId, studentId:this.nStudentId}}).then((res)=>{
                  console.log(res)
                  if(res.data){
                    this.aTeacher=res.data.teachers
                   }
                })
           }else{
              console.log('获取老师空闲课程没有传学生id或者传的错误值&&没有课程id或者传的错误值') 
           }
        },
        fChangeTeacher(){
            this.$http.post('/api/courseTableChangeClass/getMakeupDataForStudentByTeacherId',{nCourseTableDetailId:this.nCourseTableDetailId,studentId:this.nStudentId,teacherId:this.oChangecourse.nTeacherId}).then((res) =>{
                if(res.data.code=1){
                   this.aChangeClass=res.data.data
                }else{
                   console.log(res.data.msg) 
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.nStudentId&&this.nCourseTableDetailId){
                      this.$http.post('/api/courseTableChangeClass/addMakeup',{studentId:this.nStudentId,courseTableDetailId:this.nCourseTableDetailId,currentTeacher:this.oChangecourse.nTeacherId,toCourseTableItemId:this.oChangecourse.nMakeupId,reason:this.oChangecourse.sReason}).then((res) =>{
                        var data = res.data;
                        if(data.code == 1){
                            this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                            this.$emit('success');
                        }
                        else{
                            this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                        }
                    
                        // var data = res.data;
                        // this.data = data.teachers;
                        // this.info = data.info;
                      });
                    }else{
                         console.log('获取老师空闲课程没有传学生id或者传的错误值&&没有课程id或者传的错误值')  
                    }
                } else {
                  console.log('error submit!!');
                   return false;
                }
            });
        },
        back(formName) {
        //   this.$refs[formName].resetFields();
           this.$emit('success');
        }
    },
    watch:{
        nStudentId(){
            this.fGetStudentInfo()
            this.fGetCourseTabaleDetail()
            this.getNumberOfChangeClass()
            //  this.courseTableChangeClass/getMakeupDataForStudent
            this.getMakeupDataForStudent()
        }

    }
}
</script>
<style lang="less" scoped>
   .numberOfChangeClass{
       padding-left: 16px;
   }
   .reMargin{
       margin-bottom: 10px;
   }
</style>


