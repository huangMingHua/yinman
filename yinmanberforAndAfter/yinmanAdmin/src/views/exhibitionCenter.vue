<template>
   <p-layout>
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="音曼介绍" name="voice">
        </el-tab-pane>
        <el-tab-pane label="音曼教师" name="teacher">
        </el-tab-pane>
      </el-tabs>
    </template>
   </p-layout>
</template>
<script>

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
       
    }
   }
</script>


