<template>
  <div>
    <!-- 在使用表单验证时，需要注意：
    1.必须给表单对象绑定一个对象：:model="loginForm"，而且不能写成：v-model="loginForm"
    2.所有的子控件的绑定对象必须是表单对象的内部对象，比如：v-model="loginForm.username"，否则总是验证失败
     -->
    <el-form class="login-container" :model="loginForm" ref="loginForm" label-position="left">
      <h3 class="login-title">信息提交</h3>
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
        <el-button class="login-button" type="primary" @click="send('loginForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
        pub:'',
        prv:'',
        appid:'',
      rules: {
          username: [
              { required: true, message: '请输入公钥', trigger: 'blur'}
          ],
          password: [
              { required: true, message: '请输入私钥', trigger: 'blur'}
          ]
      },
      loginForm: {
        username: "admin",
        password: "123"
      },
      checked: true
    };
  },
  methods: {
    // submitClick(formName) {
    //     // 表单验证
    //     this.$refs[formName].validate(valid => {
    //         if(valid) {
    //             alert('提交成功！')
    //         } else {
    //             console.log("error submit！");
    //             return false
    //         }
    //     })
    // },
      send(){
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
      }).then(function (res) {

        this.$alert('asdasda')
      }).catch(function (error) {
          console.log(error,'失败的');
          this.$alert('asdasda')
      })
  },
  }
};
</script>
<style lang="stylus" scoped>
    .login-container
        width 350px
        margin 130px auto
        background-clip padding-box
        padding 35px 35px 15px 35px
        border 1px solid #eaeaea
        border-radius 15px
        box-shadow 0 0 25px #cac6c6
        background #fff
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

