<template>
  <div>
      <div style="float: left;margin-top: 120px;margin-left: 110px;">
          <el-button type="primary" round v-on:click="get_data()" style="border-bottom-width: 1px;margin-bottom: 31px;margin-left: 80px;margin-right: 52px;">获取配置</el-button>
          <el-button type="success" round v-on:click="Chage()">{{butme}}</el-button>
          <el-table :data="tableData" style="width: 400px">
      <el-table-column align='center' prop="public" label="支付宝公钥" width="400">
      </el-table-column>
    </el-table>
      <el-table :data="tableData" style="width: 400px">
      <el-table-column align='center' prop="prvate" label="支付宝私钥" width="400">
      </el-table-column>
    </el-table>
      <el-table :data="tableData" style="width: 400px">
      <el-table-column align='center' prop="appid" label="商户应用ID" width="400">
      </el-table-column>
    </el-table>
      </div>

      <div :style="{'display':(status == 1) ? 'block':'none'}" >
        <!-- 在使用表单验证时，需要注意：
        1.必须给表单对象绑定一个对象：:model="loginForm"，而且不能写成：v-model="loginForm"
        2.所有的子控件的绑定对象必须是表单对象的内部对象，比如：v-model="loginForm.username"，否则总是验证失败
         -->
        <el-form class="login-container" :model="loginForm" ref="loginForm" label-position="left">
          <h3 class="login-title">支付宝商户信息填写</h3>
          <el-form-item prop="pub">
            <el-input type="text" v-model="loginForm.pub" auto-complete="off" placeholder="公钥"></el-input>
          </el-form-item>
            <el-form-item prop="prv">
            <el-input type="text" v-model="loginForm.prv" auto-complete="off" placeholder="私钥"></el-input>
          </el-form-item>
            <el-form-item prop="appid">
            <el-input type="text" v-model="loginForm.appid" auto-complete="off" placeholder="appid"></el-input>
          </el-form-item>
            <el-form-item>
            <el-button class="login-button" type="primary" v-on:click="send('loginForm')" @click="Chage()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
        butme:'更改信息',
        status:0,
        pub:'',
        prv:'',
        appid:'',
        tableData:[{
           public:'\nnull',
            prvate:'\nnull',
            appid:'\nnull'
        }],
      loginForm: {
        username: "admin",
        password: "123"
      },
      checked: true
    };
  },
    mounted:function(){
      this.get_data()
    },
  methods: {
      // 判断要提交的iput框是不是空的，是空的就弹窗
      send(){
          if(this.loginForm.pub == '' || this.loginForm.prv == '' || this.loginForm.appid == ''){
              this.$message({
                  message:'请输入内容后再提交哦！'
              })
          }else {

          this.$axios({
              url:'http://127.0.0.1:8000/oa/update_setings',
              method: 'post',
              data:JSON.stringify({
                  'pub':this.loginForm.pub,
                  'prv':this.loginForm.prv,
                  'appid':this.loginForm.appid
              }),
              headers:{
                  'Content-Type': 'application/json'
              },
          }).then(response => {
              console.log(response.data);
              this.$message({
                  message:response.data
              })
          }).catch(error => {
              console.log(error);
              this.$message({
                  message:error
              })
          })
          }

    },
      get_data(){
          this.$axios({
              url: 'http://127.0.0.1:8000/oa/read_setings',
              method: 'get',
          }).then(responce => {
              // this.tableData[0].appid = response.data.appid;
              // this.tableData[0].public = response.data.pub;
              // this.tableData[0].prvate = response.data.prv;
              // console.log(responce.data);
              let res = responce.data;
              // console.log(res['appid'])
              this.tableData[0].appid = res['appid'];
              this.tableData[0].public = res['pub'];
              this.tableData[0].prvate = res['prv'];
              // console.log(this.tableData[0])
          }).catch(error => {
              this.$message({
                 message:error.data
              });
              console.log(error)
          })
      },
      Chage(){
          if (this.status == 0){
              this.status = 1;
              this.butme = '取消更改'
          }else {
              this.status = 0;
              this.butme = '更改信息';
          }
      },
  }
};
</script>
<style lang="stylus" scoped>

    .login-container
        width 350px
        margin 130px 20% 20%
        background-clip padding-box
        padding 35px 35px 15px 35px
        border 1px solid #eaeaea
        border-radius 15px
        box-shadow 0 0 25px #cac6c6
        background #fff
        margin-right 318px
        float right
        .login-title
            margin 0 auto 40px auto
            text-align center
            color #505458
        .login-remember
            margin 0 0 35px 0
            text-align center
        .login-button
            width 100%
</style>





<!--<script>-->

<!--export default {-->
<!--  name: "from",-->
<!--  data() {-->
<!--    return {-->
<!--        numberValidateForm: {-->
<!--          age: ''-->
<!--    }-->
<!--  },-->
<!--  methods:{-->
<!--      send(){-->
<!--          this.$axios({-->
<!--              url:'http://127.0.0.1:8000/oa/update_setings',-->
<!--              method: 'post',-->
<!--              data:JSON.stringify({-->
<!--                  'pub':this.formMess.account,-->
<!--                  'prv':this.formMess.account,-->
<!--                  'appid':this.formMess.account-->
<!--              }),-->
<!--              headers:{-->
<!--                  'Content-Type': 'application/json'-->
<!--              },-->
<!--          }).then(function (res) {-->
<!--              console.log(res)-->
<!--          })-->
<!--      },-->

<!--  }-->
<!--};-->
<!--</script>-->

