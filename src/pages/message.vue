<template>

    <div>

        <HeaderNav style="display: block;" :title="title"></HeaderNav>

        <div class="overAuto2" style="margin-top:0rem;top:.89rem;">

            <!--消息管理列表页面分为 养护消息 工单消息 报警消息-->
            <div class="yh_list xiaoxiGuanli">
                <ul>
                    <BetterScroll class="wrapper" ref="scroll" :data="MessageList" :pullUpLoad="pullUpLoad" @pullingUp="onPullingUp">
                        <!--进入详情页-->
                        <li class="JustifyFlex" :key="index" :id="item.WorkOrderId"
v-for="(item,index) in MessageList" @click="gotoXq(item)">
                            <!--图标-->
                            <div class="left">
                                <img v-if="true" :src="imgsType[(item.OrderType-1)]">
                            </div>
                            <div class="right">
                                <p class="title ellipse">{{item.OrderRemark}}</p>
                                <p class="dataAndText JustifyFlex">
                                    <span class="ellipse" style="display: inline-block;width:3.2rem;font-size: .28rem;">
                                        {{item.Address}}
                                    </span>
                                    <span>{{item.ReportTime}}</span>
                                </p>
                            </div>
                            <!--<div v-if="item.OrderType==3" class="jinji" :class="'jinji'+item.Emergency">
                                {{jinji(item)}}
                            </div>-->
                        </li>
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
        //name:'message',
        components:{
            HeaderNav:Header,
            FooterNav:Footer,
            BetterScroll
        },
        data(){
            return{
                title:'消息管理',
                imgsType:[
                    'static/images/yhicon1.jpg', //1报警图标 static目录下的不需要模块打包进入
                    'static/images/yhicon2.jpg', //2维护图标
                    'static/images/yhicon3.jpg',  //3工单
                    'static/images/yhicon4.jpg'  //4 科目
                ],
                //设施id 空是片区 跳转到选择设施
                sheshiId:'',
                MessageList:[],
                pullUpLoad:true,
                pageInfo:{},
                pageIndex:1,
                pageSize: 10,
                renwuNum:window.localStorage.getItem('renwuNum')||0,
                messageNum:window.localStorage.getItem('messageNum')||0,
                getRelateId:0
            }
        },
        computed:{
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
            },
            ...mapGetters([
                'user'
            ]),
        },
        watch:{
            messageNum(){},
            renwuNum(){}
        },
        methods:{
            getRelateIdFn(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl+'/api/XunchaPlan/GetTempPlanId?ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();
                    let data=d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        this.getRelateId=data.Model
                    }
                })
            },
            getData(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl+'/api/WorkOrder/GetItemListPage?pageindex='+this.pageIndex+'&pagesize='+this.pageSize+'&ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();
                    let data=d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        if(data.Model){
                            this.MessageList=this.MessageList.concat(data.Model.DataList||[]);
                            //this.MessageLength=this.MessageList.length||0;
                            this.pageInfo=data.Model.PageInfo||[];
                        }
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(data.statusText)
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
            gotoXq(item){
                console.log(item);
                if(window.disposal){
                    // 去详情
                    if(item.OrderType!=4){
                        let sendAndRoid={
                            OrderType:item.OrderType,
                            WorkOrderId:item.WorkOrderId,
                            WorkOrderNo:item.WorkOrderNo,
                            OrderStatus:item.OrderStatus,
                            step:0
                        }
                        sendAndRoid=JSON.stringify(sendAndRoid);
                        window.disposal.maintenance(sendAndRoid)
                    }
                    if(item.SheshiId && item.OrderType==4){
                        this.$router.push({
                            path:'/inspectionSubject',
                            query:{
                                sheshiid:item.SheshiId,
                                sheshiname:item.SheshiName,
                                RelateId:item.RelateId||this.getRelateId,
                                WorkOrderId:item.WorkOrderId
                            }
                        })
                    }
                    if(!item.SheshiId && item.OrderType==4){
                        //设施页
                        this.$router.push({
                            path:'/selectSheshi',
                            query:{
                                RelateId:item.RelateId||this.getRelateId,
                                WorkOrderId:item.WorkOrderId
                            }
                        })
                    }
                }else{
                    if(item.SheshiId && item.OrderType==4){
                        this.$router.push({
                            path:'/inspectionSubject',
                            query:{
                                sheshiid:item.SheshiId,
                                sheshiname:item.SheshiName,
                                RelateId:item.RelateId||this.getRelateId,
                                WorkOrderId:item.WorkOrderId
                            }
                        })
                    }
                    if(!item.SheshiId && item.OrderType==4){
                        //设施页
                        this.$router.push({
                            path:'/selectSheshi',
                            query:{
                                RelateId:item.RelateId||this.getRelateId,
                                WorkOrderId:item.WorkOrderId
                            }
                        })
                    }
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
            this.getData()
            this.getRelateIdFn()
            this.renWuJiaoBiao()
            this.xiaoxiJiaoBiao()
        },
    }
</script>
<style scoped>
    .wrapper{
        top:0!important;
        bottom:1.2rem!important;
    }
</style>
