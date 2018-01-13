<template>
    <p-layout>
        <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="学生请假" name="leave">
                  <student-leave></student-leave>
                </el-tab-pane>
                <el-tab-pane label="学生补课" name="changeClass">
                  <student-change-class></student-change-class>
                </el-tab-pane>
                <el-tab-pane label="教师调课" name="teachderChangeClass">
                  <teachder-change-class></teachder-change-class>
                </el-tab-pane>
                <el-tab-pane label="学校调课" name="transferCourse">
                  <school-transfer-course></school-transfer-course>
                </el-tab-pane>
            </el-tabs>
        </template>
    </p-layout>
</template>
<script>
import studentLeave from './studentLeave'
import schoolTransferCourse from './schoolTransferCourse'
import studentChangeClass from './studentChangeClass'
import teachderChangeClass from './teachderChangeClass'
export default {
  data(){
      return {
       activeName:'leave'
      }
  },
  methods:{
      handleClick(){

      }
  },
   components:{
    //   individualLessons,
      schoolTransferCourse,
      studentLeave,
      studentChangeClass,
      teachderChangeClass
    }
}
</script>


