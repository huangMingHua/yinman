<template>
  <p-layout>
     <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/userManagement?activeName=teacher' }">教师管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户详细</el-breadcrumb-item>
     </el-breadcrumb>
     <div class="box">
        <div class="el-dialog__header" style="padding:10px 15px !important;">
             <span class="el-dialog__title">用户信息</span>
        </div>
        <com-user :userId="userId" v-if="userId" class="user"></com-user>
        <div class="el-dialog__header" style="padding:10px 15px !important;">
            <span class="el-dialog__title">教师信息</span>
        </div> 
        <com-teacher @getTeacher='getTeacher' :teacherId='teacherId'></com-teacher>
        <el-tabs v-model="activeName">
              <el-tab-pane label="课程表信息" name="couseTableInfo">   <router-link class="el-button el-button--primary" 
                  :to="{ name: '/courseTable/addDetail', 
                  params: { teacherId: teacherId, termId:0 }  }" style="margin:0 0 15px 15px;" >+添加课程表</router-link>
                  <el-table :data="courseTableList" border style="width:60%; margin-bottom:20px;">
                <el-table-column prop="name" label="学期">
                </el-table-column>
                <el-table-column prop="term.name" label="开始时间">
                  <template scope="scope">
                    <el-icon name="time"></el-icon>
                    {{ scope.row.minStartDate | viewDate }}
                  </template>
                </el-table-column>
                <el-table-column prop="term.name" label="结束时间">
                  <template scope="scope">
                    <el-icon name="time"></el-icon>
                    {{ scope.row.maxEndDate | viewDate }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                  <template scope="scope">
                    <router-link class="el-button el-button--text el-button--small" :to="{ name: '/courseTable/addDetail', params: { teacherId: teacherId, termId:scope.row.id } }">编辑第一周课程表</router-link>
                    <router-link class="el-button el-button--text el-button--small" 
                    :to="{ path: '/courseTable/viewItems', query: { teacherId: teacherId, termId:scope.row.id } }">查看周历</router-link>
                  </template>
                </el-table-column>
              </el-table>
              </el-tab-pane>
              <el-tab-pane label="调课信息" name="changeCourseInfo">
                    <div class="terms">
                       学期名称：
                       <el-select v-model="term" @change="changeTearm" placeholder="请选择">
                          <el-option
                            v-for="item in terms"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                        <span>课程周期：{{termDate}}</span>
                    </div>
                    <el-table
                      :data="tableData"
                      style="width: 100%">
                      <el-table-column
                        prop="fromCourseTableItem.courseName"
                        label="课程名"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="teacher.name"
                        label="课程教师"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="fromCourseTableItem.level"
                        label="课程等级"
                        width="100"
                        >
                      </el-table-column>
                       <el-table-column
                        prop="fromCourseTableItem.number"
                        label="课程人数">
                      </el-table-column>
                      <el-table-column
                        prop="fromCourseTableItem.date"
                        label="原课程时间"
                        width="260"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="toCourseTableItem.date"
                        label="现课程时间"
                        width="260"
                        >
                      </el-table-column>
                       <el-table-column
                        prop="fromCourseTableItem.classroom.name"
                        label="原课程教室">
                      </el-table-column>
                      <el-table-column
                        prop="toCourseTableItem.classroom.name"
                        label="现课程教室">
                      </el-table-column>
                      <el-table-column
                        prop="reason"
                        label="原因">
                      </el-table-column>
                    </el-table>
              </el-tab-pane>
            </el-tabs>
          
   </div>
  </p-layout> 
</template>
<script>
  import post from '../post'
  import get from '../get'
  import comUser from '../components/common/editUserInfo'
  import comTeacher from '../components/common/teacherInfo'
  export default {
  data(){
    return{
      activeName: 'couseTableInfo',
      teacherId: this.$route.query.teacherId,
      options:[],
      courseTableList: [],
      userId:"",
      terms:[],
      term:'',
      termDate:'',
      tableData:[],
      nIsTeacherInfoIndex:0
    }
  },
  created(){
    this.userId = this.$route.query.userId || 0
    this.teacherId = parseInt(this.$route.query.teacherId ||0)
    if(this.teacherId==0){
        this.loadUser()    
    }else{
        this.initialCurriculum ()
    }
  } ,
  methods:{
    initialCurriculum () {
       this.$http.get('/api/teacher/getTerms', {
        params: { teacherId: this.teacherId }
      }).then((res)=>{
          if(res.data.data.length>0){
            for (let item of res.data.data) {
              this.terms.push(item)
            }
            this.term=res.data.data[0].name
            this.termDate=res.data.data[0].startDate+'至'+res.data.data[0].endDate
            this.changeTearm(res.data.data[0].id)
          }
      })
      this.$http.get('/api/teacher/getTerms', {
        params: { teacherId: this.teacherId }
      }).then((res)=>{
        console.log(res.data.data)
        this.courseTableList = res.data.data;
      });
    },
    loadUser(){
        this.$http.get('/api/teacher/getByUserId', {
          params: { userId: this.userId }
        }).then((res)=>{
          if(res.data.code==1){
               this.teacherId =res.data.data.id  
               this.initialCurriculum ()
          }
        });
    },
    changeTearm(termId){
      console.log(this.terms)
      for(let item of this.terms){
             if(item.id==termId){
                this.termDate=item.startDate+'至'+item.endDate   
             }
      }
      this.$http.get("/api/courseTableChangeClassForTeacher/getListByTeacherIdAndtermId", {params: { teacherId:this.teacherId, termId: termId}}).then((res)=>{
            if (res.data.code == 1) {
              for (let item of res.data.data){
                    item.fromCourseTableItem.date = item.fromCourseTableItem.date + " " + item.fromCourseTableItem.startTime + "~" + item.fromCourseTableItem.endTime
                    item.toCourseTableItem.date=item.toCourseTableItem.date+" "+item.toCourseTableItem.startTime+"~"+item.toCourseTableItem.endTime
              }
              this.tableData=res.data.data
            }
          })
    },
    getCourseSwitch(val){
         this.changeTearm(val)
    },
    
     getTeacher(teacher){
       this.userId=teacher.userId
       this.teacher=teacher
     }
   },
   components:{
     comUser,
     comTeacher
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
    text-align: left;
    .user{
        padding: 5px 10px;
    }
    .btns{
        margin: 10px 0; 
        text-align: center;
        margin-left: 220px;
    }      

  }
  .terms{
    margin: 0 0 10px 15px;
  }
</style>


