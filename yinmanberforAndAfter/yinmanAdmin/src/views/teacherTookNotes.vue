<template>
<div>
         <div class="terms">
            学期名称：
            <!-- <el-select v-model="term" @change="changeTearm" placeholder="请选择">
              <el-option
                v-for="item in terms"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select> -->
            <el-select v-model="term"  @change="changeTearm">
              <el-option v-for="item in terms" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
            <span>课程周期：{{termDate}}</span>
        </div>
         <el-table :data="list">
           <el-table-column
              label="id"
              width="100">
              <template scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
             <el-table-column
              label="姓名"
              width="100">
              <template scope="scope">
                <a v-if="scope.row.student" :href="'/#/studentInfo?studentId='+ scope.row.studentId ">{{ scope.row.student.name }}</a>
                <a v-if="scope.row.teacher" :href="'/#/teacherInfo?teacherId=' + scope.row.teacherId">{{ scope.row.teacher.name }}</a>
                
              </template>
            </el-table-column>
             <el-table-column
              label="课程名"
              width="100">
              <template scope="scope">
                {{ scope.row.fromCourseTableItem.courseName }}
              </template>
            </el-table-column>
            <el-table-column
              label="原课程教师"
              width="150">
              <template scope="scope">
                {{ scope.row.fromCourseTableItem.teacherName }}
              </template>
            </el-table-column>
            <el-table-column
              label="原课程时间"
              width="260">
              <template scope="scope">
                {{ scope.row.fromCourseTableItem.date | viewDate }} {{ scope.row.fromCourseTableItem.startTime | viewTime }}~{{ scope.row.fromCourseTableItem.endTime | viewTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="原课程教室"
              width="150">
              <template scope="scope">
                {{ scope.row.fromCourseTableItem.classroomName }}
              </template>
            </el-table-column>
            <el-table-column
              label="新课程教师"
              width="120">
              <template scope="scope">
                 {{ scope.row.toCourseTableItem.teacherName}} 
              </template>
            </el-table-column>
            <el-table-column
              label="新课程时间"
              width="260">
              <template scope="scope">
                {{ scope.row.toCourseTableItem.date | viewDate }} {{ scope.row.toCourseTableItem.startTime | viewTime }}~{{ scope.row.toCourseTableItem.endTime | viewTime }}
              </template>
            </el-table-column>
             <el-table-column
              label="新课程教室"
              width="150">
              <template scope="scope">
                {{ scope.row.toCourseTableItem.classroomName }}
              </template>
            </el-table-column>
            <el-table-column
              prop="reason"
              label="原因"
              width="150">
            </el-table-column>
      </el-table>
      <div>
          <el-pagination
            @current-change="currentChange"
            class="pagination"
            layout="prev, pager, next"
            :page-size="limit" 
            :current-page="page" 
            :total="total">
          </el-pagination>
        </div>
       </div> 
</template>

<script>
import nowTerm from '../commonJs/nowTerm';
import auth from '../auth'
import menus from '../nav-config'
  export default {
      name:"introduce",
      data(){
      	return {
           curri:"",
           page:1,
           total:0,
           limit:10,
           list:[],
           isShow: true,
           curriculumArray:[],
           classroomArray:[],
           teacherInput:"",
           terms:[],
           term:'',
           termDate:''
      	}
      },
      created () {
          // document.title = '调课管理'
          this.init()
	    },
    methods:{
      init(){
           this.$http.get('/api/term/getAll', {
              params: { teacherId: this.teacherId }
            }).then((res)=>{
               this.terms = res.data;
               this.term=nowTerm(this.term,this.terms)
               this.termDate=this.term.startDate+'至'+this.term.endDate
               this.getCourseTableSwitch(this.term.id)
            })
      },
      getCourseTableSwitch(termId){
         this.$http.get('/api/courseTableSwitch/getList',{
            params:{
              pageIndex : this.page,
              termId:termId,
              limit: this.limit
            }
          }).then(res=>{
            console.log(res.data)
              this.list = res.data.data.list
              this.total = res.data.data.total;
          })
      },
      changeTearm(val){
        for(let item of this.terms) {
            if(item.id==val) {
              this.termDate=item.startDate+'至'+item.endDate
            }
        }
        this.getCourseTableSwitch(val)
      },
      currentChange(val){
        this.page = val;
         this.init(this.page) 
      },
        handleDelete(index,val){
           //    post('/api/addCurriculum',{date:val.date,
           //            state:2}).then((response) => {
           //       if(response.data.boff){
           //             this.curriculumArray.splice(index,1)   
           //         }  
           //         alert(response.data.msg)       
           // })
       },
    
       
       addRecord(){
              
       }
    },
    watch:{
      
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
     .show{
       position:absolute;
        left:0;
        top:0;
        background-color:rgba(0,0,0,0.5);
        width:100%;
        height:100%;
         z-index:100;
     }
    .p-table{
      position:absolute;
      left:0;
      top:0;
      bottom:0;
      right:0;
      margin:auto;
      padding:20px;
      text-align:left;
      width:1200px;
      height:600px;
      background-color:white;
      box-shadow:0 0 5px 0 rgba(0,0,0,0.5);
      >div{
          margin:20px 0;
      }
      .input{
        width:50px;
      }
      .span{
        display:inline-block;
        width:200px;
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
    .terms{
      text-align: left;
      margin: 15px;
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
      width:600px;
      height:600px;
      background-color:white;
      box-shadow:0 0 5px 0 rgba(0,0,0,0.5);
      >div{
          margin:20px 0;
      }
      .input{
        width:200px;
      }
      .span{
        display:inline-block;
        width:200px;
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
     table{
       border-collapse:collapse;
       width:1100px;
       margin-top:50px;
     }
     table td{
       border:1px solid black;
       padding:0;
       margin:0;
       font-size:13px;
       width:200px;
       height:36px;
       line-height:36px;
       text-align:center;
     }
     table td div{
      height:36px;
      line-height:36px;
     }
     .button{
      text-align:left;
      margin:50px 0 0 40%;
     }
     .input{
       width:300px;
     }
  
     .p-hidden{
        height:500px;
        overflow: auto;
     }
      .headSpan{
          display:inline-block;
          width:200px;
          height:36px;
          line-height:36px;
          text-align:center;
     }
     .nav{
       position:absolute;
       left:0;
       top:0;
       bottom:0;
       right:0;
       margin:auto;
       padding:20px;
       width:600px;
       height:600px;
       background-color:white;
       box-shadow:0 0 5px 0 rgba(0,0,0,0.5);
       
     }
     .buts{
          width:120px;
          margin:0 10px;
          font-size:10px;
          background-color:white;
          border:1px solid black;
          cursor: pointer;
       }
</style>

