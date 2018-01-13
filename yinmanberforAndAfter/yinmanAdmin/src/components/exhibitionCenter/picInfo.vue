<template>
  <div class="p-teacher">
    <div>
      <span class="warn" style="left:70px;">*</span>
      <span class="span">标题</span>
      <el-input class="input" v-model="form.title" placeholder="请输入标题"></el-input>
    </div>
    <div>
      <span class="warn" style="left:70px;">*</span>
      <span class="span">说明</span>
      <textarea v-model="form.explain"></textarea>
    </div>
    <div class="pic">
      <div style="width:100px;display:inline-block;text-align:center">
            <span class="warn" style="left:-28px;top:32px">*</span>
            <span style="display:block;">文件</span>
      </div> 
      <el-upload class="avatar-uploader" ref="form" 
        style="margin-top:20px;"
        :auto-upload="false" 
        :action="url" 
        :show-file-list="false" 
        :before-upload="beforeAvatarUpload"
        :file-list="fileList"
        :on-change="handlePreview"
        :data="form">        
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <img v-if="mimeType == 'image/jpeg' || mimeType == 'image/png'" :src="viewUrl" class="avatar img"></img>
      <video v-if="mimeType == 'video/mp4'" :src="viewUrl" class="avatar img" controls="controls"></video>
      <audio v-if="mimeType == 'audio/mp3'" :src="viewUrl" class="avatar img" controls="controls"></audio>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="back">取 消</el-button>
      <el-button type="primary"  @click="success">提 交</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['info','activeName'],
    data() {
      return {
        url:'/api/downloadPic/saveOrUpdatePicInfo',
        viewUrl:'',
        mimeType: '',
        file:null,
        fileList:[],
        form:{
          id:0,
          title:'',
          explain:'',
          mimeType:''
        },
        message:null
      }
    },
    created(){
      Object.assign(this.form, this.info)
      this.viewUrl = this.info.path
      this.mimeType = this.info.mimeType
    },
    methods: {
      handlePreview(file){
        if(this.activeName!=file.raw.type.split('/')[0]){
           if(this.activeName=='video'){
             this.$message.error('只能上传视频');
           }else if(this.activeName=='audio'){
             this.$message.error('只能上传音频');       
           }else if(this.activeName=='image'){
             this.$message.error('只能上传图片');
           }
        }else{
          this.viewUrl = file.url;
          this.mimeType = file.raw.type;
          this.file = file;
        }
      },
      beforeAvatarUpload(file){
          var isPic=true
          if (file.type=='audio/mp3'||file.type=='video/mp4') {
            this.$message.error('只能上传图片');
            isPic=false
          }
          return isPic;
      },
      back() {
        this.$emit('backPic')
         this.fileList=[]
      },
      success() {
        let that = this;
        //this.$emit('closePic')
        this.message = this.$message({
          message:'上传中。。。',
          duration:0
        })
        //console.log(this.$refs.form);
        var formData = new FormData()
        formData.append('id',that.form.id)
        formData.append('title', that.form.title)
        formData.append('explain', that.form.explain)
        formData.append('mimeType', that.form.mimeType)
        if(this.file != null && this.file.raw){
          formData.append('file', this.file.raw)
        }
        this.$http.post(this.url, formData).then(res=>{
          if(that.message){
            that.message.close();
          }
          console.log(res);
          if(res.data.code == 1){
            that.$message('保存成功');
            that.$emit('success');
          }
          else{
            that.$message(res.data.msg)
          }
        });
      }      
    },
    watch:{
      info(){
        Object.assign(this.form, this.info)
        this.viewUrl = this.info.path
        this.mimeType = this.info.mimeType
        this.file = null
      }
    }
  }
</script>
<style lang="less" scoped>
  .input {
  
    display: inline-block;
  
    width: 300px;
  
  }
  
  
  
  .span {
  
    display: inline-block;
  
    width: 100px;
  
    text-align:right;
    margin-right: 20px;
  
    vertical-align: middle;
  
  }
  
  
  
  .p-teacher {
    width:950px;
    >div {
      margin: 20px 0;
      text-align: left
    }
  
    .pic {
      position: absolute;
      right: 10px;
      top: 10px;
      width: auto;
    }
  
    textarea {
  
      width: 400px;
  
      height: 200px;
  
      border-radius: 5px;
  
      vertical-align: middle;
  
    }
  
  }
  .img{
         width:250px;
         height:150px;
    }
</style>