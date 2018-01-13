<template>
<div>
       <div class="p-search" :page="page">
          <div class="p-search-wrap">
             <div class="p-search-head">
               <!--<el-input class="query-input" v-model="query" placeholder="查询：请输入姓名"></el-input> -->
               <div class="btns">
                  <el-button  @click="add" type="primary" style="margin-left:15px;">+添加</el-button>
               </div>
             </div>  
           <div class="p-search-table" style="overflow: auto;">
             <div style="width:1700px;">  
              <table style="width:1200px;float:left">
                <thead>
                  <tr>
                    <th>ID</th><th>头像</th><th>姓名</th><th style="width:50px;">性别</th><th>学历</th><th>专业</th><th>毕业院校</th><th>教授科目</th><th>创建时间</th><th>更新时间</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in teachers">
                  <td>{{item.list.id}}</td><td><img style="width:30px;height:30px;" :src="item.picPath"/></td><td>{{item.list.name}}</td><td>{{item.list.sex}}</td><td>{{item.list.education}}</td>
                  <td>{{item.list.major}}</td><td>{{item.list.school}}</td><td>{{item.list.teachingSubjects}}</td><td>{{item.list.creatTime}}</td><td>{{item.list.updateTime}}</td>
                </tr>
                </tbody>
              </table>
              <table style="width:250px;float:left">
                <thead>
                  <tr><th style="width:160px">操作</th></tr>
                </thead>
                <tbody >
                  <tr v-for="(item,index) in teachers"><td><span class="spans" @click=modify(index) >编辑</span><span @click="deleteInfo(item)" class="spans">删除</span></td></tr>
                </tbody>
              </table>
            </div>
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
         <el-dialog :title="title" @close='back' :visible.sync="dialogFormVisible" :close-on-click-modal="false">
           <teacher-info  :iId="iId"  @success="success" @back="back" @close="close" ></teacher-info>
         </el-dialog>
      </transition>
     </div> 
</template>
<script>
import post from '../post'
import get from '../get'
import teacherInfo from '../components/aboutYinman/teacherInfo'
  export default {
    name:"introduce",
    data(){
      return {
        query: '',
        page: 1,
        CPage: 1,
        limit: 10,
        teachers: [],
        dialogFormVisible: false,
        iId: "",
        imageUrl: '',
        title: "",
      }
    },
    created () {
      this.initialCurriculum(this.CPage,this.limit)
    },
    methods:{
      initialCurriculum(pageIndex,limit){
        get("/api/teachernItroduction/getList?pageIndex="+pageIndex+"&limit="+limit).then((res)=>{
          this.teachers=res.data.list
          this.page=res.data.pages
        })
      },
      modify(index){
        this.title="编辑教师"
        this.dialogFormVisible= true
        this.iId=this.teachers[index].list.id
      },
      back(){
        this.iId=""
        this.dialogFormVisible= false
      },
      close(val){
          this.iId=""
          this.initialCurriculum(this.CPage,this.limit)
          this.dialogFormVisible= false
      },
      currentChange(val){
        this.CPage=val
        this.initialCurriculum(this.CPage,this.limit)
      },
      success(form,img,url){
        console.log(form,img,url)
        this.imageUrl = img;
        this.form.picId=form
        this.url="/api/upload/upload?id="+url
      },
      add(){
        this.title="添加教师"
        this.dialogFormVisible= true
        this.iId=""
      },
      
      deleteInfo(item){
        console.log(item)
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post('/api/teachernItroduction/delete',{id:item.list.id}).then((response)=>{
            console.log(response)
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
        teacherInfo
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
              height:40px;
              padding:0 20px;
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
     .curriculumShow{
        position:absolute;
        left:0;
        top:0;
        background-color:rgba(0,0,0,0.5);
        width:100%;
        height:100%;
        z-index:1000;
     }

    .el-icon-plus:before{
          position: absolute;
          left:0;
          right:0;
          top:0;
          bottom:0;
          width:30px;
          height:30px;
          margin:auto;
    }
    

</style>
