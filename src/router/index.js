
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
    //mode: 'history',
    routes: [
        {
            path: '/',
            name: '首页',
            component: resolve => require(['../pages/Index.vue'], resolve)
        },
        {
            path: '/index',
            name: '首页',
            component: resolve => require(['../pages/Index.vue'], resolve)
        },
        {
            path: '/message',
            name: "消息",
            component: resolve => require(['../pages/message.vue'], resolve)
        },
        {
            path: '/messageDetail',
            name: '消息详情',
            component: resolve => require(['../pages/messageDetail.vue'], resolve)
        },
        {
            path: '/renwuManage',
            name: '任务管理',
            component: resolve => require(['../pages/renwuManage.vue'], resolve)
        },
        {
            path:'/chuzhiShow',
            name: '任务处置',
            component: resolve => require(['../pages/chuzhiShow.vue'], resolve)
        },
        /*{
            path: '/xuncha',
            name: "巡查",
            meta:{
                key:2
            },
            component: resolve => require(['../pages/xuncha.vue'], resolve)
        },*/
        {
            path: '/xunchaManage',
            name: "巡查问题管理",
            meta:{
                key:3
            },
            component: resolve => require(['../pages/xunchaManage.vue'], resolve)
        },
        {
            path: '/xunchaWenTiDetail',
            name: "巡查问题详情",
            component: resolve => require(['../pages/xunchaWenTiDetail.vue'], resolve)
        },
        {
            path: '/xunchaXq',
            name: "巡查详情",
            meta:{
                key:3
            },
            component: resolve => require(['../pages/xunchaXq.vue'], resolve)
        },
        {
            path: '/my',
            name: "我的",
            meta:{
                key:3
            },
            component: resolve => require(['../pages/my.vue'], resolve)
        },
        {
            path: '/myRichengXuncha',
            name: "日常巡查",
            meta:{
                key:3
            },
            component: resolve => require(['../pages/myRichengXuncha.vue'], resolve)
        },
        {
            path: '/myXuncha',
            name: "我的巡查",
            meta:{
                key:3
            },
            component: resolve => require(['../pages/myXuncha.vue'], resolve)
        },
        {
            path: '/sheshiList',
            name: "设施列表",
            component: resolve => require(['../pages/sheshiList.vue'], resolve)
        },
        {
            path: '/sheshiDetail',
            name: "设施详情",
            component: resolve => require(['../pages/sheshiDetail.vue'], resolve)
        },
        /*{
            path: '/myyijian',
            name: "我的意见",
            component: resolve => require(['../pages/myyijian.vue'], resolve)
        },*/
        {
            path: '/myhelp',
            name: "帮助中心",
            component: resolve => require(['../pages/myhelp.vue'], resolve)
        },
        {
            path: '/myabout',
            name: "关于应用",
            component: resolve => require(['../pages/myabout.vue'], resolve)
        },
        {
            path: '/gongneng',
            name: "功能介绍",
            component: resolve => require(['../pages/gongneng.vue'], resolve)
        },
        {
            path: '/login',
            name: "登录",
            meta: {
                requiresAuth: true
            },
            component: resolve => require(['../pages/login.vue'], resolve)
        },
        {
            path: '/resetPass',
            name: '忘记密码',
            meta: {
                requiresAuth: true
            },
            component: resolve => require(['../pages/resetPass.vue'], resolve)
        },
        {
            path: '/jianShe',
            name: '建设情况',
            component: resolve => require(['../pages/jianShe.vue'], resolve)
        },
        {
            path: '/yunxing',
            name: '运行情况',
            component: resolve => require(['../pages/yunxing.vue'], resolve)
        },
        {
            path: '/jiance',
            name: '实时监测',
            component: resolve => require(['../pages/jiance.vue'], resolve)
        },
 /*-------------------------------------新加组件---------------------------------------------------*/
        {
            path: '/selectSheshi',
            name: '选择设施',
            component: resolve => require(['../newPage/selectSheshi.vue'], resolve)
        },
        {
            path: '/inspectionSubject',
            name: '选择巡检科目',
            component: resolve => require(['../newPage/inspectionSubject.vue'], resolve)
        },
        {
            path: '/inspectionDetail',
            name: '巡检详情',
            component: resolve => require(['../newPage/inspectionDetail.vue'], resolve)
        },
        {
            path: '/*',
            redirect: '/'
        }
    ]
});


export default router;

