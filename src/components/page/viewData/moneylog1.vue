<template>
    <div id="moneylog" class='my_wap'>
        <p class="position"><i class="el-icon-location-outline"></i>您现在的位置：数据统计 > 转账记录</p>
        <div class="da_header">
            <div class="header_l">
                <p>查询时间：</p>
                <el-date-picker
                    v-model="queryTime"
                    type="daterange"
                    align="left"
                    unlink-panels
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>

                    <!--<el-select v-model="status_type" placeholder="请选择提现成功状态" style='width: 150px;margin-left: 8px;'>-->
                        <!--<el-option-->
                            <!--v-for="item in options"-->
                            <!--:key="item.status_type"-->
                            <!--:label="item.status_name"-->
                            <!--:value="item.status_type">-->
                        <!--</el-option>-->
                    <!--</el-select>-->

                <el-button type="primary" style='margin: 0px 20px;' @click='getData'>点击搜索</el-button>

                <template>
                    <el-radio-group v-model="radio" style='margin-top: 10px !important;'>
                        <el-radio :label="'payment_all'">全部</el-radio>
                        <el-radio :label="'payment_fail'">失败记录</el-radio>
                        <el-radio :label="'payment_need_pay'">待补交</el-radio>
                    </el-radio-group>
                </template>
            </div>
            <el-button type="warning" @click='export2Excel'>导出excel表格</el-button>
        </div>
        <div class="logBox">
            <table class='logtable' v-if='result_view' v-loading='loading'>
                <thead>
                <tr>
                    <th>金额</th>
                    <th>账号</th>
                    <th>交易转态</th>
                    <th>姓名</th>
                    <th>转账时间</th>
                    <th>设备信息</th>
                    <th>交易编号</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='(data,index) in result_view' :key='index' :class='{"error":data.status=="转账成功"?false:true , "first_pay_status":data.first_pay_status == 1?false:true}'>
                    <td>{{data.amount}}</td>
                    <td>{{data.account}}</td>
                    <td>{{data.status}}</td>
                    <td>{{data.name}}</td>
                    <td>{{data.pay_date}}</td>
                    <td>{{data.remark}}</td>
                    <td>{{data.out_biz_no}}</td>
                </tr>
                </tbody>
            </table>
            <p v-else style='width: 100%;text-align: center;'>暂无数据</p>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name:'moneylog',
        data: function () {
            return {
                queryTime:new Array(),
                result:null,
                result_view:null,
                loading:false,
                token:sessionStorage.getItem('token'),
                uid:sessionStorage.getItem('uid'),
                radio:'payment_all',
                // options:[{status_type: 0, status_name: '全部账单'},{status_type: 1, status_name: '首次提现的账单'},{status_type: 2, status_name: '需补交的账单'}],
                // status_type:0,
            }
        },
        mounted: function () {
            this.getData();
        },
        methods:{
            getData: function () {
                let vm = this;
                vm.at = null;
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                if(!vm.queryTime) {
                    vm.queryTime[0] =currentdate;vm.queryTime[1] =currentdate;}
                vm.getAxios({
                    token:vm.token,
                    uid:vm.uid,
                    start_time:vm.queryTime[0],
                    end_time:vm.queryTime[1],
                    type:vm.radio,
                    // status_type:vm.status_type,
                })
            },
            getAxios: function (data,nb) {
                let vm = this;
                vm.loading = true;
                if(nb){
                    vm.at = nb;
                }
                if(!data){
                    data = {token:vm.token,uid:vm.uid,status_type:vm.status_type,}
                }else {
                    data.token = vm.token;
                    data.uid = vm.uid;
                }
                vm.$axios({
                    method:'post',
                    url:window.$g_Api + '/oa/moneylog1',
                    data:data
                })
                   .then(function(res){
                       vm.loading = false;
                       if(res.data.code == 0) {
                           vm.result = res.data.data;
                           vm.result_view = res.data.data;
                           var length = vm.result_view.length;
                           //星号
                           for (var i = 0; i < length; i++) {
                               if (vm.result_view[i].status != '转账成功') {
                                   continue
                               }
                               else {
                                   //姓名
                                   if (vm.result_view[i].name) {
                                       var temp_name = String(vm.result_view[i].name);
                                       if (temp_name.length == 2) {
                                           var reg = /^.(.)$/;
                                           vm.result_view[i].name = temp_name.replace(reg, '*$1')
                                       }
                                       else if (temp_name.length == 3) {
                                           var reg = /^(.).(.)$/;
                                           vm.result_view[i].name = temp_name.replace(reg, '$1*$2')
                                       }
                                   }

                                   //账户
                                   if (Number(vm.result_view[i].account) && String(vm.result_view[i].account).length === 11) {
                                       var mobile = String(vm.result_view[i].account);
                                       var reg = /^(\d{3})\d{4}(\d{4})$/;
                                       vm.result_view[i].account = mobile.replace(reg, '$1****$2')
                                   } else if (String(vm.result_view[i].account).indexOf('@') > 0) {
                                       let newEmail, str = vm.result_view[i].account.split('@'), _s = '';

                                       if (str[0].length > 4) {
                                           _s = str[0].substr(0, 4);
                                           for (let i = 0; i < str[0].length - 4; i++) {
                                               _s += '*';
                                           }
                                       } else {
                                           _s = str[0].substr(0, 1);
                                           for (let i = 0; i < str[0].length - 1; i++) {
                                               _s += '*';
                                           }
                                       }
                                       newEmail = _s + '@' + str[1];
                                       vm.result_view[i].account = newEmail;
                                   }

                               }
                           }
                       }else {
                           vm.$message.error(res.data.message);
                       }
                   })
                   .catch(function(err){});
            },
            download_log(data) {
                let vm = this;
                vm.$axios({
                    method:'post',
                    url:window.$g_Api + '/oa/download_log',
                    data:data
                })
            },
            export2Excel() {
                let vm = this;
                if(this.result){
                    this.download_log({
                        token:vm.token,
                        uid:vm.uid,
                        start_time:vm.queryTime[0],
                        end_time:vm.queryTime[1],
                        type:vm.radio,
                    });
                    require.ensure([], () => {
                        const { export_json_to_excel } = require('@/vendor/Export2Excel');
                        const tHeader = ['金额', '账号', '交易状态', '姓名','设备信息', '交易编号']; //对应表格输出的title
                        const filterVal = ['amount', 'account', 'status', 'name','remark', 'out_biz_no']; // 对应表格输出的数据
                        const list = this.result;
                        const data = this.formatJson(filterVal, list);
                        export_json_to_excel(tHeader, data, '列表excel'); //对应下载文件的名字
                    })
                }else {
                    return false
                }

            },
            formatJson(filterVal,jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    #moneylog{
        table{
        border-collapse: collapse;
        }
        table,thead,tbody,tr,th,td{
        border: 1px solid #dedede;
        white-space:nowrap;
        }
        .logBox{
            width: 100%;
            background-color: #ffffff;
            padding: 10px;
            border-radius:20px;
            height: 80%;
            overflow-y: auto;
        }
        .logtable{
            width: 100%;
            margin-top: 20px;
            th,td{
                padding: 0px 6px;
                height: 32px;
                line-height: 32px;
            }
            tbody{
                tr:hover{
                    cursor: pointer;
                    background-color: rgba(204,204,204,0.3)
                }
            }
            .error{
                color:red;
            }
            .first_pay_status{
                background-color:rgba(204,204,204,0.3);
            }
        }
        .da_header{
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            height: 32px;
            line-height: 32px;
            margin-bottom: 20px;
            .header_l{
                display: flex;
                justify-content: flex-start;
                line-height: 32px;
            }
        }
    }
</style>

