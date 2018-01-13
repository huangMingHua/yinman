<template>
         <div class="p-teacher">
          <div>
            <span class="warn" style="left:70px;">*</span>
            <span class="span">标题</span><el-input class="input" v-model="form.title" placeholder="请输入标题"></el-input>
          </div>
          <div>
            <span class="warn" style="left:40px;">*</span>
            <span class="span">比赛地点</span><el-input class="input" v-model="form.place" placeholder="请输入比赛地点"></el-input>
          </div>
          <div>
            <span class="warn" style="left:40px;">*</span>
            <span class="span">比赛时间</span><el-input class="input" v-model="form.time" placeholder="请输入专业"></el-input>
          </div>
          <div>
            <span class="warn" style="left:40px;">*</span>
            <span class="span">比赛介绍</span>
            <ueditor :content="form.competitionPresentation" @get="change" ></ueditor>
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
                :on-change="handlePreview">
                <img v-if="imageUrl" :src="imageUrl" class="avatar img">
                <i v-else class="el-icon-plus avatar-uploader-icon img"></i>
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
            form:{
              title:"",
              place:"",
              time:"",
              competitionPresentation:"",
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
             this.$http.get('/api/competitionPresentation/getById',{params:{id:this.iId}}).then((response)=>{
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
              title:"",
              place:"",
              time:"",
              competitionPresentation:"",
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
        beforeAvatarUpload(file){
           var isPic=true
            if (file.type=='audio/mp3'||file.type=='video/mp4') {
              this.$message.error('只能上传图片');
              isPic=false
            }
            return isPic;
        }
        ,
        back(){
           this.$emit('back')
        },
        close(){
          let {title, place, time, competitionPresentation,picId} = this.form
          if(_.trim(title)==''){
             this.$message("标题不能为空")
          }else if(_.trim(place)==''){
             this.$message("比赛地点不能为空")
          }else if(_.trim(time)==''){
             this.$message("比赛时间不能为空")
          }else if(_.trim(competitionPresentation)==''){
             this.$message("比赛介绍不能为空")
          }else{
              var formData = new FormData()
              formData.append('id',this.iId)
              formData.append('title', title)
              formData.append('place', place)
              formData.append('time', time)
              formData.append('competitionPresentation', competitionPresentation)
              formData.append('file', this.file)
              formData.append('picId', picId+'')
              this.$http.post("/api/competitionPresentation/saveOrUpdateCompetitionInfo",formData).then((res)=>{
                  if(res.data.id){
                    this.$emit('close')
                    this.$message('提交成功');
                    this.initForm()
                  }
              })
          }
        },
        delect(){
         this.sShowImg=false
         this.imageUrl=""
         this.form.picId=0
         this.file=''
       },
       change(val){
            this.form.competitionPresentation=val
       },
    },
    watch:{
      iId(){
        this.init()
      }
    },
    components:{
      ueditor
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