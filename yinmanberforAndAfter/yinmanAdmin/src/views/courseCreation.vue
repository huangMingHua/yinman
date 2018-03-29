<template>
   <p-layout>
     <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
           <!-- <el-tab-pane label="课程表管理" name="list">
             <list></list>
          </el-tab-pane> -->
          <el-tab-pane label="课程类型" name="formal">
            <formal-curriculum></formal-curriculum>
          </el-tab-pane>
          <el-tab-pane label="教室管理" name="classroom">
              <classroom-creation></classroom-creation>
          </el-tab-pane>
          <el-tab-pane label="学期管理" name="terms">
             <terms></terms>
          </el-tab-pane>
        </el-tabs>
      </template>
   </p-layout>
</template>
<script>
import formalCurriculum from './formalCurriculum'
import classroomCreation from './classroomCreation'
import terms from './terms'
import list from './courseTable/list'
import renew from '../components/renew'
  export default {
      name:"introduce",
      data(){
      	return {
           activeName:'formal'
        }
      },
    methods:{
      handleClick(){

      }
    },
    components:{
      formalCurriculum,
      classroomCreation,
      terms,
      list,
      renew
    }
   }
</script>
