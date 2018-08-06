<template>
    <div class="pageTitle">
        <span class="leftJt">
            <img v-if="!isShowRe" src="static/images/returnLeft.png" @click.stop="returnPage">
        </span>
        <span class="titleName">{{title}}</span>
        <span class="rightJt"></span>
    </div>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        methods:{
            /*returnPage(){
                if(this.$route.meta.isCanPrev){
                    this.busEvent.$emit('nextShow',true)
                }else{
                    this.$router.go(-1)
                }
            }*/

            returnPage(){
                //有历史记录才回退
                if(window.history.length==1){
                    this.$router.replace({
                        path:'/'
                    })
                }else{
                    this.$router.go(-1)
                }
            },
        },
        props:['title','isShowRe']
    }
</script>
<style>

</style>
