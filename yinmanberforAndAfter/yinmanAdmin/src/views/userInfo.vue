<template>
 <p-layout>
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/userManagement?activeName=user' }">所有用户</el-breadcrumb-item>
        <el-breadcrumb-item>用户详细</el-breadcrumb-item>
      </el-breadcrumb>
   <div class="box">
     <editUser>
     </editUser>
    <div class="add" v-if="identity!=2">
     <el-button type="primary" @click="add">+添加学生</el-button>
    </div>
    <div class="table" v-if="identity!=2">
       <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="宝宝姓名"
            width="150">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="宝宝性别"
            width="120">
          </el-table-column>
          <el-table-column
            prop="dateOfBirth"
            label="出生日期"
            width="120">
          </el-table-column>
          <el-table-column
            prop="school"
            label="就读学校"
            width="120">
          </el-table-column>
          <el-table-column
            prop="parentName"
            label="家长姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="telephone"
            label="联系电话"
            width="150">
          </el-table-column>
          <el-table-column
            prop="address"
            label="家庭住址"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            width="300">
            <template scope="scope">
              <el-button type="text" size="small">
                <router-link :to="{ path: 'studentInfo', query: { studentId: scope.row.id }}" class='addCourses'>查看详细</router-link>
              </el-button>
              <el-button  type="text" size="small" @click="deleteStudent(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
     </div>
      <el-dialog
        title="学生信息"
        :visible.sync="studentBool"
        size="tiny"
      >
      <add-student @submit='submit' @back='back' v-if="studentBool"></add-student>
    </el-dialog>
   </div>  
 </p-layout>     
</template>
<script>
import post from '../post'
import get from '../get'
import addStudent from '../components/userManagement/addStudent'
import editUser from '../components/common/editUserInfo'
export default {
  props:['userId',"changeIndex"],
  data(){
    return {
       tableData: [],
       studentBool:false,
       editUser:{},
       identity:'',
       student:{
         name:'',
         sex:'',
         dateOfBirth:'',
         school:'',
         parentName:'',
         telephone:'',
         address:'',
         basics:'',
         introduceBaby:''
       },
       typeOption: [{
                value:0,
                label: '普通用户'
              }, {
                value: 1,
                label: '学生家长'
              }, {
                value: 2,
                label: '教师'
              }],
    }
  },
  created(){
    //初加载
    this.initialCurriculum() 
  },
  methods:{
    //初始化
    initialCurriculum(){
       get('/api/student/getByStudent?userId='+this.$route.query.userId).then((response)=>{
           console.log(response)
           this.tableData=response.data
       })
       get('/api/user/getById?id='+this.$route.query.userId).then((response)=>{
          console.log(response)
           this.editUser=response.data
           this.identity=this.editUser.state
       })
    },
    back(){//弹框返回
       this.studentBool=false
    },
    submit(){
      //提交学生信息
       this.studentBool=false
       this.initialCurriculum() 
    },
    add(){
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
    backParent(){
      //返回父级页面
      this.$router.go(-1)
    },
    edit(item){
      //编辑学生
      this.student=item
      this.studentBool=true
    },
    deleteStudent(item){
      //删除学生
      this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            get("/api//student/deleteUser?id="+item.id).then((response)=>{
              this.$message(response.data.msg)
              if(response.data.code==1){
                this.initialCurriculum() 
              }
            })
        }).catch(() => {
                   
        });
    },
  },
  components:{
    editUser,
    addStudent
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
    .add{
      margin: 40px 0;
      width: 200px;
      text-align: left;
      padding-left: 50px;
    }
    .back{
      margin-top: 50px;
    }
    .table{
      padding-left: 50px;
    }
  }
</style>

