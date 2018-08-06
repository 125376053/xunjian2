<template>
    <div style="overflow: hidden;">
        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto2" v-if="Object.keys(sheshiDetail).length>0">
            <div class="gnContent">
                <div class="jianshe gongnengWrap">
                    <p class="jianshe_top">
                        <span class="shuIcon"></span>
                        <b>智能网关</b>
                    </p>
                    <div class="gongneng centerFlex">
                        <img src="static/images/xiantu1.jpg" alt="" style="width: 6.34rem; height: 3.82rem;">
                    </div>
                </div>

                <div class="jianshe gongnengWrap">
                    <p class="jianshe_top">
                        <span class="shuIcon"></span>
                        <b>就地控制柜</b>
                    </p>
                    <div class="gongneng centerFlex">
                        <img src="static/images/xiantu2.jpg" alt="" style="width: 6.34rem; height: 3.82rem;">
                    </div>
                </div>
            </div>
        </div>

        <!--暂无数据-->
        <div class="notData" v-if="Object.keys(sheshiDetail).length<=0">
            <img src="static/images/noData.png" alt="">
        </div>

    </div>
</template>

<script>
    import Header from "../components/Header.vue"
    export default{
        name: '',
        data(){
            return {
                title:this.$route.query.value==1?this.$route.query.sheshiname+'接线图展示':this.$route.query.sheshiname+'安装手册展示',
                id:this.$route.query.sheshiid||0,
                sheshiDetail:{}
            }
        },
        components:{
            HeaderNav:Header
        }
    }
</script>

<style>

</style>
