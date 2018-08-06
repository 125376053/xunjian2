<template>
    <div>

        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto" style="margin-top: 0;">

            <div class="yh_list xiaoxiGuanli" style=" background: red!important;">
                <ul>
                    <BetterScroll class="wrapper" style="top:0!important;" ref="scroll" :data="myXunChaList" :pullUpLoad="pullUpLoad" @pullingUp="onPullingUp">
                        <router-link tag="li" style="border-bottom:.08rem solid #f0f2f5"
                                     :key="index" :to="{
                            path:'/inspectionDetail',
                            query:{
                                XunChaId:item.XunChaId,
                                title:item.XunChaRemark,
                                time:item.CreateTime
                            }
                        }" class="JustifyFlex" v-for="(item,index) in myXunChaList">
                            <div class="left">
                                <img src="static/images/xunchaIcon.png">
                            </div>
                            <div class="right">
                                <p class="title ellipse">{{item.XunChaRemark}}</p>
                                <p class="dataAndText JustifyFlex">
                                    <span class="ellipse" style="display: inline-block;width:3.2rem;font-size: .28rem;">{{item.Address}}</span>
                                    <span>{{item.CreateTime}}</span>
                                </p>
                            </div>
                        </router-link>
                    </BetterScroll>

                </ul>
            </div>

        </div>

        <FooterNav :MessageLength="messageNum" :MyLength="renwuNum"></FooterNav>

    </div>
</template>
<script>
    import Header from "../components/Header.vue"
    import Footer from "../components/Footer.vue"
    import BetterScroll from '../components/BetterScrollSlot'
    import {mapState,mapGetters,mapActions} from 'vuex'
    export default{
        name:'myXuncha',
        components:{
            HeaderNav:Header,
            FooterNav:Footer,
            BetterScroll,
        },
        data(){
            return{
                title:'我的巡检',
                imgsType:[
                    'static/images/yhicon1.jpg', //1报警图标 static目录下的不需要模块打包进入
                    'static/images/yhicon2.jpg', //2维护图标
                    'static/images/yhicon3.jpg'  //3巡查问题
                ],
                myXunChaList:[],
                pullUpLoad:true,
                pageInfo:{},
                pageIndex:1,
                pageSize: 10,
                renwuNum:window.localStorage.getItem('renwuNum')||0,
                messageNum:window.localStorage.getItem('messageNum')||0
            }
        },
        computed:{
            ...mapGetters([
                'user'
            ]),
            jinji(item){
                return (item)=>{
                    if(item.Emergency==1){
                        return "不急"
                    }
                    if(item.Emergency==2){
                        return "一般"
                    }
                    if(item.Emergency==3){
                        return "紧急"
                    }
                    if(item.Emergency==4){
                        return "非常紧急"
                    }
                }
            }
        },
        methods:{
            getData(){
               // alert(2)
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl+'/api/XunCha/GetItemListMyXunCha?pageindex='+this.pageIndex+'&pagesize='+this.pageSize+'&ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();

                    if(d.status==200){
                        if (d.data.IsError > 0) {
                            this.$toast(d.data.StatusMsg);
                        } else {
                            this.myXunChaList=this.myXunChaList.concat(d.data.Model.DataList||[]);
                            //this.MyLength=this.myXunChaList.length||0;
                            this.pageInfo=d.data.Model.PageInfo||[];
                        }
                    }else{
                        //this.$toast(d.statusText);
                    }

                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(e.statusText)
                })
            },
            //下拉加载数据
            onPullingUp () {
                //如果还有下一页
                if(this.pageInfo.PageCount>this.pageIndex){
                    this.pageIndex++;
                    this.getData()
                }else{
                    //如果没有新数据
                    this.$refs.scroll.forceUpdate()
                }
            },
            //待办任务角标
            renWuJiaoBiao(){
                //api/WorkOrder/GetMyTaskDealWithintCount
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl+'/api/WorkOrder/GetMyTaskDealWithintCount?ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();

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
            //alert(1)
            this.getData()
            this.renWuJiaoBiao()
            this.xiaoxiJiaoBiao()
        }
    }
</script>
<style>

</style>
