<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto2">
            <div class="rc">
                <ul>
                    <router-link :key="index" v-for="(item,index) in helpList" tag="li" :to="{
                        path:'/sheshiList',
                        query:{
                            id:item.Id,
                            type:item.EnumType,
                            value:item.EnumValue,
                            name:item.EnumName
                        }
                    }" class="JustifyFlex">
                        <span class="wt">{{item.EnumName}}</span>
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
                title:'帮助文档',
                helpList:[]
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
                this.$http.get(this.baseUrl+'/api/Common/GetDicList?typeid=11&ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();

                    if(d.status==200){
                        if(d.IsError>0){
                            this.$toast(d.data.StatusMsg)
                        }else{
                            console.log(d);
                            this.helpList=d.data.Model||[]
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
