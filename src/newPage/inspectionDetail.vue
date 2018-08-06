<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>

        <div class="inspect">
            <div class="detail_xunjian">
                <div class="title">
                    <p>
                        <span>设施名称:</span>
                        <span>{{title}}</span>
                    </p>
                    <p>
                        <span>巡检结果:</span>
                        <span :style="{
                            'color':result=='正常'?'green':'red'
                        }">{{result}}</span>
                    </p>
                </div>
                <div class="title">
                    <p>
                        <span>巡检时间:</span>
                        <span>{{time}}</span>
                    </p>
                </div>
            </div>

            <ul class="detail">
                <li v-for="(item,index) in data2" style="border-top: 7px solid #f1f2f6;">
                    <p class="title">
                        <span>{{item.Items[0].TypeValueName}}</span>
                        <span :style="{
                            'color':result2(item.Items)?'green':'red'
                        }">{{result2(item.Items)?'正常':'故障'}}</span>
                    </p>
                    <ul>
                        <li class="infor" v-for="(item1,index1) in item.Items">
                            <span>{{item1.ItemName}}</span>
                            <span class="radio_1" :class="{radio_2:item1.Result}"></span>
                        </li>
                    </ul>
                </li>
            </ul>

        </div>

    </div>
</template>
<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Header from "../components/Header.vue"
    export default{
        data(){
            return {
                title: this.$route.query.title,
                xunchaId: this.$route.query.XunChaId,
                time: this.$route.query.time,
                data: [],
                data2: [],
                jieguo:'',
                test:[]
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ]),
            //正常故障
            result(){
                let j = ''
                let f = 1
                this.data.forEach((item) => {
                    if (item.Result == 0) {
                        f = 0
                    }
                })
                if (f > 0) {
                    return j = '正常'
                } else {
                    return j = '故障'
                }
            },
            result2(arr){
                return (arr)=>{
                    let f=1
                    arr.forEach((item)=>{
                        if(!item.Result){
                            f=0
                        }else{

                        }
                    })
                    console.log(f);
                    return f
                }
            }
        },
        components: {
            HeaderNav: Header
        },
        mounted(){
            this.getData()
            console.log('test:----2018:07:24:15:00:00')
        },
        methods: {
            getData(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/XunCha/GetXunJianItem?ticket=' + this.user.ticket + '&xunChaId=' + this.xunchaId).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        this.data = data.Model || null;
                        this.data2 = data.Model || null;
                        this.setData()
                    }
                })
            },
            setData(){
                /*this.data2.sort(function (a, b) {
                    return a.TypeId - b.TypeId
                })*/
                let newArr = [];
                let tempArr = [];
                for (let i = 0; i < this.data2.length; i++) {
                    // if (this.data2[i + 1] && this.data2[i].TypeId == this.data2[i + 1].TypeId) {
                    if (this.data2[i + 1] && this.data2[i].TypeValueName==this.data2[i + 1].TypeValueName){
                        tempArr.push(this.data2[i]);
                    } else {
                        tempArr.push(this.data2[i]);
                        newArr.push({
                            Items: tempArr.slice(0)
                        });
                        tempArr.length = 0;
                    }
                }
                this.data2 = newArr
                // this.setResult()
            },
            setResult(){

                this.data2.forEach((item) => {

                    let f = 1

                    item.Items.forEach(i=>{
                        console.log(i.Result);
                        if(i.Result==0){
                            f=0
                        }
                    })

                    if (f > 0) {
                        this.jieguo = '正常'
                    } else {
                        this.jieguo = '故障'
                    }
                })

            }
        }
    }
</script>
<style>
    .inspect {
        position: absolute;
        top: 0.89rem;
        left: 0;
        right: 0;
        bottom:0rem;
        overflow: auto;
    }

    .inspect .detail>li {
        background: #fff;
    }

    .inspect > li:last-child{
        border-bottom:0
    }
    .inspect .title {
        height: .8rem;
        line-height: .8rem;
        padding: 0 .28rem;
        font-size: .28rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e8e8e8;
    }

    .inspect .title span:last-child {
        color: #ff4a68;
    }

    .inspect .infor {
        height: .8rem;
        line-height: .8rem;
        padding: 0 0.28rem 0 0;
        margin: 0 0 0 .56rem;
        font-size: .28rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e8e8e8;
        color: #bfbfbf;
    }
    .inspect ul li.infor:last-child{
        border-bottom: 0;
    }

    .detail_xunjian .title {
        display: flex;
        justify-content: space-between;
        align-content: center;
        height: .8rem;
        border-bottom: 0;
        background: #fff;
    }
</style>
