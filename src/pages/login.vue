<template>
    <div class="loginBg">
        <div class="loginWrap">
            <h1 class="login_title">用户登录</h1>
            <div class="login_input">
                <p class="username">
                    <img src="static/images/user_icon.png" alt="">
                    <input v-model="username" type="text" placeholder="用户名">
                </p>
                <p class="password">
                    <img src="static/images/pass_icon.png" alt="">
                    <input v-model="password" :type="type" placeholder="密码">
                    <i class="biyan" @click="yanJing" :class="{zhengyan:yFlag}"></i>
                </p>
                <!--<router-link :to="{path:'/resetPass',query:{mobile:username}}" class="resetPass">
                    忘记密码?
                </router-link>-->
                <router-link :to="{path:'/resetPass'}" class="resetPass">
                    忘记密码?
                </router-link>
            </div>
            <a class="loginBtn" @click="check">登录</a>
        </div>
    </div>
</template>
<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    export default{
        mounted(){
            if (this.getCookie('shoujihao1') !== '') {
                this.username = this.getCookie('shoujihao1');
            }
        },
        data(){
            return {
                yFlag: false,
                type: 'password',
                username: '',
                password: ''
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        methods: {
            yanJing(){
                this.yFlag = !this.yFlag;
                this.type = this.yFlag ? 'text' : 'password';
            },
            check(){
                //手机号输入了且输入正确 存入cookie
                this.setCookie('shoujihao1', this.username || '', 7);//设置手机号cookie 7天

                var telMoshi = /^1[34578]\d{9}$/; //手机号验证
                //var passMoshi = /^[0-9a-zA-Z]{6,20}$/g; //密码验证
                var passMoshi = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$/);
                if (this.username == "") {
                    this.$toast('用户名不能为空');
                    return false;
                } else if (this.username=="" && !telMoshi.test(this.username)){
                    this.$toast('请输入正确的手机号码');
                    return false;
                } else if (this.password == '') {
                    this.$toast('密码不能为空');
                    return false;
                } else if (!passMoshi.test(this.password)) {
                    this.$toast('密码由6-12位数字，大小写字母组成');
                    return false;
                } else {
                    //后台检测
                    this.checkUser();
                }
            },
            //检测用户名和密码是否正确
            checkUser(){
                //let ticket=localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).ticket:'';
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl+'/api/Login/LoginUser?username='+this.username+'&password='+this.password).then((d) => {
                    this.$indicator.close();
                    if (d.data.IsError > 0) {
                        this.$toast(d.data.StatusMsg);
                        return false;
                    } else {
                        //缓存用户信息
                        let userInfo=d.data.Model.UserInfo||null;
                        let ticket=d.data.Model.ticket||''
                        let user={
                            userInfo:userInfo,
                            ticket:ticket
                        }
                        //保存用户信息到本地缓存
                        window.localStorage.setItem('user',JSON.stringify(user));

                        //保存用户信息到Vuex
                        this.$store.dispatch('user',user);

                        //登录成功的时候传给安卓
                        if(window.disposal){
                            window.disposal.giveTicket(user.ticket)
                        }

                        //成功提示
                        this.$toast(d.data.StatusMsg)
                        //this.getUser()
                        //跳转到首页
                        setTimeout(()=>{
                            this.$router.push({
                                path: '/'
                            })
                        },2000)
                    }
                }).catch((e) => {
                    this.$toast('登录失败');
                    this.$indicator.close();
                })
            }
        }
    }
</script>
<style>

</style>
