exports.install = function (Vue, options) {

    Vue.prototype.setCookie=function(name,value,day){
        let date=new Date();//获取时间对象
        date.setDate(date.getDate()+day);//设置过期时间
        document.cookie=name+"="+value+";expires="+date;//设置cookie
    };

    Vue.prototype.getCookie=function(name){
        let arr=document.cookie.split('; ');
        for(let i=0;i<arr.length;i++){
            let arr2=arr[i].split('=');
            if(arr2[0]===name){
                return arr2[1];
            }
        }
        return '';
    };

    Vue.prototype.removeCookie=function(name){
        this.setCookie(name, '1', -1);
    };

    //倒计时不重置  ref visudom cookie value
    Vue.prototype.noResetTime=function(ref,cookieValue){
        let dom=this.$refs[ref];//这样写的目的是防止传入的字符串获取不到元素 而不加引号又不存在变量
        let that=this;
        let count=this.getCookie(cookieValue)||120;
        dom.innerHTML=count+"s重新获取";
        dom.setAttribute('disabled',true);
        dom.style.background="#ccc";
        let resend = setInterval(function () {
            count--;
            if (count > 0) {
                dom.innerHTML=count+"s重新获取";
                dom.setAttribute('disabled',true);
                dom.style.background="#ccc";
                that.setCookie(cookieValue, count, (1 / 172800) * count);
            } else {
                clearInterval(resend);
                dom.innerHTML="发送验证码";
                dom.removeAttribute('disabled');
                dom.style.background="#2a6eca";
                that.removeCookie(cookieValue);
            }
        }, 1000);
    }

    Vue.prototype.timeAgo=function(ago){
        var curDate = (new Date()).getTime();// 先获取当前时间
        var halfYear = ago * 24 * 3600 * 1000;//将半年的时间单位换算成毫秒
        var pastResult = (curDate - halfYear)/1000;  // 半年前的时间（毫秒单位）
        return pastResult;
    }

    Vue.prototype.getLocalData=function(){
        var localArr=[];
        var storage = window.localStorage;
        for (var i=0;i<=storage.length;i++){
            var key = storage.key(i);
            if(key){
                if(key.substring(0,12)=='addCartGoods'){
                    var value = storage.getItem(key);
                    var obj=JSON.parse(value);
                    localArr.push(obj);
                }
            }
        }
        return localArr;
    }

    Vue.prototype.noSecond=function(time){
        var date=new Date(time)
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        var day=date.getDay();
        var shi=date.getHours();
        var fen=date.getMinutes();
        return year+'-'+month+'-'+day+' '+shi+':'+fen;
    }

};
