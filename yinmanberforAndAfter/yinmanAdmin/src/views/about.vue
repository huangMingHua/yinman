<template>
   <p-layout>
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="音曼介绍" name="voice">
            <voiceIntroduction></voiceIntroduction>
        </el-tab-pane>
        <el-tab-pane label="音曼教师" name="teacher">
            <teacher-itroduction></teacher-itroduction>
        </el-tab-pane>
        <el-tab-pane label="音曼课程" name="rhythm">
            <rhythm-course></rhythm-course>
        </el-tab-pane>
         <el-tab-pane label="英皇考级" name="booking">
            <abrsm></abrsm>
        </el-tab-pane>
        <el-tab-pane label="比赛介绍" name="competition">
            <competition-presentation></competition-presentation>
        </el-tab-pane> 

      </el-tabs>
    </template>
   </p-layout>
</template>
<script>
import voiceIntroduction from './voiceIntroduction'
import teacherItroduction from './teacherItroduction'
import rhythmCourse from './rhythmCourse'
import abrsm from './abrsm'
import competitionPresentation from './competitionPresentation'
  export default {
    name:"introduce",
    data(){
      return {
       activeName:'voice'
      }
    },
    created () {
	  },
    methods:{
      handleClick(){

      }
    },
    components:{
        voiceIntroduction,
        teacherItroduction,
        rhythmCourse,
        abrsm,
        competitionPresentation
    }
   }
</script>


