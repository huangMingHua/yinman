<template>
    <div>
        <div class="row"> 
            <span>姓名：</span>
            <strong class="value">{{courseTableDetail.teacher.name}}</strong>
        </div>
        <div class="row"> 
            <span>课程：</span>
            <strong class="value">{{courseTableDetail.course.name}}</strong>
        </div>
        <div class="row"> 
            <span>类型：</span>
            <strong class="value">学期课</strong>
        </div>
        <div class="row"> 
            <span>等级：</span>
            <strong class="value">{{levels[courseTableDetail.level-1].name}}</strong>
        </div>
        <div class="row"> 
            <span>课程结束日期：</span>
            <el-select v-model="courseTableItemId" class="value">
                <el-option
                    v-for="item in courseTableItems" 
                    :key='item.id'
                    :label='item.date+" "+item.startTime+"~"+item.endTime'
                    :value='item.id'
                >
                </el-option>
            </el-select>
        </div>
        <div class="row"> 
            <span>课程结束原因：</span>
            <el-input
                class="value"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="reason"
            >
            </el-input>
        </div>
        <div class="row"> 
            <span>停课日期前课时数：</span>
            <strong>{{classNum}}</strong>
        </div>
        <div  class="careful">
           <img src="../../assets/images/prompt.png"/> <span>注：停课日期（含）之后的调课、请假、补课会删除</span>
        </div>
        <div class="btns">
           <el-button @click="cancel">取消</el-button><el-button type="primary" @click="submit">确定</el-button>
        </div>
    </div>
</template>
<script>
    export default{
        props: ["courseTableDetailStudentId"],
        data () {
            return {
                courseTableItems: [],
                reason: '',
                courseTableDetail: {},
                courseTableItemId: "",
                 levels: [
              {
                id: 1,
              name: '无等级'
              },
              {
                id: 2,
              name: 'A'
              },
              {
                id: 3,
              name: 'B'
              },
              {
                id: 4,
              name: 'C'
              },
              {
                id: 5,
              name: 'D'
              },
            ]
            }
        },
        mounted () {
            this.init()
        },
        computed:{
            classNum(){
                let index=0
                for(let [i,item] of this.courseTableItems.entries()){
                   if(item.id === this.courseTableItemId){
                      index = i;
                   }
                }
                if (index !== 0) {
                  index++
                }
                return index
            }
        },
        methods :{
            init () {
                this.courseTableItems = [];
                this.reason = '';
                this.courseTableDetail = {};
                this.courseTableItemId = ""
                this.$http.get("/api/courseTable/getBeforeSuspendClassInfoByCourseTableDetailStudentId",{params:{courseTableDetailStudentId:this.courseTableDetailStudentId}}).then((response)=>{
                    let res = response.data;
                    if (res.code) {
                        let {courseTableDetail,filterCourseTableItems} = res.data;
                        this.courseTableDetail = courseTableDetail;
                        this.courseTableItems = filterCourseTableItems;
                    } else {
                        this.$message(res.msg)
                    }
                })
            },
            cancel () {
               this.$emit('surpenClassCancel')
            },
            submit () {
                if (!this.courseTableItemId&&!this.classNum) {
                   return this.$message('请选择课程结束日期');
                }
                if (!this.reason) {
                   return this.$message('请输入课程结束原因');
                }
                this.$http.post('/api/courseTable/suspendClasses',{courseTableDetailStudentId:this.courseTableDetailStudentId,reason: this.reason,courseTableItemId:this.courseTableItemId}).then((response)=>{
                    let res = response.data
                    if (res.code) {
                        this.cancel()
                    } else {
                      this.$message(res.msg) 
                    }
                })
            },
        },
        watch:{
            courseTableDetailStudentId(newDate,oldDate){
                if (newDate){
                   this.init()
                }
            }
        }
    }
</script>
<style  lang="less" scoped>
    .row{
        padding-top: 10px;
        span {
            display: inline-block;
            width: 170px;
            height: 50px;
            text-align: right;
            vertical-align:top;    
        }
    }
    
    .value{
        width: 300px;
        vertical-align: middle;
    }
    .careful{
        display:flex;
        align-items:center;
        width: 480px;
        margin: 0 auto;
        height: 50px;
        color: red;
        border-top: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        img{
           width: 20px;
           height: 20px;
           margin-right: 10px;
        }
    }
    .btns {
        padding-top: 20px;
        display:flex;
        justify-content:center;
    }
</style>