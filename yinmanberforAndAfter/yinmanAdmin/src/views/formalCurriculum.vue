<template>
     <p-search :curriculumArr="curriculums" :page="page" @currentChange="currentChange"  @getDelArrar="delArrarFn"  @query="queryname">
         <template slot="table">
           <el-table-column
              fixed
              prop="id"
              label="id"
              width="150">
            </el-table-column>
            <el-table-column
              fixed
              prop="name"
              label="课程名称"
              width="150">
            </el-table-column>
            <el-table-column
              fixed
              prop="courseDescription"
              label="注意事项"
              width="150" 
              :show-overflow-tooltip='true'
            >
            </el-table-column>
            <el-table-column
              fixed=""
              label="操作"
              width="100">
              <template scope="scope">
                <el-button type="text"   @click="details(scope.$index, scope.row)" size="small" >编辑</el-button>
                <el-button type="text"   @click="handleDelete(scope.$index, scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
      </template>
      <template slot="action">
         <el-button @click="add" type="primary" style="margin-left:15px;">+添加</el-button>
      </template>
      <template slot="transition">
          <el-dialog
              :title="title"
              :visible.sync="dialogVisible"
              :close-on-click-modal="false"
              >
              <course :curriculum="curriculum"  :typeOption="typeOption" @submit="submit" @back="back"></course>
          </el-dialog>
      </template>
     </p-search>
</template>
<script>
import auth from '../auth'
import menus from '../nav-config'
import post from '../post'
import get from '../get'
import course from '../components/courseCreation/course'
  export default {
      name:"introduce",
      data(){
      	return {
           curri:"",
           page:1,
           CPage:1,
           limit:10,
           curriculums:[],
      	   loggedIn: auth.loggedIn(),
           timer:null,
           checked:false,
           backSingleUser:"",
           curriculum:{},
           id:0,
           typeOption: [{
	          value: '一对一',
	          label: '一对一'
	        }, {
	          value: '一对多',
	          label: '一对多',
	        }],
          dialogVisible:false,
          title:"",
          copyCurriculums:[]
        }
      },
      created () {
          this.initialCurriculum(this.CPage,this.limit)
	    },
    methods:{
      initialCurriculum(pageIndex,limit){
            get(`/api/course/getPaging?pageIndex=${pageIndex}&limit=${limit}`).then((response) => { 
                   this.curriculums=JSON.parse(JSON.stringify(response.data.list)) 
                   this.copyCurriculums=JSON.parse(JSON.stringify(response.data.list))
                   for(let item of this.curriculums){
                         item.courseDescription=item.courseDescription.replace(/<\/[^<>]+>/g,'').replace(/<[^<>]+>/g,'')
                   }
                   this
                   this.page=response.data.pages
            })
      }
      ,
      currentChange(val){
         this.CPage=val
         this.initialCurriculum(this.CPage,this.limit)
      },
      delArrarFn(val){
          // this.delCurriculum=val
      },
      add(){ 
            this.title="添加课程"
      	    // this.curriculum={}
            this.id=0
      	    this.dialogVisible =true;
      	    this.curriculum={
              id:'',
              name:"",
              courseDescription:''
      	    }
      },
      queryname(){
          get('/api/course/query?queryname='+this.curri.trim()).then((response) => { 
                   this.curriculums=response.data.count
               })
        },
        handleDelete(index,val){
           this.$confirm('确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal:false,
              type: 'warning'
            }).then(() => {
              post('/api/course/delete',{ id:val.id }).then((response) => { 
                   if(response.data.code==1){
                     this.initialCurriculum(this.CPage,this.limit)
                     this.$message({
                        type: 'success',
                        message: response.data.msg,
                        
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
           
       },
       details(index,val){
               this.title="编辑课程"
               this.dialogVisible =true;
               for(var i=0;i<this.copyCurriculums.length;i++){
                      if(this.copyCurriculums[i].id==val.id){
                      	   this.id=val.id
                           var jsonString=JSON.stringify(this.copyCurriculums[i])
                          this.curriculum=JSON.parse(jsonString)
                      }
                   }
       },
       back(){
          this.dialogVisible =false;
          this.curriculum={
      	    	name:"",
      	    	time:""
      	    }       
       },
       submit(){
            if(_.trim(this.curriculum.name)==""){
                   this.$message('课程名称不能为空');
            }else{
              if(this.id!=0){
                post('/api/course/update',{ makeCouseCreate:this.curriculum }).then((response) => { 
                            this.$message(response.data.msg);
                              if(response.data.bool){
                                this.dialogVisible =false;
                                this.initialCurriculum(this.CPage,this.limit)
                              }
                    })
              }else{
                  this.curriculum.time=new Date().getTime()
                  post('/api/course/add',{addCouseCreate:this.curriculum }).then((response) => { 
                      this.$message(response.data.msg);
                      if(response.data.bool){
                        this.dialogVisible =false;
                        this.initialCurriculum(this.CPage,this.limit)
                      }
                  })
              } 
            }
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
         } 
    },
    components:{
      course
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
     .show{
       position:absolute;
        left:0;
        top:0;
        background-color:rgba(0,0,0,0.5);
        width:100%;
        height:100%;
         z-index:100;
     } 
</style>
