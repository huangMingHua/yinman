<template>
  <div>
        <div class="add"><el-button type="primary" @click="add">+添加课程</el-button></div> 
        <div class="p-wrap-table" style="height:130px;overflow:auto">
            <table>
                <thead>
                    <th>课程周期</th>
                    <th>创建时间</th>
                    <th>报名信息</td>
                    <th>操作</th>
                </thead>
                <tbody>
                    <tr v-for="term in terms">
                        <td>
                            {{ term.name }}
                        </td>
                        <td>
                            {{ term.startDate | viewDate }} 至 {{ term.endDate | viewDate }}
                        </td>
                        <td>
                            查看报名信息
                        </td>    
                        <td>
                            <el-button @click="view(term.id)" type="text" size="small">修改课程</el-button>
                            <router-link class="el-button el-button--text el-button--small" 
                                :to="{ path: '/courseTable/viewItems', query: { termId: term.id, studentId: studentId }}">查看周历</router-link>
                            <!--<el-button type="text" size="small" @click="del(term.id)">删除</el-button>-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <el-dialog title="报名课程" size="large" :visible.sync="showStudentSignUp" v-if="showStudentSignUp" :modal="false">
            <student-sign-up :studentId="studentId" :termId="termId" @success="loadData()" @cancel="btnBack"></student-sign-up>
        </el-dialog>
  </div>    
</template>
<script>
import studentSignUp from '../components/signUp/studentSignUp';
export default {
        data(){
            return{
                    studentId: parseInt(this.$route.query.studentId || 0),
                    terms: [],
                    showStudentSignUp:false,
                    termId: 0,
            }
        },
        created(){
                this.loadData();
            },
        methods:{
            loadData() {
                this.showStudentSignUp=false;
                this.$http.get("/api/student/getSignUpTerms?studentId=" + this.studentId).then((res) => {
                    this.terms = res.data
                });
            },
            add() {
                this.showStudentSignUp=true;
            },
            btnBack() {
                //this.$emit('btnBack')
                this.showStudentSignUp=false;
            },
            view(termId) {
                this.termId = termId;
                this.showStudentSignUp = true;
            },
        },
        components:{
            studentSignUp
        }
}
</script>
<style lang="less" scoped>
    .add{
          text-align: left;
          padding: 20px 60px;
      } 
    .p-wrap-table {
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background-color: #eef1f6;
        }
        th,
        td {
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
            width: 120px;
            height: 40px;
            font-size: 14px;
            text-align: center;
            img {
                width: 40px;
                height: 40px;
            }
        }
        }
</style>


