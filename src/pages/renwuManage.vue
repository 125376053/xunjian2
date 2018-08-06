<template>
    <div>

        <HeaderNav :title="title"></HeaderNav>
        <div class="overAuto2" style="top: .89rem;">

            <ul class="tab centerFlex" style="">
                <li @click="tabSendAjax(0)" :class="{curLi:0==activeIndex}">全部</li>
                <li @click="tabSendAjax(1)" :class="{curLi:1==activeIndex}">处理中</li>
                <li @click="tabSendAjax(2)" :class="{curLi:2==activeIndex}">已处理</li>
            </ul>

            <div class="tabContent">

                <ul class="jianceList xunchaList">

                    <BetterScroll class="wrapper" ref="scroll"
                                  :data="renwuList"
                                  :pullUpLoad="pullUpLoad"
                                  @pullingUp="onPullingUp"
                                  style="top:1.5rem!important;">
                        <li :id="item.WorkOrderId" :index="index" :key="index" v-for="(item,index) in renwuList"
                            @click="gotoXq(index,item)">
                            <div class="top">
                                <p class="title ellipse">{{item.OrderRemark}}</p>
                                <div class="xunchaCenter">
                                    <span>
                                        {{item.OrderType == 1 ? '系统报警' : item.OrderType == 2 ? '设备养护' : item.ProblemTypeName}}
                                    </span>
                                    <span>丨</span>
                                    <span>{{item.Address}}</span>
                                </div>
                            </div>
                            <div class="bottom JustifyFlex">
                                <!--<p>{{noSecond(item.ReportTime)}}</p>-->
                                <p>{{item.OrderStatus==3?item.DealTime:item.ReportTime}}</p>
                            </div>
                            <div v-if="item.OrderType==3" class="jinji" :class="'jinji'+item.Emergency">
                                {{jinji(item)}}

                            </div>
                            <div class="chuliIcon">
                                <img :src="imgsType[item.OrderStatus-1]" alt="">
                            </div>
                        </li>
                    </BetterScroll>
                </ul>
            </div>

        </div>
    </div>
</template>
<script>
    import BetterScroll from '../components/BetterScrollSlot'
    import Header from "../components/Header.vue"
    import {mapState, mapGetters, mapActions} from 'vuex'
    export default{
        name: 'renwuManage',
        components: {
            HeaderNav: Header,
            BetterScroll
        },
        data(){
            return {
                activeIndex: this.$route.query.step || 0,//默认为0 表示状态的话+1
                title: '任务管理',
                imgsType: [
                    '',
                    'static/images/chulic.jpg', // 处理中
                    'static/images/ychuli.jpg'  // 已处理
                ],
                renwuList: [],
                orderStatus: this.$route.query.step || 0,
                noList: [],
                yesList: [],
                pullUpLoad: true,
                pageInfo: {},
                pageIndex: 1,
                pageSize: 10,
                renwuLength: 0, //角标显示未认领的消息长度
            }
        },
        watch: {
            '$route'(){
                //路由改变时时刷新
                this.activeIndex = this.$route.query.step;
                //重置页码
                this.pageIndex = 1;
                //重置状态码
                if (this.activeIndex == 0) {
                    this.orderStatus = 0
                }
                if (this.activeIndex == 1) {
                    this.orderStatus = 2
                }
                if (this.activeIndex == 2) {
                    this.orderStatus = 3
                }
                //重置列表
                this.renwuList = [];
                //重新发起请求 路由监控发起请求 事件内部点击不请求数据 而是改变路由地址 进而watch触发到这里
                this.getData()
            }
        },
        computed: {
            jinji(item){
                return (item) => {
                    if (item.Emergency == 1) {
                        return "不急"
                    }
                    if (item.Emergency == 2) {
                        return "一般"
                    }
                    if (item.Emergency == 3) {
                        return "紧急"
                    }
                    if (item.Emergency == 4) {
                        return "非常紧急"
                    }
                }
            },
            renwuListFilter(){
                if (this.activeIndex == 0) {
                    return this.renwuList;
                } else if (this.activeIndex == 1) {
                    return this.renwuList.filter((item) => {
                        return item.OrderStatus == 2
                    })
                } else if (this.activeIndex == 2) {
                    return this.renwuList.filter((item) => {
                        return item.OrderStatus == 3
                    })
                }
            },
            ...mapGetters([
                'user'
            ])
        },
        methods: {
            //选项卡处理
            tabSendAjax(index){

                this.activeIndex = index;

                //重置页码
                this.pageIndex = 1;
                //重置状态码
                if (index == 0) {
                    this.orderStatus = 0
                }
                if (index == 1) {
                    this.orderStatus = 2
                }
                if (index == 2) {
                    this.orderStatus = 3
                }

                //重置列表
                this.renwuList = [];
                //重新发起请求
                //this.getData()
                //重置路由
                this.$router.replace({
                    path: '/renwuManage',
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
                this.$http.get(this.baseUrl + '/api/WorkOrder/GetItemListMyTask?pageindex=' + this.pageIndex + '&pagesize=' + this.pageSize + '&OrderStatus=' + this.orderStatus + '&ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();
                    if (d.status == 200) {
                        if (d.data.IsError > 0) {
                            this.$toast(d.StatusMsg)
                        } else {
                            this.renwuList = this.renwuList.concat(d.data.Model.DataList || []);
                            this.pageInfo = d.data.Model.PageInfo || [];

                        }
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            //下拉加载数据
            onPullingUp () {
                //如果还有下一页
                if (this.pageInfo.PageCount > this.pageIndex) {
                    this.pageIndex++;
                    this.getData()
                } else {
                    //如果没有新数据
                    this.$refs.scroll.forceUpdate()
                }
            },
            gotoXq(index, item){

                if (window.disposal) {
                    /*if(item.OrderStatus==2){
                        let sendAndRoid = {
                            OrderType: item.OrderType,
                            WorkOrderId: item.WorkOrderId,
                            WorkOrderNo: item.WorkOrderNo,
                            OrderStatus:item.OrderStatus,
                            step: 0
                        }
                        sendAndRoid = JSON.stringify(sendAndRoid);
                        window.disposal.maintenance(sendAndRoid)
                    }else{
                        //已处置 进入处置展示页面
                        this.$router.push({
                            path: '/chuzhiShow',
                            query: {
                                OrderType: item.OrderType,
                                WorkOrderId: item.WorkOrderId,
                                WorkOrderNo: item.WorkOrderNo
                            }
                        })
                    }*/
                    let sendAndRoid = {
                        OrderType: item.OrderType,
                        WorkOrderId: item.WorkOrderId,
                        WorkOrderNo: item.WorkOrderNo,
                        OrderStatus:item.OrderStatus,
                        step: 0
                    }
                    sendAndRoid = JSON.stringify(sendAndRoid);
                    window.disposal.maintenance(sendAndRoid)
                }else{
                    this.$router.push({
                        path: '/messageDetail',
                        query: {
                            OrderType: item.OrderType,
                            WorkOrderId: item.WorkOrderId,
                            WorkOrderNo: item.WorkOrderNo,
                            step: 0
                        }
                    })
                }
            }
        },
        mounted(){

            //重置状态码
            if (this.activeIndex == 0) {
                this.orderStatus = 0
            }
            if (this.activeIndex == 1) {
                this.orderStatus = 2
            }
            if (this.activeIndex == 2) {
                this.orderStatus = 3
            }

            this.getData()
        }
    }
</script>
<style>

</style>
