<template>
    <div>
        <h3>{{ data.studentId >0 ? '学生':'老师' }}请假信息</h3>
        <table style="text-align:left;">
            <tr>
               <td> </td> <td>教师</td><td>{{ data.fromCourseTableItem.teacherName }}</td>
            </tr>
            <tr>
                <td> </td><td>课程</td><td>{{ data.fromCourseTableItem.courseName }}</td>
            </tr>
            <tr>
               <td> </td> <td>教室</td><td>{{ data.fromCourseTableItem.classroomName }}</td>
            </tr>
            <tr>
                <td> </td><td>时间</td>
                <td>{{ data.fromCourseTableItem.date | viewDate }} {{ data.fromCourseTableItem.startTime | viewTime }} ~ {{ data.fromCourseTableItem.endTime | viewTime }}</td>
            </tr>
            <tr>
                <td> </td><td>原因</td>
                <td>{{ data.reason }}</td>
            </tr>
            <tr>
                <td> </td><td>创建时间</td><td>{{ data.createTime | viewDate }}</td>
            </tr>
        </table>

        <h3>调课到</h3>
        <table style="text-align:left;">
            <tr>
                <td> </td><td>教师</td><td>{{ data.toCourseTableItem.teacherName }}</td>
            </tr>
            <tr>
               <td> </td> <td>课程</td><td>{{ data.toCourseTableItem.courseName }}</td>
            </tr>
            <tr>
                <td> </td><td>教室</td><td>{{ data.toCourseTableItem.classroomName }}</td>
            </tr>
            <tr>
                <td> </td><td>时间</td>
                <td>{{ data.toCourseTableItem.date | viewDate }} {{ data.toCourseTableItem.startTime | viewTime }} ~ {{ data.toCourseTableItem.endTime | viewTime }}</td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    name:'course-table-switch-detail',
    props: { id: Number },
    data(){
        return {
            data:{
                id:0,
                studentId:0,
                teacherId:0,
                termId:0,
                reason:'',
                createTime:'',
                fromCourseTableItem:{
                    teacherName:'',
                    courseName:'',
                    classroomName:'',
                    date:'',
                    startTime:'',
                    endTime:'',
                    
                },
                toCourseTableItem:{
                    teacherName:'',
                    courseName:'',
                    classroomName:'',
                    date:'',
                    startTime:'',
                    endTime:'',
                    
                }
            }
        }
    },
    created(){
        this.loadData();
    },
    methods:{
        loadData(){
            this.$http.get('/api/courseTableSwitch/getSwitchDetail?id='+ this.id).then((res)=>{
                
                this.data = res.data;
            });
        }
    },
    watch:{
        id(newVal, oldVal){
            this.loadData();

        }
    }
}

</script>
<style lang="less" scoped>
    td{
        width:100px;
    }
</style>
