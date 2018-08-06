<template>

    <div>
        <HeaderNav :title="title"></HeaderNav>

        <!--找回密码发送验证码-->
        <div class="repassContent" v-if="showNext">
            <div class="tel">
                <input v-model="username" type="tel" placeholder="请输入手机号" class="telValue_reset">
            </div>
            <div class="yanzm">
                <input v-model="ma" type="number" placeholder="短信验证码"/>
                <button class="getYan" @click="getYan" ref="noResetTimeBtn">获取验证码</button>
            </div>
            <a class="resetPassBtn" :class="{resetPassBtnNo:canNext==true}" @click="resetFn">下一步</a>
        </div>

        <!--找回密码完成-->
        <div class="repassContent" v-if="!showNext && !canNext">
            <div class="tel">
                <input v-model="password1" type="password" placeholder="密码由6-12位数字，大小写字母组成
" class="telValue_reset">
            </div>
            <div class="tel">
                <input v-model="password2" type="password" placeholder="请再次输入新密码" class="telValue_reset"/>
            </div>
            <a class="resetPassBtn" @click="wanCheng">完成</a>
        </div>

    </div>

</template>
<script>
    import Header from "../components/Header.vue"
    import {mapState, mapGetters, mapActions} from 'vuex'
    export default{
        name: "resetPass",
        components: {
            HeaderNav: Header
        },
        data(){
            return {
                yFlag: false,
                type: 'password',
                username: this.$route.query.mobile || '',
                password1: '',
                password2: '',
                ma: '',
                title:'找回密码',
                //默认为true 显示下一步界面
                showNext:true,
                canNext:true
            }
        },
        methods: {
            yanJing(){
                this.yFlag = !this.yFlag;
                this.type = this.yFlag ? 'text' : 'password';
            },

            //重置密码下一步
            resetFn(){
                //this.setCookie('shoujihao', this.username || '', 7);//设置手机号cookie 7天

                var telMoshi = /^1[34578]\d{9}$/;
                //var passMoshi = /^[0-9a-zA-Z]{6,20}$/g;//验证密码  字母 数字 或者字母数字组合 6-20

                if (this.username == '') {
                    this.$toast('请输入手机号');
                    return false;
                } else if (!telMoshi.test(this.username)) {
                    this.$toast('请输入正确的手机号码');
                    return false;
                } else if (this.ma == '') {
                    this.$toast('验证码不能为空');
                    return false;
                } else {
                    //检测验证码
                    this.resetCheck()
                }
            },
            //检测验证码
            resetCheck(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl+'/api/User/IsValidCode?validcode='+this.ma+'&mobile='+this.username).then((d) => {
                    this.$indicator.close();
                    //d.data.IsError===0表示验证码过期
                    //d.data.IsError=1;//测试条件
                    if (d.data.Model){
                        this.$toast(d.data.StatusMsg);
                        this.canNext=false;
                        this.showNext=false;
                    }else{
                        this.$toast(d.data.StatusMsg);
                        /*this.canNext=false;
                        this.showNext=false;*/
                        return false;
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },

            //获取验证码
            getYan(){
                //this.setCookie('shoujihao', this.username || '', 7);//设置手机号cookie 7天
                var telMoshi = /^1[34578]\d{9}$/; //手机号验证
                if (this.username ==='') {
                    this.$toast('请输入手机号');
                    return false;
                } else if (!telMoshi.test(this.username)) {
                    this.$toast('请输入正确的手机号码');
                    return false;
                } else {
                    this.resetCheckTel()
                }
            },
            //点击获取验证码的时候  验证手机号是否存在
            resetCheckTel(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/User/ValidMobile?mobile='+this.username).then((d) => {
                    this.$indicator.close();
                    if (d.data.IsError>0){
                        this.$toast('该手机号不存在');
                        return false;
                    }else{
                        this.sendYan();
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },
            //手机号存在 发送验证码
            sendYan(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/User/SendValidCode?mobile=' + this.username).then((d) => {
                    this.$indicator.close();

                    if(d.data.IsError>0){
                        this.$toast('获取次数已达上线，请24小时后重试！')
                    }else{
                        this.noResetTime('noResetTimeBtn', 'captcha');
                        this.canNext=false;
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            },

            //完成重置密码
            wanCheng(){
                //var passMoshi = /^[0-9a-zA-Z]{6,12}$/g;//验证密码  字母 数字 或者字母数字组合 6-20
                var passMoshi = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$/;
                if (this.password1 == '') {
                    this.$toast('密码不能为空');
                    return false;
                } else if (!passMoshi.test(this.password1)) {
                    this.$toast('密码由6-12位数字，大小写字母组成');
                } else if (this.password2 == "") {
                    this.$toast('请再次输入密码');
                    return false;
                } else if (this.password1!==this.password2) {
                    this.$toast('两次密码输入不一致');
                    return false;
                } else {
                    this.resetSend()
                }
            },
            //重置密码请求
            resetSend(){

                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl+'/api/User/ModifyPwd?mobile='+this.username+'&password='+this.password1+'&validcode='+this.ma).then((d) => {
                    this.$indicator.close();
                    if(d.data.IsError>0){
                        this.$toast(d.data.StatusMsg)
                    }else{
                        this.$router.push({
                            path: '/login'
                        })
                        let toast=this.$toast({
                            message: '密码修改成功',
                            duration: 2000
                        })
                    }
                }).catch((e) => {
                    this.$indicator.close();
                })
            }
        },
        beforeRouteLeave (to, from, next) {
            if(this.showNext){
                next()
            }else{
                this.showNext=true;
                next(false)
            }
            next()
        },
        mounted(){

            if (this.getCookie('shoujihao')) {
                this.username = this.getCookie('shoujihao');
            }
            if (this.getCookie('captcha')) {
                this.noResetTime('noResetTimeBtn', 'captcha');
            }

            /*//返回不退出页面
            this.busEvent.$on('nextShow', () => {
                this.historyFlag = true;
                this.$router.replace({
                    path: '/resetPass',
                    query: {
                        mobile: this.username
                    }
                })
            })*/
            /*//刷新修改路由
            this.$router.replace({
                path: '/resetPass',
                query: {
                    mobile: this.username
                }
            })*/
        }
    }
</script>

<style scoped>
    .repassContent{ font-size: .38rem;}
    .repassContent input{font-size: .32rem;}
    .repassContent .yanzm .getYan{font-size: .32rem;}
</style>
