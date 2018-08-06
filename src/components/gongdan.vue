<template>
    <div style="overflow: hidden;">
        <!--<HeaderNav ref="header" :title="title"></HeaderNav>-->

        <!--<ul class="tab centerFlex" style="margin-top:.89rem!important;">
            <li v-for="(item,index) in tabData" :class="{curLi:index==activeIndex}" @click="tabSendAjax(item,index)">{{item}}</li>
        </ul>-->

        <div class="overAuto3" ref="fanhuiTop" style="top:0rem!important;">

            <!--工单详情-->
            <div class="tabContent" v-show="activeIndex==0?true:false">
                <div class="gd1">
                    <p>
                        <strong>工单编号</strong>
                        <span>{{detailData.WorkOrderNo}}</span>
                    </p>
                    <p>
                        <strong>问题描述</strong>
                        <span class="ellipse">{{detailData.OrderRemark}}</span>
                    </p>
                    <p>
                        <strong>紧急程度</strong>
                        <span class="text">
                            {{detailData.Emergency == 1 ? '不急' : detailData.Emergency == 2 ? '一般' : detailData.Emergency == 3 ? '紧急' : '非常紧急'}}
                        </span>
                    </p>
                    <p>
                        <strong>状态</strong>
                        <span>{{detailData.OrderStatus==1?'待处理':detailData.OrderStatus==2?'处理中':detailData.OrderStatus==3?'已处理':''}}</span>
                    </p>
                    <p>
                        <strong>位置</strong>
                        <span>{{detailData.Address}}</span>
                    </p>

                </div>

                <!--地图组件-->
                <div class="map">
                    <div id="container" style="width:90%;margin:0 auto;height:3rem;"></div>
                </div>

                <div class="gd1">
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
                    <p>
                        <strong>派单人</strong>
                        <span>{{detailData.DistributeUser}}</span>
                    </p>
                    <p>
                        <strong>派单时间</strong>
                        <span>{{detailData.DistributeTime}}</span>
                    </p>

                    <!--认领-->
                    <div class="gd1" style="margin: 0" v-show="detailData.OrderStatus!=1">
                        <p>
                            <strong>认领人</strong>
                            <span>
                                {{detailData.ConfirmTrueName}}
                            </span>
                        </p>
                        <p>
                            <strong>认领时间</strong>
                            <span>{{detailData.ConfirmTime}}</span>
                        </p>
                    </div>
                </div>

                <div class="footerQu centerFlex" v-show="detailData.OrderStatus==1 && renlingFlag">
                    <button class="button" @click="gongDanGetDataAndStep">认领</button>
                </div>

            </div>

            <!--照片查看-->
            <div class="tabContent" v-show="activeIndex==1?true:false">

                <div class="gd2" v-if="imgsList.length>0">
                    <p>现场状况:</p>
                    <ImgSlide :imgsLi="imgsList"></ImgSlide>
                </div>
                <div v-else class="noIMG" style="background:#f0f2f5;">
                    <img src="static/images/noData.jpg" alt="">
                </div>
            </div>

            <!--工单处置-->
            <div class="tabContent" v-show="activeIndex==2?true:false">
                <div class="gd2">
                    <p>
                        <strong>工单编号</strong>
                        <span>201710171528</span>
                    </p>
                    <p>
                        <strong>问题描述</strong>
                        <span>2017101715281234567</span>
                    </p>
                    <!--已处理过再进来的时候显示这个div 而且是只读的 不能保存 和上传图片-->
                    <div v-if="firstFlag">
                        <p>
                            <strong>处置人员</strong>
                            <span>201710171528</span>
                        </p>
                        <p>
                            <strong>处置时间</strong>
                            <span>2017101715281234567</span>
                        </p>
                    </div>
                    <p>
                        <strong>处理方案</strong>
                        <span class="last">201710171528</span>
                    </p>
                    <p>
                        <strong>图片拍摄</strong>
                        <span class="last">(选填，最多四张)</span>
                    </p>

                    <!--图片上传-->
                    <!--<uploadImg></uploadImg>-->

                    <div class="footerQu centerFlex">
                        <button class="button" @click="saveJilu">保存</button>
                    </div>
                </div>
            </div>

            <!--处置记录-->
            <div class="tabContent chuzhiJilu" v-show="activeIndex==3?true:false">

                <ul v-if="gongDanJiLuList.length>0">
                    <li v-for="(item,index) in gongDanJiLuList">
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

        <!--处置信息弹出层-->
        <div class="imgBigList gdTan" v-if="modiaFlag">
            <div class="save">
                <h1>保存成功</h1>
                <div class="content">
                    <p>你的工单处置方案已记录</p>
                    <div class="right">
                        <router-link :to="{path:'/renwuManage'}" tag="button">确定</router-link>
                        <a href="javascript:;" @click="jixuChuzhi">继续处置</a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import ImgSlide from "../components/ImgSlide.vue"
    import Header from "../components/Header.vue";
    export default{
        props:['detailData','gongDanJiLuList'],
        data(){
            return {
                url: this.$route.fullPath,
                title: '工单详情',
                activeIndex: this.$route.query.step || 0,//默认为0
                tabData: ['工单详情', '现场照片','工单处置','处理记录'], //工单选项卡数据
                imgsList:[],//图片放大器所支持的图片列表
                renlingFlag:true,
                firstFlag: false, //第一次进入工单记录的时候 不显示 处置人员和处置时间
                modiaFlag: false, //工单处置信息弹出层

                suoImgs:['static/images/suo1.png','static/images/suo2.png','static/images/suo3.png','static/images/suo4.png','static/images/suo5.png'], //处置记录锁图标
                dealRemarkable:[], //处理事项

                jingdu: 0,
                weidu: 0
            }
        },
        components: {
            HeaderNav: Header,
            ImgSlide
        },
        watch: {
            '$route':{
                handler(a,b){
                    this.activeIndex = this.$route.query.step;
                    if(this.activeIndex==0){
                        this.$nextTick(()=>{
                            if(this.jingdu&&this.weidu){
                                this.getMap()
                            }
                        })
                    }

                    this.$parent.gongDanJilu()

                    this.imgsList=[]
                    this.$parent.getData()
                },
                deep:true
            },
            //监控父组件传递的数据 实时更新试图 解决异步取不到数据问题
            detailData: {
                handler(a, b){
                    this.detailData.OrderStatus=a.OrderStatus;
                    //a是新值 b是旧值
                    this.jingdu = a.JingDu;
                    this.weidu = a.WeiDu;
                    //先监控 在调值 解决ajax异步 mounted无法取值问题
                    if(this.activeIndex==0){
                        if(this.jingdu&&this.weidu){
                            this.getMap()
                        }
                    }
                    let imgs=[];
                    if(this.detailData.Picture2){
                        imgs=this.detailData.Picture2.split(',');
                        imgs.forEach((item,index)=>{
                            let url=this.baseUrl+item;
                            if(item.length==0){
                                return
                            }else{
                                this.imgsList.push(url) //交给子组件的imgsList数组进行操作
                            }
                        })
                    }
                },
                deep: true
            },
        },
        methods: {
            //工单认领
            gongDanGetDataAndStep(){
                this.renlingFlag = false;
                this.busEvent.$emit('gongdanRenLiang');
            },
            //返回顶部
            returnTop(){
                this.$refs.fanhuiTop.scrollTop =0+'px'
            },
            saveJilu(){
                this.modiaFlag = true;
            },
            jixuChuzhi(){
                //子组件修改父组件数据 通过$parent引用父组件 找到父组件属性修改
                this.modiaFlag = false;
            },
            //map3
            getMap(){
                var lnglatXY = [this.jingdu, this.weidu]; //已知点坐标
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
            }
        },
        mounted(){
            //这里每次都会执行 因为动态组件加载的 不走缓存了
            //this.$parent.getData()
        },
    }
</script>

<style>

</style>
