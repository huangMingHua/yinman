<template>
    <p-layout>
        <div class="btn">
            <span>学期：</span><el-select size="mini"  v-model="termId" @change="termChange">
                <el-option
                    v-for="item in terms"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <span>课程：</span><el-select size="mini" v-model="courseTableDetailId1">
                <el-option
                    v-for="item in courseTableDetails"
                    :key="item.id"
                    :label="item.course.name+' '+item.startDate+'~'+item.endDate+' '+item.startTime+'~'+item.endTime+' '+levels[item.level-1].name+' '+item.teacher.name+' '+item.duration+'分钟'"
                    :value="item.id">
                </el-option>
            </el-select> 
            <el-button type="primary" @click="queryFn">查询</el-button>
            <el-button type="primary" @click="applyClassTransfer">申请转班</el-button>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="startTime"
                label="开始时间"
                width="180">
            </el-table-column>
            <el-table-column
                prop="endTime"
                label="结束时间"
                width="180">
            </el-table-column>
            <el-table-column
                prop="teacher.name"
                label="教师姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="course.name"
                label="课程名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="courseTableItemStudents.length"
                label="已报人数">
            </el-table-column>
            <el-table-column
                prop="number"
                label="最多总人数">
            </el-table-column>
        </el-table>
        <el-dialog title="转班信息"  size="small"  :visible.sync="isClassTrasfer" :close-on-click-modal='false' @close="closeleaveAndMakeUpRecordFn" label-position="left">
            <tableforclass-trasfer  :courseTableDetailId="courseTableDetailId" :studentId="studentId" @cancelClassTransfer="cancelClassTransfer"></tableforclass-trasfer> 
        </el-dialog>
    </p-layout>
</template>
<script>
    import tableforclassTrasfer from './../components/studentInfo/tableforclassTrasfer.vue'
    export default{
        data () {
            return{
                tableData: [],
                courseTableDetailId: this.$route.query.courseTableDetailId,
                isClassTrasfer: false,
                studentId: this.$route.query.studentId,
                terms: [],
                courseTableDetails: [
                ],
                courseTableDetailId1: '',
                termId: '',
                levels: [
                    {
                    id: 1,
                    name: '无等级'
                    },
                    {
                    id: 2,
                    name: 'A'
                    },
                    {
                    id: 3,
                    name: 'B'
                    },
                    {
                    id: 4,
                    name: 'C'
                    },
                    {
                    id: 5,
                    name: 'D'
                    },
                ]
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                this.$http.get('/api/term/getTermListForCourse').then((response)=>{
                    let res = response.data;
                    if (res.code) {
                        this.terms = res.data;   
                    } else {
                        this.$message(res.msg);
                    }
                })
            },
            applyClassTransfer(){
                this.isClassTrasfer = true;
            },
            termChange(){
                this.courseTableDetailId1 = '';
                this.tableData = [];
                this.$http.get('/api/courseTable/getCourseTableDetailByFilter',{params:{termId:this.termId}}).then((response)=>{
                    let res = response.data;
                    if (res.code) {
                       this.courseTableDetails = res.data;   
                    } else {
                        this.$message(res.msg);
                    }
                })
            },
            queryFn(){
                if(!this.courseTableDetailId1){
                   return this.$message('请选择课程');
                }
                this.$http.get('/api/courseTable/getListEvenClassDetail',{params:{courseTableDetailId:this.courseTableDetailId1}}).then((response)=>{
                    let res = response.data;
                    if (res.code) {
                        this.tableData = res.data;   
                    } else {
                        this.$message(res.msg);
                    }
                })
            },
            cancelClassTransfer(){
                this.isClassTrasfer = false;
            }
        },
        components:{
            tableforclassTrasfer
        }
    }
</script>
<style>
    .btn{
        padding: 10px 20px;
        text-align: left;
    }
</style>