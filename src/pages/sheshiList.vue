<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto2">
            <div class="rc">
                <ul>
                    <router-link :key="index" v-for="(item,index) in sheshiList" tag="li" :to="{
                        path:'/sheshiDetail',
                        query:{
                            sheshiid:item.SheshiId,
                            value:value,
                            sheshiname:item.SheshiName
                        }
                    }" class="JustifyFlex">
                        <span class="wt">{{item.SheshiName}}</span>
                        <img class="jt" src="static/images/myLeft.jpg">
                    </router-link>
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
                title:'所有设施',
                value:this.$route.query.value,
                sheshiList:[]
            }
        },
        components:{
            HeaderNav:Header
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        methods:{
            getData(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl+'/api/Sheshi/AllSheShi?ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();

                    if(d.status==200){
                        if(d.IsError>0){
                            this.$toast(d.data.StatusMsg)
                        }else{
                            this.sheshiList=d.data.Model||[]
                        }
                    }else{
                        //this.$toast('请求未成功')
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(e)
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
