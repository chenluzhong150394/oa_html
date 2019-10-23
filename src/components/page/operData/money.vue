<template>
    <div id="money" class='my_wap'>
        <p class="position"><i class="el-icon-location-outline"></i>您现在的位置：新建转账</p>
        <div class="btn_box">
            <el-button type="primary" @click='open' style='height: 36px;margin-left: 10px;'>启动程序</el-button>
            <!--<el-button type="primary" @click=initWebSocket>上传文件</el-button>-->
            <el-upload
                class="upload-demo"
                :action='url'
                ref="upload"
                :multiple='false'
                :on-error='error'
                name='payment'
                :limit=1
                :on-change='changefile'
                :on-exceed='exceed'
                :on-success='uploadFile'
                :auto-upload="false">
                <el-button size="small" slot="trigger" type="primary" style='height: 36px;'>选择文件</el-button>
                <el-button size="small" type="success" style='height: 36px;margin: 0px 30px;' @click='submitUpload' plain :disabled='btn1'>
                    上传到服务器
                </el-button>
            </el-upload>
            <el-button type="primary" @click='pay' style='height: 36px;margin-left: 10px; overflow: hidden' :loading='transfer' :disabled='btn2'>开始转账</el-button>
            <p style='margin-left: 50px;display: flex;justify-content: flex-start;line-height: 32px;white-space: nowrap'>
                <el-input placeholder='填写金额' style='width: 100px;' v-model='deposit' @keydown.enter.native='setdeposit'></el-input>
                <span style='margin-left: 30px;'>余额:<i style='margin-left: 8px;'>{{balance}}</i></span>
            </p>
        </div>
        <!--<div class="textbox" >-->
        <div>
            <br>
        </div>
            <template >
                <el-table v-show='preview == 1?true:false'
                    :data="websockData"
                    height="100%"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%;font-size: 14px;white-space: nowrap">
                    <el-table-column
                        fixed
                        sortable
                        prop="key"
                        label="设备号">
                    </el-table-column>
                    <el-table-column
                        fixed
                        prop='value'
                        label='提现状态'>
                    </el-table-column>
                    </el-table>
            </template>

        <div class="feedback_box">
            <p class="allmoney" v-show='preview == 2?true:false'>
                总订单数:<span style='color:red;margin: 0 8px;'>{{allorder}}</span>
                总订金额:<span style='color:red;margin: 0 8px;'>{{allmoney}}</span>
            </p>
            <table>
                <thead>
                <tr v-if='preview == 3'>
                    <th>姓名</th>
                    <th>账号</th>
                    <th>日期</th>
                    <th>订单号</th>
                    <th>编码</th>
                    <th>设备信息</th>
                    <th>金额</th>
                    <th>状态</th>
                </tr>
                <tr v-else-if='preview == 2'>
                    <th>金额</th>
                    <th>账号</th>
                    <th>备注</th>
                    <th>名字</th>
                    <th>设备号</th>
                </tr>
                </thead>
                <tbody v-if='preview == 3'>
                <tr v-for='item in resultlist' :key='item.order_id'>
                    <td>{{item.payee_real_name}}</td>
                    <td>{{item.payee_account}}</td>
                    <td>{{item.pay_date}}</td>
                    <td>{{item.order_id}}</td>
                    <td>{{item.out_biz_no}}</td>
                    <td>{{item.remark}}</td>
                    <td>{{item.amount}}</td>
                    <td>{{item.status}}</td>
                </tr>
                </tbody>
                <tbody v-else-if='preview == 2'>
                <tr v-for='item in outdata' :key='item["账号"]'>
                    <td>{{item['金额']}}</td>
                    <td>{{item['账号']}}</td>
                    <td>{{item['备注']}}</td>
                    <td>{{item['名字']}}</td>
                    <td>{{item['设备号']}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'money',
        data() {
            return {
                websock: null,
                websockData: [],
                url: window.$g_Api + '/oa/upload_excel',
                token: sessionStorage.getItem('token'),
                uid: sessionStorage.getItem('uid'),
                resultlist: null,
                outdata:null,
                preview:0,
                allorder:null,
                allmoney:null,
                transfer:false,
                btn1:true,
                btn2:true,
                balance:'',
                deposit:'',
                all_devices:[],
            }
        },
        mounted() {
            this.setbalance();
        },
        computed: {},
        methods: {
            setbalance: function () {
                let vm = this;
                vm.$axios({
                    method:'post',
                    url:window.$g_Api+'/oa/balance_preview',
                    data:{
                        token:vm.token,
                        uid:vm.uid,
                    }
                })
                    .then(function(res){
                        if(res.data.code == 0){
                            vm.balance = res.data.data;
                        }
                    })
                    .catch(function(err){});
            },
            setdeposit: function () {
                let vm = this;
                if(!vm.deposit){return false}
                vm.$axios({
                    method:'post',
                    url:window.$g_Api+'/oa/balance_deposit',
                    data:{
                        token:vm.token,
                        uid:vm.uid,
                        deposit:vm.deposit
                    }
                })
                    .then(function(res){
                        vm.setbalance();
                        vm.$notify({
                            title: '提示',
                            message: res.data.message,
                        });

                    })
                    .catch(function(err){});
            },
            open() {
                let vm = this;
                vm.$confirm('即将启动程序, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    vm.progress = true;
                    vm.feedback = false;
                    vm.initWebSocket();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            openNew: function (url) {
                let a = document.createElement("a"); //创建a对象
                a.setAttribute("href", url);
                a.setAttribute("target", "_blank");
                a.setAttribute("id", "camnpr");
                document.body.appendChild(a);
                a.click(); //执行当前对象
            },

            initWebSocket() {
                //初始化weosocket
                this.preview = 1;
                this.websockData = [{key:'begin',value:'程序启动中......'}];
                if ("WebSocket" in window) {
                    const wsuri = "ws://" + window.$g_Api2 + "/oa/exec_each_machines";
                    this.websock = new WebSocket(wsuri);
                    this.websock.onmessage = this.websocketonmessage;
                    this.websock.onopen = this.websocketonopen;
                    // this.websock.onerror = this.websocketonerror;
                    this.websock.onclose = this.websocketclose;
                } else {
                    vm.$message.warning('您的浏览器版本不支持该功能请升级版本或更换浏览器!')
                }
            },
            websocketonerror() {//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e) { //数据接收
                var message_key = e.data.split('@')[0];
                var message_value = e.data.split('@')[1];
                var message = new Array();
                message['key'] = message_key;
                message['value'] = message_value;
                this.websockData.push(this.$qs.parse(message));
            },
            websocketsend(Data) {//数据发送
                this.websock.send(Data);
            },
            websocketclose(e) {  //关闭
                if (this.websock.readyState == 3 && !!this.websock) {
                    this.websockData.push({key:'end',value:'执行完毕,断开连接'})
                    // window.location.href =window.$g_Api+"/oa/download_transfer_excel"
                    // window.location.href ="http://www.baidu.com"
                    // window.open(window.$g_Api+"/oa/download_transfer_excel");
                    // this.openNew(window.$g_Api+"/oa/download_transfer_excel")
                    // this.openNew(window.$g_Api + "/oa/download_transfer_excel");
                    let tempwindow=window.open('_blank');
                    tempwindow.location=window.$g_Api + "/oa/download_transfer_excel"
                } else {
                    this.websockData.push({key:'error',value:'程序出错,断开连接'})
                }
            },
            uploadFile: function (response, file, fileList) {
                if (response.code == 0) {
                    this.$message.success('上传成功');
                    this.btn2 = false;
                } else {
                    alert(response.message);
                }

            },
            exceed: function (files, fileList) {
                this.$message.warning('超出文件个数')
            },
            error: function (err, file, fileList) {
                console.log(err);
                this.$message.error(err.message)
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            changefile: function (file, fileList) {
                this.btn1 = false;
                this.preview = 2;
                if (file.name.split('.')[1] != 'xls' && file.name.split('.')[1] != 'xlsx') {
                    this.$message({message: '上传文件格式错误，请上传xls、xlsx文件！', type: 'warning'});
                } else {
                    let _this = this;
                    let inputDOM = this.$refs.inputer;
// 通过DOM取文件数据

                    this.file = event.currentTarget.files[0];

                    let rABS = false; //是否将文件读取为二进制字符串
                    let f = this.file;

                    let reader = new FileReader();
//if (!FileReader.prototype.readAsBinaryString) {
                    FileReader.prototype.readAsBinaryString = function (f) {
                        let binary = "";
                        let rABS = false; //是否将文件读取为二进制字符串
                        let wb; //读取完成的数据
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            let bytes = new Uint8Array(reader.result);
                            let length = bytes.byteLength;
                            for (let i = 0; i < length; i++) {
                                binary += String.fromCharCode(bytes[i]);
                            }
                            let XLSX = require('xlsx');
                            if (rABS) {
                                wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                    type: 'base64'
                                });
                            } else {
                                wb = XLSX.read(binary, {
                                    type: 'binary'
                                });
                            }
                            let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
                            let money = 0;
                            for(let i = 0 ,len = outdata.length ; i < len; i++){
                                // money = _this.accAdd(money,outdata[i]['金额']);
                                // money = (money+outdata[i]['金额']).toFixed(2);

                                money = money+Number(outdata[i]['金额']);
                            }
                            _this.allmoney = money.toFixed(2);
                            _this.outdata = outdata;
                            _this.allorder = outdata.length;
                        }
                        reader.readAsArrayBuffer(f);
                    }
                    if (rABS) {
                        reader.readAsArrayBuffer(f);
                    } else {
                        reader.readAsBinaryString(f);
                    }
                }
            },
            pay: function (data) {
                let vm = this;
                vm.transfer = true;
                if (!data) {
                    data = {token: vm.token, uid: vm.uid}
                }
                vm.$axios({
                    method: 'post',
                    url: window.$g_Api + '/oa/money',
                    data: {
                        token: vm.token, uid: vm.uid
                    }
                })
                    .then(function (res) {
                        vm.transfer = false;
                        if (res.data.code == 0 && res.data.data)
                        {
                            vm.$notify({
                                title: '提示',
                                message: '转账成功',
                                duration: 0
                            })

                            vm.preview = 3;
                            vm.resultlist = res.data.data;
                            vm.btn2 = true;
                            vm.setbalance();
                        }
                        else if (res.data.code == 1 && res.data.data)
                        {
                            vm.$notify({
                                title: '警告',
                                message: res.data.message,
                                duration: 0
                            })
                            vm.preview = 3;
                            vm.resultlist = res.data.data;
                            vm.btn2 = true;
                            vm.setbalance();
                        }
                    })
                    .catch(function (err) {
                        vm.transfer = false;
                        alert(err);
                    });
            },
        },
        destroyed() {
            this.websock.onclose() //离开路由之后断开websocket连接
        },
    }

</script>

<style lang='scss'>
    #money {
        min-height: 600px;
        background-color: #ffffff;
        .btn_box {
            display: flex;
            justify-content: flex-start;
            .upload-demo {
                width: 600px;
                margin: 0px 50px;
                display: flex;
                justify-content: flex-start;
                .el-upload--text {
                    border: none;
                    height: 36px;
                    width: 80px;
                }
            }
        }
        .textbox {
            width: 100%;
            height: 520px;
            overflow-y: auto;
            padding: 10px;
            background-color: #ffffff;
        }
        .feedback_box {
            height: 80%;
            width: 100%;
            margin-top: 20px;
            overflow-x: auto;
            table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                margin-top: 15px;
                thead{
                    tr{
                        background-color: rgba(64,158,255,.7);
                        color: #ffffff;
                    }
                }
                th, td {
                    /*border-bottom: 1px solid #cccccc;*/
                    padding-left: 10px;
                    height: 28px;
                    line-height: 28px;
                }
                tbody {
                    tr {
                        &:nth-child(2n){
                            background-color: rgba(64,158,255,.15);
                        }
                        &:hover {
                            background-color: rgba(204, 204, 204, 0.2);
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }

</style>

