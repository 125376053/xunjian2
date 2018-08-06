<template>

    <div style="position: absolute;top:0rem!important;">

        <!--报警处置-->
        <div class="gd1" v-if="$route.query.OrderType == 1">
            <div class="" v-if="detailData.OrderStatus==3">
                <p>
                    <strong>处理事项</strong>
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

        <!--养护处置-->
        <div class="gd1" v-if="$route.query.OrderType == 2">
            <div class="" v-if="detailData.OrderStatus==3">
                <p>
                    <strong>养护事项</strong>
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

        <!--工单处置-->
        <div class="gd1" v-if="$route.query.OrderType == 3">
            <div class="" v-if="detailData.OrderStatus==3">
                <p>
                    <strong>工单编号</strong>
                    <span>{{detailData.WorkOrderNo}}</span>
                </p>
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

    </div>

</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import ImgSlide from "../components/ImgSlide.vue"
    export default{
        name: '',
        data(){
            return {
                id: this.$route.query.WorkOrderId || 0,
                detailData:{},
                imgsList2:[],//处置照片
            }
        },
        components: {
            ImgSlide
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        methods:{
            getData(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/WorkOrder/GetItem?id=' + this.id+'&ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();
                    if (d.status === 200) {
                        if (d.data.IsError > 0) {
                            this.$toast(d.data.StatusMsg);
                            return false;
                        } else {
                            this.detailData = d.data.Model || null;
                            console.log(this.detailData);
                            let imgs2=[]
                            if(this.detailData.Picture1){
                                imgs2=this.detailData.Picture1.split(',');
                                imgs2.forEach((item,index)=>{
                                    let url=this.baseUrl+item;
                                    if(item.length==0){
                                        return
                                    }else{
                                        this.imgsList2.push(url)
                                    }
                                })
                            }
                        }
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            }
        },
        mounted(){
            this.getData()
        }
    }
</script>

<style>

</style>
