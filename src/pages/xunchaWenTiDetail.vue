<template>
    <div style="overflow: hidden;">

        <HeaderNav :title="title"></HeaderNav>

        <ul class="tab centerFlex" style="margin-top:.89rem;">
            <li v-for="(item,index) in tabData" :class="{curLi:index==activeIndex}" @click="tabSendAjax(item,index)">
                {{item}}


            </li>
        </ul>

        <div class="overAuto2" ref="fanhuiTop" style="top:2.1rem;">

            <!--详情-->
            <div class="tabContent" v-show="activeIndex==0?true:false">
                <div class="gd1">
                    <p>
                        <strong>类型</strong>
                        <span>{{detailData.ProblemTypeName}}</span>
                    </p>
                    <p>
                        <strong>状态</strong>
                        <span>{{detailData.OrderStatus == 1 ? '待处理' : detailData.OrderStatus == 2 ? '处理中' : detailData.OrderStatus == 3 ? '已处理' : ''}}</span>
                    </p>
                    <p>
                        <strong>紧急程度</strong>
                        <span class="text">
                            {{detailData.Emergency == 1 ? '不急' : detailData.Emergency == 2 ? '一般' : detailData.Emergency == 3 ? '紧急' : '非常紧急'}}
                        </span>
                    </p>
                    <p>
                        <strong>位置</strong>
                        <span>{{detailData.Address}}</span>
                    </p>
                </div>

                <!--地图组件-->
                <div class="map" v-if="activeIndex==0">
                    <div id="container" style="width:90%;margin:0 auto;height:3rem;"></div>
                </div>


                <div class="gd1">
                    <p>
                        <strong>问题描述</strong>
                        <span class="ellipse">{{detailData.OrderRemark}}</span>
                    </p>
                    <p>
                        <strong>上报时间</strong>
                        <span>{{detailData.ReportTime}}</span>
                    </p>
                    <p>
                        <strong>上报人</strong>
                        <span>{{detailData.ReportTrueName}}</span>
                    </p>
                    <p>
                        <strong>所属单位</strong>
                        <span>{{detailData.DepartmentName}}</span>
                    </p>

                    <!--待处理的时候不显示  1-->
                    <!--处理中的时候显示 2 -->
                    <!--已处理 detailData.OrderStatus  3-->
                    <div v-if="detailData.OrderStatus==2 || detailData.OrderStatus==3">
                        <p>
                            <strong>派单人</strong>
                            <span>{{detailData.DistributeUser}}</span>
                        </p>
                        <p>
                            <strong>派单时间</strong>
                            <span>{{detailData.DistributeTime}}</span>
                        </p>
                        <p>
                            <strong>认领人</strong>
                            <span :id="detailData.ConfirmUserId">
                            {{detailData.ConfirmTrueName}}
                        </span>
                        </p>
                        <p>
                            <strong>认领时间</strong>
                            <span>{{detailData.CreateTime}}</span>
                        </p>
                    </div>

                </div>
            </div>

            <!--照片-->
            <div class="tabContent" v-show="activeIndex==1?true:false">
                <div class="gd2" v-if="imgsList.length>0">
                    <p>现场状况:</p>
                    <ImgSlide :imgsLi="imgsList"></ImgSlide>
                </div>
                <div v-else class="noIMG" style="background:#f0f2f5;">
                    <img src="static/images/noData.jpg" alt="">
                </div>
            </div>

            <!--问题处置 只有状态为3才显示图片-->
            <div class="tabContent" v-show="activeIndex==2?true:false">
                <!--待处理,处理中的选项卡下 点击问题处置显示暂无数据  只有已处理才显示-->
                <div class="gd2" v-if="detailData.OrderStatus==3">
                    <p>
                        <strong>问题描述</strong>
                        <span>{{detailData.OrderRemark}}</span>
                    </p>
                    <p>
                        <strong>处置时间</strong>
                        <span>{{detailData.DealTime}}</span>
                    </p>
                    <p>
                        <strong>处置人员</strong>
                        <span>{{detailData.ConfirmTrueName}}</span>
                    </p>
                    <p>
                        <strong>处理方案</strong>
                        <span>{{detailData.DealRemarkable}}</span>
                    </p>
                    <p>
                        <strong>图片拍摄</strong>
                        <span>(选填，最多四张)</span>
                    </p>

                    <div class="gd2" v-if="imgsList2.length>0">
                        <ImgSlide :imgsLi="imgsList2"></ImgSlide>
                    </div>
                    <div v-else class="noIMG" style="background:#f0f2f5;">
                        <img src="static/images/noData.jpg" alt="">
                    </div>
                </div>
                <div v-else class="notData" style="margin-top: 0px;">
                    <img src="static/images/noData.png" alt="">
                </div>

            </div>

            <!--处置记录-->
            <div class="tabContent chuzhiJilu" v-show="activeIndex==3?true:false">

                <ul v-if="gongDanJiLuList.length>0">
                    <li v-for="(item,index) in gongDanJiLuList" style="padding-top:.1rem;">
                        <span>【{{item.TrueName}}】</span>
                        <span>{{item.CreateTime}}</span>
                        <b>{{item.Remark}}</b>
                        <img :src="suoImgs[item.LogTypeId-1]" alt="">
                    </li>
                </ul>

                <!--暂无数据-->
                <div class="notData" v-if="gongDanJiLuList.length<=0">
                    <img src="static/images/noData.png" alt="">
                </div>

                <!--返回顶部-->
                <div v-if="gongDanJiLuList.length>0" class="returnFixed" @click.stop="returnTop">
                    <img src="static/images/fanhui.gif" alt="">
                </div>

            </div>

        </div>

    </div>
