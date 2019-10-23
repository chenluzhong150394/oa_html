import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token:null,
        userName:null,
        role:null,
        auth:null,
        uid:null,
    },
    getters: {},
    mutations: {
        //所有mutations中的方法的第一个参数一定是state变量，用来进行对state中的状态的操作
        //第二个参数是可选参数，用于调用该 mutations 方法的时候传参
        loginToken: function (state,token) {
            sessionStorage.setItem("token", token);
            state.token = token;
        },
        logoutToken: function (state,token) {
            sessionStorage.removeItem("token", token);
            state.token = token;
        },
        setUserName: function (state,username) {
            state.userName = username;
        },
        setRole: function (state,role) {
            state.role = role;
        },
        setAuth: function (state,auth) {
            state.auth = auth;
        },
        setUid: function (state,uid) {
            state.uid = uid;
        }
    },
    actions: {},
})

export default store
