<template>
    <div>
        <HeaderNav :title="title"></HeaderNav>

        <div class="overAuto2">
            <div class="jianceWrap centerFlex">
                <div class="jianceSearch JustifyFlex" @click.stop="clickSearch">
                    <span class="searchIcon"></span>
                    <span style="color:#ccc;">丨</span>
                    <input
                        v-model="searchKey"
                        @keyup.stop="enterSearchPage"
                        @keyup.13.stop="enterSearch($event)"
                        type="text" placeholder="请输入设施，设备名称">
                    <span class="close" @click.stop="emptySearch"></span>
                </div>
            </div>

            <!--搜索页面-->
            <ul v-if="historyFlag" class="jianceList">

                <BetterScroll class="wrapper" ref="scroll" :data="searchList"
                              :pullUpLoad="pullUpLoad"
                              @pullingUp="onPullingUp"
                              :pullDownRefresh="pullDownRefresh"
                              @pullingDown="onPullingDown"
                              style="top:1.48rem!important;">

                    <li v-if="searchList&&searchList.length>0" v-for="(item,index) in searchList">
                        <a>
                            <div class="top">
                                <p class="title ellipse" style="width:7rem;">
                                    <b>{{item.ShebeiName}}</b>
                                    <span>({{item.SheshiName}})</span>
                                </p>

                                <div class="list-text flexBuju">
                                    <p v-if="childrenList(item).length>0"
                                       v-for="(item1,index) in childrenList(item)">
                                        <b>{{item1.ParaVal}}{{item1.Unit}}</b>
                                        <i>{{item1.ParaName}}</i>
                                    </p>
                                </div>
                            </div>
                            <div class="bottom JustifyFlex" style="font-size:.28rem;">
                                <p class="title ellipse" style="width: 3.5rem;">{{item.Address}}</p>
                                <p>{{item.FinalTime}}</p>
                            </div>
                            <div v-if="item.ShebeiStatus==4" class="shouceng"></div>
                        </a>
                    </li>
                    <li v-else>
                        <!--暂无数据-->
                        <div class="notData">
                            <img src="static/images/noData.png" alt="">
                        </div>
                    </li>

                </BetterScroll>

            </ul>

            <!--历史搜索-->
            <div v-if="!historyFlag&&!historyFlag2" class="lishijilu">
                <p style="height:.86rem;line-height:.86rem;border-bottom: 1px solid #ccc;">历史搜索</p>
                <ul class="jilu-list">
                    <li v-for="(item,index) in saveHistoryList" @click="historyClick(item)">
                        {{item.userSearch}}
                    </li>
                </ul>
                <button @click="removeHistory" v-if="saveHistoryList.length>0" class="qingkong">
                    清空历史搜索
                </button>
            </div>

            <!--模糊搜索-->
            <div v-if="mohuList.length>0 && historyFlag2 && !historyFlag">
                <ul class="jilu-list">
                    <li v-if="filterList.length>0"
                        v-for="(item,index) in filterList"
                        @click="mohuListClick($event,item)"
                    >
                        {{item.ShebeiName}}
                    </li>
                </ul>
                <div class="noData"  v-if="filterList.length==0">
                    <img src="static/images/noData.png" alt="">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Header from "../components/Header.vue"
    import BetterScroll from '../components/BetterScrollSlot'
    import {mapState, mapGetters, mapActions} from 'vuex'
    export default{
        components: {
            HeaderNav: Header,
            BetterScroll
        },
        data(){
            return {
                title: '实时监测',
                searchList: [],
                pullUpLoad: true,
                pullDownRefresh:{
                    flag:true,
                    txt:'刷新成功'
                },
                pageInfo: {},
                pageIndex:1,
                pageIndex2: 1,
                pageSize: 10,
                searchKey: '',
                historyFlag: true,
                historyFlag2: false,
                //历史记录列表
                saveHistoryList:JSON.parse(window.localStorage.getItem('saveHistoryList')) ||[],
                mohuList: []
            }
        },
        methods: {
            getData(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/Sheshi/MonitorSheBei?pageindex=' + this.pageIndex + '&pagesize=' + this.pageSize+'&ticket='+this.user.ticket+'&searchKey='+encodeURIComponent(this.searchKey)).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        if(data.Model.DataList.length>0){
                            this.searchList =this.searchList.concat(data.Model.DataList || []);
                        }else{
                            this.searchList=[];
                        }
                        this.pageInfo = data.Model.PageInfo || [];
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            //上拉加载数据
            onPullingUp () {
                //如果还有下一页
                if (this.pageInfo.PageCount > this.pageIndex) {
                    this.pageIndex++;
                    this.getData()
                } else {
                    //如果没有新数据
                    this.$refs.scroll.forceUpdate()
                }
            },
            getData2(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/Sheshi/MonitorSheBei?pageindex=' + this.pageIndex2 + '&pagesize=' + this.pageSize+'&ticket='+this.user.ticket+'&searchKey='+encodeURIComponent(this.searchKey)).then((d) => {
                    this.$indicator.close();
                    let data = d.data;
                    if (data.IsError > 0) {
                        this.$toast(data.StatusMsg);
                        return false;
                    } else {
                        if(data.Model.DataList.length>0){
                            this.searchList=data.Model.DataList || [];
                        }else{
                            this.searchList=[];
                        }
                        this.pageInfo = data.Model.PageInfo || [];
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            //下拉刷新
            onPullingDown() {
                //重置上拉加载更多页码
                this.pageIndex=1;
                this.getData2();
                this.$refs.scroll.forceUpdate();
            },
            //点击搜索进入搜索页面
            clickSearch(){
                this.historyFlag = false;
                this.searchKey = '';
                if (this.searchKey.length > 0) {
                    this.historyFlag2 = true;
                } else {
                    this.historyFlag2 = false;
                }
            },
            //点击回车请求数据
            enterSearch(e){
                //重置页吗
                this.pageIndex=1;
                //现将数据清空
                this.searchList=[];
                //发起强求
                this.getData()
                //回到搜索结果页
                this.historyFlag = true;
                //保存搜索的记录字段到缓存中
                this.searchKey = e.target.value;
                //执行保存历史记录操作
                this.saveHistory(e)
            },
            //模糊搜索
            enterSearchPage(){
                this.historyFlag = false;
                if (this.searchKey.length > 0) {
                    this.historyFlag2 = true;
                } else {
                    this.historyFlag2 = false;
                }
                //http://waterapi.qijiatech.com/Help/Api/POST-api-Sheshi-AllSheBei
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/Sheshi/AllSheBei?ticket='+this.user.ticket).then((d) => {
                    this.$indicator.close();
                    if (d.status == 200) {
                        if (d.data.IsError > 0) {
                            this.$toast(d.data.StatusMsg)
                        } else {
                            this.mohuList = d.data.Model || [];
                        }
                    } else {
                        //this.$toast(d.statusText)
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    //this.$toast(e)
                })
            },
            //模糊搜索点击 请求数据
            mohuListClick(e,item){
                //重置页吗
                this.pageIndex=1;
                //保存搜索的记录字段到缓存中
                this.searchKey = item.ShebeiName;
                //现将数据清空
                this.searchList=[];
                //发起强求
                this.getData()
                //回到搜索结果页
                this.historyFlag = true;
                //执行保存历史记录操作
                this.saveHistory(e)
            },
            //保存历史记录
            saveHistory(e){
                e.target.blur()
                //保存用户记录
                if (this.searchKey != '') {
                    this.saveHistoryList.unshift({
                        userSearch: this.searchKey
                    })
                }
                if (this.saveHistoryList.length >= 7) {
                    this.saveHistoryList.pop()
                }

                window.localStorage.setItem('saveHistoryList', JSON.stringify(this.saveHistoryList))
            },
            //删除历史记录
            removeHistory(){
                this.saveHistoryList = [];
                window.localStorage.removeItem('saveHistoryList');
            },
            //点击历史记录请求数据
            historyClick(item){
                //设置搜索字段
                this.searchKey = item.userSearch
                //重置页吗
                this.pageIndex=1;
                //现将数据清空
                this.searchList=[];
                //发起强求
                this.getData()
                //回到搜索结果页
                this.historyFlag = true;
            },
            //清空搜索
            emptySearch(){
                //重置页吗
                this.pageIndex=1;
                //现将数据清空
                this.searchList=[];

                //回到搜索结果页
                this.historyFlag = true;
                //清空搜索栏
                this.searchKey = '';
                //发起强求
                this.getData()
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ]),
            //前台模糊搜索过滤实现
            filterList: function () {
                var self = this;
                return self.mohuList.filter(function (item) {
                    return item.ShebeiName.toLowerCase().indexOf(self.searchKey.toLowerCase()) !== -1;
                })
            },
            childrenList(item){
                return (item)=>{

                    if(item.ShebeiMonitorPara){
                        return JSON.parse(item.ShebeiMonitorPara)
                    }else{
                        return ''
                    }
                }
            }
        },
        //组件内钩子
        beforeRouteLeave (to, from, next) {
            if(this.historyFlag){
                next()
            }else{
                this.historyFlag=true;
                next(false)
            }
        },
        mounted(){
            this.getData()

            //这里用$on会触发事件连锁 重复绑定问题
            //检测是否要退出页面
            /*this.busEvent.$off('nextShow');
            this.busEvent.$on('nextShow',(flag)=>{
                if(this.historyFlag){
                    this.$router.push({
                        path:'/'
                    })
                }else{
                    this.historyFlag=true;
                    this.$router.push({
                        path:'/jiance'
                    })
                }
            })*/
        }
    }
</script>

<style scoped>
    body{ background: red!important;}
    .wrapper {
        top: 1.48rem;
        bottom: 0px;
    }
</style>
