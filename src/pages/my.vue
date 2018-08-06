<template>
    <div>
        <div class="bigImg centerFlex">
            <div class="myTou JustifyFlex">
                <p class="left">
                    <img src="static/images/myTou.png" alt="">
                </p>
                <div class="right" v-if="userObj">
                    <p class="title">{{userObj.TrueName}}</p>
                    <p>
                        <span>{{userObj.RoleName}}</span>
                        <span>丨</span>
                        <span>{{userObj.LastLoginTime}}</span>
                    </p>
                </div>
            </div>
        </div>

        <div class="rc" style="background:#f0f2f5;">
            <ul>
                <router-link class="JustifyFlex" :to="{path:'/renwuManage',query:{
                    step:1
                }}" tag="li">
                    <img class="bq" src="static/images/my1.jpg">
                    <span class="wt">待办任务</span>
                    <img class="jt" src="static/images/myLeft.jpg">
                </router-link>

                <router-link class="JustifyFlex" :to="{path:'/myRichengXuncha'}" tag="li">
                    <img class="bq" src="static/images/my2.jpg">
                    <span class="wt">日常巡检</span>
                    <img class="jt" src="static/images/myLeft.jpg">
                </router-link>

                <li @click="gotoYijian()" class="JustifyFlex" style="margin-top: .2rem;">
                    <img class="bq" src="static/images/my3.jpg">
                    <span class="wt">意见反馈</span>
                    <img class="jt" src="static/images/myLeft.jpg">
                </li>

                <router-link class="JustifyFlex" :to="{path:'/myhelp'}" tag="li">
                    <img class="bq" src="static/images/my4.jpg">
                    <span class="wt">帮助文档</span>
                    <img class="jt" src="static/images/myLeft.jpg">
                </router-link>

                <router-link class="JustifyFlex" :to="{path:'/myabout'}" tag="li">
                    <img class="bq" src="static/images/my5.jpg">
                    <span class="wt">关于应用</span>
                    <img class="jt" src="static/images/myLeft.jpg">
                </router-link>
            </ul>

            <div class="logout" v-if="user" @click="logout">退出登录</div>

        </div>

        <FooterNav :MessageLength="messageNum" :MyLength="renwuNum"></FooterNav>

        <!--弹出-->
        <div class="imgBigList gdTan" v-if="modiaFlag">
            <div class="save">
                <h1 style="font-size:.38rem">确定注销</h1>
                <div class="content">
                    <p style="font-size:.32rem; text-align: left;">确定注销当前账号？</p>
                    <div class="logout2" style="margin-left:2.1rem;">
                        <button class="quxiao" @click="modiaFlag=false">取消</button>
                        <span class="enter" @click="enterLogout">确定</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Footer from "../components/Footer.vue"
    export default{
        components: {
            FooterNav: Footer
        },
        data(){
            return {
                MyLength: 0,
                modiaFlag: false,
                renwuNum: window.localStorage.getItem('renwuNum') || 0,
                messageNum: window.localStorage.getItem('messageNum') || 0,
                userObj:{}
            }
        },
        computed: {
            ...mapGetters([
                'user',
                /*'renwuNum',
                 'messageNum'*/
            ])
        },
        watch: {
            //路由发生改变 查看数据
            //'$route'(a,b){},
            'user'(a, b){
            }
        },
        methods: {
            //通过方法  用mapActions将事件转发给仓库的actions动作
            ...mapActions([
                'removeLocal'
            ]),
            //mapActions传递参数 单独定义一个方法调用 mapactions里面的方法
            logout(){
                this.modiaFlag = true;
            },
            enterLogout(){
                this.modiaFlag = false;
                //this.removeLocal()
                //commit提交到mutions
                //dispatch提交方法
                this.$store.dispatch("removeLocal")
            },
            gotoYijian(){
                if (window.disposal) {
                    window.disposal.feedbackSuggest();
                } /*else {
                    this.$router.push({
                        path: '/myyijian',
                    })
                }*/
            },
            //待办任务角标
            renWuJiaoBiao(){
                //api/WorkOrder/GetMyTaskDealWithintCount
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/WorkOrder/GetMyTaskDealWithintCount?ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();

                    if (d.data.IsError > 0) {
                        this.$toast(d.data.StatusMsg);
                        return false;
                    } else {
                        this.renwuNum = d.data.Model || 0;
                        //this.$store.dispatch('renwuNum',this.renwuNum);
                        window.localStorage.setItem('renwuNum', this.renwuNum);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    this.renwuNum = 0
                })
            },
            //消息角标
            xiaoxiJiaoBiao(){
                //api/WorkOrder/GetMessageCount
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/WorkOrder/GetMessageCount?ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();

                    if (d.data.IsError > 0) {
                        this.$toast(d.data.StatusMsg);
                        return false;
                    } else {
                        this.messageNum = d.data.Model || 0;
                        //this.$store.dispatch('messageNum',this.messageNum);
                        window.localStorage.setItem('messageNum', this.messageNum);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    this.messageNum = 0
                })
            },
            //获取当前用户
            //GET api/User/GetLoginedUser
            getUser(){
                let ticket = JSON.parse(window.localStorage.getItem('user')).ticket;
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/Common/GetLoginedUser?ticket=' + ticket).then((d) => {
                    this.$indicator.close();
                    if (d.data.IsError > 0) {
                        this.$toast(d.data.StatusMsg);
                        return false;
                    } else {
                        this.userObj=d.data.Model||null;
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            }
        },
        //刷新vuex数据丢失 vuex可以共享数据 但是共享的数据在刷新丢失 所以将本地缓存设置到vuex
        mounted(){
            this.renWuJiaoBiao()
            this.xiaoxiJiaoBiao()
            this.getUser()
        }
    }
</script>
<style scoped>

    .save{
        height: 4rem;
    }

    .quxiao {
        font-size: .28rem;
        background: #2b6dcb;
        display: inline-block;
        text-align: center;
        padding:.15rem .4rem .15rem;
        color: #999;
    }

    .logout2{
        margin-top:.3rem;
    }

    .enter {
        font-size: .28rem;
        background: #2b6dcb;
        display: inline-block;
        text-align: center;
        padding:.15rem .4rem .15rem;
        color: #fff !important;
        border-radius: 5px;
    }
</style>
