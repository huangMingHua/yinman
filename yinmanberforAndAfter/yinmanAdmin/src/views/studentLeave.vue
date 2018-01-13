<template>
  <div>
    <div class="terms">
      学期名称：
      <el-select v-model="term"  @change="changeTearm">
        <el-option v-for="item in terms" :key="item.id" :label="item.name" :value="item"></el-option>
      </el-select>
      <span>课程周期：{{termDate}}</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th class="w100px">id</th>
            <th class="w100px">姓名</th>
            <th class="w100px">课程名</th>
            <th class="w100px">课程教师</th>
            <th class="w260px">课程时间</th>
            <th class="w150px">课程教室</th>
            <th class="w150px">课程等级</th>
            <th class="w150px">课程人数</th>
            <th class="w150px">请假原因</th>
            <th class="w160px">操作时间</th>
          </tr>
          <tr>
            <th></th>
            <th>
              <el-input @change="query" v-model="name" placeholder="输入姓名">
              </el-input>
            </th>
            <th>
              
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>  
          </tr>
        </thead>
        <tbody>
          <tr v-for="(each,index) in list">
            <td>{{each.id}}</td>
            <td>{{each.student.name}}</td>
            <td>{{each.courseName}}</td>
            <td>{{each.teacher.name}}</td>
            <td>{{each.date | viewDate}} {{each.dayOfWeek}} {{ each.startTime | viewTime }}~{{ each.endTime | viewTime }}</td>
            <td>{{each.classroomName}}</td>
            <td>{{each.level}}</td>
            <td>{{each.number }}</td>
            <td>{{each.reason}}</td>
            <td>{{each.createTime | viewFullDate}}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
      curri: "",
      page: 1,
      total: 0,
      limit: 10,
      list: [],
      terms:[],
      term: '',
      termDate: '',
      name: '',
    }
  },
  created () {
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
          this.getCourseTableLevel(this.term.id)
      })
    },
    getCourseTableLevel(termId){
      this.$http.get('/api/courseTableLeave/getList',{
        params:{
          pageIndex: this.page,
          termId: termId,
          limit: this.limit,
        }
      }).then(res=>{
        this.list = res.data.data.list
        for(let item of this.list){
          let aDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          item.dayOfWeek=aDay[new Date(item.date).getDay()]
        }
        this.total = res.data.data.total;
      })
    },
    changeTearm(val){
      for(let item of this.terms) {
        if(item.id==val.id) {
          this.termDate=item.startDate+'至'+item.endDate
        }
      }
      this.getCourseTableLevel(val.id)
    },
    query(){
       
    },
    currentChange(val){
      this.page = val;
      this.init()
    },
  },
}
</script>
<style lang="less" scoped>
  .w100px{
    width: 100px
  }
  .w150px{
    width: 150px
  }
  .w160px{
    width: 160px
  }
  .w260px{
    width: 260px
  }
  .terms{
    text-align: left;
    margin: 15px;
  }    
  .table-wrap{
    overflow: scroll;
    table{
      width: 1420px;
      border-collapse: collapse;
      thead{
        background-color:#eef1f6;
        tr{
          height: 40px;
          th{
            font-weight: bold;
            font-size: 14px;
          }
        }
      }
      tbody{
        tr{
          height: 40px;
          td{
            font-size: 14px;
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
          }
        }
      }
    }
  }

</style>

