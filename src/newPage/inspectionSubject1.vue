<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>
        <ul class="inspect">
            <li v-for="(item,index) in data" @click="gotoAndroid(item)">
                <p class="title">
                    <span>{{item.SheshiorShebeiName}}</span>
                    <span>报事</span>
                </p>
                <ul>
                    <li class="infor" v-for="(item1,index1) in item.Items">
                        <span>{{item1.ItemName}}</span>
                        <!-- item1.Result 1 duihao 0 chahao  -->
                        <span class="radio_1" :class="{radio_2:item1.flag}"
                              @click.stop="radioFn(item,item1)">
                        </span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="wancheng1" @click="wanchengFn">保存</div>

        <div class="wancheng1" @click="wanchengFn">完成</div>

        <!--弹出-->
        <div class="imgBigList gdTan" v-if="modiaFlag">
            <div class="save">
                <h1 style="font-size:.38rem">巡检</h1>
                <div class="content">
                    <p style="font-size:.32rem; text-align: left;">您确定要提交本轮巡检结果吗？</p>
                    <div class="logout2" style="margin-left:2.1rem;">
                        <button class="quxiao" @click="gotoMyxuncha">取消</button>
                        <span class="enter" @click="enterSave">确定</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import qs from "qs"
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Header from "../components/Header.vue"
    export default{
        data(){
            return {
                title: '',
                sheshiid: this.$route.query.sheshiid || ' ',
                RelateId: this.$route.query.RelateId || ' ',
                WorkOrderId: this.$route.query.WorkOrderId || ' ',
                data: [],
                modiaFlag: false,
                selectSubject: [],
                jingdu: this.$route.query.jingdu || ' ',
                weidu: this.$route.query.weidu || ' ',
                adress: this.$route.query.adress || ' '
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        components: {
            HeaderNav: Header
        },
        mounted(){
            this.getData()
        },
        methods: {
            radioFn(item, item1){
                if (!item1.flag) {
                    this.$set(item1, 'flag', true)
                    this.selectSubject.push({
                     TypeId: item1.TypeId,//1设施  2 设备
                     TypeValueId: item1.TypeValueId,    //设备或设施ID  根据TYPEid 确定
                     TypeValueName: item1.TypeValueName, //设施或设备名称[SheshiorShebeiName]
                     ItemId: item1.Id,    //检查项ID
                     ItemName: item1.ItemName,    //检查项名称
                     Result: 1,    //1 正常  0 故障
                     //巡查数据逗号隔开 SheshiName,SheshiId,Jingdu,WeiDu,Address
                     XunChaInfo: item.SheshiorShebeiName + ','+item.SheshiOrShebeiId + ',' + this.jingdu + ',' + this.weidu + ',' + this.adress
                     })
                } else {
                    item1.flag = false
                    this.selectSubject = this.selectSubject.filter((item) => {
                        return item != item1
                    })
                    console.log(this.selectSubject);
                }


                /*if (!item1.Result) {
                 this.$set(item1, 'Result', 1)
                 } else {
                 item1.Result = 0
                 }*/
            },
            //取消按钮
            gotoMyxuncha(){
                this.modiaFlag = false
                this.$router.push({
                    path: '/myXuncha'
                })
            },

            //完成按钮
            wanchengFn(){
                this.modiaFlag = true

                this.data.forEach((item) => {
                    if (item.Items.length > 0) {
                        item.Items.forEach((item1) => {
                            this.selectSubject.push({
                                RelateId: this.RelateId,
                                TypeId: item1.TypeId,//1设施  2 设备
                                TypeValueId: item.SheshiOrShebeiId,    //设备或设施ID  根据TYPEid 确定
                                TypeValueName: item.SheshiorShebeiName,
                                ItemId: item1.Id,    //检查项ID
                                ItemName: item1.ItemName,    //检查项名称
                                // Result: item1.flag?1:0,    //1 正常  0 故障
                                Result: item1.Result,    //1 正常  0 故障
                                //巡查数据逗号隔开 SheshiName,SheshiId,Jingdu,WeiDu,Address
                                XunChaInfo: item.SheshiorShebeiName + ',' + item.SheshiOrShebeiId + ',' + this.jingdu + ',' + this.weidu + ',' + this.adress + ',' + this.RelateId + ',' + this.WorkOrderId
                            })
                        })
                    }
                })
                console.log(this.selectSubject);
            },
            //确定弹出按钮
            enterSave(){
                this.modiaFlag = false
                this.submitResult()
            },
            submitResult(){
                let that = this;
                //提交巡检结果
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/XunCha/SaveXunJianItem?ticket=' + this.user.ticket,
                    ...[this.selectSubject] //数组拓展运算符   ...this.selectSubject对象
                ).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    console.log(data);
                    this.$toast({
                        message: '提交成功',
                        duration: 2000
                    })
                    setTimeout(() => {
                        this.$router.push({
                            path: '/selectSheshi',
                            query: {
                                RelateId: this.$route.query.RelateId,
                                WorkOrderId: this.$route.query.WorkOrderId
                            }
                        })
                    }, 2000)
                })
            },
            getData(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/XunCha/GetXunChaSheshiItems?ticket=' + this.user.ticket + '&sheshiid=' + this.sheshiid + '&workorderid=' + this.WorkOrderId).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    console.log(data);
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        this.data = data.Model || null;
                        this.title = data.Model[0].SheshiorShebeiName || ''
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            //跳转到安卓巡查上报
            gotoAndroid(item){
                console.log(item);
                let obj = {
                    RelateId: this.$route.query.RelateId || ' ',
                    WorkOrderId: this.$route.query.WorkOrderId || ' ',
                    jingdu: this.$route.query.jingdu || ' ',
                    weidu: this.$route.query.weidu || ' ',
                    adress: this.$route.query.adress || ' ',
                    sheshiid: item.SheshiOrShebeiId || this.sheshiid,
                    sheshiname: item.SheshiorShebeiName
                }
                obj = JSON.stringify(obj)
                console.log(obj);
                if (window.disposal) {
                    window.disposal.reportInspection(obj)
                }
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
        background: #fff;
        bottom: 2.1rem;
        overflow: auto;
    }

    .inspect > li {
        border-bottom: 7px solid #f1f2f4;
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

    .inspect ul li.infor {
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

    .wancheng1 {
        height: .9rem;
        background: #2a6eca;
        position: fixed;
        bottom: .5rem;
        left: .27rem;
        right: .27rem;
        line-height: .9rem;
        text-align: center;
        color: #fff;
    }

    .save {
        height: 4rem;
    }

    .quxiao {
        font-size: .28rem;
        background: #2b6dcb;
        display: inline-block;
        text-align: center;
        padding: .15rem .4rem .15rem;
        color: #999;
    }

    .logout2 {
        margin-top: 0rem;
    }

    .enter {
        font-size: .28rem;
        background: #2b6dcb;
        display: inline-block;
        text-align: center;
        padding: .15rem .4rem .15rem;
        color: #fff !important;
        border-radius: 5px;
    }
</style>
