<template>
    <p-layout>
        <!-- <el-breadcrumb class="p-layout-breadcrumb" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/courseTable/list' }">课程表管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/studentInfo?studentId='+studentId }"
                v-if="studentId > 0">学生详情</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/teacherInfo?teacherId='+teacherId }"
                v-if="teacherId > 0">教师详情</el-breadcrumb-item>
            <el-breadcrumb-item >周课表</el-breadcrumb-item>
          </el-breadcrumb> -->
        <course-table-item :teacherId="teacherId" :termId="termId" :studentId="studentId"></course-table-item>
    </p-layout>
</template>
<script>
import CourseTableItem from '../../components/courseTables/CourseTableItem';

export default{
    name:'view-items',
    data(){
        return {
            termId:0,
            teacherId:0,
            studentId:0
        }
    },
    created(){
        this.teacherId = parseInt(this.$route.query.teacherId || 0);
        this.termId = parseInt(this.$route.query.termId);
        this.studentId = parseInt(this.$route.query.studentId || 0);
        //console.log(this.$route.query.studentId || 0);
        //console.log(this.$route);
    },
    components:{
        'course-table-item' : CourseTableItem
    }
}
</script>
<style lang="less" scoped>
</style>