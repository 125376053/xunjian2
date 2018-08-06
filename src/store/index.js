import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
Vue.use(Vuex);
var state = {
    user:null
};
const mutations = {
    user:(state,content)=>{
        state.user=content;
    },
    removeLocal:(state)=>{
        state.user=null;
    }
};

const actions = {
    user:({commit},content)=>{
        commit("user",content)
    },
    removeLocal:({commit})=>{
        let toast=Vue.$toast({
            message: '退出成功',
            duration: 2000
        })
        setTimeout(() => {
            toast.close();
            router.push({
                path:'/login'
            })
        }, 2000);
        window.localStorage.removeItem("user");
        commit("removeLocal")
    }
};

const getters = {
    user(state){
        //刷新vuex数据丢失
        var that=this;
        //本地缓存通过storage事件做监控
        window.addEventListener("storage", function (e) {
            if(e.key=='user'){
                //发生改变修改user 实施监听user
                if(e.newValue==null){
                    router.push({
                        path:'/login'
                    })
                }
                return state.user=JSON.parse(e.newValue);
            }
        });
        return state.user||JSON.parse(window.localStorage.getItem('user'))
    }
};


//需要导出Store对象
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});
