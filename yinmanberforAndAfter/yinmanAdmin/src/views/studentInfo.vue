<template>
  <p-layout>
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/userManagement?activeName=user' }">所有用户</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.query.activeName=='added'" :to="{ path: '/userManagement?activeName=added' }">已添加学生用户</el-breadcrumb-item>
        <el-breadcrumb-item v-else-if="$route.query.activeName=='booking'" :to="{ path: '/userManagement?activeName=booking' }">已预约试课</el-breadcrumb-item>
        <el-breadcrumb-item v-else="$route.query.activeName=='student'" :to="{ path: '/userManagement?activeName=student' }">学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户详细</el-breadcrumb-item>
      </el-breadcrumb>
   <div class="box" style="margin-bottom:50px;text-align:left;">
        <div class="el-dialog__header" style="padding:10px 15px !important">
             <span class="el-dialog__title">用户信息</span>
        </div>
        <com-user :userId="userId" v-if="userId" :changeIndex="changeIndex" @getStudent="getStudent" class="user"></com-user>
        <div style="position:relative;height:60px;">
            <div class="el-dialog__header" style="display:inline;position:absolute;left:0;padding:10px 15px !important;">
              <span class="el-dialog__title">学生信息</span>
            </div> 
            <div class="add">
              <el-button type="primary" @click="addStudent">+添加学生</el-button>
            </div>
        </div>
        <el-tabs v-model="currentStudentId" @tab-click="handleClick" type="border-card">
            <el-tab-pane :label="student.name" :name="student.id.toString()" v-for="(student,index) in students">
                <com-student :studentId="student.id"></com-student>
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
                    </a>
                </div>
                <div>
                    <el-tabs v-model="activeName" type="card">
                            <el-tab-pane label="课程信息" name="courseInfo">
                                <course-info @toSignUp="toSignUp" :termId="term" @termFn="termFn1" :name="student.name"></course-info>
                            </el-tab-pane>
                            <el-tab-pane label="报名管理" name="signUpInfo">
                                <sign-up-info :studentId="student.id" :termId="term"></sign-up-info>
                            </el-tab-pane>
                            <!-- <el-tab-pane label="续课管理" name="continuedEducationInfo">
                                <renew :studentId="student.id" @toCurriculumInfo="toCurriculumInfo" :termId="this.term"></renew>
                            </el-tab-pane> -->
                    </el-tabs>
                </div>
            </el-tab-pane>
        </el-tabs>
            <el-dialog
                title="学生信息"
                :visible.sync="studentBool"
                size="tiny"
            >
              <add-student @submit='submit' @back='back' :userId='userId'  v-if="studentBool"></add-student>
            </el-dialog>
   </div>  
</p-layout>     
</template>
<script>

// import CourseTableItemForStudent from '../components/signUp/CourseTableItemForStudent';
import courseInfo from '../components/studentInfo/courseInfo'
import changingCourseInfo from '../components/studentInfo/changingCourseInfo'
import leave from '../components/studentInfo/leave'
import signUpInfo from '../components/studentInfo/signUpInfo'
import comUser from '../components/common/editUserInfo'
import comStudent from '../components/common/studentInfo'
import addStudent from '../components/userManagement/addStudent'
import renew from  '../components/renew'
export default {
    data() {
        return {
            term: '',
            terms:[],
            termData: '',
            termStartDate: '2018-1-1',
            termEndDate: '2018-1-1',
            showStudentSignUp: false,
            studentBool:false,
            terms: [],
            termId: 0,
            userId:0,
            studentId:0,
            currentStudentId:'0',
            students:[],
            student:{},
            changeIndex:0,
            activeName: 'courseInfo'
        }
    },
  created(){
      this.userId = this.$route.query.userId || 0
      this.studentId = parseInt(this.$route.query.studentId ||0)
      if(this.studentId == 0){
          this.loadUserData()
      }
      else if(this.userId == 0){
          this.loadStudentData()
      }
      else {
          this.currentStudentId = this.studentId.toString();
      }
      this.init();
  },
  methods:{
    init(){
            this.$http.get('/api/term/getAll').then((res)=>{
              if(typeof res==='object'&&res.data){
                this.terms = res.data;
                this.term = res.data[0].id
                this.termFn(res.data[0].id)
              }else{
                alert('数据出错')
              }
            })
    },  
    loadUserData(){
        this.$http.get('/api/user/getById?id='+ this.userId).then(res=>{
              if(res.data.students && res.data.students.length > 0){
                  this.studentId = res.data.students[0].id;
                  this.currentStudentId = this.studentId.toString();
              }
          })
    },
    loadStudentData(){
       this.$http.get('/api/student/getById?id='+ this.studentId).then(res=>{
            if(res.data){
                this.currentStudentId=res.data.id.toString()
                this.userId=res.data.userId
            }
          })
    },
    getUserId(userId){
        this.userId=userId
    },
    view(termId) {
        this.termId = termId;
        this.showStudentSignUp = true;
    },
    //学期的修改
    termFn(id){
        for (let item of this.terms) {
            if (item.id == id) {
                this.termStartDate = item.startDate;
                this.termEndDate = item.endDate;
            }
        }
    },
    termFn1(id){
       this.term = id;
       this.termFn(id);
    },
    add() {
        this.showStudentSignUp=true;
    },
    toSignUp(){
         this.activeName='signUpInfo'
    },
    addStudent(){
      //添加学生
      this.student={
         name:'',
         sex:'',
         dateOfBirth:'',
         school:'',
         parentName:'',
         telephone:'',
         address:'',
         basics:'',
         introduceBaby:''
       }
      this.studentBool=true
    },
    toCurriculumInfo(){
       this.activeName='courseInfo'
    },
    del(termId){
        this.$confirm('确定要删除吗？').then(()=>{
            post('/api/signUp/delete', { termId:termId, studentId:this.singleUser.student.id }).then((res)=>{
                if(res.data.code == 1){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
                else{
                    this.$message({
                        message: data.msg,
                        type: 'error'
                    });
                }
            });
        });
    },
    btnBack() {
        //this.$emit('btnBack')
        this.showStudentSignUp=false;
    },
    getStudent(students,state){
        console.log(state)
         this.students=students
         if(state==2){
                this.$router.go(1)
            }
    },
    getNowStudent(id,index){
         this.studentId=id
         this.$router.push({path:'studentInfo', query: { userId:this.userId,studentId:id,activeName:'student'}})
    },
    back(){//弹框返回
       this.studentBool=false
    },
    submit(){
      //提交学生信息
       this.studentBool=false
       this.changeIndex++
    },
    handleClick(val){
        this.$router.push({path:'/studentInfo',query:{userId:this.userId,studentId:Number(val.name),activeName:this.$route.query.activeName}})
    }
  },
  watch:{
    changeIndex(){
        this.loadUserData()
    }
  },
  components:{
      comUser,
      comStudent,
      addStudent,
      courseInfo,
      renew,
      signUpInfo,
      changingCourseInfo,
      leave
    //   CourseTableItemForStudent
  }
}
</script>
<style lang="less" scoped>
 .breadcrumb{
    height: 60px;
    line-height: 60px;
    padding-left: 15px;
  }
.box{
     .user{
         padding:10px 0;
     }
      .add{
          position:absolute;
          left:110px;top:0;
      }    
      .p-wrap-table {
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background-color: #eef1f6;
        }
        th,
        td {
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
            width: 120px;
            height: 40px;
            font-size: 14px;
            text-align: center;
            img {
                width: 40px;
                height: 40px;
            }
        }
    }  
   
}
  

</style>


