<template>
    <div >
        <div class="p-hidden">
            <div>
                <span style="width:400px">教师姓名
                    <el-select v-model="courseTable.teacherId" @change="select" placeholder="请选择" :disabled="!canEdit">
                        <el-option v-for="item in baseData.teachers" :key="item._id" :label="item.teacherName" :value="item._id">
                        </el-option>
                    </el-select>
                </span>
                </span class="headSpan">
                <span>
                    课程周期
                </span>
                <span class="headSpan">
                    {{ courseTable.startDate | viewDate }} 至 {{ courseTable.endDate | viewDate }}
                </span>
                <span>学生数量: {{ courseTable.number }} </span>
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
                        <td>
                            教室
                        </td>
                        <td>
                            开始时间
                        </td>
                        <td>
                            结束时间
                        </td>
                        <td>
                            已报名学生
                        </td>
                        <td>
                            添加
                        </td>
    
                    </tr>
                    <tbody v-for="(day,idx) in weekDays">
                        <tr>
                            <td>
                                {{ day }}
                            </td>
                            <td colspan="5">
                                
                            </td>
                            <td>
                                <el-button size="mini" @click="add(idx)">添加</el-button>
                            </td>
                        </tr>
                        <tr v-for="(item,index) in getList(day)">
                            <td></td>
                            <td>
                                {{ item.course.name + item.course.type + item.course.time }}分钟
                            </td>
                            <td>
                                {{ item.classroomName }}
                                
                            </td>
                            <td>
                                {{ item.startTime | viewTime }}
                            </td>
                            <td>
                                {{ item.endTime | viewTime }}
                            </td>
                            <td>
                                <div>
                                    <div v-for="(sss, i) in item.students">
                                        {{ sss.name }}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <a href="javascript:;">调课</a>
                            </td>
                        </tr>
                    </tbody>
                </table>                
            </div>
        </div>
        <div class="button" v-if="canEdit">
            <el-button @click="sumbit()" type="primary" class="el-button--primary">提交</el-button>
            <el-button @click="btnBack()">返回</el-button>
        </div>
    </div>
</template>
<script>
import post from '../../post'
import get from '../../get';
import moment from 'moment';
import momentlocale from 'moment/locale/zh-cn';
import lodash from 'lodash';

