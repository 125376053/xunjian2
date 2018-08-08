<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>
        <div class="overAuto2">
            <div class="version">
                <img src="static/images/version.jpg" alt="">
                <p>版本1.1.0</p>
                <p>清源华建 版权所有</p>
            </div>
            <div class="rc">
                <ul>
                    <router-link tag="li" :to="{path:'/gongneng'}" class="JustifyFlex">
                        <span class="wt">功能介绍</span>
                        <img class="jt" src="static/images/myLeft.jpg">
                    </router-link>
                    <li class="JustifyFlex" @click="checkVersion">
                        <span class="wt">版本检测</span>
                        <img class="jt" src="static/images/myLeft.jpg">
                    </li>
                </ul>
            </div>
        </div>

        <div class="imgBigList" v-if="modiaFlag">
            <div class="save save2">
                <p>检测到新版本,是否升级？</p>
                <div class="btnGroup centerFlex">
                    <a href="javascript:;" @click="modiaFlag=false">取消</a>
                    <a href="javascript:;" @click="downApp">升级</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Header from "../components/Header.vue"
    export default{
        components:{
            HeaderNav:Header
        },
        data(){
            return{
                title:'关于应用',
                modiaFlag:false,
                url:''
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        methods:{
            checkVersion(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/UpdateVersion/CheckVer?ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    if(data.Model==='False'){
                        this.$toast('当前已是最新版本！')
                    }else{
                        this.modiaFlag=true
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            //window.open
            downApp(e){
                this.modiaFlag=false
                var url=this.baseUrl + '/api/UpdateVersion/DownVer?ticket=' + this.user.ticket;
                e.target.setAttribute('href',url)

//                this.$indicator.open('加载中...');
//                this.$http.get(this.baseUrl + '/api/UpdateVersion/DownVer?ticket=' + this.user.ticket).then((d) => {
//                    //this.$indicator.close();
//                    this.modiaFlag=false;
//                    console.log(d);
//                }).catch((e) => {
//                    this.$indicator.close();
//                })
            }
        }
    }
</script>
<style>

</style>
