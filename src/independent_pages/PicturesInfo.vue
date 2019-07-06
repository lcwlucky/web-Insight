<template>
  <div class="pictures_info">
    <div class="pic_show">
      <div v-if="isTailor" class="tailor">
        <VueCropper ref="cropper" :img="getPicUrll(nowPicture.url)"></VueCropper>
      </div>
      <el-carousel v-if="!isTailor" :class="{showSpecificInfo:showSpecificInfo,cancelSpecificInfo:!showSpecificInfo}" @change="changes"
                   indicator-position="outside" :autoplay="F" height="690px" :initial-index="initIndex">
        <el-carousel-item v-for="(item,index) in allPictures " :key="index">
          <!--空标签用来让图片垂直居中-->
          <span></span>
          <img :src="getPicUrl(item.url)" alt="图片详情">
        </el-carousel-item>
      </el-carousel>
    </div>
<!--    <div class="nav" :class="{showSpecificInfo:showSpecificInfo,cancelSpecificInfo:!showSpecificInfo}"-->
<!--         v-show="isEntering">-->
<!--      <a href="nowPicture.url" download="img"><span class="iconfont icon-download">下载</span></a>-->
<!--      <span class="iconfont icon-share-nocircle" @click="share">分享</span>-->
<!--      <span class="iconfont icon-print" @click="printPic">打印</span>-->
<!--      <span class="iconfont icon-tailor" @click="tailor">裁剪</span>-->
<!--      <span class="iconfont icon-show_info" @click="needSpecificInfo">显示详细信息</span>-->
<!--    </div>-->
    <div class="specificInfo" v-show="showSpecificInfo">
      <p class="info_title"><span class="cancel iconfont icon-close2" @click="cancelSpecificInfo" title="点击关闭详情"></span>图片详情
      </p>
      <div><span class="info_name_title">文件信息</span>
        <span class="info_name">{{nowPicture.name}}</span>
        <p class="WHAndSize"><span>{{getFileSize(nowPicture.size)}}&nbsp&nbsp&nbsp</span><span>{{nowPicture.info.width}}&times;{{nowPicture.info.height}}px</span>
        </p>
      </div>
      <p v-show="nowPicture.info.createTime"><span>拍摄时间</span><span>{{unixChange(nowPicture.info.createTime)}}</span>
      </p>
      <p v-show="!nowPicture.info.createTime"><span>上传时间</span><span>{{unixChange(nowPicture.uploadTime)}}</span></p>
      <p><span>拍摄参数</span>{{nowPicture.info.modal}}<span v-show="!nowPicture.info.modal">未知</span></p>
      <div class="clearFix"><span class="location_title">拍摄地点</span><div class="location_outer">{{nowPicture.info.location}}<span v-show="!nowPicture.info.location">未知</span></div></div>
      <div class="clearFix"><span class="ocr_title">OCR</span><div class="ocr_outer">{{nowPicture.info.ocrInfo}}<span v-show="!nowPicture.info.ocrInfo">无</span></div></div>
      <div class="clearFix"><span class="color_title">色系</span>
        <div class="color clearFix">
          <div v-for="(colorItem, index) in nowPicture.info.colors" :key="index"
               :style="getColorWidth(colorItem)"></div>
        </div>
      </div>
      <div><span class="keyword_title">关键词</span>
        <div class="keyword_outer"><span class="keyword" v-for="(item,index) in nowPicture.keyword" :key="index">{{item}}</span>
        </div>
      </div>
      <div class="tag_pic_info"><span>标签</span>
        <span class="tag" v-for="(item,index) in nowPicture.tag" :key="index"  >
           {{item}}<img @click="delOneTag(nowPicture.id, item, index)" src="../assets/img/close.png" alt="删除" title="点击删除">
        </span>
        <div class="input_outer">
      <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签"
             v-on:keyup.enter="addTag(nowPicture.id)" :class="nowPicture.tag.length != 0 ? 'have_content': ''">
      <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag(nowPicture.id)"></span>
    </div>
    </div>
      <div class="remark_pic_info"><span>评论</span>
        <span class="remark" v-for="(item,index) in nowPicture.comments" :key="index">
          {{item.content}} <img @click="delOneRemark(item.id)" src="../assets/img/close.png" alt="删除" title="点击删除">
        </span>
        <div class="input_outer">
          <input class="remark_input" type="text" v-model="newRemark" placeholder="新增评论"
                 v-on:keyup.enter="addRemark(nowPicture.id)" :class="Object.keys(nowPicture.comments).length != 0 ? 'have_content': ''">
          <span class="iconfont icon-checked_circle ok_remark_input"
                @click="addRemark(nowPicture.id)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { VueCropper }  from 'vue-cropper'
  import {
    toggleTip,
    getFileSize,
    inputIsEmpty,
    unixChange,
    fetchList,
    addTag,
    addRemark,
    delTag,
    delRemark
  } from "../publics/public"

  export default {
    components: {
      VueCropper
    },
    data() {
      return {
        F: false,
        markup: '',
        allPictures: [],
        showSpecificInfo: true,
        nowPicture: {info: {}},
        initIndex: 0,
        isEntering: true,
        newTag: '',
        newRemark: '',
        nowId: 0,
        isTailor: false
      }
    },
    mounted() {
      this.getAllPics()
    },
    methods: {
      getAllPics(){
        this.nowId = this.$route.query.id
        // 1.获取所有图片  2.显示之前点击图片
        fetchList('/imageinfo').then(data => {
          data.forEach(el => {
            if (!el.info){
              el.info = JSON.stringify({})
            }
            el.info = JSON.parse(el.info)
            if (el.keyword) {
              el.keyword = el.keyword.split('|')
            }
            if (el.tag) {
              el.tag = el.tag.split('|')
            } else {
              el.tag = []
            }
          })
          this.allPictures = data
          //得到当前显示图片的id
          this.initIndex = this.allPictures.findIndex(el => {
            return el.id == this.nowId
          })
          //当前显示的图片
          this.nowPicture = this.allPictures[this.initIndex]
          console.log(this.nowPicture,111)
        }).catch((error) => {
          toggleTip(this, error)
        })
      },
      getPicUrl(url) {
        var baseUrl = window.baseUrl + "/testpreview/"
        return baseUrl + url
      },
      getPicUrll(url) {
        var baseUrl = window.baseUrl + "/testpreview/"
        console.log(baseUrl + url,111)
        return baseUrl + url
      },
      unixChange(timeStamp) {
        return unixChange(timeStamp)
      },
      getColorWidth(item) {
        let r = item.red
        let g = item.green
        let b = item.blue
        let bgc = ("background-color: rgb(" + r + "," + g + "," + b + ");")
        let w = (Math.round(item.score * Math.pow(10, 2 + 2)) / Math.pow(10, 2)).toFixed(2) + '%'
        return bgc + ("width: " + w)
      },
      delOneTag(id, name, index) {
        delTag(id, name).then(data => {
          if (data.success) {
            this.nowPicture.tag.splice(index, 1)
          }
        }).catch(error=>{
          toggleTip(this, error)
        })
      },
      delOneRemark(cid) {
        const index = this.nowPicture.comments.findIndex(el => {return el.id == cid})
        delRemark(cid).then(data => {
          if (data.success) {
            this.nowPicture.comments.splice(index, 1)
          }
        }).catch(error=>{
          toggleTip(this, error)
        })
      },
      addTag(pid) {
        // 1.本地验证
        if (!this.newTag) {
          inputIsEmpty(this, '不能添加空标签')
          return
        }
        addTag(pid, this.newTag).then(data => {
          if(data.success){
            this.nowPicture.tag.push(this.newTag)
            this.newTag = ''
          }

        }).catch(error=>{
          toggleTip(this, error)
        })
      },
      addRemark(pid) {
        // 1.本地验证
        if (!this.newRemark) {
          inputIsEmpty(this, '不能添加空评论')
          return
        }
        addRemark(pid, this.newRemark).then(data => {
          if (data.success){
            this.nowPicture.comments.push({content: this.newRemark})
            this.newRemark = ''
          }
        }).catch(error=>{
          toggleTip(this, error)
        })
      },
      getFileSize(size) {
        return getFileSize(size)
      },
      cancelSpecificInfo() {
        this.showSpecificInfo = false
      },
      needSpecificInfo() {
        this.showSpecificInfo = true
      },
      tailor(){
        this.isTailor = true
      },
      share() {

      },
      printPic() {

      },
      changes(index, oldIndex) {
        this.nowPicture = this.allPictures[index]
      }
    }
  }
