<template>
  <div>
     <el-form  label-width="180px" class="demo-ruleForm">
            <el-form-item label="姓名："   class="suspendClassShow">
                {{name}}
            </el-form-item>
            <el-form-item label="课程："  class="suspendClassShow">
                {{curriculum}}
            </el-form-item>
            <el-form-item label="等级：" class="suspendClassShow">
                {{level}}
            </el-form-item>
            <el-form-item label="课程截止日期："  class="suspendClassShow">
                {{suspensionDate | viewDate}}
            </el-form-item>
            <el-form-item label="停课原因：" class="suspendClassShow">
                {{reason}}
            </el-form-item>
       </el-form>
  </div>
</template>
<script>
export default {
   props:['name','curriculum','level','suspensionDate','reason']
}
</script>
>

