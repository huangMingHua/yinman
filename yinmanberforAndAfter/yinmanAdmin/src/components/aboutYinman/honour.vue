<template>
         <div class="p-teacher">
          <div>
            <span class="warn" style="left:70px;">*</span>
            <span class="span">姓名</span>
              <el-input class="input" v-model="form.name" placeholder="请输入姓名"></el-input>
          </div>
          <div>
            <span class="warn" style="left:40px;">*</span>
            <span class="span">获奖内容</span>
            <textarea v-model="form.introduce"></textarea>
          </div>
          <div class="pic">
              <div style="width:100px;display:inline-block;text-align:center">
                <span style="display:block;">封面</span>
              </div>  
              <el-upload
                class="avatar-uploader" ref="form"
                :auto-upload="false" 
                :action="url"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-change="handlePreview"
                :data="form">
                <img v-if="imageUrl" :src="imageUrl" class="avatar img">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="back" class="back">取 消</el-button>
              <el-button type="primary" @click="success">提 交</el-button>
            </div>
         </div> 
</template>
<script>
  export default {
    props: ['info'],
    data(){
      return{
          url:"/api/honorRoll/saveOrUpdateCompetitionInfo",
          imageUrl:'',
          mimeType: '',
          file:null,
          form:{
            id:0,
            name:'',
            introduce:''
          },
          message:null
      }
    },
    created(){
      Object.assign(this.form, this.info)
      this.imageUrl = this.info.path
    },
    methods:{
       handlePreview(file){
         if(file.raw.type.split('/')[0]=='audio'||file.raw.type.split('/')[0]=='video'){
              this.$message.error('只能上传图片');    
          }else{
              this.imageUrl = file.url;
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
        }
        ,
        back(){
           this.$emit('back')
        },
        success(){
          let that = this;
          console.log(this.file)
          this.message = this.$message({
            message:'上传中。。。',
            duration:0
          })
          //this.$refs.form.submit();
          
          var data = new FormData()
          data.append('id',this.form.id)
          data.append('name', this.form.name)
          data.append('introduce', this.form.introduce)
          if(this.file != null && this.file.raw){
            data.append('file', this.file.raw)
          }
          this.$http.post(this.url, data).then(res=>{
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
        console.log('change info',this.info)
        Object.assign(this.form, this.info)
        this.imageUrl = this.info.path
        this.file = null
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