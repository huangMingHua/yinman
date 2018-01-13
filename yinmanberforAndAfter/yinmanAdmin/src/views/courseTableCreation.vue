<template>
  <p-layout>
    <p-search :curriculumArr="courseTables" :page="page" @changeCurriculumArr="changeCurriculumFn" @getDelArrar="delArrarFn" @query="queryCurriculum">
      <template slot="form">
        <el-form-item>
          <el-input v-model="curri" placeholder="查询：请输入教师姓名" :maxlength="10"></el-input>
        </el-form-item>
      </template>
      <template slot="table">
        <el-table-column fixed prop="teacher.name" label="教师姓名" width="150">
        </el-table-column>
        <el-table-column fixed prop="week" label="课程周期" width="150">
        </el-table-column>
        <el-table-column fixed label="开始日期" width="150">
          <template scope="scope">
            {{ scope.row.startDate | viewDate }}
          </template>
        </el-table-column>
        <el-table-column fixed label="开始日期" width="150">
          <template scope="scope">
            {{ scope.row.endDate | viewDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template scope="scope">
            <router-link class="el-button el-button--text el-button--small" :to="{ name: '/courseTable/addDetail', params: { teacherId: scope.row.teacher.id, termId:term.id } }">编辑</router-link>
            <router-link class="el-button el-button--text el-button--small" :to="{ name: 'courseTableViewItems', params: { teacherId: scope.row.teacher.id, termId:term.id } }">查看周历</router-link>
            <el-button type="text" @click="handleDelete(scope.$index, scope.row)" size="small">删除/禁用(启用)</el-button>
          </template>
        </el-table-column>
      </template>
      <template slot="action">
        <a href="/#/courseTable/addDetail/term/0/teacher/0">添加课程</a>
        <br/>
        学期：<el-select v-model="term">
          <el-option v-for="item in terms" :key="item.id" :label="viewDate(item.startDate) +' ~ ' + viewDate(item.endDate)" :value="item"></el-option>
        </el-select>
      </template>
      <template slot="transition">
        <transition name="fade">
          <!--<div class="show" v-if="isShow">
            <course-table-detail :id="id" @cancel="cancel"></course-table-detail>
          </div>-->
          <div>
            <el-dialog :title="title" size="large" v-model="isShow" :close-on-click-modal="false">
              <course-table-detail :termId="termId" :teacherId="teacherId" @cancel="cancel" @saveSuccess="init" ></course-table-detail>
            </el-dialog>
            <el-dialog title='课程周历' size="small" v-model="showItem" :close-on-click-modal="false">
              <course-table-item  :id="id" @cancel="cancel"></course-table-item>
            </el-dialog>
          </div>
        </transition>
      </template>
    </p-search>
  </p-layout>

</template>

<script>
import auth from '../auth'
import menus from '../nav-config'
import post from '../post'
import get from '../get';

import CourseTableDetail from '../components/courseTables/CourseTableDetail';
import CourseTableItem from '../components/courseTables/CourseTableItem';
export default {
  name: "introduce",
  data() {
    return {
      terms:[],
      term: null,
      curri: "",
      page: 1,
      loggedIn: auth.loggedIn(),
      isShow: false,
      showItem: false,
      courseTables: [],
      termId:null,
      teacherId: null,
      dialogTableVisible: false,
      title:"",
      id:''
    }
  },
  computed: {
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.termId = null;
      this.teacherId = null;
      this.isShow = false;
      get('/api/term/getAll').then((res)=>{
        this.terms = res.data;
        if(this.terms.length > 0){
          this.term = this.terms[0];
        }
      });
      
    },
    add() {
      this.title="添加课程表"
      this.termId = null;
      this.teacherId = null;
      this.isShow = true;
    },
    changeCurriculumFn(arr) {
      // this.curriculumArray=arr
    },
    delArrarFn(val) {
      // this.delCurriculum=val
    },
    cancel(){
      this.isShow = false;
      this.showItem = false;
      //this.init();

    },
    queryCurriculum() {
      //  var This=this
      // if(this.curri.trim().length>0){
      //   post('/api/addCurriculum',{queryCurriculumName:this.curri.trim(),
      //             state:4}).then((response) => { 
      //              This.curriculumArray=response.data.count
      //      })   

      // }
    },
    handleDelete(index, val) {
      //    post('/api/addCurriculum',{date:val.date,
      //            state:2}).then((response) => {
      //       if(response.data.boff){
      //             this.curriculumArray.splice(index,1)   
      //         }  
      //         alert(response.data.msg)       
      // })
    },
    edit(row) {
      this.title="编辑课程表"
      this.termId = row.termId;
      this.teacherId = row.teacherId;
      this.isShow = true;
    },
    viewWeekItem(row){
      this.id=row.id;
      this.showItem = true;
    },
    viewDate(date){
      return this.$moment(date).format('YYYY-MM-DD');
    }
  },
  watch: {
    term(newVal, oldVal){
      get('/api/courseTable/getList?termId='+ this.term.id).then((res) => {
        this.courseTables = res.data;
        console.log(this.courseTables);
      });
    }
  },
  components:{
    CourseTableDetail,
    CourseTableItem
  }
}

</script scoped>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-active {
  opacity: 0
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

.number {
  width: 100px;
}



table {
  border-collapse: collapse;
  width: 1100px;
  margin-top: 10px;
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

.button {
  text-align: left;
  margin: 50px 0 0 40%;
}

.input {
  width: 300px;
}

</style>

