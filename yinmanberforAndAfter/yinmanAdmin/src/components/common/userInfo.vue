<template>
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
                <em v-if="user.state==0">普通用户</em>
                <em v-else-if="user.state==1">学生家长</em>
                <em v-else-if="user.state==2">教师</em>
             </div> 
             <div>
                <span>备注：</span>
                <em>{{user.remarks}}</em>
             </div> 
        </div>  
    </div>    
</template>
<script>
export default {
    props:['userId',"changeIndex"],
    data(){
        return{
            user:{}
        }
    },
    created(){
        this.initialCurriculum()
    },
    methods:{
        initialCurriculum(){
            this.$http.get('/api/user/getById?id='+this.userId).then((response)=>{
                this.user=response.data
                this.$emit("getStudent",response.data.students)
            })
        },
    },
    watch:{
        userId(){
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
               width: 700px;
               text-align: left;
               >div{
                   margin-bottom: 20px;
               }
               span{
                   display: inline-block;
                   width: 100px;
                   vertical-align: top;
                   text-align: right;
                   margin-right: 10px;
               }
               em{
                   display: inline-block;
                   width: 500px;
                   font-style: normal;
               }
           }
           .btns{
                    margin-top: 40px;
                    text-align: center;
            }
       }

</style>


