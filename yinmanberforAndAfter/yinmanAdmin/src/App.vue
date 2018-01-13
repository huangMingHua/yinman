<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
 .avatar-uploader {
   display:inline-block;
   vertical-align:top;
 }
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader-icon:before{
    line-height:100px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .dialog-footer{
      text-align: center !important;
  }
  .el-pagination{
    padding: 0 !important;
  }
  .pagination{
      text-align: left;
    } 
    .el-dialog__header{
      padding: 10px !important;
      text-align: left;
      background-color: #009688;
      margin: 0 auto;
      color: white;
      .el-dialog__title{
        color: white;
      }
    }
    .warn{
      position: relative;
      top:5px;
      left:70px;
      font-size:26px;
      color:red;
      vertical-align: middle;
    }
    .el-form-item__content{
         width: 300px;
       }
    .el-button--primary{
      background-color: #009688 !important;
      border:1px solid #009688 !important;
    }
    .el-dialog--tiny{
       min-width: 570px;
    }
</style>