export default {
    name: 'course-sign-up',
    props: ['id'],
    data() {
        return {
            baseData: {
                courses: [], teachers: [], classrooms: [],
            },
            courseTable: {
                _id: '',
                teacherId: null,
                number: 0,
                startDate: null,
                endDate: null
            },
            currentStartDate:null,
            currentEndDate:null,
            weekNum: "",
            weekArray: [],
            canEdit: true,
            weekDays:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
            isShow:false,
            newItem:{
                courseTableId: this.id,
                date:null,
                courseId:'',
                classroomId:'',
                startTime: new Date(),
                endTime: new Date()
            }
        }
    },
    computed: {
    canPrevWeek:function(){
      return this.courseTable._id != null && this.courseTable.startDate &&
        this.currentStartDate.format('YYYY-MM-DD') != moment(this.courseTable.startDate).format('YYYY-MM-DD');
    },
    weekLabel: function(){
      if(this.courseTable._id != null && this.courseTable.startDate){
        return this.currentStartDate.diff(this.courseTable.startDate, 'week')+1;
      }
      return 1;
    }
  },
    created() {
        moment.locale('zh-cn', {
            week: {
                dow: 1, // Monday is the first day of the week.
            }
        });
        //this.weekDays = moment.weekdays();
        get('/api/courseTable/getBaseData').then((res) => {
                this.baseData = res.data;
                //console.log(this.teacherArray);
            });
        this.currentStartDate = moment().day(1);
        this.currentEndDate = moment(this.currentStartDate).day(7);



        this.init();
    },
    methods: {
        init() {
            //this.currentStartDate = moment().day(1);
            if (this.id != '') {
                this.loadInfo();
            }
            else {
                this.weekArray = [];
                this.canEdit = true;
                this.courseTable = {
                    _id: this.id,
                    teacherId: null,
                    number: 0,
                    startDate: moment(),
                    endDate: moment(),
                };
                for (var index = 1; index <= 7; index++) {
                    this.weekArray.push({
                        dayOfWeek: moment.weekdays()[index % 7],
                        list: []
                    });
                }
            }
        },
        getList(dayOfWeek){
            var list1 = _.find(this.weekArray, { 'dayOfWeek': dayOfWeek });
            if(!list1){
                return [];
            }
            var list = _.pick(list1,'list');
            return list.list;
        },
        btnBack() {
            this.$emit('cancel');
        },
        showOption(idx, index, obj) {
            this.idx = idx
            this.index = index
        },
        add(index) {
            // var obj = {
            //     dayOfWeek: day,
            //     courseId: '',
            //     classroomId: '',
            //     startTime: null,
            //     endTime: null
            // };
            // _.find(this.weekArray, { dayOfWeek: day }).list.push(obj);
            this.newItem.date = moment(this.currentStartDate).add(index, 'days');
            this.isShow = true;
        },
        saveAdd(){
            post('/api/courseTable/addItem', this.newItem).then((res) => {
                var data = res.data;
                if(data.result){
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.isShow = false;
                    this.loadInfo();
                }
            });
        },
        sumbit() {
            console.log(this.weekArray, this.courseTable);
            //return;
            var list = [];
            this.weekArray.forEach(function (i) {
                list = _(list).concat(i.list).value();
            });
            if (this.courseTable._id != null) {
                post('/api/courseTable/update', { weeks: list, courseTable: this.courseTable }).then((res) => {
                    var data = res.data;
                    if (data.result) {
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                        this.courseTable._id = data.data;
                        this.loadInfo();
                    }
                    else {
                        //alert(data.msg);
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                    }
                });
            }
            else {
                post('/api/courseTable/add', { weeks: list, courseTable: this.courseTable, weekNum: this.weekNum }).then((res) => {
                    var data = res.data;
                    if (data.result) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.isShow = false;
                        //this.courseTable._id = data.data;
                        this.init();
                    }
                    else {
                        //alert(data.msg);
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                    }
                });
            }
        },
        copy() {
            if (this.weekNum < 1) {
                alert('请输入至少一周');
                return;
            }
            var list = [];
            this.weekArray.forEach(function (i) {
                list = _(list).concat(i.list).value();
            });
            post('/api/courseTable/copy', { weeks: list, courseTable: this.courseTable, weekNum: this.weekNum }).then((res) => {
                if (res.data.result) {
                    alert('操作成功');
                    this.loadInfo();
                }
                else {
                    alert(res.data.msg);
                }
            });
        },
        currentWeek() {
            this.currentStartDate = moment().day(1);
        },
        nextWeek() {
            this.currentStartDate = moment(this.currentStartDate).day(8);
            console.log('nextWeek');
        },
        prevWeek() {
            this.currentStartDate = moment(this.currentStartDate).add(-7, 'days').day(1);
        },
        select(key, keypath) {
            //this.courseTable.teachrId = key;
            // for (var i = 0; i < this.baseData.teachers.length; i++) {
            //   var teacher = this.teacherArray[i];
            //   if (teacher.wxId == key) {
            //     this.teacherValue =teacher.teacherName
            //   }
            // }
        },
        loadInfo() {
            get('/api/courseTable/getWeekItems?id=' + this.id + '&startDate=' + this.currentStartDate.format('YYYY-MM-DD')).then((res) => {
                this.courseTable = res.data.courseTable;
                this.weekArray = res.data.data;
                console.log(this.weekArray);
            });
        },
        
    },
    watch: {
        id(newVal, oldVal){
            console.log('change');
            this.init();
        },
        currentStartDate(newVal, oldVal) {
            console.log('change', this.courseTable.id);
            this.currentEndDate = moment(this.currentStartDate).day(7);
            this.weekArray = [];
            if (this.courseTable.id && this.courseTable.id != null) {
                this.loadInfo();
                // get('/api/courseTable/getWeekItems?id=' + this.courseTable._id + '&startDate=' + this.currentStartDate.format('YYYY-MM-DD')).then((res) => {
                //     var data = res.data.data;
                //     for (var i = 0; i < 7; i++) {
                //         var date = moment(this.currentStartDate).add(i, 'days');
                //         var list = _.filter(data, function (m) {
                //             //console.log(m.date, moment(m.date).format('YYYY-MM-DD'));
                //             return date.isSame(m.date, 'year') && date.isSame(m.date, 'month') && date.isSame(m.date, 'day');
                //         });

                //         this.weekArray.push({
                //             date: date,
                //             label: date.format('dddd'),
                //             list: list
                //         });
                //     }
                //     console.log(this.weekArray);
                // });
            }
            else {

            }
        }
    }
    
}
</script>
<style  lang="less" scoped>
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