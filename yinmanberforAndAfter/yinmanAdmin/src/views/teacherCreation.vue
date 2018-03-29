<template>
       <div class="p-search-wrap">
        <!--<div class="p-search-head">
          <el-input class="query-input" v-model="query" placeholder="查询：请输入教师姓名"></el-input>
          <el-button type="primary" class="query-btn">查询</el-button>
        </div>-->
        <div class="p-search-table">
          <table style="float:left;width: 100%;">
            <thead>
              <tr>
                <th>id</th>
                <th>教师姓名</th>
                <th>性别</th>
                <th>头像</th>
                <th>联系电话</th>
                <th>最后交互</th>
                <th style="width:300px">操作</th>
              </tr>
              <tr>
                <th></th>
                <th><el-input @change="queryFn" v-model="teacherName" placeholder="输入教师姓名"></el-input></th>
                <th></th>
                <th></th>
                <th><el-input @change="queryFn" v-model="telephone" placeholder="输入联系电话"></el-input></th>
                <th style="width:200px"></th>
                <th style="width:300px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(list,index) in teacherArray">
                <td>
                  {{list.teacher.id}}
                </td>
                <td>
                  {{list.teacher.name}}
                </td>
                <td>{{list.teacher.sex}}</td>
                <td>
                  <img :src="list.user.wxHead">
                </td>
                <td>{{list.teacher.phoneNumber}}</td>
                <td>{{list.user.lastInteraction}}</td>
                <td>
                   <router-link  :to="{ path: '/courseTable/viewItems', query: { teacherId: list.teacher.id } }" class='el-button--text'>每周课表</router-link>
                   <router-link  :to="{ name: '/courseTable/addDetail', params: { teacherId: list.teacher.id } }" class='el-button--text'>排学期课</router-link>
                   <router-link  :to="{ path: 'teacherInfo', query: { teacherId: list.teacher.id }}" class='el-button--text'>教师档案</router-link>
                   <el-button type="text"   @click="isDisable(list.user)">{{list.user.isDisable}}</el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <el-pagination class="pagination" @current-change="changePage" layout="prev, pager, next" :total="page">
          </el-pagination>
        </div>  
      </div>
</template>

<script>
import auth from '../auth'
import menus from '../nav-config'
import post from '../post'
import get from '../get'
  export default {
    name:"introduce",
    data(){
      return {
        curri:"",
        query:'',
        page:1,
        CPage:1,
        limit:10,
        teacherArray:[],
        loggedIn: auth.loggedIn(),
        delCurriculum:[],
        timer:null,
        isShow: false,
        type:0,
        singleTeacher:{
        head:"",
        identityCategory:"",
        name:"",
        sex:"",
        dateOfBirth:"",
        phoneNumber:""
        }
        ,
        singleUser:{

        },
        idx:"",
        index:"",
        obj:"",
        teacherValue: '',
        date2:"",
        date3:"",
        dates:[["",""]],
        id:"",
        butsValue:[],
        dialogVisible:false,
        teacherName:'',
        telephone:'',
        professorCourse:'',
        aRemarks:[]
      }
    },
    created () {
        //初加载
      this.initialCurriculum(this.CPage,this.limit)
	  },
    methods:{
      //初始化
      initialCurriculum(page,limit){
        get('/api/teacher/getList?page='+page+'&limit='+limit).then((response) => { 
          for(let [index,item]  of response.data.list.entries()){
            if(item.user.isDisable==1){
              item.user.isDisable='启用'
            }else{
              item.user.isDisable='禁用'
            }
            if(item.user.remarks.length>3){
                  this.aRemarks[index]=item.user.remarks.substr(0,3)+"..."
                }else{
                  this.aRemarks[index]=item.user.remarks
                }
          }
          this.teacherArray=response.data.list
          this.page=response.data.totalCount
        });
      }
      ,
      currentChange(val){
        //分页跳转
         // this.curriculumArray=arr
      },
      isDisable(obj){
          //禁用或启用
        var obj=Object.assign({},obj) 
        if(obj.isDisable=="禁用"){
          obj.isDisable=1
        }else{
          obj.isDisable=0
        }
        post("/api/user/changeIsDisable",{id:obj.id,isDisable:obj.isDisable}).then((response)=>{
          if(response.data.code==1){
            this.$message('修改成功')
            this.initialCurriculum(1) 
          }else{
            this.$message(response.data.msg)
          }
        })
       },
       queryFn(){
         if(this.teacherName||this.professorCourse||this.telephone){
            this.$http.post('/api/teacher/query',{teacherName:this.teacherName,professorCourse:this.professorCourse,telephone:this.telephone,pageIndex:this.CPage,limit:this.limit}).then((response)=>{
              for(let item of response.data.list){
                if(item.user.isDisable==1){
                  item.user.isDisable='启用'
                }else{
                  item.user.isDisable='禁用'
                }
              }
              this.teacherArray=response.data.list
              this.page=response.data.totalCount
          })
         }else{
            this.initialCurriculum(this.CPage,this.limit)
         }
       },
       changePage(page){
         this.CPage=page;
         this.initialCurriculum(this.CPage,this.limit)
       }
    },
    watch:{
    },
   }
</script>
<style lang="less" scoped>

.query-input {
      width: 192px;
      height: 28px;
    }
  .p-search-wrap {
    background-color: white;
  }
  .btns {
    margin-top: 20px;
  }
  .p-search-head {
    text-align: left;
    margin-bottom: 22px;
    
  }
  
  .query-btn {
    margin-left: 10px;
  }
  .p-search-table:after {
    content: "";
    display: block;
    clear: both;
  }
  .p-search-table {
    zoom: 1;
    border: 1px solid #dfe6ec;
    table {
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
      img {
        width: 40px;
        height: 40px;
      }
    }
    .spans {
      float: left;
      cursor: pointer;
      color: #20a0ff;
      width: 80px;
      text-align: center;
      height: 100%;
      line-height: 40px;
    }
  }
  .pagination {
    text-align: left;
  }


.show {
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 100;
}

.curriculumShow {
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 1000;
}


.p-curriculum-wrap {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  padding: 20px;
  text-align: left;
  width: 1200px;
  height: 600px;
  background-color: white;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  table {
    border-collapse: collapse;
    width: 1100px;
    margin-top: 50px;
  }
  table td {
    border: 1px solid black;
    padding: 0;
    margin: 0;
    font-size: 13px;
    width: 200px;
    height: 36px;
    line-height: 36px;
    text-align: center;
  }
  table td div {
    height: 36px;
    line-height: 36px;
  }
}
.el-button--text{
  margin-right: 10px;
}
</style>

