<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>

        <ul class="inspect" :style="{
            'bottom':WorkOrderId?'3rem':'2.1rem'
        }">
            <li v-for="(item,index) in data">
                <p class="title">
                    <span>{{item.SheshiorShebeiName}}</span>
                    <span @click="gotoAndroid(item)">报事</span>
                </p>
                <ul>
                    <li class="infor" v-for="(item1,index1) in item.Items">
                        <span>{{item1.ItemName}}</span>
                        <span class="radio_1" :class="{radio_2:item1.Result}"
                              @click.stop="radioFn(item,item1)">
                        </span>
                    </li>
                </ul>
            </li>
        </ul>
        <div :style="{'bottom':'1.5rem'}" class="wancheng1" @click="saveFn" v-if="WorkOrderId">保存</div>

        <div class="wancheng2" :style="{
            'background':!WorkOrderId?'#2a6eca':'#ccc',
            'bottom':'0.5rem'
        }" @click="wanchengFn">完成</div>


        <!--弹出-->
        <div class="imgBigList gdTan" v-if="modiaFlag">
            <div class="save">
                <h1 style="font-size:.38rem">巡检</h1>
                <div class="content">
                    <p style="font-size:.32rem; text-align: left;">您确定要提交本轮巡检结果吗？</p>
                    <div class="logout2" style="margin-left:2.1rem;">
                        <button class="quxiao" @click="gotoMyxuncha">取消</button>
                        <span class="enter" @click.stop="enterSave">确定</span>
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
                bsFlag:false,
                title:'',
                sheshiid:this.$route.query.sheshiid || ' ',
                RelateId:this.$route.query.RelateId || ' ',
                WorkOrderId: this.$route.query.WorkOrderId,
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
        watch:{
            $route(){

            }
        },
        methods: {
            // 点击选中取消
            radioFn(item, item1){
                if (!item1.Result) {
                    this.$set(item1, 'Result', 1)
                } else {
                    item1.Result = 0
                }
            },
            // 取消按钮
            gotoMyxuncha(){
                this.modiaFlag = false
                this.$router.push({
                    path: '/myXuncha'
                })
            },
            // 保存按钮
            saveFn(){
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
                this.submitResult()
            },

            // 保存结果
            submitResult(){
                //提交巡检结果
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/XunCha/SaveXunJianItem?ticket=' + this.user.ticket, ...[this.selectSubject]).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    console.log(data);
                    if(data.IsError===0){
                        this.$toast({
                            message: '保存成功',
                            duration: 2000
                        })
                        setTimeout(() => {
                            /*this.$router.replace({
                                path: '/selectSheshi',
                                query: {
                                    RelateId: this.$route.query.RelateId,
                                    WorkOrderId: this.$route.query.WorkOrderId
                                }
                            })*/

                            // workid存在 从列表进来的 否则从底部巡检进来的
                            // 是否有经纬度地址等信息 主片区没有经纬地址
                            /* if(this.$route.query.WorkOrderId){
                                if(this.$route.query.jingdu || this.$route.query.weidu || this.$route.query.adress || this.$route.query.sheshiname){
                                    this.$router.replace({
                                        path: '/selectSheshi',
                                        query: {
                                            RelateId: this.$route.query.RelateId,
                                            WorkOrderId: this.$route.query.WorkOrderId
                                        }
                                    })
                                }else{
                                    this.$router.replace({
                                        path: '/message'
                                    })
                                }
                            }else{
                                this.$router.replace({
                                    path: '/selectSheshi',
                                    query: {
                                        RelateId: '',
                                        WorkOrderId: ''
                                    }
                                })
                            }*/
                            this.$router.go(-1)
                            //this.$toast(`${this.bsFlag}`)
                            if(this.bsFlag){
                                window.history.back(-1);
                            }
                        }, 2000)
                    }else{
                        this.$toast({
                            message: '保存失败',
                            duration: 2000
                        })
                    }
                })
            },

            // 点击完成
            wanchengFn(){
                this.modiaFlag=true
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
            },

            // 确定提交
            enterSave(){

                this.modiaFlag=false
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/XunCha/SaveXunJianItemFinish?ticket=' + this.user.ticket,...[this.selectSubject]).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    console.log(data);

                    if(data.IsError===0){
                        this.$toast({
                            message: '提交成功',
                            duration: 2000
                        })
                        setTimeout(() => {

                            /*if(this.$route.query.WorkOrderId){
                                if(this.$route.query.jingdu || this.$route.query.weidu || this.$route.query.adress || this.$route.query.sheshiname){
                                    this.$router.replace({
                                        path: '/selectSheshi',
                                        query: {
                                            RelateId: this.$route.query.RelateId,
                                            WorkOrderId: this.$route.query.WorkOrderId
                                        }
                                    })
                                }else{
                                    this.$router.replace({
                                        path: '/message'
                                    })
                                }
                            }else{
                                this.$router.replace({
                                    path: '/selectSheshi',
                                    query: {
                                        RelateId: '',
                                        WorkOrderId: ''
                                    }
                                })
                            }*/
                            this.$router.go(-1)
                            //this.$toast(`${this.bsFlag}`)
                            if(this.bsFlag){
                                window.history.back(-1);
                            }
                        }, 2000)

                    }else{
                        this.$toast({
                            message: '提交失败',
                            duration: 2000
                        })
                    }
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
            // 跳转到安卓巡查上报
            gotoAndroid(item){
                this.bsFlag=true
                console.log(item);
                /*let obj = {
                    RelateId: this.$route.query.RelateId || ' ',
                    WorkOrderId: this.$route.query.WorkOrderId || ' ',
                    jingdu: this.$route.query.jingdu || ' ',
                    weidu: this.$route.query.weidu || ' ',
                    adress: this.$route.query.adress || ' ',
                    sheshiid: item.SheshiOrShebeiId,
                    sheshiname: item.SheshiorShebeiName
                }*/
                let obj={
                    RelateId: this.$route.query.RelateId || ' ',
                    WorkOrderId: this.$route.query.WorkOrderId || ' ',
                    jingdu: this.$route.query.jingdu || ' ',
                    weidu: this.$route.query.weidu || ' ',
                    adress: this.$route.query.adress || ' ',
                    sheshiid: item.Typeid==2?item.SheshiOrShebeiId:'',
                    sheshiname: item.SheshiorShebeiName,
                    shebeiid: item.Typeid == 2 ? '' : item.SheshiOrShebeiId
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
<style scoped>
    .inspect {
        position: absolute;
        top: 0.89rem;
        left: 0;
        right: 0;
        bottom: 2.1rem;
        overflow: auto;
    }

    .inspect > li {
        background: #fff;
        border-bottom: 7px solid #f1f2f6;
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
    .inspect ul li.infor:last-child{
        border-bottom: 0;
    }

    /* 其他页面这个样式bottom:0.5有时候起作用 导致样式和wangcheng2叠一起 就出现了 保存按钮有时候消失
        不是workerid的问题
     */
    .wancheng1 {
        height: .9rem;
        background: #2a6eca;
        position: fixed;
        bottom: 1.5rem;
        left: .27rem;
        right: .27rem;
        line-height: .9rem;
        text-align: center;
        color: #fff;
    }

    .wancheng2 {
        height: .9rem;
        background: #ccc;
        position: fixed;
        bottom: 0.5rem;
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
