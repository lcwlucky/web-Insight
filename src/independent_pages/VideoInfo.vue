<template>
  <div class="video_info clearFix">
    <div class="shot_labels">
      <img :src="nowVideo.info.wordCloudUrl" alt="视频词云">
      <p v-for="(item, key) in validShotLabels" @click="showSegment(item)">{{item.shotlabel}}</p>
    </div>
    <div class="center_outer clearFix"
         :class="{showSpecificInfo:showSpecificInfo,cancelSpecificInfo:!showSpecificInfo}">
      <div class="video_play_outer">
        <video id="media" :src="getVideoUrl()" controls></video>
      </div>
      <div class="shot_cut">
        <div @click="getCutTime" class="general_view" id="general_view"><span :style="{width: (cutTime.width + 'px'),left: (cutTime.left + 'px')}"></span></div>
        <span>{{formatTime(nowVideo.info.duration)}}</span>
        <span class="time">开始时间 {{cutTime.startTime}}</span>~
        <span class="time">结束时间 {{cutTime.endTime}}</span>
        <button @click="upCutTime">裁剪</button>
      </div>
      <div class="shot_labels_show_outer"><span>{{labelName}}</span>
        <div class="shot_labels_show" id="shot_labels_show">
          <span @click="timeLocation(item.startTime)" v-for="(item, index) in validSegments" :key="index"
                class="small_shots"
                :style="{width: (item.width + 'px'),left: (item.startPosition) + 'px'}"></span></div>
      </div>
    </div>
    <div class="specific_info" v-show="showSpecificInfo">
      <p class="info_title"><span class="cancel iconfont icon-close2" @click="cancelSpecificInfo" title="点击关闭详情"></span>视频详情
      </p>
      <div><span>文件信息</span><span class="name_info">{{nowVideo.name}}</span></div>
      <p><span>文件大小</span>{{getFileSize(nowVideo.size)}}</p>
      <p><span>拍摄时间</span>{{unixChange(nowVideo.createTime)}}</p>
      <p><span>时长</span><span>{{formatTime(nowVideo.info.duration)}}</span><span
        v-show="!nowVideo.info.duration">未知</span></p>
      <p><span>比特率</span><span>{{nowVideo.info.bitrate}}</span><span v-show="!nowVideo.info.bitrate">未知</span></p>
      <p><span class="code_title">编码信息</span><span class="code_info">{{nowVideo.info.code}}</span><span
        v-show="!nowVideo.info.code">未知</span></p>
      <div><span class="keyword_title">关键词</span>
        <div class="keyword_outer"><span class="keyword" v-for="(item,index) in nowVideo.info.videoResults.videoLabels"
                                         :key="index">{{item.videolabel}}</span></div>
      </div>
      <div class="tag_pic_info"><span>标签</span>
        <span class="tag" v-for="(item,index) in nowVideo.tag" :key="index">
          {{item}} <img @click="delOneTag(nowVideo.id, item, index)" src="../assets/img/close.png" alt="删除"
                        title="点击删除">
        </span>
        <div class="input_outer">
          <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签"
                 v-on:keyup.enter="addTag(nowVideo.id, index)" :class="nowVideo.tag.length != 0 ? 'have_content': ''">
          <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag(nowVideo.id, index)"></span>
        </div>
      </div>
      <div class="remark_pic_info"><span>评论</span>
        <span class="remark" v-for="(item,index) in nowVideo.comments" :key="index">
          {{item.content}} <img @click="delOneRemark(item.id)" src="../assets/img/close.png" alt="删除" title="点击删除">
        </span>
        <div class="input_outer">
          <input class="remark_input" type="text" v-model="newRemark" placeholder="新增评论"
                 v-on:keyup.enter="addRemark(nowVideo.id)" :class="Object.keys(nowVideo.comments).length != 0 ? 'have_content': ''">
          <span class="iconfont icon-checked_circle remark_tag_input"
                @click="addRemark(nowVideo.id)"></span>
        </div>
      </div>
      <!--      <div class="remark_video_info"><span>用户评价</span>-->
      <!--        <span v-show="!isModifyRemark" class="remarks">{{nowVideo.remark}}</span>-->
      <!--        <span v-show="!isModifyRemark" class="iconfont icon-brush" @click="modifyRemark"></span>-->
      <!--        <div class="input_outer" v-show="isModifyRemark">-->
      <!--          <input v-model="nowVideo.remark" class="remark_input" type="text" placeholder="评价"  v-on:keyup.enter="completeModifyRemark">-->
      <!--          <span class="iconfont icon-checked_circle ok_remark_input" @click="completeModifyRemark"></span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
  import {
    toggleTip,
    inputIsEmpty,
    getFileSize,
    unixChange,
    formatTime,
    fetchList,
    addTag,
    delTag,
    addRemark,
    delRemark, uploadOrUpdate
  } from "../publics/public"

  export default {
    name: "VideoInfo",
    data() {
      return {
        nowVideo: {info: {}},
        showSpecificInfo: true,
        newTag: '',
        newRemark:'',
        validShotLabels: [],
        validSegments: [],
        labelName: '暂无选择',
        cutTime:{startTime:formatTime(), endTime:formatTime(), width:'', left:'', startSecond:0, endSecond:0}
      }
    },
    mounted() {
      this.getVideo()
    },
    methods: {

      //计算视频剪裁的时间段
      getCutTime(){
        const duration = parseInt(this.nowVideo.info.duration)
        const parentW = parseInt(document.getElementById("general_view").offsetWidth)
        const parentLeft = parseInt(document.getElementById("general_view").offsetLeft)
        const left = event.clientX - parentLeft
        const clickSecond = parseInt(left / parentW * duration)
        const clickTime = formatTime(clickSecond)
        var media = document.getElementById("media")
        media.currentTime = clickSecond
        if (!this.cutTime.startSecond) {
          this.cutTime.startSecond = clickSecond
          this.cutTime.startTime = clickTime
          this.cutTime.left = left
        }else if(!this.cutTime.endSecond){
          this.cutTime.endSecond = clickSecond
          this.cutTime.endTime = clickTime
        }else{
          if (clickSecond < this.cutTime.startSecond) {
            this.cutTime.startSecond = clickSecond
            this.cutTime.startTime = clickTime
            this.cutTime.left = left
          }else{
            this.cutTime.endSecond = clickSecond
            this.cutTime.endTime = clickTime
          }
        }
        const spanW = (this.cutTime.endSecond - this.cutTime.startSecond) / duration * parentW
        this.cutTime.width = spanW
        console.log(this.cutTime,2222)
      },
      upCutTime(){
        let formData = new FormData()
        formData.append('url', this.nowVideo.url)
        formData.append('start', this.cutTime.startSecond)
        formData.append('end', this.cutTime.endSecond)
        uploadOrUpdate('/videocut', formData).then(data=>{
          if (data.success){
             //剪裁成功 重置剪裁时间
            this.cutTime = {startTime:formatTime(),endTime:formatTime()}
            toggleTip(this, '裁剪成功，已保存至“处理”文件夹')
          }
        })
      },

      //计算某个标签的位置和宽度
      showSegment(shotLabelsItem) {
        this.validSegments = []
        this.labelName = shotLabelsItem.shotlabel
        let duration = parseInt(this.nowVideo.info.duration)
        let parentW = parseInt(document.getElementById("shot_labels_show").offsetWidth)
        // let parentW = 1100
        // let duration = 309
        shotLabelsItem.segments.forEach(el => {
          let w = (el.endtime - el.starttime) / duration * parentW
          let st = el.starttime / duration * parentW
          this.validSegments.push({startPosition: st, width: w, startTime: el.starttime})
        })
        // console.log('validSegments:', this.validSegments)
      },
      timeLocation(time) {
        var media = document.getElementById("media")
        media.currentTime = time
      },
      getVideo(){
        const id = this.$route.query.id
        const childUrl = '/fileinfo/' + id
        fetchList(childUrl).then(data => {
          data.info = JSON.parse(data.info)
          if (data.keyword) {
            data.keyword = data.keyword.split('|')
          }
          if (data.tag) {
            data.tag = data.tag.split('|')
          } else {
            data.tag = []
          }
          this.nowVideo = data
          this.getShotLabels()
        })
      },
      getVideoUrl() {
        var baseUrl = window.baseUrl + '/testpreview/'
        return baseUrl + this.nowVideo.url
      },
      getShotLabels() {
        var shotLabels = this.nowVideo.info.videoResults.shotLabels
        shotLabels.forEach(el => {
          if (!el.segments) {
            return
          }
          this.validShotLabels.push(el)
        })
        console.log(this.validShotLabels)
      },
      cancelSpecificInfo() {
        this.showSpecificInfo = false
      },
      needSpecificInfo() {
        this.showSpecificInfo = true
      },
      delOneTag(id, name, index) {
        delTag(id, name).then(data => {
          if (data.success) {
            this.nowVideo.tag.splice(index, 1)
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      delOneRemark(cid) {
        const index = this.nowVideo.comments.findIndex(el => {
          return el.id == cid
        })
        delRemark(cid).then(data => {
          if (data.success) {
            this.nowVideo.comments.splice(index, 1)
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      addTag(pid, index) {
        // 1.本地验证
        if (!this.newTag) {
          inputIsEmpty(this, '不能添加空标签')
          return
        }
        addTag(pid, this.newTag).then(data => {
          if (data.success) {
            this.nowVideo.tag.splice(index, 1)
            this.newTag = ''
          }

        }).catch(error => {
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
          if (data.success) {
            this.nowVideo.comments.push({content: this.newRemark})
            this.newRemark = ''
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      unixChange(timeStamp) {
        return unixChange(timeStamp)
      },
      getFileSize(size) {
        return getFileSize(size)
      },
      formatTime(second) {
        return formatTime(second)
      }
    }
  }
</script>

<style scoped>
  .have_content{
    margin-left: 80px;
  }
  /*裁剪开始*/
  .shot_cut{
    background-color: #cfcfcf;
    border-radius: 5px;
    height: 30px;
    padding: 0 3px;
    margin-top: 10px;
    color: #1f1f1f;
  }
  .shot_cut .time {
    font-size: 14px;
  }
  .general_view{
    display: inline-block;
    width: 50%;
    background-color: #eeeeee;
    border-radius: 5px;
    height: 10px;
    line-height: 30px;
    cursor: pointer;
    position: relative;
  }
  .general_view>span{
    background-color: #6495ed57;
    height: 30px;
    border-radius: 5px;
    position: absolute;
    top: -10px;
  }
  .shot_cut>span{
    margin: 5px;
  }
  .shot_cut>button{
    padding: 4px 10px;
    background-color: cornflowerblue;
    outline: none;
    border: 1px solid cornflowerblue;
    border-radius: 5PX;
    color: white;
    cursor: pointer;
    margin-left: 30px;
  }
  /*裁剪结束*/
  .shot_labels {
    padding: 10px;
    width: 180px;
    float: left;
    height: 700px;
    overflow: auto;
  }

  .shot_labels > img {
    width: 160px;
    display: block;
  }

  .shot_labels > p {
    display: inline-block;
    width: 60px;
    padding: 5px;
    cursor: pointer;
    background-color: #e8e8e8;
    border-radius: 5px;
    margin: 5px;
    font-size: 12px;
    color: #252525;
  }

  .shot_labels > p:hover {
    font-size: 14px;
    color: cornflowerblue;
  }

  .center_outer {
    float: left;
    width: 1010px;
  }

  .video_play_outer {
    background-color: #444444;
    padding: 10px;
    box-sizing: border-box;
    height: 600px;
  }

  .video_play_outer video {
    width: 100%;
    height: 100%;
    outline: none;
  }

  .shot_labels_show_outer {
    width: 100%;
    margin-top: 20px;
  }

  .shot_labels_show_outer > span {
    display: inline-block;
    text-align: center;
    padding: 10px;
    width: 70px;
    vertical-align: middle;
    color: #b3b3b3;
    word-break: break-all;
  }

  .shot_labels_show {
    vertical-align: middle;
    display: inline-block;
    width: 90%;
    height: 30px;
    background-color: #dfdfdf;
    border-radius: 5px;
    margin: 10px 0;
    box-sizing: border-box;
    position: relative;
  }

  .shot_labels_show span.small_shots {
    background-color: #bf3f0d;
    height: 30px;
    position: absolute;
    cursor: pointer;
  }

  .showSpecificInfo {
    width: 1010px;
  }

  .cancelSpecificInfo {
    width: 90%;
  }

  .specific_info {
    background-color: white;
    float: left;
    width: 300px;
  }

  .specific_info .name_info {
    width: 180px;
    word-break: break-word;
    display: inline-block;
  }

  .specific_info .code_info {
    font-size: 13px;
    width: 180px;
    word-break: break-word;
    display: inline-block;
  }

  .specific_info > p > span:first-child,
  .specific_info > div > span:first-child {
    color: rgba(133, 127, 127, 0.85);
    display: inline-block;
    width: 80px;
    float: left;
  }

  .specific_info .color > div {
    height: 30px;
    float: left;
  }

  .specific_info .keyword_outer {
    width: 180px;
    display: inline-block;
  }

  .specific_info .info_title {
    color: rgba(51, 51, 51, 0.8);
    font-size: 20px;
  }

  .specific_info .cancel:hover {
    color: rgba(33, 33, 33, 0.89);
  }

  .specific_info > span {
    font-size: 20px;
  }

  .specific_info > p,
  .specific_info > div {
    padding: 10px;
    margin: 10px;
  }

  .specific_info > p:first-child {
    margin-bottom: 15px;
  }

  .specific_info .input_outer {
    position: relative;
    display: inline-block;
  }

  .specific_info .tag_video_info .input_outer {
    margin-left: 80px;
  }

  .specific_info .tag_input,
  .specific_info .remark_input {
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 17px 2px 4px;
    font-size: 12px;
  }

  .specific_info .ok_tag_input,
  .specific_info .remark_tag_input {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }

  .specific_info .tag_video_info .tag {
    font-size: 11px;
  }

  .specific_info .remark_video_info .remarks {
    font-size: 13px;
    margin-right: 10px;
  }

  .specific_info .remark_video_info .icon-brush {
    font-size: 13px;
    color: cornflowerblue;
    cursor: pointer;
  }

  .specific_info > .info_title > span.cancel {
    cursor: pointer;
    font-size: 18px;
    width: 40px
  }

</style>
