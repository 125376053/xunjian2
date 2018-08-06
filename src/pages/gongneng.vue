<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto2">
            <div class="gnContent">
                <div class="jianshe gongnengWrap">
                    <p class="jianshe_top">
                        <span class="shuIcon"></span>
                        <b>启动应用</b>
                    </p>
                    <div class="gongneng centerFlex">
                        <img src="static/images/gn1.jpg" alt="">
                    </div>
                </div>

                <div class="jianshe gongnengWrap">
                    <p class="jianshe_top">
                        <span class="shuIcon"></span>
                        <b>登录</b>
                    </p>
                    <div class="gongneng centerFlex">
                        <img src="static/images/gn2.jpg" alt="">
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Header from "../components/Header.vue"
    export default{
        name: '',
        data(){
            return {
                title:'功能介绍'
            }
        },
        components:{
            HeaderNav:Header
        }
    }
</script>

<style>

</style>
