<template>
    <div>
        <div>
            <HeaderNav :title="title"></HeaderNav>

            <div class="overAuto2" style=" background: #f0f2f5;">
                <div class="rc">
                    <ul>
                        <router-link tag="li" :to="{path:'/xunchaManage',query:{step:0}}" class="JustifyFlex">
                            <img class="bq" src="static/images/my1.jpg">
                            <span class="wt">我的问题</span>
                            <img class="jt" src="static/images/myLeft.jpg">
                        </router-link>
                        <router-link tag="li" :to="{path:'/myXuncha'}" class="JustifyFlex">
                            <img class="bq" src="static/images/my2.jpg">
                            <span class="wt">我的巡检</span>
                            <img class="jt" src="static/images/myLeft.jpg">
                        </router-link>
                    </ul>
                </div>
            </div>

            <FooterNav :MessageLength="messageNum" :MyLength="renwuNum"></FooterNav>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Header from "../components/Header.vue"
    import Footer from "../components/Footer.vue"
    export default{
        data(){
            return {
                title:'日常巡检',
                renwuNum:window.localStorage.getItem('renwuNum')||0,
                messageNum:window.localStorage.getItem('messageNum')||0
            }
        },
        components: {
            HeaderNav: Header,
            FooterNav: Footer
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        methods:{
            //待办任务角标
            renWuJiaoBiao(){
                //api/WorkOrder/GetMyTaskDealWithintCount
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl+'/api/WorkOrder/GetMyTaskDealWithintCount?ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();
                    //console.log(d.data);
                    if (d.data.IsError > 0){
                        this.$toast(d.data.StatusMsg);
                        return false;
                    } else {
                        this.renwuNum=d.data.Model||0;
                        //this.$store.dispatch('renwuNum',this.renwuNum);
                        window.localStorage.setItem('renwuNum',this.renwuNum);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    this.renwuNum=0
                })
            },
            //消息角标
            xiaoxiJiaoBiao(){
                //api/WorkOrder/GetMessageCount
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl+'/api/WorkOrder/GetMessageCount?ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();

                    if (d.data.IsError > 0){
                        this.$toast(d.data.StatusMsg);
                        return false;
                    } else {
                        this.messageNum=d.data.Model||0;
                        //this.$store.dispatch('messageNum',this.messageNum);
                        window.localStorage.setItem('messageNum',this.messageNum);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    this.messageNum=0
                })
            }
        },
        mounted(){
            this.renWuJiaoBiao()
            this.xiaoxiJiaoBiao()
        }
    }
</script>

<style>

</style>
