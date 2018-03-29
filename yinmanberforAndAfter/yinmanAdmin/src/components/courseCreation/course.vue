<template>
  <div class="p-wrap" :style="{'background-color':selectColor}">
    <div style="background-color:white;margin:0 20px;">
      <div>
        <span class="warn" style="left:140px;">*</span>
        <span class="span" >课程名称</span>
        <el-input v-model="curriculum.name" class="input" placeholder="请输入名称"></el-input>
      </div>
      <div class="color">
        <span class="warn" style="left:140px;">*</span>
        <span class="span" >课程颜色选择</span>
        <div class="colors">
          <span v-for="item in colors" @click='selectColorFn(item)'>
            <em :style="{'background-color':item}"></em>
            <strong>{{item}}</strong>
          </span>
        </div>
      </div>
      <div>
        <span class="span" >课程说明</span>
        <ueditor class="ueditor" :content="curriculum.courseDescription" style="over" @get="change" ></ueditor>
      </div>
      <div class="btns"><el-button class="btn" @click="back">取消</el-button><el-button  type="primary" @click="submit" >提交</el-button> 
      </div>
    </div>
  </div>    
</template>
<script>
import ueditor from '../ueditor/ueditor'
export default {
  props:['curriculum'],
  name:"course",
  data(){
    return{
      content:'',
      colors:[
        '#FF6C00',
        '#ff8c0f',
        '#ffaa35',
        '#03CAC3',
        '#1ad6d5',
        '#01e4d9',
        '#f43793',
        '#ff70b2',
        '#f998c5',
        '#0279bb',
        '#0d9ee1',
        '#04bff6',
        '#954f11',
        '#c67838',
        '#df9c65',
        '#801eaf',
        '#8b4bbd',
        '#b589d8',
        '#6b702e',
        '#8b8d4e',
        '#a6a972',
        '#2c9a43',
        '#01b868',
        '#3dce89',
        '#6c7079',
        '#959a9e',
        '#b0b4b7',
      ],
      color: '#FF0000',
      selectColor: 'white'
    }
  },
  created(){
    if (this.curriculum.id) {
      this.selectColor = this.curriculum.color
    } else {
      this.selectColor = 'white'
    }
  },
  methods:{
    back(){
      this.$emit("back")
    },
    submit(){
      this.$emit("submit")
    },
    selectColorFn(color){
      this.selectColor = color
      this.curriculum.color = color
    },
    change(val){
      this.curriculum.courseDescription = val
    }
  },
  components:{
    ueditor
  },
  watch:{
    curriculum(newData, oldData){
      if (newData.id) {
        this.selectColor = newData.color
      } else {
        this.selectColor = 'white'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .p-wrap{
    width:1000px;
    text-align: left;
      >div:nth-child(1){
        margin-bottom: 20px;
      }
      .input{
        width:300px;
      }
      .span{
        margin-left: 160px;
        display:inline-block;
        width:100px;
        text-align:left;
        vertical-align:middle;
        vertical-align: middle;
      }
      .span:nth-of-type(1){
        margin-left: 175px;
      }
      .textarea{
        width:500px;
        vertical-align: middle;
      }
      .btn{
        margin-right:20px;
      }
      .btns{
        text-align: center;
        border-top:1px solid #c3c3c3; 
        margin: 20px auto 0 auto !important;
        padding: 20px 0;
        width: 86%;
      }
      .ueditor{
        display: inline-block;
        width: 600px;
        min-height: 300px;
        vertical-align: middle;
      }
    }
    .color{
      margin: 20px 0;
    }
    .colors {
      display: inline-block;
      width: 500px;
      vertical-align: middle;
      span{
        display: inline-block;
        width: 40px;
        height: 40px;
        margin: 0 20px;
        text-align: center;
        cursor:pointer;
        em{
          display: inline-block;
          width: 30px;
          height: 30px;
        }
      }
    }
</style>


