<template>
<div>
       <div class="p-search">
          <div class="p-search-wrap">
             <div class="p-search-head">
               <!--<el-input class="query-input" v-model="query" placeholder="查询：请输入课程名称"></el-input> -->
               <div class="btns">
                  <el-button @click="add" type="primary" style="margin-left:10px;">+添加</el-button>
               </div>
             </div>  
           <div class="p-search-table">  
            <table style="float:left;">
              <thead>
                <tr>
                  <th>ID</th><th>封面</th><th>课程名称</th><th>类别</th><th>时长</th><th>创建时间</th><th>更新时间</th>
               </tr>
              </thead>
              <tbody>
               <tr v-for="item in courses">
                 <td>{{item.res.id}}</td><td><img style="width:30px;height:30px;" :src="item.picPath"/></td><td>{{item.res.name}}</td><td>{{item.res.category}}</td><td>{{item.res.time}}</td><td>{{item.res.creatTime}}</td><td>{{item.res.updateTime}}</td>
               </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr><th style="width:160px">操作</th></tr>
              </thead>
              <tbody >
                <tr v-for="(item,index) in courses"><td><span class="spans" @click=modify(index) >编辑</span><span @click="deleteInfo(item)" class="spans">删除</span></td></tr>
              </tbody>
            </table>
           </div>
           <div >
              <el-pagination
                class="pagination"
                layout="prev, pager, next"
                @current-change='currentChange'
                :total="page*10">
              </el-pagination>
            </div>
          </div>
       </div>
      <transition name="fade">
          <transition name="fade">
            <el-dialog :title="title" @close='back'  :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                <course-info  :iId='iId' @success="success" @back="back" @close="close"></course-info>
            </el-dialog>
          </transition>
       </transition>
  </div>     
</template>
<script>
import post from '../post'
import get from '../get'
import courseInfo from '../components/aboutYinman/courseInfo'
  export default {
      name:"introduce",
      data(){
        return {
          query:'',
          page:1,
          CPage:1,
          limit:10,
          isShow:false,
          imageUrl: '',
          dialogFormVisible: false,
          url:"/upload/upload",
          courses:[],
          title:"",
          iId:0
        }
      },
      created () {
        this.initialCurriculum(this.CPage,this.limit)
      },
    methods:{
      initialCurriculum(pagexIndex,limit){
        get("/api/rhythmCourse/getList?pageIndex="+pagexIndex+"&limit="+limit).then((res)=>{
          this.courses=res.data.list
          this.page=res.data.pages
        })
      },
      modify(index){
          this.title="编辑课程介绍"
          this.dialogFormVisible=true
          this.iId=this.courses[index].res.id
      },
      add(){
        this.iId=0
        this.title="添加课程介绍"
        this.dialogFormVisible=true
      },
      success(form,img,url){
        this.imageUrl = img;
        this.form.picId=form
        this.url="/upload/upload?id="+url
      },
      currentChange(val){
         this.CPage=val
         this.initialCurriculum(this.CPage,this.limit)
      },
      back(){
         this.dialogFormVisible=false
         this.iId=0
      },
      close(){
         this.dialogFormVisible=false
         this.initialCurriculum(this.CPage,this.limit)
      },
      deleteInfo(item){
         console.log(item)
         this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post('/api/rhythmCourse/delete',{id:item.res.id}).then((response)=>{
            if(response.data.code==1){
              this.initialCurriculum(this.CPage,this.limit)
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }else{
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
              
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    watch:{
       curri(newVal,oldVal){
         if(newVal.trim().length==0){
            var This=this
             this.timer=setTimeout(function () {
                This.initialCurriculum()
             },500)
          }else{
              clearTimeout(this.timer)
          }  
       },
    },
    components:{
      courseInfo
    }
   }
</script>
<style lang="less" scoped>
     .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
      }
      .fade-enter, .fade-leave-active {
        opacity: 0
      }
      .p-search{
          background-color:#f5f5f5;
          .p-search-wrap{
            background-color:white;
          }
           .btns{
              margin-top:20px;
           }
          .p-search-head{
            text-align:left;
            margin-bottom:22px;
          }
          .query-input{
            width:192px;
            height:28px;
          }
          .query-btn{
            margin-left:10px;
          }
          .p-search-table:after{
             content:"";
             display:block;
             clear:both;
          }
          .p-search-table{
            zoom:1; 
            border:1px solid #dfe6ec;
            table{
              border-collapse:collapse;
            }
            th{
              background-color:#eef1f6;
            }
            th,td{
              border-right: 1px solid #dfe6ec;
              border-bottom: 1px solid #dfe6ec;
              padding:0 20px;
              height:40px;
              font-size:14px;
            }
            .spans{
              float:left;
              cursor:pointer;
              color:#20a0ff;
              width:80px;
              text-align:center;
              height:100%; 
              line-height:40px;             
            }
          } 
      }
       .show{
        position:absolute;
        left:0;
        top:0;
        background-color:rgba(0,0,0,0.5);
        width:100%;
        height:100%;
        z-index:100;
     } 
     .curriculumShow{
        position:absolute;
        left:0;
        top:0;
        background-color:rgba(0,0,0,0.5);
        width:100%;
        height:100%;
        z-index:1000;
     }
     
   
   
    

</style>
