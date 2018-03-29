<template>
   <p-layout>
     <booking></booking>
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


