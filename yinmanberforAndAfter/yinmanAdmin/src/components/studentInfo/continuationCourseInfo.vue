<template>
  <div>
      <table>
      <thead>
        <th>原课程信息</th>
        <th>续课信息</th>
        <th>操作</td>
      </thead>
        <tbody>
          <tr v-for="item in tableData">
            <td>{{item.curriculum}}</td>
            <td><span v-for="time in item.times">{{time.arrayDay}} {{time.timeStart}}~{{time.timeEnd}}</span></td>
            <td>{{item.createTime}}</td>
            <td><span v-if="item.state==0" style="color:#ff4949">已取消</span><span  v-else-if="item.state==1">待确认</span><span style="color:#20a0ff" v-else>已确认</span></td>
          </tr>
        </tbody>
    </table>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less">

</style>


