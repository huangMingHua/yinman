<template>
    <div>
        <div>
            <div class='title'><img src="../../assets/images/termRecords.png" /><span>请假记录</span></div>
            <el-table
                :data="courseTableItems"
                style="width: 100%">
                <el-table-column
                    prop="courseTableDetail.teacher.name"
                    label="教师"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="courseTableDetail.number"
                    label="满员人数"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="courseTableDetail.course.name"
                    label="课程"
                    show-overflow-tooltip="true"
                    width="200"
                    >
                </el-table-column>
                <el-table-column
                    prop="courseTableDetail.level"
                    label="等级"
                    width="80"
                    >
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    label="开始时间"
                    width="120"
                    >
                </el-table-column>
                <el-table-column
                    prop="endTime"
                    label="结束时间"
                    width="120"
                    >
                </el-table-column>
                <el-table-column
                    prop="courseTableDetail.classroom.name"
                    label="教室"
                    width="120"
                    >
                </el-table-column>
                <el-table-column
                    prop="reason"
                    label="原因"
                    show-overflow-tooltip="true"
                    width="200"
                    >
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    export default{
        props: ["courseTableDetailId","studentId"],
        data () {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                courseTableItems: [],
            }
        },
        mounted(){
           this.init()
        },
        methods:{
            init(){
                this.$http.get('/api/courseTable/getClassTimeLeaveRecord',{params:{studentId: this.studentId,courseTableDetailId:this.courseTableDetailId}}).then((response)=>{
                    let res = response.data;
                    if (res.code) {
                        let {courseTableItems} = res.data;
                        this.courseTableItems = courseTableItems;
                    } else {
                        this.$message(res.msg);
                    } 
                })
            }
        },
        watch:{
            courseTableDetailId(newData,oldDate){
                if (newData!==0) {
                  this.init()
                }
            } 
        }
    }
</script>
<style  lang="less" scoped>
     .title {
         height: 60px;
         line-height: 60px;
         img {
            margin: 0 10px; 
            width: 36px;
            height: 36px;
            vertical-align: middle;
         }
     }
</style>