</template>
<script>
    /*
     * v-show解决异步保存 频繁切换选项卡取不到数据等问题
     * */
    import Header from "../components/Header.vue"
    import ImgSlide from "../components/ImgSlide.vue"
    import {mapState, mapGetters, mapActions} from 'vuex'
    export default{
        components: {
            HeaderNav: Header,
            ImgSlide
        },
        data(){
            return {
                title: '问题详情',
                activeIndex: this.$route.query.step || 0, //默认显示第一个  刷新根据step定位是哪个选项卡显示
                //ptab:this.$route.query.pTab||0,
                tabData: ['问题详情', '现场照片', '问题处置', '处置记录'],
                id: this.$route.query.WorkOrderId || 0, //id
                detailData: {}, //报警详情对象
                renLingFlag: true,//认领按钮控制
                jingdu: 0,
                weidu: 0,
                firstFlag: false,
                imgsList: [],//现场照片
                imgsList2: [],//处置照片
                gongDanJiLuList: [],
                suoImgs:['static/images/suo1.png','static/images/suo2.png','static/images/suo3.png','static/images/suo4.png','static/images/suo5.png'], //处置记录锁图标
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        methods: {
            //选项卡切换
            tabSendAjax(item, index){
                this.activeIndex = index;
                //增加定位路由参数 step
                this.$router.replace({
                    path: '/xunchaWenTiDetail',
                    query: {
                        WorkOrderId: this.id,
                        step: index
                    }
                })

                //切换选项卡重新发起请求 解决v-lazy不能加载图片问题
                this.imgsList = []//现场照片
                this.imgsList2 = []//处置照片
                this.getData();
            },
            //问题详情
            getData(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/WorkOrder/GetItem?id=' + this.id + '&ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();
                    if (d.status === 200) {
                        if (d.data.IsError > 0) {
                            this.$toast(d.data.StatusMsg);
                            return false;
                        } else {
                            this.detailData = d.data.Model || null;
                            this.jingdu = this.detailData.JingDu;
                            this.weidu = this.detailData.WeiDu;

                            //现场照片用2222222
                            let imgs = []
                            if (this.detailData.Picture2) {
                                imgs = this.detailData.Picture2.split(',');
                                imgs.forEach((item, index) => {
                                    let url = this.baseUrl + item;
                                    if (item.length == 0) {
                                        return
                                    } else {
                                        this.imgsList.push(url)
                                    }
                                })
                            }
                            //处置用1111111111111
                            let imgs2 = []
                            if (this.detailData.Picture1) {
                                imgs2 = this.detailData.Picture1.split(',');
                                imgs2.forEach((item, index) => {
                                    let url = this.baseUrl + item;
                                    if (item.length == 0) {
                                        return
                                    } else {
                                        this.imgsList2.push(url)
                                    }
                                })
                            }

                            this.getMap()
                        }
                    } else {

                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            getMap(){
                var lnglatXY = [this.jingdu, this.weidu]; //已知点坐标
                //console.log(lnglatXY);
                let map = new AMap.Map("container", {
                    //resizeEnable: true,
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
            //返回顶部
            returnTop(){
                this.$refs.fanhuiTop.scrollTop = 0 + 'px'
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

                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            }
        },
        mounted(){
            this.getData()
            this.gongDanJilu()
        }
    }
</script>
<style>

</style>
