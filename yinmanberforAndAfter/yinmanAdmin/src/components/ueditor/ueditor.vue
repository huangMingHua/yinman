<template>
      <vue-html5-editor :content="content" @change="change" ></vue-html5-editor>
</template>
<script>
    export default {
        name:"ueditor",
        props: ['content'],
        data() {
    
            return {
             
            }
    
        },
    
        methods: {
          change(val){
              this.$emit('get',val)
          }
    
    
        },
    
      
    
    
    
    }
</script>
<style lang="less" scoped>
  
</style>