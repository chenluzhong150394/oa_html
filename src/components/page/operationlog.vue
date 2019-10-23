<template>
    <div id="operationlog" class='my_wap'>
        <p class="position"><i class="el-icon-location-outline"></i>您现在的位置：操作日志</p>
        <div class="log_box">
            <table>
                <thead>
                    <tr>
                        <th>操作记录</th>
                        <th>时间</th>
                        <th>用户名</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for='(item,index) in log'>
                        <td>{{item.record}}</td>
                        <td>{{item.time}}</td>
                        <td>{{item.username}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name:'operationLog',
    data: function () {
        return {
            token:sessionStorage.getItem('token'),
            uid:sessionStorage.getItem('uid'),
            log:null,
        }
    },
    mounted: function () {
        this.getData()
    },
    methods:{
        getData: function () {
            let vm = this;
            vm.$axios({
                method:'post',
                url:window.$g_Api+'/oa/operationlog',
                data:{
                    token:vm.token,
                    uid:vm.uid,
                }
            })
               .then(function(res){
                   if(res.data.code == 0){
                       vm.log = res.data.data;
                   }else {
                       console.error(res.data.message)
                   }
               })
               .catch(function(err){});
        },
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
#operationlog{
    .log_box{
        width: 100%;
        table{
            width: 100%;
            text-align: left;
            border-collapse: collapse;
            tr{
                height: 34px;
                line-height: 34px;
                &:hover{
                    background-color: rgba(204,204,204,.2);
                }
                th,td{
                    border-bottom: 1px solid #cccccc;
                    padding-left: 15px;
                }
                td{
                    color: #666666;
                }
            }
        }
    }
}
</style>

