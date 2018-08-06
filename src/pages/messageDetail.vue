<template>
    <div style="overflow: hidden;">
        <!--详情页动态组件 1报警 2养护 3工单-->
        <component :is="whoDetail" :detailData="detailData" :gongDanJiLuList="gongDanJiLuList">

        </component>
        <!--<baojing v-if="this.$route.query.OrderType == 1" :detailData="detailData" :gongDanJiLuList="gongDanJiLuList"></baojing>
        <yanghu v-if="this.$route.query.OrderType == 2" :detailData="detailData" :gongDanJiLuList="gongDanJiLuList"></yanghu>
        <gongdan v-if="this.$route.query.OrderType == 3" :detailData="detailData" :gongDanJiLuList="gongDanJiLuList"></gongdan>-->
    </div>
</template>

<script>
    import baojing from "../components/baoJing.vue";
    import yanghu from "../components/yanghu.vue";
    import gongdan from "../components/gongdan.vue";
    import index from "../pages/Index.vue";
    import {mapState,mapGetters,mapActions} from 'vuex';
    export default{
        name: '',
        data(){
            return {
                id: this.$route.query.WorkOrderId || 0,
                //nextId:this.$route.query.WorkOrderId || 0,
                detailData: {}, //工单详情 报警详情 养护详情 现场照片数据
                gongDanJiLuList: [] //工单记录
            }
        },
        computed: {
            whoDetail(){
                if (this.$route.query.OrderType == 1) {
                    return baojing
                } else if (this.$route.query.OrderType == 2) {
                    return yanghu
                } else if (this.$route.query.OrderType == 3) {
                    return gongdan
                }
            },
            ...mapGetters([
                'user'
            ]),
        },
        methods: {
            //详情
            getData(){
                this.$indicator.open('加载中...');
                /*this.$http.get(this.baseUrl + '/api/WorkOrder/GetItem?id='+this.id+'&nextId='+this.nextId+'&ticket='+this.ticket).then((d)=>{*/
                this.$http.get(this.baseUrl + '/api/WorkOrder/GetItem?id='+this.id+'&ticket='+this.user.ticket).then((d)=>{
                    this.$indicator.close();
                    if (d.status === 200) {
                        if (d.data.IsError > 0) {
                            this.$toast(d.data.StatusMsg);
                            return false;
                        } else {
                            this.detailData = d.data.Model || null;

                            //回调给安卓
                            if (window.order) {
                                window.order.setOrderStatus(this.detailData.OrderStatus);
                            }
                        }
                    } else {
                        //404
                        //this.$toast(d.statusText);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(e)
                })
            },
            //认领
            gongDanGetDataAndStep(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/WorkOrder/ClaimOrder?orderId=' + this.id + '&ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();

                    if (d.status === 200) {
                        if (d.data.IsError > 0) {
                            this.$toast(d.data.StatusMsg);
                            return false;
                        } else {
                            if (window.order) {
                                window.order.setOrderStatus(d.data.Model);
                            }
                            this.$toast('认领成功');
                            //this.$store.dispatch('renwuNum2',1);
                            //this.$store.dispatch('messageNum2',1);
                            //认领成功后更新状态 vue前后对比模板 发现数据和之前传递的不一样 就更新视图
                            //this.detailData.OrderStatus=d.data.Model;
                            this.getData()

                        }
                    } else {
                        //404
                        //this.$toast(d.statusText);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(e)
                })
            },
            //记录
            gongDanJilu(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/WorkOrderLog/GetItemList?workOrderId=' + this.id + '&ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();
                    if (d.status === 200) {
                        if (d.data.IsError > 0) {
                            this.$toast(d.data.StatusMsg);
                            return false;
                        } else {
                            this.gongDanJiLuList = d.data.Model || [];

                        }
                    } else {
                        //404
                        //this.$toast(d.statusText);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(e)
                })
            }
        },
        mounted(){
            this.getData()
            //父组件接受子组件点击认领发起的请求数据
            this.busEvent.$on('gongdanRenLiang', () => {
                this.gongDanGetDataAndStep()
                //this.getData()
            })
            //记录
            this.gongDanJilu()

            this.show=false;
        }
    }
</script>

<style>

</style>
