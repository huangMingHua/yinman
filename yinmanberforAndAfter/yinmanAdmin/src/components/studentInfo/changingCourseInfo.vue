<template>
  <div class="p-wrap-table">
      <div class="term"><span style="margin-left:17px;">学期名称：</span>
          <el-select v-model="termId" @change="termChange" placeholder="请选择">
                <el-option
                    v-for="item in terms"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
          </el-select>
          <span>课程周期：{{termDate}}</span>
    </div>
    <table>
      <thead>
        <th>课程名</th>
        <th>课程教师</th>
        <th>课程时间</td>
        <th>课程教室</th>
        <th>课程等级</th>
        <th>课程人数</th>
        <th>原因</th>
        <th>创建时间</th>
      </thead>
        <tbody>
          <tr v-for="item in tableData">
            <td>{{item.courseName}}</td>
            <td>{{item.oTeacher.name}}</td>
            <td>{{item.date}} {{item.dateOfWeek}}{{item.startTime}}~{{item.endTime}}</td>
            <td>{{item.oClassroom.name}}</td>
            <td>{{item.level}}</td>
            <td>{{item.number}}</td>
            <td>{{item.reason}}</td>
            <td>{{item.createTime1}}</td>
          </tr>
        </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props:['studentId'],
  data(){
      return{
        tableData:[],
        terms:[],
        termId:"",
        termDate:''
      }
  },
  created(){
     this.init()
  },
  methods:{
      init(){
        this.$http.get("/api/student/getSignUpTerms", {params:{studentId: this.studentId }}).then(res=>{
            if(res.data[0]){
                this.termDate=res.data[0].startDate+'至'+res.data[0].endDate
                this.termId=res.data[0].id
                this.terms=res.data
                this.getSwitch()
            }
        })
      },
      getSwitch(){
       this.$http.get("/api/courseTableChangeClass/getListByTermIdAndstundetId",{params:{studentId: this.studentId,termId: this.termId}}).then(res=>{
            console.log(res)
                  if(res.data.code==1){
                    this.tableData=res.data.data
                    for(let item of this.tableData){
                        let aDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                       item.dateOfWeek=aDay[new Date(item.date).getDay()]
                    }
                  }
              })
      },
      termChange(){
        this.getSwitch()
      }
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
        .term{
            margin-bottom:20px; 
        }
    }
</style>


