<template>
<div>
    <div class="p-search">
      <div class="p-search-wrap">
        <!--<div class="p-search-head">
          <el-input class="query-input" v-model="QStudent" @change="query"  placeholder="查询：请输入学生姓名"></el-input>
        </div>-->
        <div class="p-search-table">
          <table style="float:left;">
            <thead>
              <tr>
                <th>id</th>
                <th>学生姓名</th>
                <th>学生性别</th>
                <th>报名课程</th>
                <th>头像</th>
                <th>昵称</th>
                <th>家长姓名</th>
                <th>身份类别</th>
                <th>联系电话</th>
                <th>关注时间</th>
                <th>最后交互</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
              <tr>
                <th></th>
                <th><el-input @change="query" v-model="studentName" placeholder="输入学生姓名"></el-input></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th><el-input @change="query" v-model="parentName" placeholder="输入学生姓名"></el-input></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in userInfo">
                <td>{{ item.student.id}}</td>
                <td>{{ item.student.name}}</td>
                <td>{{ item.student.sex}}</td>
                <td><span v-for="curriculum in item.signUpCurriculum" v-if="curriculum.state=='已确认'">{{curriculum.courseTableDetail.course.name}},</span></td>
                <td>
                  <img :src="item.user.wxHead">
                </td>
                <td>{{ item.user.wxName}}</td>
                <td>{{ item.student.parentName}}</td>
                <td>学生家长</td>
                <td>{{ item.student.telephone}}</td>
                <td>{{item.user.attentionTime}}</td>
                <td>{{item.user.lastInteraction}}</td>
                <td :title='item.user.remarks'>{{aRemarks[index]}}</td>
                <td>
                  <router-link :to="{ path: 'studentInfo', query: { studentId: item.student.id,activeName:'student'}}" class='addCourses'>学生详细</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <el-pagination class="pagination" layout="prev, pager, next" @current-change='currentChange' :total="page">
          </el-pagination>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
import post from '../post'
import get from '../get'
export default {
  name: "introduce",
  data() {
    return {
      QStudent: '',
      page: 1,
      CPage:1,
      limit:10,
      userInfo: [],
      isShow: false,
      singleUser: {},
      isCurriculumShow: false,
      // teacherOptions: [],
      teacherValue: '',
      creatWeek: "",
      management: [],
      teacherId: "",
      checkedCurriculum: [],
      checkedParent: [],
      weekArray: [],
      result: [],
      date: {},
      studentSignUp:false,
      studentInfo:false,
      studentId:"",
      studentName:'',
      parentName:'',
      aRemarks:[]
    }
  },
  created() {
    this.initialCurriculum(this.CPage,this.limit)
  },
  methods: {
    initialCurriculum(pageIndex,limit) {
      get("/api/signUp/getList?pageIndex="+pageIndex+"&limit="+limit).then((res) => {
        this.page=res.data.totalCount
        this.userInfo = res.data.list;
         for(let [index,item] of this.userInfo.entries() ){
              if(item.user.remarks.length>3){
                this.aRemarks[index]=item.user.remarks.substr(0,3)+"..."
              }else{
                this.aRemarks[index]=item.user.remarks
              }
        }
      })
    }
    ,
    changeCurriculumFn(arr) {

    },
    getTeacherCurriculumTable(value, index) {
      get('/api/getCourseTableCreation?state=0&teacherId=' + value + '&coursetype=1').then((response) => {


      })
    },
    optionValue(day, info) {
      var index = -1
      for (var i = 0; i < this.result.length; i++) {
        if (this.result[i].day == day && this.result[i].courseName == info.courseName && this.result[i].classroomName == info.classroomName && this.result[i].startTime == info.startTime && this.result[i].endTime == info.endTime) {
          index = i
          this.result.splice(i, 1)
        }
      }
      if (index == -1) {
        info.day = day
        this.result.push(info)
      }
    },
    delArrarFn(val) {

    },
    delSelect() {

    },
    query() {
      // clearTimeout(this.timer)
      //     this.timer=setTimeout(()=>{
            if(this.studentName||this.parentName){
              this.$http.post('/api/signUp/query',{studentName:this.studentName,parentName:this.parentName,pageIndex:this.CPage,limit:this.limit}).then((response) => { 
                     if(response.data.code==1){
                      this.page=response.data.data.totalCount
                      this.userInfo = response.data.data.list;
                     }
                })
              }else{
                  this.initialCurriculum(this.CPage,this.limit)
              }
          // },1000)

    },
    handleDelete(index, val) {

    },
    btnBack() {
      this.studentInfo = !this.studentInfo
    },
    submit() {
      let student=this.singleUser.student
      if(_.trim(student.name)==''){
          this.$message('学生姓名不能为空')
      }else if(_.trim(student.school)==''){
          this.$message('就读学校不能为空')
      }else if(_.trim(student.parentName)==''){
          this.$message('家长姓名不能为空')
      }else if(!(/^1[34578]\d{9}$/.test(student.telephone))){
              this.$message('联系电话必须是11位的纯数字');
      }else if(_.trim(student.address)==''){
          this.$message('家庭住址不能为空')
      }else{
          post('/api/signUp/editPersonalInfo',student).then((res) => {
              if(res.data){
                 this.$message('修改成功')
                 this.initialCurriculum(this.page,this.limit)
                 this.studentInfo = !this.studentInfo
              }
          })
      }
    },
    back(){
       this.studentSignUp = !this.studentSignUp 
    }
    ,
    curriculumSubmit() {
      if (this.result.length == 0) {
        this.$message("你还没有选择课程")
      } else {
        post("/api/studentRelatedCourse/saveAssociation", { studentId: this.singleUser.student._id, teacherId: this.teacherId, result: this.result, date: this.date }).then((respose) => {
          this.isCurriculumShow = !this.isCurriculumShow
        })
        this.isCurriculumShow = !this.isCurriculumShow
      }
    },
    curriculumBtnBack() {
      this.isCurriculumShow = !this.isCurriculumShow
    },
    currentChange(val){
      this.initialCurriculum(val,this.limit)
    },
    teacherChange(key) {
      this.teacherId = key
      get('/api/courseTable/getByTeacherId?teacherId=' + key).then((response) => {
        this.teacherId = response.data.data.info.teacher.userId
        this.date.startDate = response.data.data.info.startDate
        this.date.endDate = response.data.data.info.endDate
        get('/api/courseTable/getWeekItemsForWx?id=' + response.data.data.info._id + '&startDate=' + response.data.data.list[0].startDate).then((response) => {
          this.weekArray = response.data.data
        })
      })
    },
    modify(item) {
      this.singleUser =JSON.parse(JSON.stringify(item));
      this.studentInfo=true
      
    },
  },
  watch: {
  
  },
  components:{
  }
}
</script>
<style lang="less" scoped>


.p-search {
  background-color: #f5f5f5;
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
  .query-input {
    width: 192px;
    height: 28px;
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
    .addCourses{
          color: #20a0ff;
    }
  }
  .pagination {
    text-align: left;
  }
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
</style>
