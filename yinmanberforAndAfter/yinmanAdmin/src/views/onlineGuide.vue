<template>
   <p-layout>
       <el-table
      :data="tableData"
      style="width: 100%;text-align:center">
        <el-table-column
            prop="id"
            label="id"
            >
        </el-table-column>
       <el-table-column
            prop="studentName"
            label="学生姓名">
            <template scope="scope">
                <img :src="scope.row.student.wxHead" style="width:50px; height:50px;     vertical-align: middle;"></img>
                <a :href="'/#/studentInfo?studentId='+scope.row.studentId">{{ scope.row.student.name }}</a>
            </template>
        </el-table-column> 
        <el-table-column
            prop="title"
            label="标题"
            >
        </el-table-column>
        <el-table-column
            prop="explain"
            label="说明"
            >
        </el-table-column>
        <el-table-column
            prop="path"
            label="地址"
            >
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            >
        </el-table-column>
        <el-table-column label="点评教师">
            <template scope="scope">
                <img :src="scope.row.teacher.wxHead" style="width:50px; height:50px; vertical-align: middle;" v-if="scope.row.teacher"></img>
                <a :href="'/#/teacherInfo?teacherId='+scope.row.teacherId" v-if="scope.row.teacherId>0">{{ scope.row.teacher.name }}</a>
            </template>
        </el-table-column>
        <el-table-column prop="content" label="点评内容">
        </el-table-column>
        <el-table-column label="点评时间">
            <template scope="scope">
                <span v-if="scope.row.state == '已点评'">{{ scope.row.updateTime }}</span>
            </template>
        </el-table-column>
      </el-table>
    <div> 
          <el-pagination class="pagination" layout="prev, pager, next" @current-change='currentChange' :total="page">
          </el-pagination>
    </div>
   </p-layout>
</template>
<script>
export default {
    data(){
        return {
            tableData:[],
            page:1,
            CPage:1,
            limit:10
        }
    },
    created(){
        this.init(this.CPage,this.limit)
    },
    methods:{
        init(pageIndex,limit){
            this.$http.get('/api/onlineGuide/getList', { params:{
                pageIndex:pageIndex,
                limit:limit
            } }).then(res=>{
                this.tableData = res.data.list
            });
        },
        currentChange(){

        }
    }
}
</script>
<style lang="less">
 .cell{
     text-align: center;
 }
 .pagination{
     text-align: left;
 }
</style>
