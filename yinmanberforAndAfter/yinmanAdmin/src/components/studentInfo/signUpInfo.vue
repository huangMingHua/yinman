<template>
  <div class="p-wrap-table">
    <div class="add"><el-button type="primary" @click="add">+报名</el-button></div> 
    <table>
      <thead>
        <th>id</th>
        <th>课程名称</th>
        <th>课程时间</th>
        <th>报名日期</td>
        <th>状态</th>
        <th>操作</th>
      </thead>
        <tbody>
          <tr v-for="(item,index) in tableData">
            <td>{{item.id}}</td>
            <td>{{item.courseTableDetail.courseName}}</td>
            <td>{{item.startCourseTableItemId?item.startCourseTableItem.date:item.courseTableDetail.startDate | viewDate}}至{{item.courseTableDetail.endDate | viewDate}} {{item.courseTableDetail.dayOfWeek}} {{item.courseTableDetail.startTime | viewHouAndSec}}~{{item.courseTableDetail.endTime | viewHouAndSec}} </td>
            <td>{{item.createTime}}</td>
            <td>{{item.state}}</td>
            <td>
                <el-button type="text" @click="details(index,item)" >审核</el-button>
                <!-- <el-button type="text" v-if="item.state=='已确认'" @click="cancel(index,item)" >取消报名</el-button> -->
            </td>
          </tr>
        </tbody>
    </table>
    <el-dialog title="报名课程"  :visible.sync="showStudentSignUp" v-if="showStudentSignUp" :modal="false">
      <student-signUp :studentId='this.$route.query.studentId' @btnBack="btnBack" @signUpSuccess="signUpSuccess"></student-signUp>
    </el-dialog>
    <el-dialog title="报名审核"  :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <auditing :singleUser="singleUser" :singleChecked='singleChecked' @changes="change()" @btnBack="signBtnBack"  @success="success"></auditing>
    </el-dialog>
  </div>
</template>
<script>
import studentSignUp from '../signUp/studentSignUp1';
import auditing from '../registrationRecord/auditing'
export default {
  props:['studentId'],
  data(){
      return{
        tableData: [],
        showStudentSignUp:false,
        dialogFormVisible: false,
        singleChecked: false,
        singleUser: {},
        backSingleUser: "",
      }
  },
  created(){
     this.init()
  },
  methods:{
     init(){
        this.dialogFormVisible = false
        this.$http.get("/api/signUpCurriculum/getSignCurriculum",{params: {studentId:this.studentId}}).then((response)=>{
          this.tableData=response.data
          console.log(response.data,1111)
          this.tableData.reverse()
        })
     },
     add() {
          this.showStudentSignUp=true;
      },
    btnBack() {
          this.showStudentSignUp=false;
        },
    signBtnBack(){
      this.dialogFormVisible= false
    } ,   
    signUpSuccess(){
       this.init()
       this.showStudentSignUp=false;
    },
        details(index, val) {
        console.log(val)
        this.dialogFormVisible = true
        if(val.state=='已停课' || val.state=='已取消'||val.state=='已确认'||val.state=='已拒绝'||val.state=='已转课'){
          this.singleChecked=true
        }else{
          this.singleChecked=false
        }
        this.singleUser=JSON.parse(JSON.stringify(val))
        this.backSingleUser=JSON.parse(JSON.stringify(val))
      },
     success(){
          this.init()
     },
     cancel(index,item){
         this.$confirm('选择已取消后状态不可更改，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/signUpCurriculum/backEndCancel', {
            id: item.id,
          }).then((res) => {
            if(res.data.code==1){
             this.init()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });          
        });
      }
  },
 
  watch:{
    '$route' (to, from) {
      this.init()
    } 
  },
  components:{
    studentSignUp,
    auditing
  }
}
</script>
<style lang="less" scoped>
   .p-wrap-table {
         padding-bottom: 50px;
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
        }
    }
</style>