</script>

<style scoped>
  .have_content{
    margin-left: 85px;
  }
  .nav {
    position: absolute;
    top: 10px;
    z-index: 200;
    text-align: center;
  }

  .nav > a {
    text-decoration: none;
  }

  .nav span {
    color: white;
    margin: 10px;
    cursor: pointer;
  }

  .specificInfo {
    background-color: white;
    width: 24%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }

  .specificInfo .info_name_title {
    float: left;
  }

  .specificInfo .info_name {
    display: inline-block;
    width: 225px;
    word-break: break-word;
  }

  .specificInfo > p > span:first-child,
  .specificInfo > div > span:first-child {
    color: rgba(133, 127, 127, 0.85);
    display: inline-block;
    width: 80px;
  }

  .specificInfo > div .WHAndSize {
    color: #c1c1c1;
    padding: 5px 0 5px 80px;
    font-size: 14px;
  }

  .specificInfo .color_title {
    float: left;
  }

  .specificInfo .color {
    display: inline-block;
    width: 235px;
    height: 30px;
  }

  .specificInfo .color > div {
    height: 30px;
    float: left;
  }

  .specificInfo .keyword_title,
  .specificInfo .ocr_title,
  .specificInfo .location_title{
    float: left;
  }

  .specificInfo .keyword_outer,
  .specificInfo .ocr_outer,
  .specificInfo .location_outer{
    width: 235px;
    display: inline-block;
  }

  .info_title {
    color: rgba(51, 51, 51, 0.8);
    font-size: 20px;
  }

  .cancel:hover {
    color: rgba(33, 33, 33, 0.89);
  }

  .specificInfo > span {
    font-size: 20px;
  }

  .specificInfo > p,
  .specificInfo > div {
    padding: 10px;
    margin: 10px;
  }

  .specificInfo > p:first-child {
    margin-bottom: 15px;
  }

  .specificInfo .input_outer {
    position: relative;
    display: inline-block;
  }

  .specificInfo .tag_pic_info .input_outer {
    /*margin-left: 85px;*/
  }

  .specificInfo .tag_input,
  .specificInfo .remark_input {
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 17px 2px 4px;
    font-size: 12px;
  }

  .specificInfo .ok_tag_input,
  .specificInfo .ok_remark_input {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }

  .specificInfo .tag_pic_info .tag,
  .specificInfo .remark_pic_info .remark{
    font-size: 11px;
  }

  .specificInfo > .info_title > span.cancel {
    cursor: pointer;
    font-size: 18px;
    width: 40px
  }

  .showSpecificInfo {
    width: 76%;
  }

  .cancelSpecificInfo {
    width: 100%;
  }
  .pic_show{
    height: 100%;
  }
  .tailor{
    width: 76%;
    height: 800px;
  }
  .el-carousel {
    height: 100%;
    text-align: center;
  }

  .cropper-box-canvas{
    width: 100%;
    height: 800px;
  }
  .el-carousel__item > span {
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }

  .el-carousel__item > img {
    vertical-align: middle;
    max-width: 1100px;
    max-height: 96%;
  }

  .el-carousel__item {
    background-color: rgba(17, 17, 17, 0.97);
  }

</style>
