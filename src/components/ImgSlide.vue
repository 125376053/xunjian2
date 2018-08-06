<template>

    <div class="gd3">
        <ul class="tp" style="margin-top: 0.2rem;">
            <li style="height: 1.9rem; text-align: center" v-for="(item,index) in imgsLi" @click="bigImg(item,index)">
                <img v-lazy="item" class="imgs">
            </li>
        </ul>
        <div id="yulan" class="imgBigList bigTan" v-if="imgsMoveFlag">
            <div class="bigContent centerFlex" style="width:80%;height:70%;" v-setloadStyle>
                <img alt="1" title="1" :src="curentIMG">
            </div>
            <a id="prevBtn" href="javascript:;" @click="prevImg"></a>
            <a id="nextBtn" href="javascript:;" @click="nextImg"></a>
            <button class="closeBtn" @click="imgsMoveFlag=false"></button>
        </div>
    </div>

</template>
<script>
    export default{
        props:['imgsLi'],
        data(){
            return{
                imgsMoveFlag: false, //图片放大弹出层
                curentIMG: '', //当前图片
                currentIMGIndex: 0, //当前图片的索引
                /*imgsLi1:[
                    '../../static/images/gn1.jpg',
                    '../../static/images/login_bg2.jpg',
                    '../../static/images/dt.jpg',
                ]*/
            }
        },
        methods:{
            //处理照片逻辑
            bigImg(item, index){
                if(event.target.getAttribute('lazy')=="loaded"){
                    this.imgsMoveFlag = true;
                    this.curentIMG = item;
                    this.currentIMGIndex = index;
                }
            },
            prevImg(){
                if (this.currentIMGIndex <= 0) {
                    this.currentIMGIndex = this.imgsLi.length - 1;
                } else {
                    this.currentIMGIndex--;
                }
                this.curentIMG = this.imgsLi[this.currentIMGIndex]
            },
            nextImg(){
                if (this.currentIMGIndex >= this.imgsLi.length - 1) {
                    this.currentIMGIndex = 0;
                } else {
                    this.currentIMGIndex++;
                }
                this.curentIMG = this.imgsLi[this.currentIMGIndex]
            }
        }
    }
</script>
<style scoped>
    .gd3{margin-left: .2rem; background: #fff; overflow: hidden;}
    .gd3 .tp li{
        width: 1.52rem;
        height: 1.52rem;
        float:left;
        margin-left: .2rem;
    }
    .gd3 .tp li img{
        width: 1.52rem;
        height: 1.52rem;
    }
    .gd3 .tp li img[lazy=loading] {
        width: 50px;
        height: 50px;
        margin: auto;
        background: #000;
    }
    .gd3 .tp li img[lazy=error] {
        background: url("../../static/images/noData.jpg") no-repeat;
        background-size: contain;
    }

    #yulan .bigContent{ position: fixed;left:10%;top:10%;}
    #yulan .bigContent img{max-width:100%;}



</style>
