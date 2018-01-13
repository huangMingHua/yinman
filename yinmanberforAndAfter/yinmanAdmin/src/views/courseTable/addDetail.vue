<template>
    <p-layout>
        <el-breadcrumb class="p-layout-breadcrumb" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/courseCreation' }">课程表管理</el-breadcrumb-item>
            <el-breadcrumb-item >添加课程表</el-breadcrumb-item>
          </el-breadcrumb>
        <course-table-detail :termId="termId" :teacherId="teacherId"></course-table-detail>
    </p-layout>
</template>
<script>
import CourseTableDetail from '../../components/courseTables/CourseTableDetail';

export default{
    name:'add-detail',
    data(){
        return {
            termId:0,
            teacherId:0
        }
    },
    created(){
        this.teacherId = parseInt(this.$route.params.teacherId);
        this.termId = parseInt(this.$route.params.termId);
    },
    components:{
        'course-table-detail':CourseTableDetail
    }
}
</script>
<style lang="less" scoped>
</style>