<template>
<div>
     <div class="term">学期名称：
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
  <table class="table">
      <tr>
        <th>id</th>
        <th>学生姓名</th>
        <th>原课程信息</th>
        <th>续课信息</th>
        <th>创建时间</th>
        <th>状态</th>
        <th>操作</th>
      </tr>
      <tr v-for="item in data.list" :key="item.id">
          <td>{{item.id}}</td>
          <td>
              <a :href="'/#/studentInfo?studentId='+ item.studentId">{{ item.student.name }}</a>
          </td>
          <td style="text-align:left;">
              <div>{{ item.detail.teacherName }}</div>
              <div>{{ item.detail.courseName }}{{ item.detail.number }}人</div>
              <div>{{ item.detail.dayOfWeek }} {{ item.detail.startTime | viewTime }}~{{ item.detail.endTime | viewTime }}</div>
              <div>{{ item.detail.startDate | viewDate }} - {{ item.detail.endDate | viewDate }}</div>
          </td>
          <td>
              <div v-for="time in item.times" :key="time">
                  {{ time.dayOfWeek }} {{ time.startTime }}~{{ time.endTime }}
              </div>
          </td>
          
          <td>
              {{ item.createTime }}
          </td>
          <td>
            {{ item.state }}
          </td>
          <td>
              <el-button type="info" size="mini" @click="check(item.id, true)" v-if="item.state=='待审核'">同意</el-button>
              <el-button type="danger" size="mini" @click="check(item.id, false)" v-if="item.state=='待审核'">拒绝</el-button>
              <span @click='toCurriculumInfo' class="to-curriculumInfo" v-if="item.state=='已通过'"> 请在课程信息中给学生添加课程 </span>
          </td>
      </tr>
  </table>
  <div>
    <el-pagination
        @current-change="currentChange"
        class="pagination"
        layout="prev, pager, next"
        :total="data.total">
    </el-pagination>
</div>

</div>
</template>

<script>
export default {
    props:{
        studentId: Number
    },
    data(){
        return {
            data:{},
            page:1,
            limit:10,
            termDate:'',
            termId:'',
            terms:''
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
             this.$http.get("/api/term/getAll").then(res=>{
                if(res.data[0]){
                    this.termDate=res.data[0].startDate+'至'+res.data[0].endDate
                    this.termId=res.data[0].id
                    this.terms=res.data
                    this.getRenew()
                }
            })
            
        },
        getRenew(){
           this.$http.get('/api/renew/getList', { params:{
                        page:this.page,
                        limit: this.limit,
                        termId:this.termId,
                        studentId: this.studentId || 0
                    } }).then(res=>{
                        this.data = res.data
                    });
        },
        currentChange(page){
            this.page = page
            this.init()
        },
        check(id, v){
            this.$confirm('确定操作吗？').then(()=>{
                this.$http.post('/api/renew/check', { id: id, v:v }).then(res=>{
                    if(res.data.code == 1){
                        this.$message('操作成功')
                        this.init();
                    }
                    else{
                        this.$message(res.data.msg)
                    }
                })
            })
        },
        toCurriculumInfo(){
            this.$emit('toCurriculumInfo')
        },
        termChange(val){
                this.getRenew()
        }
    },
    watch:{
        studentId(){

        }
    }

}
</script>

<style lang="less" scoped>
  .to-curriculumInfo{
      color:#20a0ff;
      cursor: pointer;
  }
  .term{
            margin:0 0 20px 18px;
            text-align: left;
        }
    th,td{
        text-align: center;
    }
</style>
