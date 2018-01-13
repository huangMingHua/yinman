<template>
        <div class="p-course" >
               <div>
                 <span class="warn" style="left:40px;">*</span>
                 <span class="span">课程名称</span><el-input class="input" v-model="form.name" placeholder="请输入课程名"></el-input>
               </div>
                <div>
                  <span class="warn" style="left:70px;">*</span>
                 <span class="span">类别</span><el-input class="input" v-model="form.category" placeholder="请输入类别"></el-input>
               </div>
                <div>
                 <span class="warn" style="left:70px;">*</span>
                 <span class="span">时长</span><el-input class="input" v-model="form.time" placeholder="请输入时长"></el-input>
               </div>
               <div style="overflow:hidden;">
                 <span class="warn" style="left:40px;">*</span>
                 <span class="span" >课程介绍</span>
                  <ueditor :content="form.courseIntroduction" @get="change" ></ueditor>
               </div>
               <div class="pic">
                    <div style="width:100px;display:inline-block;text-align:center">
                      <span style="display:block;">封面</span>
                      <el-button size="small" @click="delect" style="margin-top:30px;" type="primary">删除图片</el-button>
                    </div> 
                   <el-upload
                      class="avatar-uploader img"
                      :action="url"
                      :show-file-list="false"
                      :on-change="handlePreview"
                     >
                       <img v-if="sShowImg" :src="imageUrl" class="avatar img"> 
                      <i v-else class="el-icon-plus avatar-uploader-icon img" ></i>
                   </el-upload>
               </div>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="back" class="back">取 消</el-button>
                  <el-button type="primary"  @click="close">提 交</el-button>
                </div>
      </div>
</template>
<script>
import ueditor from '../ueditor/ueditor'
  export default {
     props: ['iId'],
     data(){
       return{
         form: {
            name:"",
            category:"",
            time:"",
            courseIntroduction:"",
            picId:0
         },
         url: "/api/upload/upload",
         imageUrl:'',
         file:'',
         sShowImg:false
       }
     },
     created(){
       this.init()
     },
    methods:{
        init(){
          this.initForm()
          if(this.iId>0){
            this.$http.get('/api/rhythmCourse/getById',{params:{id:this.iId}}).then((response)=>{
              console.log(response.data.picPath)
             this.imageUrl=response.data.picPath
             if(this.imageUrl){
                this.sShowImg=true
             }
             this.form=response.data.res
           })  
          }
        },
        initForm(){
          this.form={
            name:"",
            category:"",
            time:"",
            courseIntroduction:"",
            picId:0
          }
          this.imageUrl=""
          this.sShowImg=false
          this.file=''
        },
        handlePreview(file){
              var isPic=true
              if (file.raw.type=='audio/mp3'||file.raw.type=='video/mp4') {
                this.$message.error('只能上传图片');
                isPic=false
              }else{
                this.sShowImg=true
                this.imageUrl=file.url
                this.file=file.raw
              }
              return isPic;
          },
        back(){
           this.$emit('back')
        },
        close(){
          let {name,category,time,courseIntroduction,picId} = this.form
          if(_.trim(name)==''){
            this.$message("课程名称不能为空")
          }else if(_.trim(category)==''){
            this.$message("类别不能为空")
          }else if(_.trim(time)==''){
            this.$message("时长不能为空")
          }else if(_.trim(courseIntroduction)==''){
            this.$message("课程介绍不能为空")
          }else{
             var formData = new FormData()
             formData.append('id',this.iId)
             formData.append('name', name)
             formData.append('category', category)
             formData.append('time', time)
             formData.append('courseIntroduction', courseIntroduction)
             formData.append('file', this.file)
             formData.append('picId', picId+'')
            this.$http.post("/api/rhythmCourse/saveOrUpdateCourseInfo",formData).then((res)=>{
              if(res.data.id){
                  this.initForm()
                  this.$message('提交成功');
                  this.$emit('close',res.data.id)
              }
            })
          }
        },
        change(val){
            this.form.courseIntroduction=val
        },
       delect(){
         this.sShowImg=false
         this.imageUrl=""
         this.form.picId=0
         this.file=''
       }
    },
    components:{
      ueditor
    },
    watch:{
      iId(){
        this.init()
      }
    }
  }
</script>
<style lang="less" scoped>
    .input{
        display:inline-block;
        width:300px;
      }
    .span{
      display:inline-block;
      width:100px;
      text-align:right;
      vertical-align:middle;
      margin-right: 20px;
    }
    .p-course{
      width:950px;
      >div{
          margin:20px 0;
          text-align:left
      }
      .pic{
        position:absolute;
        right:100px;
        top:70px;
        width:300px;
      }
      textarea{
        width:400px;
        height:200px;
        border-radius:5px;
        vertical-align:middle;
      }
    }
    .img{
         width:100px;
         height:100px;
    }
    .back{
      margin-right: 20px;
    }
 
</style>