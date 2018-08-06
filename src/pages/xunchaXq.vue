<template>
    <div>

        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto2" style="background: #fff;">

            <!--详情-->
            <div class="tabContent">

                <div class="gd1">

                    <p class="xiaoLine">
                        <strong>任务描述</strong>
                        <span>{{detailData.XunChaRemark}}</span>
                    </p>
                    <p>
                        <strong>巡查时间</strong>
                        <span>{{detailData.CreateTime}}</span>
                    </p>
                    <p>
                        <strong>巡查位置</strong>
                        <span>{{detailData.Address}}</span>
                    </p>

                </div>

                <!--地图组件-->
                <div class="map">
                    <div id="container" style="width:90%;margin:0 auto;height:3rem;"></div>
                </div>

                <div class="gd2">
                    <p style="margin-left:.2rem;">
                        <strong style="text-align: left; width: auto;">图片</strong>
                        <span>(最多四张)</span>
                    </p>
                    <ul class="">
                        <div v-if="imgsList.length>0">
                            <ImgSlide :imgsLi="imgsList"></ImgSlide>
                        </div>
                        <div v-else class="noIMG" style="background:#f0f2f5;">
                            <img src="static/images/noData.jpg" alt="">
                        </div>
                    </ul>
                </div>

            </div>

        </div>

        <FooterNav :MessageLength="messageNum" :MyLength="renwuNum"></FooterNav>

    </div>
</template>

<script>
    import Header from "../components/Header.vue"
    import Footer from "../components/Footer.vue"
    import ImgSlide from "../components/ImgSlide.vue"
    import {mapState,mapGetters,mapActions} from 'vuex'
    export default{
        name: '',
        data(){
            return {
                title:'巡查详情',
                id: this.$route.query.id || 0, //巡查列表的id
                detailData:{}, //巡查详情
                jingdu: 0,
                weidu: 0,
                imgsList:[],
                renwuNum:window.localStorage.getItem('renwuNum')||0,
                messageNum:window.localStorage.getItem('messageNum')||0
            }
        },
        components:{
            HeaderNav:Header,
            FooterNav:Footer,
            ImgSlide
        },
        computed:{
            ...mapGetters([
                'user'
            ])
        },
        methods:{
            getData(){
                //api/XunCha/GetItem
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/XunCha/GetItem?id=' + this.id+'&ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();
                    if (d.status === 200) {
                        if (d.data.IsError > 0) {
                            this.$toast(d.data.StatusMsg);
                            return false;
                        } else {
                            this.detailData = d.data.Model || null;
                            this.jingdu=this.detailData.JingDu;
                            this.weidu=this.detailData.WeiDu;
                            this.getMap()

                            let imgs=[];
                            if(this.detailData.Picture1){
                                imgs=this.detailData.Picture1.split(',');
                                imgs.forEach((item,index)=>{
                                    let url=this.baseUrl+item;
                                    if(item.length==0){
                                        return
                                    }else{
                                        this.imgsList.push(url)
                                    }
                                })
                            }
                        }
                    } else {
                        //404
                        //this.$toast(d.statusText);
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(d.data.statusText)
                })
            },
            getMap(){

                var lnglatXY = [this.jingdu, this.weidu]; //已知点坐标

                let map = new AMap.Map("container", {
                    resizeEnable: true,
                    zoom: 11,
                    center: lnglatXY
                });
                let geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                geocoder.getAddress(lnglatXY, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        let adress = result.regeocode.formattedAddress;

                    }
                });
                let marker = new AMap.Marker({  //加点
                    map: map,
                    position: lnglatXY
                });
                map.setFitView();
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
            this.renWuJiaoBiao()
            this.xiaoxiJiaoBiao()
        },
        activated(){
           /* this.imgsList=[];//对于push的要清空 缓存组件后 只会执行这里 其他的配置都不会执行 所以必须重新初始化
            this.id=this.$route.query.id || 0;
            this.getData()*/
        }
    }
</script>

<style>

</style>
