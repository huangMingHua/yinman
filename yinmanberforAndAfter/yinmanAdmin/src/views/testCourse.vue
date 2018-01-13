<template>
     <p-search :curriculumArr="curriculumArray" :page="page" @currentChange="currentChange">
       <template slot="action">
         <el-button @click="addCurriculum" type="primary" style="margin-left:15px;">+添加</el-button>
      </template> 
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
              fixed=""
              label="操作"
              width="100">
              <template scope="scope">
                <el-button type="text"   @click="handleDelete(scope.$index, scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
      </template> 
      <template slot="transition">
          <el-dialog title="添加试课课程" :close-on-click-modal="false"  :visible.sync="dialogVisible">
            <curriculum @submit="submit" :form="form" @back="back"></curriculum>
          </el-dialog>
      </template>   
     </p-search>
</template>
<script>
import auth from '../auth'
import menus from '../nav-config'
import curriculum from '../components/introduce/curriculum'
  export default {
    name:"introduce",
    data(){
      return {
        QCurriculum:"",
        page:1,
        CPage:1,
        limit:10,
        curriculumArray:[],
        delCurriculum:[],
        timer:null,
        isShow:false,
        dialogVisible: false,
        form:{
          curriculum:""
        }
      }
    },
    created () {
      this.init()
	  },
    methods:{
      init(){
        this.$http.get(`/api/curriculum/getPaging?pageIndex=${this.CPage}&limit=${this.limit}`).then((response) => { 
          console.log(response)
          this.page=response.data.pages   
          this.curriculumArray=response.data.list
        })
      },
      submit(){
        if (this.form.curriculum.trim() !== '') {
          this.$http.post('/api/curriculum/add',{ name: this.form.curriculum}).then((response) => {
            if(response.data.code==1){
              this.$message('添加成功');
              this.dialogVisible = false
              this.init()
              this.form.curriculum=""
            }else{
              this.$message(response.data.msg);
            }
          })
        }else{
          this.$message('课程不能为空');
        }
      },
      back(){
        this.dialogVisible = false
        this.form.curriculum=""
      },
      addCurriculum(){
        this.dialogVisible = true
      },
      query(){
        clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
          if(_.trim(this.QCurriculum)!=""){
            this.$http.get(`/api/curriculum/query?name=${this.QCurriculum}`).then((response) => { 
              this.page=1
              this.curriculumArray=response.data
            })
          }else{
            this.init()
          }
        },1000)
      },
      handleDelete(index,val){
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/curriculum/delete',{ id :val.id }).then((res) => {
            if(res.data.code == 1){
              this.init() 
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }
            else{
              this.$message(res.data.msg)
            }
          })
        }).catch(() => {        
        });
      },
      currentChange(val){
        this.CPage=val
        this.init()
      }
    },
    watch:{
        //  curri(newVal,oldVal){
        //    if(newVal.trim().length==0){
        //       var This=this
        //        this.timer=setTimeout(function () {
        //           This.initialCurriculum()
        //        },500)
        //     }else{
        //         clearTimeout(this.timer)
        //     }  
        //  } 
      
    },
    components:{
      curriculum
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

