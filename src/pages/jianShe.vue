<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto2">
            <div class="yunxing">

                <div class="jianshe">
                    <div class="jianshe_bottom JustifyFlex">
                        <!--<p class="JustifyCenter">
                            <span>{{jianSheObj.totoalmianji}}</span>
                            <i>项目规模</i>
                        </p>
                        <p class="JustifyCenter">
                            <span>{{jianSheObj.totoalcount}}</span>
                            <i>安装设备数量</i>
                        </p>-->
                        <div class="index_text">
                            <b>{{jianSheObj.totoalmianji}}</b>
                            <span>项目规模</span>
                        </div>
                        <div class="index_text">
                            <b>{{jianSheObj.totoalcount}}</b>
                            <span>安装设备数量</span>
                        </div>
                    </div>
                </div>

                <ul class="tableUl">
                    <li>
                        <span>设施/设备名称</span>
                        <span>规模/数量</span>
                    </li>
                    <li v-for="(item,index) in jianSheObj.datalist">
                        <span class="ellipse">{{item.Name}}</span>
                        <span>{{item.NameVal}}</span>
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
                title:'建设情况',
                jianSheObj:{}
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
                this.$http.post(this.baseUrl+'/api/Sheshi/JianSheQingkuang?ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();
                    let data=d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        this.jianSheObj=data.Model||null;
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

<style scoped>
    .index_text{width:3.35rem;height:1.3rem;background:#3eaeff;border-radius:5px;color:#fff;text-align:center;}
    .index_text b{ display: block; font-size:.5rem;line-height:0;margin-top:.5rem; /*border-bottom: 1px solid red;*/}
    .index_text span{ display: block; font-size:.28rem;line-height:0;margin-top:.5rem;/*border-bottom: 1px solid green;*/}
</style>
