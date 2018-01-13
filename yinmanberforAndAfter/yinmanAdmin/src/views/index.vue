<template>
  <p-layout>
    面板
  </p-layout>
</template>
<script>
  export default {
    name: 'index',
    created(){
         this.$router.push({path:"userManagement"})
    }
  }
</script>
