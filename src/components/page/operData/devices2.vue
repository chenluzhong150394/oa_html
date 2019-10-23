<template>
    <div id="devices2" class='my_wap'>
        <p class="position"><i class="el-icon-location-outline"></i>您现在的位置：数据统计 > 设备管理</p>
        <div class="dev_head_box">
            <div class="dev_head">
                <div class="head1">
                    <div><span>设备</span><p><input type="text" v-model="dataInfo.device"></p></div>
                    <div><span>账号</span><p><input type="text" v-model="dataInfo.account"></p></div>
                    <div><span>号码卡</span><p><input type="text" v-model="dataInfo.online_number"></p></div>
                    <div><span>上网卡</span><p><input type="text" v-model="dataInfo.phone_number"></p></div>
                    <div><span>设备id</span><p><input type="text" v-model="dataInfo.phone_number" class='dis' disabled></p></div>
                </div>
                <div class="head2">
                    <div><span>QQ号</span><p><input type="text" v-model="dataInfo.qq_id"></p></div>
                    <div><span>微信号</span><p><input type="text" v-model="dataInfo.wechat_id"></p></div>
                    <div><span>PID列表</span><p><input type="text" v-model="dataInfo.pid_list"></p></div>
                    <div><span>备注</span><p><input type="text" v-model="dataInfo.remark"></p></div>
                    <div><span>序号</span><p><input type="text" v-model="dataInfo.sequence" class='dis' disabled></p></div>
                </div>
                <div class="head2">
                    <el-select v-model="dataInfo.is_promoting" placeholder="推广状态">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="head-r">
                <template>
                    <el-radio-group v-model="radio" @change='radiochange' style='margin-top: 8px;'>
                        <el-radio :label="1">新增</el-radio>
                        <el-radio :label="2">修改</el-radio>
                    </el-radio-group>
                </template>
                <el-button type="primary" plain @click='setnewData()' style='height: 32px;margin-left: 20px;'>提交</el-button>
            </div>
        </div>
        <template>
            <el-table
                :data="deviceList"
                height="80%"
                v-loading='loading'
                border
                fit
                highlight-current-row
                @current-change="handleCurrentChange"
                style="width: 100%;white-space: nowrap">
                <el-table-column
                    prop="sequence"
                    width='50'
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="belong_to_whom"
                    label="分组">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope='scope'>
                        <span style='color: #E6A23C;' v-if='scope.row.is_promoting == "完成推广"'>{{scope.row.is_promoting}}</span>
                        <span v-else>{{scope.row.is_promoting}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="device"
                    label="设备">
                </el-table-column>
                <el-table-column
                    prop="wechat_id"
                    label="微信号">
                </el-table-column>
                <el-table-column
                    prop="qq_id"
                    label="QQ号">
                </el-table-column>
                <el-table-column
                    prop="online_number"
                    label="号码卡">
                </el-table-column>
                <el-table-column
                    prop="phone_number"
                    label="上网卡">
                </el-table-column>
                <el-table-column
                    prop="account"
                    label="账号">
                </el-table-column>
                <el-table-column
                label="在线情况">
                <template slot-scope="scope">
                <span :class='{"te":scope.row.status == "掉线"}'>{{scope.row.status}}</span>
                </template>
                </el-table-column>
                <el-table-column
                    label="授权截止时间"
                    width='136'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.sesstion_update_time'>{{scope.row.sesstion_update_time}}</span>
                        <el-button type="primary" size="mini" plain v-else>点击授权</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pid_list"
                    label="PID列表">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注">
                </el-table-column>

            </el-table>
        </template>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'devices2',
        data: function () {
            return {
                token: sessionStorage.getItem('token'),
                uid: sessionStorage.getItem('uid'),
                deviceList: [],
                loading: false,
                dataInfo: {
                    sequence: '',
                    is_promoting:'',
                },
                revise: true,
                radio: 1,
                options: [{
                    value: '完成推广',
                    label: '完成推广'
                }, {
                    value: '正在推广中',
                    label: '正在推广中'
                }],
                edit_id:'',
            }
        },
        mounted: function () {
            let vm = this;
            vm.loading = true;
            vm.$axios({
                method: 'post',
                url: window.$g_Api + '/oa/devices1',
                data: {
                    token: vm.token,
                    uid: vm.uid,
                }
            })
                .then(function (res) {
                    vm.loading = false;
                    if (res.data.code == 0) {
                        vm.deviceList = res.data.data;
                        vm.dataInfo.sequence = vm.deviceList.length + 1;
                    } else {
                        console.error(res.data.message);
                    }
                })
                .catch(function (err) {
                });
        },
        methods: {
            getData: function () {
                let vm = this;
                vm.loading = true;
                vm.$axios({
                    method: 'post',
                    url: window.$g_Api + '/oa/devices1',
                    data: {
                        token: vm.token,
                        uid: vm.uid,
                    }
                })
                    .then(function (res) {
                        vm.loading = false;
                        if (res.data.code == 0) {
                            vm.deviceList = res.data.data;
                            vm.dataInfo.sequence = vm.deviceList.length + 1;
                        } else {
                            console.error(res.data.message);
                        }
                    })
                    .catch(function (err) {
                    });
            },
            handleCurrentChange(val) {
                this.dataInfo = val;
                this.radio = 2;
            },
            radiochange(val) {
                if (val == 1) {
                    this.dataInfo = {sequence: this.deviceList.length + 1}
                } else {
                    this.dataInfo.sequence = ''
                }
            },
            setnewData: function () {
                let vm = this;
                if (!vm.dataInfo.device || !vm.dataInfo.account) {
                    vm.$message.warning('设备和账号为必填项');
                    return false;
                } else {
                    let data = vm.dataInfo;
                    data.token = vm.token;
                    data.uid = vm.uid;
                    data.edit_id = vm.edit_id;
                    let devapi, mag;
                    if (vm.radio == 1) {
                        devapi = '/oa/devices2_add';
                        mag = '新增'
                    } else if (vm.radio == 2) {
                        devapi = '/oa/devices2';
                        mag = '修改'
                    }
                    vm.$axios({
                        method: 'post',
                        url: window.$g_Api + devapi,
                        data: data
                    })
                        .then(function (res) {
                            if (res.data.code == 0) {
                                vm.$message.success(mag + '成功!');
                            } else {
                                vm.$message.error(mag + '失败!' + res.data.message);
                            }
                            vm.getData();
                        })
                        .catch(function (err) {
                            console.error(err);
                            vm.getData();
                        });
                }
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    #devices2 {
        .te {
            color: red;
        }
        .dev2_tag {
            &:hover {
                cursor: pointer;
            }
        }
        .dev_head_box {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            .dev_head {
                .head1, .head2 {
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 8px;
                    div {
                        display: block;
                        height: 28px;
                        width: 212px;
                        display: flex;
                        justify-content: flex-start;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                        color: #606266;
                        line-height: 28px;
                        font-size: 12px;
                        margin-right: 10px;
                        white-space: nowrap;
                        span {
                            display: block;
                            color: #909399;
                            background-color: #f5f7fa;
                            padding: 0 10px;
                            border-radius: 4px;
                            border-top-right-radius: 0;
                            border-bottom-right-radius: 0;
                            border: 1px solid #dcdfe6;
                        }
                        p {
                            flex: 1;
                            input {
                                width: 100%;
                                height: 28px;
                                line-height: 28px;
                                border: 1px solid #dcdfe6;
                                border-radius: 4px;
                                border-top-left-radius: 0;
                                border-bottom-left-radius: 0;
                                padding: 0 15px;
                                color: #606266;
                                border-left: none;
                            }
                            .dis{
                                background-color: #f5f7fa;
                                color: #c0c4cc;
                                &:hover{
                                    cursor: not-allowed;
                                }
                            }
                        }

                    }
                }
            }
            .head-r {
                display: flex;
                justify-content: flex-start;
                height: 32px;
                margin-top: 20px;
                line-height: 32px;
                margin-left: 20px;
                /*float: right;*/
                /*margin-top: 15px;*/
            }
        }

    }
</style>

