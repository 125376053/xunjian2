﻿<template>
    <div style="overflow: hidden;">

        <!--<HeaderNav ref="header" :title="title"></HeaderNav>-->

        <!--<ul class="tab centerFlex" style="margin-top:.89rem!important;">
            <li v-for="(item,index) in tabData" :class="{curLi:index==activeIndex}" @click="tabSendAjax(item,index)">{{item}}</li>
        </ul>-->

        <div class="overAuto3" ref="fanhuiTop" style="top:0rem!important;">

            <!--养护内容-->
            <div class="tabContent" v-show="activeIndex==0?true:false">

                <div class="gd1">
                    <p>
                        <strong>设施名称</strong>
                        <span>{{detailData.SheshiName}}</span>
                    </p>
                    <p>
                        <strong>设备名称</strong>
                        <span>{{detailData.ShebeiName}}</span>
                    </p>
                    <!--<p>
                        <strong>紧急程度</strong>
                        <span class="text">
                            {{detailData.Emergency == 1 ? '不急' : detailData.Emergency == 2 ? '一般' : detailData.Emergency == 3 ? '紧急' : '非常紧急'}}
                        </span>
                    </p>-->
                    <p>
                        <strong>提醒时间</strong>
                        <span>{{detailData.CreateTime}}</span>
                    </p>
                    <!--<p class="xiaoLine">
                        <strong>警情描述</strong>
                        <span>{{detailData.OrderRemark}}</span>
                    </p>-->
                    <p>
                        <strong>位置</strong>
                        <span>{{detailData.Address}}</span>
                    </p>
                </div>

                <!--地图组件-->
                <div class="map">
                    <div id="container" style="width:90%;margin:0 auto;height:3rem;"></div>
                </div>

                <div class="footerQu centerFlex" v-show="detailData.OrderStatus==1 && renlingFlag">
                    <button class="button" @click="gongDanGetDataAndStep">认领</button>
                </div>
                <!--认领状态为2 显示认领人 认领时间  不显示认领按钮-->
                <div class="gd1" style="padding-left: .2rem;" v-show="detailData.OrderStatus!=1">
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

            <!--养护处置-->
            <div class="tabContent" v-show="activeIndex==1?true:false">

                <div class="gd2">
                    <p>
                        <strong>处置时间</strong>
                        <span>2017.02.03 16:03</span>
                    </p>
                    <p>
                        <strong>处置人员</strong>
                        <span>张三</span>
                    </p>
                    <p>
                        <strong>处理事项</strong>
                        <span>喷射器电容烧毁，已处理</span>
                    </p>
                    <p>
                        <strong>图片拍摄</strong>
                        <span>(选填，最多四张)</span>
                    </p>
                    <ul class="tp">
                        <li>
                            <input type="file" class="file">
                            <img src="static/images/gd2_06.jpg">
                        </li>
                        <li><img src="static/images/gd2_03.jpg"></li>
                    </ul>

                </div>

                <div class="footerQu centerFlex">
                    <button class="button">确认</button>
                </div>
            </div>

            <!--养护处置记录-->
            <div class="tabContent chuzhiJilu" v-show="activeIndex==2?true:false">

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

    </div>
</template>

<script>

    import Header from "../components/Header.vue"
    /*import uploadImg from "../components/uploadImg.vue";*/
    export default{
        name: '',
        props:['detailData','gongDanJiLuList'],
        data(){
            return {
                title:'养护详情',
                //tabData:['养护内容','养护处理','处理记录'],
                activeIndex:this.$route.query.step|| 0, //默认显示第一个  刷新根据step定位是哪个选项卡显示
                renlingFlag:true,

                firstFlag: false, //第一次进入报警处置 不显示 处置人员和处置时间 下一次进来才显示

                imgsList:[],
                suoImgs:['static/images/suo1.png','static/images/suo2.png','static/images/suo3.png','static/images/suo4.png','static/images/suo5.png'], //处置记录锁图标
                dealRemarkable:[], //处理事项

                jingdu: 0,
                weidu: 0
            }
        },
        components:{
            HeaderNav:Header,
            /*uploadImg*/
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

                },
                deep:true
            },
            // map1
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
                    /*let imgs=[];
                    if(this.detailData.Picture2!='' && this.detailData.Picture2!=null){
                        imgs=this.detailData.Picture2.split(',');
                        imgs.forEach((item,index)=>{
                            let url=this.baseUrl+'/'+item;
                            this.imgsList.push(url) //交给子组件的imgsList数组进行操作
                        })
                    }*/
                },
                deep: true
            },
        },
        methods:{
            //工单认领
            gongDanGetDataAndStep(){
                this.renlingFlag = false;
                this.busEvent.$emit('gongdanRenLiang');
            },
            //返回顶部
            returnTop(){
                this.$refs.fanhuiTop.scrollTop =0+'px'
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
            //为什么要掉父组件的 因为如果在父组件调用这个方法的话 只执行一次 在路由改变的时候
            //动态组件渲染 等于刷新 走这里不执行方法了
            //this.$parent.getData()
        }
    }
</script>

<style>

</style>
