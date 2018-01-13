<template>
  <div class="box-body-lower" >
         <div class="lower-body">
            <div class="lower-body-row"> 
             <span class="warn">*</span>
             <h5>教师姓名</h5>
             <div class="input">
                 <el-input v-model="teacher.name"  placeholder="请输入内容"></el-input>
             </div>
            </div>
            <div class="lower-body-row"> 
             <span class="warn">*</span>    
             <h5>性别</h5>
             <div class="input">
                 <el-radio class="radio" v-model="teacher.sex" label="男">男</el-radio>
                 <el-radio class="radio" v-model="teacher.sex" label="女">女</el-radio>
             </div>
            </div>
            <div class="lower-body-row"> 
             <span class="warn">*</span>   
             <h5>出生日期</h5>
             <div class="input">
               <el-date-picker
                    v-model="teacher.dateOfBirth"
                    type="date"
                    placeholder="选择日期"
                    >
                </el-date-picker>
             </div>
            </div>
            <div class="lower-body-row">
             <span class="warn">*</span>    
             <h5>联系电话</h5>
             <div class="input">
              <el-input v-model="teacher.phoneNumber" placeholder="请输入内容"></el-input>
             </div>
            </div>
            <!-- <div class="lower-body-row"> 
             <h5>教授课程</h5>
             <div class="input">
                <span class="span">教授课程(可多选)</span>
                <el-select v-model="teacher.professorCourse" multiple placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                    </el-option>
                </el-select>
             </div>
            </div> -->
           <div class="btns"><el-button type="primary"  @click="submitUserInfo">提交</el-button></div> 
         </div>        
      </div> 
</template>
<script>
export default {
  props:['teacherId'],
  data(){
    return{
       teacher:{
           name:"",
           sex:"",
           dateOfBirth:"",
           phoneNumber:"",
           professorCourse:""
       },
       options:[]
    }
  },
  mounted(){
      let timer=null
       timer=setInterval(()=>{
             if(this.teacherId>0){
               this.initialCurriculum()
               clearInterval(timer)
             }
      },30)
  },
  methods:{
      initialCurriculum(){
        this.$http.get('/api/teacher/getById?id='+this.teacherId).then((response)=>{
            response.data.professorCourse=response.data.professorCourse.split(',')
            this.teacher=response.data
            this.$emit('getTeacher',this.teacher)
        })
        this.$http.get('/api/course/getAll').then((response) => { 
            this.options=response.data
        });
      },
      submitUserInfo () {
      let {name,sex,dateOfBirth,phoneNumber,professorCourse}=this.teacher
        this.teacher.professorCourse=professorCourse.toString()
        const date=new Date(dateOfBirth)
        this.teacher.dateOfBirth=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
       this.$http.post('/api/teacher/update',{teacherInfo:this.teacher}).then((response) =>{
          if (response.data.code==1) {
            this.initialCurriculum()
            this.$message('修改成功')
          }else{
            this.$message(response.data.msg)
            this.teacher.dateOfBirth=dateOfBirth
            this.teacher.professorCourse=professorCourse
          }
        })
      //}
     },
  },
}
</script>
<style lang="less" scoped>
.box-body-lower{
              margin-top: 20px;
            .lower-body{
                text-align: left;
                .lower-body-row{
                    display: flex;
                    margin: 20px 0;
                    height: 40px;
                    line-height: 40px;
                    .warn{
                        left:65px;
                    }
                    h5{
                        width: 120px;
                        text-align: right;
                        vertical-align: middle;
                        margin: 0;
                        margin-right: 20px;
                    }
                    div{
                        vertical-align: middle;
                        width: 300px;
                    }
                }
                .btns{
                    margin-top: 40px;
                    text-align: center;
                }
            }
     } 
</style>


