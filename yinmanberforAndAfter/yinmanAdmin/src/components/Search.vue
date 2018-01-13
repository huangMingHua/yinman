<template>
  <div class="p-search-container">
  
    <el-form :inline="true" class="p-search-form" ref="searchForm">
  
      <slot name="form">
  
      </slot>
  
  
    </el-form>
  
    <div class="p-search-action">
  
      <slot name="action"></slot>
  
    </div>
  
    <el-table :data="curriculumArr" border style="width: 100%" @selection-change="handleSelectionChange">
  
      <slot name="table"></slot>
  
    </el-table>
  
    <keep-alive>
  
      <slot name="transition"></slot>
  
    </keep-alive>
    <div>
  
      <el-pagination layout="prev, pager, next" :total="page*10" @current-change="handleCurrentChange">
  
      </el-pagination>
  
    </div>
  
  </div>
</template>

<script>
  export default {
  
    name: 'p-search',
  
    props: ['curriculumArr', 'page'],
  
    methods: {
  
      handleSubmit() {
  
        this.$emit('query')
  
      },
  
      handleSelectionChange(val) {
  
        this.$emit('getDelArrar', val)
  
      },
  
      handleCurrentChange(val) {
  
        this.$emit('currentChange',val)
  
      }
  
    }
  
  }
</script>
<style lang="less" scoped>
  .white {
  
    background-color: white;
  
  }
  
  
  
  .p-search {
  
    .el-pagination {
  
      float: right;
  
      margin-top: 10px;
  
    }
  
    &-action {
  
      padding: 16px 0;
  
      .white
  
    }
  
  }
  
  
  
  .p-search-container {
  
  
    background: #f5f5f5;
  
    text-align: left;
  
  }
  
  
  
  .p-search-form {
  
    .white
  
  }
  
  
  
  .el-form {
  
    text-align: left;
  
  }
  

</style>
