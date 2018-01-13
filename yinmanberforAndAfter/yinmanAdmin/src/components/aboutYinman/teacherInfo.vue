<template>
         <div class="p-teacher">
          <div>
            <span class="warn" style="left:70px;">*</span>
            <span class="span">姓名</span><el-input class="input" v-model="form.name" placeholder="请输入姓名"></el-input>
            
          </div>
          <div>
            <span class="warn" style="left:70px;">*</span>
            <span class="span">性别</span>
            <el-radio class="radio" v-model="form.sex" label="男">男</el-radio>
            <el-radio class="radio" v-model="form.sex" label="女">女</el-radio>
          </div>
          <div>
            <span class="warn" style="left:70px;">*</span>
            <span class="span">学历</span><el-input class="input" v-model="form.education" placeholder="请输入学历"></el-input>
            <span class="warn" style="left:70px;">*</span>
            <span class="span">专业</span><el-input class="input" v-model="form.major" placeholder="请输入专业"></el-input>
          </div>
          <div>
             <span class="warn" style="left:40px;">*</span>
             <span class="span">毕业院校</span><el-input class="input" v-model="form.school" placeholder="请输入毕业院校"></el-input>
             <span class="warn" style="left:40px;">*</span>
            <span class="span">教授科目</span><el-input class="input" v-model="form.teachingSubjects" placeholder="请输入教授科目"></el-input>
          </div>
          
          <div>
            <span class="warn" style="left:40px;">*</span>
            <span class="span">专业经历</span>
            <ueditor :content="form.professionalExperience" @get="change" ></ueditor>
          </div>
          <div class="pic">
            <div style="width:100px;display:inline-block;text-align:center">
              <span style="display:block;">头像</span>
              <el-button size="small" @click="delect" style="margin-top:30px;" type="primary">删除图片</el-button>
            </div>  
               <el-upload class="avatar-uploader img" ref="form" 
                style="margin-top:20px;"
                :auto-upload="false" 
                :action="url" 
                :show-file-list="false" 
                :on-change="handlePreview"
                :data="form"> 
                <img v-if="sShowImg" :src="imageUrl" class="avatar img">      
                <i v-else class="el-icon-plus avatar-uploader-icon img"></i>
              </el-upload>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="back" class="back">取 消</el-button>
              <el-button type="primary" @click="close">提 交</el-button>
            </div>
         </div> 
</template>
<script>
import ueditor from '../ueditor/ueditor'
  export default {
     props: ['iId'],
     data(){
          return{
              form:{
                name: "",
                sex: "",
                education: "",
                major: "",
                school: "",
                teachingSubjects: "",
                professionalExperience: "",
                picId: 0,
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
            this.$http.get('/api/teachernItroduction/getById',{params:{id:this.iId}}).then((response)=>{
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
            name: "",
            sex: "",
            education: "",
            major: "",
            school: "",
            teachingSubjects: "",
            professionalExperience: "",
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
        handleAvatarSuccess(res, file){
           this.$emit('success',res.res.id,URL.createObjectURL(file.raw),res.res.id)
        },
        back(){
          this.form={
            name: "",
            sex: "",
            education: "",
            major: "",
            school: "",
            teachingSubjects: "",
            professionalExperience: "",
          }
          this.imageUrl=""
          this.file=''
          this.$emit('back')
        },
        close(){
          let {id,name, education, major, school, teachingSubjects, sex, professionalExperience, picId}=this.form
          if(_.trim(name)==''){
            this.$message('姓名不能为空')
          }else if(_.trim(education)==''){
            this.$message('学历不能为空')
          }else if(_.trim(major)==''){
            this.$message('专业不能为空')
          }else if(_.trim(school)==''){
            this.$message('毕业院校不能为空')
          }else if(_.trim(teachingSubjects)==''){
            this.$message('教授科目不能为空')
          }else if(_.trim(sex)==''){
            this.$message('性别不能为空')
          }else if(_.trim(professionalExperience)==''){
            this.$message('专业经历不能为空')
          }else{
             var formData = new FormData()
             formData.append('id',this.iId)
             formData.append('name', name)
             formData.append('education', education)
             formData.append('major', major)
             formData.append('school', school)
             formData.append('teachingSubjects', teachingSubjects)
             formData.append('sex', sex)
             formData.append('professionalExperience', professionalExperience)
             formData.append('file', this.file)
             formData.append('picId', picId+'')
              this.$http.post("/api/teachernItroduction/saveOrUpdateTeacherInfo",formData).then((res)=>{
                if(res.data.id){
                  this.$emit('close')
                  this.$message('提交成功');
                  this.initForm()
                }
              })
          }
        },
        change(val){
            this.form.professionalExperience=val
       },
       delect(){
         this.imageUrl=""
         this.form.picId=0
         this.file=''
         this.sShowImg=false
       }
    }
    ,
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
      margin-right: 20px;
      vertical-align:middle;
    }
    .p-teacher{
      width: 950px;
      >div{
          margin:20px 0;
          text-align:left
      }
      .pic{
        position:absolute;
        right:162px;
        top:50px;
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