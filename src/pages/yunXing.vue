<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto2">
            <div class="yunxing">
                <div class="yunZhuan JustifyFlex">
                    <div class="p1">
                        <p class="number">{{yunXingObj.Normal}}</p>
                        <p class="text">正常设备</p>
                    </div>
                    <!--<div class="yunzhuanlv">
                        <p id="tijiaoProcess1"></p>
                        <p class="huanText">正常运转率</p>
                    </div>-->
                    <div class="yunzhuanlv">
                        <p id="tijiaoProcess1">
                            <span>{{normalScale}}%</span>
                        </p>
                        <p class="huanText">正常运转率</p>
                    </div>

                    <div class="p1">
                        <p class="number">{{yunXingObj.Trouble}}</p>
                        <p class="text">故障设备</p>
                    </div>
                </div>

                <ul class="tableUl2">
                    <li>
                        <span>设备名称</span>
                        <span>运转正常数</span>
                        <span>运转故障数</span>
                    </li>

                    <li v-for="(item,index) in yunXingObj.DataList">
                        <span class="ellipse">{{item.SheBeiname}}</span>
                        <span>{{item.Normal}}</span>
                        <span>{{item.Trouble}}</span>
                    </li>
                </ul>

            </div>
        </div>

    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Header from "../components/Header.vue"
    export default{
        name: '',
        data(){
            return {
                title:'运行情况',
                yunXingObj:{},
                normalScale:0
            }
        },
        components:{
            HeaderNav:Header
        },
        mounted(){
            this.getData()
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        methods:{
            getData(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/Sheshi/YunxingQingKuang?ticket=' + this.user.ticket).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        this.yunXingObj=data.Model||null;

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
        }
    }
</script>

<style scoped>
    #tijiaoProcess1{ position: relative;}
    #tijiaoProcess1 span{font-size: .55rem; position: absolute;left:0;right:0;
        text-align: center; top:0;bottom:0;margin-top: .7rem;
    }
</style>
