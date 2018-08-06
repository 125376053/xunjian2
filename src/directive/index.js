import Vue from "vue"
export let setloadStyle = function (el, binding) {

    var Img=el.querySelector('img');
    if(!Img) return;

    Vue.nextTick(()=>{
        var maxWidth = el.offsetWidth;
        var maxHeight = el.offsetHeight;
        el.style.width = maxWidth+'px';
        el.style.height = maxHeight+'px';
        el.style.lineHeight = maxHeight+'px';
        el.style.textAlign = "center";

        Img.style.verticalAlign = "middle";//不要设置maxwidth maxHeight*/

        var image = new Image();
        image.src = Img.src;//原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
        image.onload = function () {
            if (image.width < maxWidth && image.height < maxHeight) {// 当图片比图片框小时不做任何改变
                Img.width = image.width;
                Img.height = image.height;
            } else {
                //原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
                if (maxWidth / maxHeight <= image.width / image.height) {
                    Img.width = maxWidth;   //以框的宽度为标准
                    Img.height = maxWidth * (image.height / image.width);
                }
                else {//原图片宽高比例 小于 图片框宽高比例
                    Img.width = maxHeight * (image.width / image.height);
                    Img.height = maxHeight;   //以框的高度为标准
                }
            }
        };
    })
};

export const limit = function (el, binding) {

    el.oninput=function(){
        let size =binding.value;
        let curSize = chekStrLen(trim(el.value)); //检测字符长度+去除空格后的长度计算
        let reSize = size - curSize;
        if (curSize > size) {
            el.nextElementSibling.innerHTML="不允许输入太多字符";
            el.nextElementSibling.style.color="red";
            el.value=el.value.substring(0,140);
        } else {
            el.nextElementSibling.innerHTML=reSize;
            el.nextElementSibling.style.color="green";
        }
    };


    //检测字符长度
    function chekStrLen(str) {
        var strlen = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) >= '0x4e00' && str.charCodeAt(i) <= '0X9fa5') {
                strlen += 3;
            } else {
                strlen++;
            }
        }
        return strlen;
    }

    //不允许输入空格
    function trim(str) {
        var re = /(^\s*)|(\s*$)/g;
        str = str.replace(re, "");
        return str;
    }
};
