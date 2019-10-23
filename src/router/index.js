import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/moneylog1'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/devices2',
                    component: resolve => require(['../components/page/operData/devices2.vue'], resolve),
                    meta: { title: '设备管理2'}
                },
                {
                    path: '/moneylog1',
                    component: resolve => require(['../components/page/viewData/moneylog1.vue'], resolve),
                    meta: { title: '转账记录' }
                },
                {
                    path: '/money',
                    component: resolve => require(['../components/page/operData/money.vue'], resolve),
                    meta: { title: '新建转账' }
                },
                {
                    path: '/usercenter',
                    component: resolve => require(['../components/page/operData/usercenter.vue'], resolve),
                    meta: { title: '用户中心'}
                },
                {
                    // 权限页面
                    path: '/manage',
                    component: resolve => require(['../components/page/manage.vue'], resolve),
                    meta: { title: '用户管理'}
                },
                {
                    path: '/operationlog',
                    component: resolve => require(['../components/page/operationlog.vue'], resolve),
                    meta: { title: '操作日志'}
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '更新日志'}
                },
                {
                    path:'/tixian',
                    component: resolve => require(['../components/page/tixian.vue'], resolve),
                    meta: { title: '提现设置'}

                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
