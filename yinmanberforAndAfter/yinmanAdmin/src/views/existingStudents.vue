<template>
 <div class="p-search">
     <div class="p-search-wrap">
        <div class="p-search-table">
            <table>
                <thead>
                    <tr> 
                        <th>id</th><th>学生姓名</th><th>学生性别</th><th>出生日期</th><th>头像</th><th>昵称</th><th>家长姓名</th><th>身份类别</th><th>联系电话</th><th>关注时间</th><th>最后交互</th><th>备注</th><th>操作</th>    
                    </tr>
                     <tr> 
                        <th></th><th><el-input @change="query" v-model="studentName" placeholder="输入学生姓名"></el-input></th><th></th><th></th><th></th><th></th><th><el-input @change="query" v-model="parentName" placeholder="输入家长姓名"></el-input></th><th></th><th></th><th></th><th></th><th></th><th></th>    
                    </tr> 
                </thead> 
                 <tbody>
                    <tr v-for="(item,index) in reserveUser">
                        <td>{{item.id}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.sex}}</td>
                        <td>{{item.dateOfBirth | viewDate}}</td>
                        <td><img style="width:30px;height:30px;" :src="item.user.wxHead"></td>
                        <td>{{item.user.wxName}}</td>
                        <td>{{item.parentName}}</td>
                        <td>学生家长</td>
                        <td>{{item.telephone}}</td>
                        <td>{{item.user.attentionTime}}</td>
                        <td>{{item.user.lastInteraction}}</td>
                        <td :title='item.user.remarks'>{{aRemarks[index]}}</td>
                        <td>
                          <router-link :to="{ path: 'studentInfo', query: { studentId: item.id,activeName:'added'}}" class='addCourses'>学生详细</router-link>
                        </td>
                    </tr>
              </tbody>
            </table> 
        </div>
         <div >
              <el-pagination
                @current-change="currentChange"
                class="pagination"
                layout="prev, pager, next"
                :total="reserveCPage">
              </el-pagination>
          </div>
           <el-dialog
                title="用户管理"
                :visible.sync="userBool"
                :close-on-click-modal="false"
            >
            <student-info :user="user" @editStudent="editStudent"></student-info>
          </el-dialog>
      </div>  
 </div> 
</template>
<script>
import post from '../post'
import get from '../get'
import studentInfo from '../components/existingStudents/studentInfo'
export default {
  data() {
    return {
      reservedPage:1,
      reserveCPage:1,
      reserveLimit:10,
      reserveUser:[],
      userBool:false,
      user:{},
      studentName:'',
      parentName:'',
      aRemarks:[]
    }
  },
  created() {
      //初加载
    this.initialCurriculum(this.reserveCPage,this.reserveLimit) 
  },
  methods: {
      //初始化
    initialCurriculum(reservePageIndex,reserveLimit,) {
      get("/api/student/getNoReserved?pageIndex="+reservePageIndex+"&limit="+reserveLimit).then((res) => {
        this.reservedPage=res.data.totalCount
        this.reserveUser = res.data.list;
        console.log(this.reserveUser)
        for(let [index,item] of this.reserveUser.entries() ){
              if(item.user.remarks.length>3){
                this.aRemarks[index]=item.user.remarks.substr(0,3)+"..."
              }else{
                this.aRemarks[index]=item.user.remarks
              }
        }
        
      })
    },
    currentChange(val) {
        this.reserveCPage=val
          //分页跳转
          this.query()
    } ,
    editStudent() {
        //提交学生信息
      let {name,sex, dateOfBirth,school, parentName, telephone, address, basics, introduceBaby} = this.user
        if(_.trim(name) == ""){
          this.$message("学生姓名不能为空")
        }else if(_.trim(sex) == ""){
          this.$message("宝宝性别不能为空")
        }else if(_.trim(dateOfBirth) == ""){
          this.$message("出生日期不能空")
        }else if(_.trim(school) == ""){
          this.$message("学校不能为空")
        }else if(_.trim(parentName) == ""){
          this.$message("家长姓名不能为空")
        }else if(!(/^1[34578]\d{9}$/.test(telephone))){
          this.$message("联系电话必须是11位的纯数字")
        }else if(_.trim(address) == ""){
          this.$message("家庭住址不能为空")
        }else if(_.trim(basics) == ""){
          this.$message("学习经历不能为空")
        }else{
           const date=new Date(dateOfBirth)
          delete this.user.user
          this.user.dateOfBirth = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
            if(this.user.id){
              post('/api/student/updateStudentInfo',{userInfo:this.user}).then((response)=>{
                console.log(response)
                this.$message(response.data.msg)
                if(response.data.code==1){
                  this.userBool=false
                  this.initialCurriculum(this.reserveCPage,this.reserveLimit) 
                }
              })
            }
        }
      },
      query(){
          if(this.studentName||this.parentName){
            this.$http.post('/api/student/getNoReservedQuery',{studentName:this.studentName,parentName:this.parentName,pageIndex:this.reserveCPage,limit:this.reserveLimit}).then((response)=>{
                 this.reservedPage=response.data.totalCount
                 this.reserveUser = response.data.list;
            })  
          }else{
            this.initialCurriculum(this.reserveCPage,this.reserveLimit) 
          }
      },
    edit(item) {
        //编辑
      if(item){
        this.user=Object.assign({},item)
        this.userBool=true
      }else{
        this.$message("数据存在问题")
      }
    },
  },
  components: {
    studentInfo
  }
}
</script>
<style lang="less" scoped>
    .p-search{
          background-color:#f5f5f5;
          .p-search-wrap{
            background-color:white;
          }
           .btns{
              margin-top:20px;
           }
          .p-search-head{
            text-align:left;
            margin-bottom:22px;
          }
          .query-input{
            width:192px;
            height:28px;
          }
          .query-btn{
            margin-left:10px;
          }
          .p-search-table:after{
             content:"";
             display:block;
             clear:both;

          }
          .p-search-table{
            zoom:1; 
            border:1px solid #dfe6ec;
            table {  
              border-spacing:2px; border-color:grey; width:100%;
              border-collapse: collapse;
              th {
                  width:120px;
                  height:40px; 
                  font-size: 14px;
                  background-color:#eef1f6;
              }
              td{
                  border-right: 1px solid #dfe6ec;
                  border-bottom:1px solid #dfe6ec;
                  width:120px;
                  height:40px; 
                  font-size: 14px;
                  img{
                    width:40px;
                    height:40px;
                  }
              }
            }
            .del{
              width: 100%;
              border: none;
              height: 43px;
              cursor:pointer;
              color:#20a0ff;              
            }
          } 
         .pagination{
           text-align:left;
         }
      }

</style>


