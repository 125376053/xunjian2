<template>
    <div style="overflow: hidden;">

        <HeaderNav :title="title"></HeaderNav>

        <ul class="tab centerFlex" style="margin-top:.89rem;">
            <li @click="tabSendAjax(0)" :class="{curLi:0==activeIndex}">全部</li>
            <li @click="tabSendAjax(1)" :class="{curLi:1==activeIndex}">待处理</li>
            <li @click="tabSendAjax(2)" :class="{curLi:2==activeIndex}">处理中</li>
            <li @click="tabSendAjax(3)" :class="{curLi:3==activeIndex}">已处理</li>
        </ul>

        <div class="overAuto" style="top:2.3rem!important;">

            <div class="tabContent">

                <ul class="jianceList xunchaList">

                    <BetterScroll class="wrapper" ref="scroll" :data="wentiList" :pullUpLoad="pullUpLoad" @pullingUp="onPullingUp">
                        <router-link tag="li" :key="index" v-for="(item,index) in wentiList" :to="{
                            path:'/xunchaWenTiDetail',
                            query:{
                                WorkOrderId:item.WorkOrderId,
                                step:0,
                                //pTab:activeIndex
                            }
                        }" class="current">
                            <div class="top">
                                <p class="title ellipse" style="color:#393939;">{{item.OrderRemark}}</p>
                                <div class="xunchaCenter" style="color:#393939;">
                                    <span class="ellipse">{{item.ProblemTypeName}}</span>
                                    <span>丨</span>
                                    <span class="ellipse">{{item.Address}}</span>
                                </div>
                            </div>
                            <div class="bottom JustifyFlex">
                                <p>{{item.OrderStatus==3?item.DealTime:item.ReportTime}}</p>
                            </div>
                            <div class="jinji" :class="'jinji'+item.Emergency">{{jinji(item)}}</div>
                            <div class="chuliIcon">
                                <img :src="imgsType[item.OrderStatus]" alt="">
                            </div>
                        </router-link>

                    </BetterScroll>


                </ul>
            </div>

        </div>

        <!--:XunchaLength="XunchaLength"-->
        <FooterNav :MessageLength="messageNum" :MyLength="renwuNum" >

        </FooterNav>

    </div>
</template>
<script>
    import {mapState,mapGetters, mapActions} from 'vuex'
    import Header from "../components/Header.vue"
    import Footer from "../components/Footer.vue"
    import BetterScroll from '../components/BetterScrollSlot'
    export default{
        name:'xuchaManage',
        components:{
            HeaderNav:Header,
            FooterNav:Footer,
            BetterScroll
        },
        data(){
            return{
                title:'巡检问题管理',
                activeIndex: this.$route.query.step || 0,//默认为0
                imgsType:[
                    '',
                    'static/images/dchuli.jpg', // 待处理
                    'static/images/chulic.jpg', // 处理中
                    'static/images/ychuli.jpg'  // 已处理
                ],
                wentiList:[], //问题列表
                pullUpLoad:true,
                pageInfo:{},
                pageIndex:1,
                pageSize: 10,
                XunchaLength:0, //角标显示未认领的消息长度
                renwuNum:window.localStorage.getItem('renwuNum')||0,
                messageNum:window.localStorage.getItem('messageNum')||0
            }
        },
        watch: {
            '$route'(){
                //路由改变时时刷新
                this.activeIndex = this.$route.query.step;

                //重置页码
                this.pageIndex=1;
                //重置状态码
                if(this.activeIndex==0){
                    this.orderStatus=0
                }
                if(this.activeIndex==1){
                    this.orderStatus=1
                }
                if(this.activeIndex==2){
                    this.orderStatus=2
                }
                if(this.activeIndex==3){
                    this.orderStatus=3
                }

                //重置列表
                this.wentiList=[];
                //重新发起请求
                this.getData()
            }
        },
        computed:{
            ...mapGetters([
                'user',
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
            },
            status(item){
                return (item)=>{
                    if(item.OrderStatus==0){
                        return '全部'
                    }
                    if(item.OrderStatus==1){
                        return '待处理'
                    }
                    if(item.OrderStatus==2){
                        return '处理中'
                    }
                    if(item.OrderStatus==3){
                        return '已处理'
                    }
                }
            },
            wentiListFilter(){
                if(this.activeIndex==0){
                    return this.wentiList;
                }else if(this.activeIndex==1){
                    return this.wentiList.filter((item)=>{
                        return item.OrderStatus==1
                    })
                }else if(this.activeIndex==2){
                    return this.wentiList.filter((item)=>{
                        return item.OrderStatus==2
                    })
                }else if(this.activeIndex==3){
                    return this.wentiList.filter((item)=>{
                        return item.OrderStatus==3
                    })
                }
            }
        },
        methods:{
            //选项卡处理
            tabSendAjax(index){
                this.activeIndex = index;

                //重置页码
                this.pageIndex=1;
                //重置状态码
                if(index==0){
                    this.orderStatus=0
                }
                if(index==1){
                    this.orderStatus=1
                }
                if(index==2){
                    this.orderStatus=2
                }
                if(index==3){
                    this.orderStatus=3
                }

                //重置列表
                this.wentiList=[];
                //重新发起请求
                //this.getData()
                //重置路由
                this.$router.replace({
                    path: '/xunchaManage',
                    query: {
                        OrderType: this.$route.query.OrderType,
                        WorkOrderId: this.$route.query.WorkOrderId,
                        WorkOrderNo: this.$route.query.WorkOrderNo,
                        step: index
                    }
                })
            },
            getData(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl+'/api/WorkOrder/GetItemListMyQuestion?pageindex='+this.pageIndex+'&pagesize='+this.pageSize+'&ticket='+this.user.ticket+'&OrderStatus='+this.orderStatus).then((d) => {
                    this.$indicator.close();
                    if(d.status==200){
                        if(d.data.IsError>0){
                            this.$toast(d.StatusMsg)
                        }else{
                            this.wentiList=this.wentiList.concat(d.data.Model.DataList||[]);
                            this.XunchaLength=this.wentiList.length||0;
                            this.pageInfo=d.data.Model.PageInfo||[];
                        }
                    }else{
                        //this.$toast(d.statusText)
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(e)
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


            //重置状态码
            if(this.activeIndex==0){
                this.orderStatus=0
            }
            if(this.activeIndex==1){
                this.orderStatus=1
            }
            if(this.activeIndex==2){
                this.orderStatus=2
            }
            if(this.activeIndex==3){
                this.orderStatus=3
            }

            this.getData()
            this.renWuJiaoBiao()
            this.xiaoxiJiaoBiao()
        }
    }
</script>
