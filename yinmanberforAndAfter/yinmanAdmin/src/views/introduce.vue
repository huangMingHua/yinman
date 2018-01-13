<template>
   <p-layout>
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="已预约试课" name="booking">
          <booking></booking>
        </el-tab-pane>
      </el-tabs>
    </template>
   </p-layout>
</template>
<script>
import testCourse from './testCourse'
import booking from './bookingTestRecord'
  export default {
    name:"introduce",
    data(){
      return {
       activeName:'booking'
      }
    },
    created () {
	  },
    methods:{
      handleClick(){

      }
    },
    components:{
      testCourse,
      booking
    }
   }
</script>


