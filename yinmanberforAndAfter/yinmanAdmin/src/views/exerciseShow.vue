<template>
    <p-layout>
    
        <div class="p-search" :page="page">
    
            <div class="p-search-wrap">
    
                <div class="p-search-head">
    
                    <!--<el-input class="query-input" v-model="query" placeholder="查询：请输入标题"></el-input>-->
    
                    <div class="btns">
    
                        <el-button @click="add" type="primary" style="margin-left:15px;">+添加</el-button>
    
                    </div>
    
                </div>
    
                <div class="p-search-table">
                    <table style="float:left;">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>标题</th>
                                <th>学生姓名</th>
                                <th>上传时间</th>
                                <th>更新时间</th>
                                <th style="width:160px">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in video" :key="item.id">
                                <td>{{ item.id }}</td>
                                <td>{{item.title}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.createTime}}</td>
                                <td>{{item.updateTime}}</td>
                                <td>
                                    <span class="spans" @click="modify(item)">编辑</span>
                                    <span @click="deleteInfo(item)" class="spans">删除</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <el-pagination class="pagination" @current-change="currentChange" layout="prev, pager, next" :total="page*10">
                    </el-pagination>
                </div>
    
            </div>
    
        </div>

        <transition name="fade">
            <transition name="fade">
                <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                    <exercise-video :info="editInfo" @success="success" @back="back" v-if="dialogFormVisible"></exercise-video>
                </el-dialog>
            </transition>
        </transition>
    </p-layout>
</template>
<script>
import exerciseVideo from '../components/exhibitionCenter/exerciseVideo'

export default {
    name: "introduce",
    data() {
        return {
            query: '',
            page: 1,
            CPage: 1,
            limit: 10,
            isShow: false,
            dialogFormVisible: false,
            editInfo: {
                id:0,
                title: "",
                name: "",
            },

            video: [],
            title: ""
        }
    },
    created() {
        this.init()
    },

    methods: {
        init() {
            this.$http.get(`/api/exerciseVideo/getList?pageIndex=${this.CPage}&limit=${this.limit}`).then((res) => {
                this.video = res.data.list
                this.page = res.data.pages
            })
        },
        modify(item) {
            this.editInfo = Object.assign({}, item)
            this.dialogFormVisible = true
            this.title = "编辑练习秀"
        },
        add() {
            this.editInfo = {
                id:0,
                title: "",
                name: "",
                path:''
            }
            console.log('add')
            this.dialogFormVisible = true
            this.title = "添加练习秀"

        },

        success(form, img, url) {
            this.dialogFormVisible = false
            this.init();
        },
        deleteInfo(item) {
            console.log(item)
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/api/exerciseVideo/delete', { id: item.id }).then((response) => {
                    console.log(response)
                    if (response.data.code == 1) {
                        this.init()
                        this.$message({
                            type: 'success',
                            message: response.data.msg
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.msg
                        });
                    }

                })

            }).catch(() => {
            });
        },
        currentChange(val) {
            this.CPage = val
            this.init()
        },
        back() {
            this.dialogFormVisible = false
        }
    },
    watch: {
    },
    components: {

        exerciseVideo

    }

}
</script>
<style lang="less" scoped>
.fade-enter-active,

.fade-leave-active {

    transition: opacity .5s
}



.fade-enter,

.fade-leave-active {

    opacity: 0
}



.p-search {


    background-color: #f5f5f5;

    .p-search-wrap {

        background-color: white;
    }

    .btns {

        margin-top: 20px;
    }

    .p-search-head {

        text-align: left;

        margin-bottom: 22px;
    }

    .query-input {

        width: 192px;

        height: 28px;
    }

    .query-btn {

        margin-left: 10px;
    }

    .p-search-table:after {

        content: "";

        display: block;

        clear: both;
    }

    .p-search-table {

        zoom: 1;

        border: 1px solid #dfe6ec;

        table {

            border-collapse: collapse;
        }

        th {

            background-color: #eef1f6;
        }

        th,

        td {

            border-right: 1px solid #dfe6ec;

            border-bottom: 1px solid #dfe6ec;

            padding: 0 20px;

            height: 40px;

            font-size: 14px;
        }

        .spans {

            float: left;

            cursor: pointer;

            color: #20a0ff;

            width: 80px;

            text-align: center;

            height: 100%;

            line-height: 40px;
        }
    }
}



.show {

    position: absolute;

    left: 0;

    top: 0;

    background-color: rgba(0, 0, 0, 0.5);

    width: 100%;

    height: 100%;

    z-index: 100;
}



.curriculumShow {

    position: absolute;

    left: 0;

    top: 0;

    background-color: rgba(0, 0, 0, 0.5);

    width: 100%;

    height: 100%;

    z-index: 1000;
}
</style>
