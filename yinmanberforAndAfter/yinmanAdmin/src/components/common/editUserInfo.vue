<template>
<div>
  <div class="box-body-upper">
        <div class="upper-info">
            <div>
                <img :src="user.wxHead">
            </div>
            <h5>
                {{user.wxName}}
            </h5>        
        </div>
        <div class="upper-operation">
             <div>
                <span>身份类别：</span>
                <span v-if="user.state==1">学生家长</span>
                <span v-else>教师</span>
                <el-button size="mini"  style="background:#8492A6;color:white"  @click="change" v-if="user.state==1&&user.students==0">设为教师</el-button>
             </div> 
             <div>
                <span>备注：</span>
                <el-input  :rows="3" type="textarea" v-model="user.remarks"  class="remarks" placeholder="请输入内容"></el-input>
                <el-button type="primary" @click="submit" style="vertical-align: bottom;margin-left:20px;">提交</el-button>
             </div> 
        </div>
    </div> 
   </div>  
</template>
<script>
import get from '../../get'
import post from '../../post'
export default {
  props:['userId',"changeIndex"],
  data(){
      return{
            user:{
            }
      }
  },
  created(){
     this.initialCurriculum()
  },
  methods:{
    initialCurriculum(){
        this.$http.get('/api/user/getById?id='+this.userId).then((response)=>{
                this.user=response.data
                this.$emit("getStudent",response.data.students,response.data.state)
        })
    },
    submit(){
       this.$http.post('/api/user/changeRemarks',{editInfo:this.user}).then((response)=>{
           if(response.data.code==1){
              this.initialCurriculum()
              this.$message("修改成功")
           }else{
               this.$message(response.data.msg)
           }
        })
    },
    change(){
         this.$confirm('此操作将永久改变用户身份, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            console.log(this.user)
            this.$http.post('/api/user/change',{editInfo:this.user}).then((response)=>{
            if(response.data.code==1){
                this.$router.push({path:'teacherInfo',query:{teacherId:response.data.data.teacherId}})
            }else{
                this.$message(response.data.msg)
            }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消改变身份'
          });          
        });
    }
  },
  watch:{
        changeIndex(){
            this.initialCurriculum()
        }
    }
  
}
</script>
<style lang="less" scoped>
  .box-body-upper{
           display: flex;
           .upper-info{
               text-align: center;
               width: 200px; 
               img{
                   width: 30px;
                   height: 30px;
               }
               h5{
                   font-size: 20px;
                   margin: 15px 0;
               }
           }
           .upper-operation{
               width: 800px;
               text-align: left;
               >div{
                   margin-bottom: 20px;
               }
               span{
                   display: inline-block;
                   width: 100px;
                   vertical-align: middle;
                   text-align: right;
                   margin-right: 10px;
               }
               .identity,.remarks{
                   display: inline-block;
                   width: 566px;
                   vertical-align: middle;
               }
           }
           .btns{
                    margin-top: 40px;
                    text-align: center;
            }
       }

</style>


