<template>
    <div id="usercenter" class='my_wap'>
        <!--<p class="position"><i class="el-icon-location-outline"></i>您现在的位置：用户中心</p>-->
        <div class="formBox">
            <div class="headpic">
                <img src="static/img/img.jpg" alt="">
                <div class="textinfo">
                    <p class='p1'>{{formLabel.name}}</p>
                    <p class='p2'>{{formLabel.username}}</p>
                </div>
            </div>
            <div class="p3"><p><span>类型: </span><span>{{formLabel.group}}</span></p></div>
            <div class="p3"><p><span>姓名: </span><span>{{formLabel.name}}</span></p></div>
            <div class="p3"><p><span>用户名:</span> <span>{{formLabel.username}}</span></p></div>
            <div class="p3"><p><span>密码: </span><span>{{formLabel.password}}</span></p><i @click='showBox'>修改</i>
            </div>
        </div>
        <el-dialog title="修改密码" :visible.sync="show" class="reviseInfo" width='550px'>
            <div class="info" v-loading='loading'>
                <el-form status-icon label-position="left" label-width="90px" :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm">
                    <el-form-item label="姓名">
                        <el-input v-model="formLabel.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input v-model="formLabel.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass"></el-input>
                    </el-form-item>
                </el-form>
                <!--<el-button type="primary" @click.stop="revisePassword">提交</el-button>-->
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="show = false">取 消</el-button>
                <el-button type="primary" @click="revisePassword('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'usercenter',
        data: function () {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                token: sessionStorage.getItem('token'),
                uid: sessionStorage.getItem('uid'),
                formLabel: {},
                ruleForm: {
                    pass:"",
                    checkPass:""
                },
                rules: {
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                },
                show: false,
                loading: false,
            }
        },
        mounted: function () {
            let vm = this;
            vm.$axios({
                method: 'post',
                url: window.$g_Api + '/oa/manage/get_userinfo',
                data: {
                    token: vm.token,
                    uid: vm.uid,
                }
            })
                .then(function (res) {
                    vm.formLabel = res.data.data
                })
                .catch(function (err) {
                });
        },
        methods: {
            //弹出修改密码框
            showBox: function () {
                this.show = true;
            },
            //修改密码
            revisePassword: function (formName) {
                let vm = this;
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.loading = true;
                        vm.$axios({
                            method: 'post',
                            url: window.$g_Api + '/oa/manage/change_password',
                            data: {
                                token: vm.token,
                                uid: vm.uid,
                                password: vm.ruleForm.checkPass
                            }
                        })
                            .then(function (res) {
                                vm.loading = false;
                                vm.$message.success(res.data.message);
                                setTimeout(function () {
                                    vm.show = false;
                                },1000)
                            })
                            .catch(function (err) {
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style lang="scss" type="text/scss">
    #usercenter {
        .formBox {
            width: 100%;
            .headpic {
                display: flex;
                justify-content: flex-start;
                width: 100%;
                padding: 20px 0;
                border-bottom: 1px solid #cccccc;
                background-color: rgba(204, 204, 204, 0.1);
                img {
                    display: block;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    box-shadow: 3px 3px 3px #888888;

                }
                .textinfo {
                    margin-left: 15px;
                    .p1 {
                        font-size: 20px;
                        margin-top: 16px;
                        color: #666666;

                    }
                    .p2 {
                        font-size: 16px;
                        color: #999999;
                        margin-top: 4px;
                    }
                }
            }
            .p3 {
                width: 600px;
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                padding-bottom: 6px;
                border-bottom: 1px solid rgba(204, 204, 204, 0.2);
                p {
                    display: flex;
                    justify-content: flex-start;
                    color: #4f4f4f;
                    span {
                        &:nth-child(1) {
                            display: block;
                            width: 120px;
                        }
                    }
                }
                i {
                    color: #ffa042;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
        .reviseInfo {
            border-radius: 20px;
            .el-dialog {
                border-radius:10px !important;
            }
            .info {
                background-color: #ffffff;
                padding: 0px 80px;
                /*border-radius: 20px;*/
                /*margin: 30px auto 0 auto;*/
            }
        }
    }
</style>

