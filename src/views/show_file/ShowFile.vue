<template>
  <div class="show_file clearFix">
    <div class="file_nav">
      <span @click="backToAll">返回 </span>
      <span v-show="fromSearch" @click="backToSearch">返回搜索页面 </span>
<!--      <a href="javascript:POBrowser.openWindowModeless('edit/30','width=1200px;height=800px;');">在线编辑ss</a>-->
      <span class="editFile" @click="editFile">在线编辑</span>
      <span class="" v-show="nowFile.name.split('.').pop() == 'pdf'" @click="dialogVisible = true">拆分文档</span>
      <span class="" v-show="nowFile.name.split('.').pop() == 'pdf'" @click="pdfToPng">转图片</span>
    </div>
    <div class="file_info">
      <svg class="icon" aria-hidden="true" @click.stop="toggleCollectionNotIndex">
        <use v-show="!nowFile.collection" xlink:href="#icon-collection"></use>
        <use v-show="nowFile.collection" xlink:href="#icon-collection_fill"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @click.stop="toggleAttentionNotIndex">
        <use v-show="!nowFile.attention" xlink:href="#icon-like"></use>
        <use v-show="nowFile.attention" xlink:href="#icon-like_fill"></use>
      </svg>
      <p><span>文件名</span><span v-html="nowFile.name"></span></p>
      <p><span>文件类型</span>{{type}}</p>
      <p><span>文件大小</span>{{size}}</p>
      <p><span>创建时间</span>{{lastTime}}</p>
      <div><span>关键词</span><span class="keyword" v-for="(item,index) in nowFile.keyword" :key="index" v-html="item"></span>
        <p><img class="wordCloud" :src="nowFile.info.wordCloudUrl" alt="词云"></p>
      </div>
      <div class="tag_pic_info"><span>标签</span>
        <span class="tag" v-for="(item,index) in nowFile.tag" :key="index" >
          <span v-html="item"></span>
          <img @click="delOneRemark(item.id)" src="../../assets/img/close.png" alt="删除" title="点击删除">
        </span>
        <div class="input_outer">
          <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签" :class="nowFile.tag.length != 0 ? 'have_content': ''"
                 v-on:keyup.enter="addTag(nowFile.id)">
          <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag(nowFile.id)"></span>
        </div>
      </div>
      <div class="remark_pic_info"><span>评论</span>
        <span class="remark" v-for="(item,index) in nowFile.comments" :key="index">
          <span  v-html="item.content"></span>
          <img @click="delOneRemark(item.id)" src="../../assets/img/close.png" alt="删除" title="点击删除">
        </span>
        <div class="input_outer">
          <input class="remark_input" type="text" v-model="newRemark" placeholder="新增评论" :class="Object.keys(nowFile.comments).length != 0 ? 'have_content': ''"
                 v-on:keyup.enter="addRemark(nowFile.id)">
          <span class="iconfont icon-checked_circle ok_remark_input"
                @click="addRemark(nowFile.id)"></span>
        </div>
      </div>
    </div>
    <iframe :src="url" frameborder="0"></iframe>
    <div class="separate_page">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span>请输入要拆分的页码</span>
        <span><input class="separate_input" v-model="ids" type="text" placeholder="以空格分隔"></span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="separateFile">确定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import {
    getFileSize,
    unixChange,
    inputIsEmpty,
    toggleCollection,
    toggleAttention,
    toggleTip,
    addTag, delTag,
    addRemark, delRemark, uploadOrUpdate
  } from "../../publics/public";

  export default {
    name: "ShowFile",
    data() {
      return {
        markup: '',
        newTag: '',
        newRemark:'',
        fromSearch: false,
        dialogVisible: false,
        ids:''
      }
    },
    mounted(){
      this.fromSearch = this.$route.params.fromSearch
      if (!this.nowFile.comments) {
        this.nowFile.comments = {}
      }
    },
    computed: {
      ...mapState(['nowFile']),
      nowFile:{
        get(){
          return this.$store.state.nowFile
        },
        set(val){
          deep: true
          handles:{
            this.$store.state.nowFile = val
          }
        }
      },
      editName(){
        return 'edit/' + this.nowFile.id
      },
      url(){
        const childUrl = this.getPdfUrl(this.nowFile.url)
        return window.baseUrl + '/testpreview/' + childUrl
      },
      type() {
        if (!this.nowFile) {
          return
        }
        const ext = this.nowFile.name.split('.').pop()
        return ext
      },
      size() {
        return getFileSize(this.nowFile.size)
      },
      lastTime() {
        return unixChange(this.nowFile.createTime)
      }
    },
    methods: {
      pdfToPng() {
        let formData = new FormData()
        formData.append('url', this.nowFile.url)
        uploadOrUpdate('/pdftopng', formData).then(data=>{
          if (data.success){
            toggleTip(this, '转换',data.file,'成功，已保存至“处理文件”中')
            this.dialogVisible = false
            const routeData = this.$router.resolve({
              name: 'PicturesInfo',
              query: {id: data.index}
            });
            window.open(routeData.href, '_blank');
          }
        }).catch(error=>{
          toggleTip(this, error)
        })
      },
      separateFile(){
        const ids = this.ids.split(' ')
        let formData = new FormData()
        formData.append('url', this.nowFile.url)
        formData.append('indexs', ids)
        uploadOrUpdate('/pdfsplit', formData).then(data=>{
          if (data.success){
            toggleTip(this, '拆分成功，已保存至“处理文件”中')
            this.dialogVisible = false
          }
        }).catch(error=>{
          toggleTip(his, error)
        })
      },
      backToSearch(){
        this.$router.push('/main/insightInfo')
      },
      editFile(){
       window.POBrowser.openWindowModeless(this.editName,'width=1200px;height=800px;')
      },
      backToAll() {
        this.$router.replace('/main/documents')
      },
      getPdfUrl(url) {
        const pdfUrlTemp = url.split('.').slice(0, url.split('.').length - 1)
        pdfUrlTemp.push('.pdf')
        return pdfUrlTemp.join("")
      },
      toggleCollection() {
        toggleCollection(this, this.nowFile)
      },
      toggleAttention() {
        toggleAttention(this, this.nowFile)
      },
      delOneTag(id, name, index) {
        delTag(id, name).then(data => {
          if (data.success) {
            this.nowFile.tag.splice(index, 1)
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      delOneRemark(cid) {
        const index = this.nowFile.comments.findIndex(el => {
          return el.id == cid
        })
        delRemark(cid).then(data => {
          if (data.success) {
            this.nowFile.comments.splice(index, 1)
          }
        }).catch(error => {
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
          if (data.success) {
            this.nowFile.tag.push(this.newTag)
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
            this.nowFile.comments.push({content: this.newRemark})
            this.newRemark = ''
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      Save() {
        document.getElementById("PageOfficeCtrl1").WebSave();
      },
      AddSeal() {
        try{
          document.getElementById("PageOfficeCtrl1").ZoomSeal.AddSeal();
        }catch (e){ };
      }
    }
  }
</script>

<style scoped>
  .file_nav {
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
    padding-left: 50px;
    color: cornflowerblue;
  }
  .file_nav .editFile>a{
    padding-left: 20px;
    text-decoration: none;
    color: cornflowerblue;
  }
  .file_nav >span:hover,.file_nav .editFile>a:hover{
    color: #5783d0;
  }
  .file_nav > span {
    cursor: pointer;
    margin-right: 20px;
  }
  .separate_input{
    outline: none;
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 5px;
    width: 150px;
  }
  .have_content{
    margin-left: 85px;
  }
  .show_file iframe {
    width: 75%;
    height: 780px;
    background-color: #e3e3e3;
    float: right;
  }

  .file_info {
    background: linear-gradient(#ededed, white, white, white, white, white);
    width: 25%;
    float: left;
  }

  .file_info > svg {
    color: cornflowerblue;
    font-size: 20px;
    margin: 10px;
    padding: 10px;
  }

  .file_info .wordCloud {
    width: 260px;
  }

  .file_info > p > span:first-child,
  .file_info > div > span:first-child {
    color: cornflowerblue;
    display: inline-block;
    width: 80px;
  }

  .file_info .color > div {
    height: 30px;
    float: left;
  }

  .file_info > span {
    font-size: 20px;
  }

  .file_info > p,
  .file_info > div {
    padding: 10px;
    margin: 10px;
  }

  .file_info > p:first-child {
    margin-bottom: 15px;
  }

  .file_info .input_outer {
    position: relative;
    display: inline-block;
  }

  .file_info .tag_file_info .input_outer {
    margin-left: 85px;
  }

  .file_info .tag_input,
  .file_info .remark_input {
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 17px 2px 4px;
    font-size: 12px;
  }

  .file_info .ok_tag_input,
  .file_info .ok_remark_input {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }

  .file_info .tag_file_info .tag {
    font-size: 11px;
  }

  .file_info .remark_file_info .remarks {
    font-size: 13px;
    margin-right: 10px;
  }

  .file_info .remark_file_info .icon-brush {
    font-size: 13px;
    color: cornflowerblue;
    cursor: pointer;
  }
</style>
