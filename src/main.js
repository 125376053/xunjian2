import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios";
Vue.prototype.$http = axios;
Vue.prototype.baseUrl = "http://waterapi.qijiatech.com";
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(Mint);
Vue.prototype.busEvent = new Vue();
import * as utils from "./utils";
Vue.use(utils);

import store from "./store";
Vue.use(store);

//全局指令
import * as direct from './directive';
Object.keys(direct).forEach(key => {
    Vue.directive(key,direct[key])
});


router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        if (!to.meta.requiresAuth && !localStorage.getItem('user')) {
            next({
                path: '/login'
            })
        } else {
            next()
        }
    }
    next()
})

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(res => {
    if(res.status==200){
        if (res.data && res.data.IsError==0) {

        }else{

        }
    }
    return res;
}, (error) => {
    return error;
});


let vm=new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});


