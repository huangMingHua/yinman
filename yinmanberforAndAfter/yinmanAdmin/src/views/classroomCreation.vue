<template>
     <p-search :curriculumArr="curriculumArray" :page="page"  @currentChange="currentChange"  @getDelArrar="delArrarFn"  @query="queryCurriculum">
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
              label="教室名称"
              width="150">
            </el-table-column>
             <el-table-column
              fixed
              prop="isPiano"
              label="是否有钢琴"
              width="150">
            </el-table-column>
            <el-table-column
              fixed=""
              label="操作"
              width="100">
              <template scope="scope">
                <el-button type="text"   @click="modify(scope.$index, scope.row)" size="small">编辑</el-button>
                <el-button type="text"   @click="handleDelete(scope.$index, scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
      </template>
       <template slot="action">
        <el-button @click="addClassroom" type="primary" style="margin-left:15px;">+添加</el-button>
       </template>
       <template slot="transition">
          <el-dialog
              :title="title"
              :visible.sync="dialogVisible"
              :close-on-click-modal="false"
              >
            <classroom @back="back" :form="form"  @submit="submit"></classroom>
          </el-dialog>
          
      </template>
     </p-search>
</template>
<script>
  import auth from '../auth'
  import menus from '../nav-config'
  import post from '../post'
  import get from '../get'
  import classroom from '../components/classroom/classroom';
  export default {
    name:"introduce",
    data(){
      return {
        curri:"",
        page:1,
        CPage:1,
        limit:10,
        curriculumArray:[],
        loggedIn: auth.loggedIn(),
        delCurriculum:[],
        timer:null,
        dialogVisible:false,
        form:{
          classroom:"",
          checked:false
        },
        title:'添加教室'
      }
    },
    created () {
      this.initialCurriculum(this.CPage,this.limit)
	  },
    methods:{
      initialCurriculum(pageIndex,limit){
        get(`/api/classroom/getAll?pageIndex=${pageIndex}&limit=${limit}`).then((response) => { 
          for(let item of response.data.list){
            if(item.isPiano==0){
              item.isPiano=""
            }else{
              item.isPiano="有"
            }
          }
          this.page=response.data.pages  
          this.curriculumArray=response.data.list
        })
      }
      ,
      addClassroom(){
        this.form={
          classroom:"",
          checked:false
        }
        this.title='添加教室'
        this.dialogVisible=true
      },
      currentChange(val){
        this.CPage=val
        this.initialCurriculum(this.CPage,this.limit)
      },
      delArrarFn(val){
        this.delCurriculum=val
      },
      queryCurriculum(){
          var This=this
          if(this.curri.trim().length>0){
            post('/api/classroom/query',{ queryCurriculumName:this.curri.trim() }).then((response) => { 
              This.curriculumArray=response.data.count
            })   
          }
        },
      handleDelete(index,val){
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          post('/api/classroom/delete',{ classroom:val }).then((response) => {
            console.log(response)
            if(response.data.code==1){
              this.initialCurriculum(this.CPage,this.limit)
              this.$message({
                type: 'success',
                message: response.data.msg
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
      modify(index, item){
          this.dialogVisible=true
          this.title='编辑教室'
          let checked=false
           if(item.isPiano){
              checked=true
           }
           this.form={
             id:item.id,
             checked:checked,
             classroom:item.name,
           }
      },
      submit(){
        
        if (this.form.classroom.trim() !== '') {
          if(this.form.id){
               post('/api/classroom/update',{id:this.form.id, classroom:this.form.classroom,isPiano:this.form.checked }).then((response) => {
                  if(response.data.bool){
                    this.initialCurriculum(this.CPage,this.limit)
                    this.dialogVisible=false
                    this.classroom=""
                  }
                  this.$message(response.data.msg);
              })
          }else{
               post('/api/classroom/add',{ classroom:this.form.classroom,isPiano:this.form.checked }).then((response) => {
                  if(response.data.bool){
                    this.initialCurriculum(this.CPage,this.limit)
                    this.dialogVisible=false
                    this.classroom=""
                  }
                  this.$message(response.data.msg);
                })
          }
        }else{
          this.$message('教室名称不能为空');
        }
       },
      back(){
        this.dialogVisible=false
        this.form.classroom="",
        this.form.checked=false
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
       classroom
    }
   }
</script>
<style scoped>

</style>
