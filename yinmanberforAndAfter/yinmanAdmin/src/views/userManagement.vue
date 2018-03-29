<template>
   <p-layout>
       <el-tabs v-model="activeName" @tab-click="handleClick">
     <el-tab-pane label="所有用户" name="user">
         <div class="p-search">
          <div class="p-search-wrap">
           <div class="p-search-table">  
            <table style="float:left;">
              <thead>
                <tr>
                  <th>id</th><th>微信头像</th><th>微信昵称</th><th>性别</th><th>身份类别</th><th>学生</th><th>关注时间</th><th>最后交互</th><th>是否关注</th><th>备注</th><th colspan="3">操作</th>  
                </tr>
                 <tr>
                  <th></th>
                  <th></th>
                  <th><el-input style="margin-top:-20px;" @change="query" v-model="wxName" placeholder="输入微信昵称"></el-input></th>
                  <th></th>
                  <th>
                    <el-select @change="query" style="margin-top:-20px;" v-model="identity" placeholder="请选择">
                      <el-option
                        v-for="item in typeOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                 </th>
                 <th></th>
                 <th></th>
                 <th></th>
                 <th></th>
                 <th colspan="3"></th>  
                </tr>
              </thead>
              <tbody>
               <tr v-for="(list,index) in userInfo">
                 <td>{{list.id}}</td>
                 <td><img :src="list.wxHead"></td>
                 <td>{{list.wxName}}</td>
                 <td v-if='list.state==2'>{{list.teacher.sex}}</td>
                 <td v-else>{{list.sex==1?"男":"女"}}</td>
                 <td>
                   {{option[index]}}
                 </td>
                 <td><span v-if="list.student" v-for="(item,index) in list.student">{{item.name}}<em v-if="index!==(list.student.length-1)">，</em></span></td>
                 <td>{{list.attentionTime}}</td>
                 <td>{{list.lastInteraction}}</td>
                 <td>{{list.publicOpenId?'是':'否'}}</td>
                 <td :title='list.remarks'>
                    <span class="remarks" >{{aRemarks[index]}}</span>
                 </td>
                 <td>
                   <router-link v-if="option[index]!='教师'?true:false" :to="{  path: 'studentInfo', query: { userId:list.id ,studentId:list.student.length>0?list.student[0].id:'',activeName:'user'}}" class="del" @click="studentList(list.id)">用户详细</router-link>
                   <router-link v-if="option[index]=='教师'?true:false" :to="{  path: 'teacherInfo', query: { userId:list.id  }}" class='el-button--text'>教师详细</router-link>
                 <td>
                    <span @click="isDisable(list)" class="del" v-if="option[index]==='教师'?true:false">{{list.isDisable}}</span>
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
                :total="totalCount">
              </el-pagination>
            </div>
          </div>
       </div> 
        </el-tab-pane>
        <el-tab-pane label="未报名学生" name="added">
          <existing></existing>
        </el-tab-pane>
 <!--        <el-tab-pane label="学生管理" name="student">
           <sign-up></sign-up>
        </el-tab-pane> -->
          <!-- <el-tab-pane label="续课管理" name="continuedEducation">
          <renew></renew>
        </el-tab-pane> -->
       <!--  <el-tab-pane label="教师管理" name="teacher">
          <teacher></teacher>
        </el-tab-pane> -->
      </el-tabs>
   </p-layout>
