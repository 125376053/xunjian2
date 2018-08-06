<template>
    <div>

        <HeaderNav :title="title" :isShowRe="isShowRe"></HeaderNav>

        <div class="indexWrap">
            <div class="index_top">
                <router-link tag="p" :to="{path:'/jianShe'}">
                    <img src="static/images/weihu1.png" alt="">
                    <span>建设情况</span>
                </router-link>

                <router-link tag="p" :to="{path:'/yunxing'}">
                    <img src="static/images/weihu2.png" alt="">
                    <span>运行情况</span>
                </router-link>

                <router-link class="xiaoxiListWrap" tag="p" :to="{path:'/renwuManage?step=1'}">
                    <img src="static/images/weihu3.png" alt="">
                    <span>待办任务</span>
                    <i class="xiaoxiList1">{{renwuNum}}</i>
                </router-link>

                <router-link tag="p" :to="{path:'/jiance'}">
                    <img src="static/images/weihu4.png" alt="">
                    <span>实时监测</span>
                </router-link>
            </div>

            <div class="jianshe">
                <p class="jianshe_top">
                    <span class="shuIcon"></span>
                    <b>建设情况</b>
                </p>
                <div class="jianshe_bottom">
                    <router-link class="JustifyFlex" :to="{path:'/jianShe'}">
                        <!--<p class="JustifyCenter">
                            <span>{{jianSheObj.totoalmianji}}</span>
                            <i>项目规模</i>
                        </p>
                        <p class="JustifyCenter">
                            <span>{{jianSheObj.totoalcount}}</span>
                            <i>安装设备数量</i>
                        </p>-->
                        <div class="index_text">
                            <b>{{jianSheObj.totoalmianji}}</b>
                            <span>项目规模</span>
                        </div>
                        <div class="index_text">
                            <b>{{jianSheObj.totoalcount}}</b>
                            <span>安装设备数量</span>
                        </div>
                    </router-link>
                </div>
            </div>

            <div class="jianshe jiansheNomargin">
                <p class="jianshe_top">
                    <span class="shuIcon"></span>
                    <b>运行情况</b>
                </p>
                <div class="yunZhuan">
                    <router-link class="yunxingLink JustifyFlex" :to="{path:'/yunxing'}">
                        <div class="p1">
                            <p class="number">{{yunXingObj.Normal}}</p>
                            <p class="text">正常设备</p>
                        </div>

                        <div class="yunzhuanlv">
                            <p id="tijiaoProcess1">
                                <span>{{normalScale}}%</span>
                            </p>
                            <p class="huanText">正常运转率</p>
                        </div>

                        <!--<div class="wrap1">
                            <div class="circle">
                                <div class="percent left" style="transform: rotate(108deg);"></div>
                                <div class="percent right wth0"></div>
                            </div>
                            <div class="num">
                                <div class="numWrap">
                                    <p>
                                        <span class="baifenbi">2.15</span><span class="baifenbi2">%</span>
                                    </p>
                                </div>
                                <p class="huanText">正常运转率</p>
                            </div>
                        </div>-->

                        <div class="p1">
                            <p class="number">{{yunXingObj.Trouble}}</p>
                            <p class="text">故障设备</p>
                        </div>
                    </router-link>
                </div>
            </div>

        </div>

        <FooterNav :MessageLength="messageNum" :MyLength="renwuNum"></FooterNav>

    </div>
</template>
<script>

    import {mapState, mapGetters, mapActions} from 'vuex'
    import Header from "../components/Header.vue"
    import Footer from "../components/Footer.vue"
    export default{
        components: {
            HeaderNav: Header,
            FooterNav: Footer
        },
        data(){
            return {
                title: '首页',
                isShowRe: true,
                jianSheObj: {},
                yunXingObj: {},
                normalScale: 0,
                renwuNum: 0,
                messageNum: 0
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        beforeRouteEnter(to,from,next){
            next(vm => {

            })
        },
        mounted(){
            this.jianSheData()
            this.yunXingData()
            this.renWuJiaoBiao()
            this.xiaoxiJiaoBiao()

        },
        methods: {
            jianSheData(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/Sheshi/JianSheQingkuang?ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        this.jianSheObj = data.Model || null;
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            yunXingData(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/Sheshi/YunxingQingKuang?ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        this.yunXingObj = data.Model || null;
                        this.normalScale = ((this.yunXingObj.Normal / this.yunXingObj.TotalCount)*100).toFixed(2)
                        this.huan()
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            huan(){
                var scale = document.documentElement.clientWidth / 750 * 100;
                let lv = this.normalScale;
                let color = 'aee3fb';
                if (lv > 0) {
                    color = '#4aff6e'
                } else {
                    color = 'aee3fb';
                }
                $("#tijiaoProcess1").radialIndicator({
                    radius: scale,
                    barColor: color,
                    barBgColor: '#aee3fb',
                    barWidth: 7,
                    initValue:lv,
                    roundCorner: true,
                    percentage: true,
                    fontSize: 22,
                    fontColor: '#fff',
                    minValue: 0, //圆形指示器的最小值。
                    maxValue: 100,
                    displayNumber: false,
                    format: function (lv) {
                        return value.toFixed(2);
                    }
                })
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
                        window.localStorage.setItem('renwuNum',this.renwuNum);
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
                        window.localStorage.setItem('messageNum',this.messageNum);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    this.messageNum = 0
                })
            }
        }
    }
</script>
<style scoped>
    .index_text{width:3.35rem;height:1.3rem;background:#3eaeff;border-radius:5px;color:#fff;text-align:center;}
    .index_text b{ display: block; font-size:.5rem;line-height:0;margin-top:.5rem; /*border-bottom: 1px solid red;*/}
    .index_text span{ display: block; font-size:.28rem;line-height:0;margin-top:.5rem;/*border-bottom: 1px solid green;*/}
    #tijiaoProcess1{ position: relative;}
    #tijiaoProcess1 span{font-size: .55rem; position: absolute;left:0;right:0;
        text-align: center; top:0;bottom:0;margin-top: .7rem;
    }

    /*.yunxingLink{
        position: relative;
    }
    .wrap1,.circle,.percent{
        position: absolute;
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 50%;
    }
    .wrap1{
        top:.3rem;
        left:2.2rem;
        background-color: #aee3fb;
    }
    .wrap1 .circle{
        box-sizing: border-box;
        border:5px solid #4aff6e;
        clip:rect(0,2.4rem,2.4rem,1.2rem);
        background: none;
    }
    .wrap1 .clip-auto{
        clip:rect(auto, auto, auto, auto);
    }
    .wrap1 .percent{
        box-sizing: border-box;
        top:-.2rem;
        left:-.2rem;
    }
    .wrap1 .left{
        transition:transform ease;
        border:5px solid #eee;
        clip: rect(0,1.2rem,2.4rem,0);
    }
    .wrap1 .right{
        border:5px solid #eee;
        clip: rect(0,2.4rem,2.4rem,1.2rem);
    }
    .wrap1 .wth0{
        width:0;
    }
    .wrap1 .num{
        position: absolute;
        box-sizing: border-box;
        width: 2rem;
        height: 2rem;
        text-align: center;
        left:.2rem;
        top:.2rem;
        border-radius:50%;
        background:#3eaeff;
        z-index: 1;
        font-size:.32rem;
        color:#5d5d5d;
        line-height:20px;
    }
    .wrap1 i{font-style: normal}
    .wrap1 .numWrap{margin-top:.5rem;}
    .wrap1 .baifenbi,.wrap1 .baifenbi2{font-size:.55rem;color:#fff;}*/
</style>
