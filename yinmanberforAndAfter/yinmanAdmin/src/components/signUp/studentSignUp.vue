<template>
    <div >
        <div class="p-hidden">
            <div style="margin-left:80px;">
                <el-select v-model="term" @change="selectTerm" placeholder="请选择学期">
                    <el-option v-for="term in baseData.terms" :key="term.id" :label="term.name" :value="term"></el-option>
                </el-select>
                <span style="width:400px">教师姓名
                    <el-select v-model="teacherId" @change="select" placeholder="请选择" >
                        <el-option v-for="item in baseData.teachers" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </span>
                </span class="headSpan">
                <span>
                    课程周期
                </span>
                <span class="headSpan">
                    {{ term.startDate | viewDate }} 至 {{ term.endDate | viewDate }}
                </span>
            </div>
            <div style=" text-align:center;">
                <table cellpadding=0 cellspacing=0 border=0 class="table">
                    <tr>
                        <td>
                            星期
                        </td>
                        <td>
                            课程
                        </td>
                        <td>等级</td>
                        <td>人数</td>
                        <td>时长(分钟)</td>
                        <td>
                            教室
                        </td>
                        <td>
                            开始时间
                        </td>
                        <td>
                            结束时间
                        </td>
                    </tr>
                    <tbody v-for="(day,idx) in data.details">
                        <tr>
                        <td>
                            {{ day.dayOfWeek }}
                        </td>
                        <td colspan="7">
                            
                        </td>
                        </tr>
                        <tr v-for="(item,index) in day.list">
                            <td></td>
                            <td style="width:189px;">
                                <el-checkbox v-model="item.checked" :disabled="!item.canSelected"></el-checkbox>
                                {{ item.courseName }}
                            </td>
                            <td>
                                {{ item.level }}
                            </td>
                            <td>
                                {{ item.number }}
                            </td>
                            <td>
                                {{ item.duration }}
                            </td>
                            <td>
                                {{ item.classroomName }}
                            </td>
                            <td>
                                <div >{{ item.startTime }}</div>
                            </td>
                            <td>
                                <div v-if="!canEdit">{{ item.endTime }}</div>                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
                <el-button @click="back">取 消</el-button>
                <el-button type="primary" @click="submit">提 交</el-button>
        </div>
    </div>
  
</template>
<script>
export default {
    props:{
        studentId : Number,
        termId : Number
    },
    name: 'student-sign-up',
    data() {
        return {
            baseData: {
                courses: [], teachers: [], classrooms: [], terms:[]
            },
            data:{},
            weekArray: [],
            canEdit:false,
            levels:['', 'A','B','C','D'],
            term:{},
            teacherId:"",
            //selectInfo:[]
        }
    },
    created() {
        this.$http.get('/api/courseTable/getBaseData').then((res) => {
            this.baseData = res.data;
            if(this.termId > 0){
                this.term = _.find(this.baseData.terms, { id: this.termId });
            }
        });
    },
    methods: {
        init() {
            this.loadInfo();
        },
        back(){
            this.$emit('cancel');
        },
        showOption(idx, index, obj) {
            this.idx = idx
            this.index = index
        },
        submit() {
            // if(this.selectInfo.length>0){
            //      post("/api/signUp/relationalInfo",{relationalInfo:this.selectInfo}).then((res)=>{
            //         this.$message(res.data);
            //     })
            // }else{
            //     this.$message("提交不能为空");
            // }
            var data = [];
            _.forEach(this.weekArray, function(item){
                _.forEach(item.list, function(ii){
                    data.push({ id: ii.id, checked: ii.checked });
                });
            });
            this.$http.post("/api/signUp/addOrUpdate", { data: data, studentId: this.studentId }).then((res)=>{
                if(res.data.code == 1){
                    this.$message('操作成功');
                    this.$emit('success');
                }
                else{
                    this.$message(res.data.msg);
                }
            });


        },
        select(key) {
           this.teacherId=key
           this.init()
        },
        selectTerm(){
           if(this.teacherId==""){
             return
           }
           this.init()
        },
        // isChecked(idx,index){
        //       var inde=-1
        //       for(var i=0;i<this.selectInfo.length;i++){
        //            if(this.selectInfo[i].idx==idx&&this.selectInfo[i].index==index){
        //                    inde=i
        //                  this.selectInfo.splice(i,1)  
        //            }
        //       } 
        //       if(inde==-1){
        //         this.selectInfo.push({
        //              courseTableDetailId:this.weekArray[idx].list[index].id ,
        //              studentId:this.studentId,
        //              idx:idx,
        //              index:index
        //             })
        //       }
        // },
        loadInfo() {
            if(!this.term.id || this.teacherId == '') return;
            this.$http.get('/api/courseTable/getByTeacherId', { params:{
                    teacherId:this.teacherId,
                    studentId: this.studentId,
                    termId: this.term.id}}).then((res) => {
                this.data = res.data;
                this.weekArray=res.data.details
            });
        }
    },
    watch: {
        termId:function(){

        }
    }
}
</script>
<style  lang="less" scoped>
.dialog-footer{
    margin-top: 10px;
}
.number {
    width: 100px;
}

.table {
    border-collapse: collapse;
    // width: 1100px;
    margin-top: 10px;
}

.table>tr>td, .table>tbody>tr>td {
    border: 1px solid #bfcbd9;
    padding: 0;
    margin: 0;
    font-size: 13px;
    width: 160px;
    height: 36px;
    line-height: 36px;
    text-align: center;
}

.table tr>td div {
    height: 36px;
    line-height: 36px;
}

.button {
    text-align: left;
    margin: 50px 0 0 40%;
}

.input {
    width: 300px;
}

.p-hidden {
    // height: 450px;
    overflow: auto;
}

.headSpan {
    display: inline-block;
    width: 200px;
    height: 36px;
    line-height: 36px;
}
</style>