</template>
<script>
import post from '../post'
import get from '../get'
// import ldentitySelection from '../components/userManagement/ldentitySelection'
import userInfo from '../components/userManagement/userInfo'
import studentSignUp from '../components/signUp/studentSignUp'
import teacher from './teacherCreation'
import signUp from './signUp'
import booking from './bookingTestRecord'
import existing from './existingStudents'
// import renew from '../components/renew'
  export default {
      name:"introduce",
      data(){
      	return {
             activeName: 'first',
             typeOption: [
               {
                value: 0,
                label: '所有'
              },{
                value: 1,
                label: '学生家长'
              }, {
                value: 2,
                label: '教师'
              }],
              wxName:'',
              option:[],
              totalCount:1,
              CPage:1,
              limit:10,
              userInfo:[],
              identity:"",
              student:[],
              studentId:null,
              timer:null,
              aRemarks:[]
          }
      },
      created () {
          this.initialCurriculum(this.CPage,this.limit) 
          this.activeName=this.$route.query.activeName||"user"
          let arr=['user','added','booking','continuedEducation','student','teacher']
          arr.indexOf(this.$route.query.activeName)==-1?this.activeName="user":""
	    },
    methods:{
      initialCurriculum(pageIndex,limit){
          get(`/api/user/getPaging?pageIndex=${pageIndex}&limit=${limit}`).then((response)=>{
                  this.option=[]
                  this.userInfo=response.data.list
                  this.totalCount=Number(response.data.totalCount)
                  console.log(this.userInfo)
                  for(let [index,item] of this.userInfo.entries()){
                       if(item.state==0){
                           this.option.push("普通用户")
                       }else if(item.state==1){
                           this.option.push("学生家长")
                       }else{
                           this.option.push("教师")
                       }
                       if(item.isDisable==0){
                           item.isDisable="禁用" 
                       }else{
                           item.isDisable="启用" 
                       }
                       if(item.remarks.length>3){
                          this.aRemarks[index]=item.remarks.substr(0,3)+"..."
                        }else{
                          this.aRemarks[index]=item.remarks
                        }
                  }
          })
      } ,
      currentChange(val){
          this.CPage=val
          this.query()
      },
       handleClick(tab, event) {
           this.$router.push({
              path: '/userManagement',
              query: {activeName:tab.name}
          })
      },
      isDisable(obj){
         var obj=Object.assign({},obj) 
        if(obj.isDisable=="禁用"){
           obj.isDisable=1
        }else{
           obj.isDisable=0
        }
        post("/api/user/changeIsDisable",{id:obj.id,isDisable:obj.isDisable}).then((response)=>{
              if(response.data.code==1){
                this.$message("修改成功")
              }else{
                this.$message("修改失败")
              }
             this.initialCurriculum(this.CPage,this.limit) 
         })
      },
      query(){
        if(this.identity == 0){
               this.identity='' 
          }
        if(this.wxName||this.identity){
            this.$http.post('/api/user/getByName',{wxName:this.wxName,identity:this.identity,pageIndex:this.CPage,limit:this.limit}).then((response)=>{
                  this.option=[]
                 this.userInfo=response.data.list
                  this.totalCount=response.data.totalCount
                  for(let  item of this.userInfo){
                       if(item.state==0){
                           this.option.push("普通用户")
                       }else if(item.state==1){
                           this.option.push("学生家长")
                       }else{
                           this.option.push("教师")
                       }
                       if(item.isDisable==0){
                           item.isDisable="禁用" 
                       }else{
                           item.isDisable="启用" 
                       }
                  }      
            })  

        }else{
          this.initialCurriculum(this.CPage,this.limit) 
        }
       
      }
    },
    watch:{
    },
    components:{
      userInfo,
      studentSignUp,
      signUp,
      booking,
      teacher,
      existing,
      // renew
    },
    extend:{
      existing
    }
   }
</script>
<style lang="less" scoped>
       .fade-enter-active, .fade-leave-active {
          transition: opacity .5s
        }
      .fade-enter, .fade-leave-active {
        opacity: 0
      }
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
      .p-wrap{
      position:absolute;
      left:0;
      top:0;
      bottom:0;
      right:0;
      margin:auto;
      padding:20px;
      text-align:left;
      width:1200px;
      height:800px;
      background-color:white;
      overflow:auto;
      box-shadow:0 0 5px 0 rgba(0,0,0,0.5);
      .p-wrap-table{
        table{
          width:100%;
          border-collapse:collapse;
        }
         th{
              background-color:#eef1f6;
            }
            th,td{
              border-right: 1px solid #dfe6ec;
              border-bottom: 1px solid #dfe6ec;
              width:120px;
              height:40px;
              font-size:14px;
              text-align:center;
              img{
                width:40px;
                height:40px;
              }
            }
      }
      >div{
          margin:20px 0;
      }
      .input{
        display:inline-block;
        width:150px;
      }
      .span{
        display:inline-block;
        width:150px;
        text-align:center;
        vertical-align:middle;
      }
      .textarea{
        width:300px;
      }
      .btn{
        margin:0 80px;
      }
    }

      .popup{
        position:absolute;
        left:0;
        right:0;
        top:100px;
        margin:auto;
        width:200px;
        height:40px;
        line-height:40px;
        text-align:center;
        background-color:rgba(0,0,0,0.1);
        z-index:1000;
        border-radius:10px;
      }
     .remarks{
       width: 100%;
       height: 100%;
     }
</style>
