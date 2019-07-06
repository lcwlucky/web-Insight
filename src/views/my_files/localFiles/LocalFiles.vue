<template>
  <div class="local-files" >
    <OperationBG :navContent="navContent"></OperationBG>
    <header>
      <span class="disk">当前绑定：<span>{{absolutePath}}</span></span>
      <span placeholder="重新绑定" class="choose_file_input"><span data-v-6be7b2a8="">重新绑定</span>
      <input class="file_input" type="file" webkitdirectory @change="getFiles"> </span>
      <el-switch
        v-model="toBackEnd"
        active-text="内容分析"
        active-value="false"
        inactive-text="">
      </el-switch>
      <input class="search-input" type="text" placeholder="文件名搜索" v-model="searchKey" @change="search">
    </header>
    <section class="clearFix content">
      <div class="left_content">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree :data="isSearch ? backup : catalog" :props="defaultProps" class="filter-tree"
                 default-expand-all
                 :filter-node-method="filterNode"
                 ref="tree2":highlight-current="T" @current-change="nodeChange"></el-tree>
      </div>
      <div class="six_info_outer">
        <div class="">
          <div class="pics_outer">
            <div class="title">图片 <span class="no_result" v-show="!fives.pics || !fives.pics.length">暂无图片</span></div>
            <span v-if="fives.pics.length > 0" class="mergeBtn" @click="mergeImages">
      <svg class="icon" aria-hidden="true"><use xlink:href="#icon-merge"></use></svg>合并图片</span>
            <span v-if="fives.pics.length > 0" class="albumBtn" @click="albumImages">
      <svg class="icon" aria-hidden="true"><use xlink:href="#icon-album_white"></use></svg>合成GIF</span>
            <div class="pics">
              <div class="pics_item" v-for="(item, index) in fives.pics"
                   :key="index" :class="item.itemChecked ? 'blockItemCheckedClass' : 'loo'">
                <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
                <div class="img_outer" @click="openFile(item)"
                     :style="{'background-image': 'url('+getPicUrl(item.file) +')'}"></div>
                <p>{{item.file.name}}</p>
              </div>
            </div>
          </div>
          <div class="videos_outer">
            <div class="title">视频 <span class="no_result" v-show="!fives.videos || !fives.videos.length">暂无视频</span>
            </div>
            <div class="videos">
              <div class="videos_item" v-for="(item, index) in fives.videos" :key="index"
                   :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
                <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
                <div class="img_outer" @click="openFile(item)">
<!--                  <img :src="getVideoPre(item)" alt="视频预览图">-->
                  <video id="video" :src="getPicUrl(item.file)" alt="视频预览图" controls></video>
                </div>
                <p v-html="item.file.name"></p>
              </div>
            </div>
          </div>
          <div class="docs_outer">
            <div class="title"> 文档 <span class="no_result" v-show="!fives.docs|| !fives.docs.length">暂无文档</span></div>
            <div class="docs_item" v-for="item in fives.docs" @click.stop="itemCheck(item)"
                 :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
              <svg class="icon" aria-hidden="true">
                <use :xlink:href=fileIconsOrOthers(item.file)></use>
              </svg>
              <span @click="openFile(item)" v-html="item.file.name"></span>
            </div>
          </div>
          <div class="audios_outer">
            <div class="title">音频 <span class="no_result" v-show="!fives.audios|| !fives.audios.length">暂无音频</span></div>
            <div v-for="item in fives.audios" @click.stop="itemCheck(item)"
                 :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-mp3"></use>
              </svg>
              <span v-html="item.file.name" @click="openFile(item)"></span>
            </div>
          </div>
          <div class="others">
            <div class="title">其他 <span class="no_result" v-show="!fives.others|| !fives.others.length">暂无其他</span></div>
            <p class="others_item" v-for="item in fives.others" @click.stop="itemCheck(item)"
               :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
              <svg class="icon" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(item.file)></use></svg>
              <span v-html="item.file.name"></span></p>
          </div>
        </div>
      </div>
    </section>
    <div v-show="mergeOk" class="mask">
      <div class="merge-img" :style="{height: canvasHeight}">
        <a download :href=finalImageUrl class="download-img" >
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-download-copy"></use></svg>下载自本地</a>
        <span class="upload-img">
           <svg class="icon" aria-hidden="true"><use xlink:href="#icon-up-file-copy"></use></svg>保存自云端</span>
        <span class="close-img" @click="closeImg">&times;</span><br>
        <div id="image-container" class="image-container" ></div>
      </div>

    </div>
  </div>
</template>

<script>
  import OperationBG from "../../../components/OperationBG";
  import { mapState } from "vuex";
  import {fetchList, inputIsEmpty, toggleTip} from "../../../publics/public";

  export default {
    components: {OperationBG},
    name: "LocalFiles",
    data() {
      return {
        navContent: {
          icon: '&#xe651;',
          text: '本地文件'
        },
        toBackEnd: true,
        absolutePath: '无绑定',
        catalog: [],
        fives:{docs:[], pics: [], videos:[], audios: [], others: []},
        searchKey: '',
        T: true,
        defaultProps: {children: 'children', label: 'label'},
        files:[],
        isSearch: false,
        backup: [],
        filterText:'',
        checkedFiles: [],
        finalImageUrl: '',
        canvasHeight: ''
      }
    },
    mounted(){
      console.log('LOCAL mounted')
      this.watchClick()
    },
    destroyed(){
      console.log('LOCAL destroy')

    },
    computed:{
      ...mapState(['file_icons','mergeOk']),
      mergeOk:{
        get(){
          return this.$store.state.mergeOk
        },
        set(val){
          this.$store.state.mergeOk = val
        }
      }
    },
    methods: {
      get(){
        fetchList('/local').then(data=>{
          this.setCatalog(data)
          // this.$nextTick(()=>{
          //   this.addFileIcon()
          // })
        }).catch(error=>{
          toggleTip(this, error)
        })
      },
      getFiles() {
        this.files = []
        this.catalog = []
        const fileList = [...event.target.files]
        this.absolutePath = fileList[0].webkitRelativePath.split('/')[0]
        const path = []
        let id = 0
        fileList.forEach(el => {
          const item = {file: el, id: id++, itemChecked: false}
          this.files.push(item)
          this.classify(item)
          path.push({id: id, path: el.webkitRelativePath})
        })
        // console.log(path,222)
        this.setCatalog(path)
      },
      addFileIcon(){
        const spans = Array.from(document.querySelectorAll(".el-tree-node__label"))
        console.log(spans,777)
        spans.forEach(el=>{
          const oldText = el.innerHTML
          console.log(oldText,1111)
          el.innerHTML = `<svg class="icon" style="margin-right: 10px;" aria-hidden="true"> <use xlink:href="#icon-aFile"></use> </svg>` + oldText

        })
      },
      setCatalog(path) {
        const children = []
        let count = -1
        for (let item of path) {
          const p = item.path ? item.path : item
          const arr = p.split('/')
          let currentChildren = children
          let child = null
          let i = 0
          for (let name of arr) {
            child = currentChildren.find(({label}) => label === name)
            if (!child) {
              child = {
                label: name,
                id: i === arr.length - 1 ? (item.id || 0) : count--,
                children: []
              }
              currentChildren.push(child)
            }
            currentChildren = child.children
            i++
          }
        }
        this.catalog = children
      },
      classify(item){
        const curType = item.file.name.split('.').pop().toLocaleLowerCase()
        if (['doc', 'docx', 'pdf', 'xls', 'txt', 'md','ppt','pptx'].indexOf(curType) >= 0) {
          // item.type = 'docu'
          this.fives.docs.push(item)
        } else if (['jpg', 'png', 'gif'].indexOf(curType) >= 0) {
          // item.type = 'image'
          this.fives.pics.push(item)
        } else if (['movie', 'mp4', 'avi','wmv'].indexOf(curType) >= 0) {
          // item.type = 'video'
          this.fives.videos.push(item)
        } else if (['mp3', 'wav'].indexOf(curType) >= 0) {
          // item.type = 'audio'
          this.fives.audios.push(item)
        } else {
          // item.type = 'others'
          this.fives.others.push(item)

        }
      },
      nodeChange(data, obj) {
        // 点击对象为具体文件id>=0 或 总文件id=-1时
        if (data.id >= 0) {
          return
        }
        this.fives = {docs:[], pics: [], videos:[], audios: [], others: []}
        data.children.forEach(el=>{
          this.findItem(el)
        })
      },
      findItem(el){
        // id < 0 为文件夹
        if (el.id < 0){
          el.children.forEach(el=>{
            this.findItem(el)
            return
          })
        }
        for (let i=0; i< this.files.length - 1;i++){
          let item = null
          if (el.id === this.files[i].id){
            item = this.files[i]
            this.classify(item)
            break
          }
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      watchClick(){
        document.addEventListener('click', function () {
          this.mergeOk = false
          console.log('ssss',this.mergeOk)
        })
      },
      search(){
        const searchKey = this.searchKey.trim()
        if(!searchKey){
          this.isSearch = false
          this.backup = []
          return
        }
        this.backup = []
        this.backup.push({
          label: searchKey,
          children: []
        })
        this.files.forEach(el=>{
          if (el.file.name.indexOf(searchKey) != -1){
            // el.name = [...el.name]
            this.backup[0].children.push({label: el.file.name, id: el.id})
            this.classify(el)
          }
        })
        // 没有搜索结果
        if (this.backup[0].children.length == 0){
          this.backup = []
        }
        console.log(this.backup)
        this.isSearch = true
      },
      fileIconsOrOthers(item){
        // const nowFile = this.others.find(el=>{ return el.id == id})
        const ext = item.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      mergeImages(){
        if (this.checkedFiles.length <= 1){
          inputIsEmpty(this, '请至少选择两张图片')
          return
        }
        // 拼出来的图片的宽度
        const width = 400

        // 拼出来的图片的质量，0-1之间，越大质量越好
        const encoderOptions = 0.5
        const imageDiv = document.getElementById('image-container')

        // 根据图片文件拿到图片实例
        const filesToInstances = (files, callback) => {
          const length = files.length
          let instances = []
          let finished = 0

          files.forEach((item, index) => {
            const reader = new FileReader()
            // 把文件读为 dataUrl
            reader.readAsDataURL(item.file)
            reader.onload = e => {
              const image = new Image()
              image.src = e.target.result
              image.onload = () => {
                // 图片实例化成功后存起来
                instances[index] = image
                finished ++
                if (finished === length) {
                  callback(instances)
                }
              }
            }
          })
        }

        // 拼图
        const drawImages = (images, callback) => {
          const heights = images.map(item => width / item.width * item.height)
          const canvasHeight = heights.reduce((total, current) => total + current)
          this.canvasHeight = canvasHeight
          console.log(this.canvasHeight,888)
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = canvasHeight
          const context = canvas.getContext('2d')

          let y = 0

          images.forEach((item, index) => {
            const height = heights[index]
            context.drawImage(item, 0, y, width, height)
            y += height
          })
          callback(canvas.toDataURL('image/jpeg', encoderOptions))
        }


        filesToInstances(this.checkedFiles, instances => {
          drawImages(instances, finalImageUrl => {
            this.mergeOk = true
            this.finalImageUrl = finalImageUrl
            imageDiv.innerHTML = `<div style="text-align: center;overflow: auto;"><img src=${finalImageUrl}></div>`
          })
        })
      },
      closeImg(){
        this.checkedFiles.forEach(el=>{
          el.itemChecked = false
        })
        this.checkedFiles = []
        this.mergeOk = false
      },
      albumImages(){

      },
      openFile(){

      },
      itemCheck(item){
        item.itemChecked = !item.itemChecked
        console.log(item.itemChecked)
        const index = this.checkedFiles.findIndex(el=>{return el.id === item.id})
        if (item.itemChecked && index < 0){
          this.checkedFiles.push(item)
        }else{
          this.checkedFiles.splice(index, 1)
        }
        console.log(this.checkedFiles)
      },
      getPicUrl(file){
        // var baseUrl = window.baseUrl +  "/testpreview/"
        let URL = window.URL || window.webkitURL
        const url = URL.createObjectURL(file)
        return url
      },
      getVideoPre(item){
        const scale = 0.5
        const video = document.querySelector("#video")
        const img = event.target
          // video = $('#videoarea').find('video')[0],
         const canvas = document.createElement("canvas")
          const canvasFill = canvas.getContext('2d');
        canvasFill.drawImage(video, 0, 0, 150, 100);
        return canvas.toDataURL("image/jpeg");
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
  }
</script>

<style scoped>
  .local-files {
    position: relative;
    padding-left: 50px;
    overflow: hidden;
  }
  .merge-img{
    padding: 10px;
    height: 800px;
    background: #f7f7f7;
    position: absolute;
    top: 20px;
    left: 50%;
    margin-left: -200px;
    text-align: center;
    box-shadow: 0px 0px 10px 0px lightgrey;
    overflow: auto;
  }
  .close-img{
    position: relative;
    top: -7px;
    right: -80px;
    font-size: 20px;
  }
  .image-container{
  }
  .download-img{
    padding: 5px 10px;
    border: 1px solid #efefef;
    border-radius: 5px;
    color: white;
    background-color: rgba(255, 192, 199, 0.77);
    cursor: pointer;
    text-decoration: none;
    margin: 0px 20px 5px 0px;
    font-size: 14px;
  }
  .upload-img{
    padding: 5px 10px;
    border: 1px solid #efefef;
    border-radius: 5px;
    color: white;
    background-color: rgba(31, 112, 249, 0.62);
    cursor: pointer;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .search-input{
    border: 1px solid #e0e0e0;
    box-shadow: 0px 0px 10px 0px #e0e0e0;
    outline: none;
    border-radius: 5px;
    padding: 8px 10px;
    font-size: 13px;
    margin-left: 345px;
    width: 300px;
  }
  .pics_item,
  .videos_item{
    font-size: 13px;
    text-align: center;
    overflow: hidden;
  }
  .disk{
    font-size: 14px;
    color: gray;
    display: inline-block;
    min-width: 150px;
  }
  .choose_file_input{
    border-radius: 5px;
    outline: none;
    padding: 3px 10px;
    display: inline-block;
    color: white;
    background: #409EFF;
    border: 1px solid #409EFF;
    font-size: 12px;
    line-height: 20px;
    position: relative;
    margin-right: 160px;
  }
  .file_input{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
  .content{
    margin-top: 20px;
  }
  .left_content{
    width: 300px;
    float: left;
    border: 1px solid lightgray;
    border-radius: 5px;
    margin-right: 25px;
    -webkit-box-shadow: 0px 0px 10px 0px lightgrey;
    box-shadow: 0px 0px 10px 0px lightgrey;
    padding: 20px;
    height: 480px;
    overflow: auto;
  }
  /*  six_info */
  .six_info_outer{
    float: left;
  }
  .pics_outer, .videos_outer, .count_show,
  .docs_outer, .audios_outer, .others {
    border: 1px solid lightgray;
    box-shadow: 0px 0px 4px 0px #b2b0b0;
    background-color: white;
    border-radius: 5px;
    margin: 0px 20px 10px;
    width: 820px;
    position: relative;
  }
  .docs_outer .docs_item{
    padding: 5px 10px;
    min-width: 150px;
    /* width: 150px; */
    display: inline-block;
  }
  .six_info_outer .folders_outer .folder_item {
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
  }
  #video{
    width: 220px;
  }
  .six_info_outer .folders_outer .folder_item > svg {
    font-size: 60px;
  }

  .six_info_outer .no_result {
    color: gray;
    font-size: 13px;
    margin-left: 10px;
  }

  .six_info_outer .title {
    margin: 10px 20px;
    color: cornflowerblue;
  }
  .six_info_outer .icon-checked_circle {
    cursor: pointer;
    position: absolute;
    font-size: 17px;
  }

  /*pics*/
  .six_info_outer .pics > .pics_item {
    display: inline-block;
    padding: 10px;
    margin: 10px;
    position: relative;
  }

  .six_info_outer .pics > .pics_item > .img_outer {
    width: 100px;
    height: 100px;
    display: inline-block;
    background-size: cover;
    cursor: pointer;
  }

  .six_info_outer .pics > .pics_item > .img_outer > img {
    width: 150px;
    display: inline-block;
  }
  /*videos*/
  .six_info_outer .videos>.videos_item{
    display: inline-block;
    padding: 10px;
    margin: 10px;
    position: relative;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
  }
  .six_info_outer .videos>.videos_item>.img_outer>img{
    width: 200px;
    height: 100px;
    display: inline-block;
  }
  .six_info_outer .pics>.pics_item:hover{
    background-color: rgba(221, 221, 221, 0.78);
  }
  .blockItemCheckedClass{
    background-color: rgba(221, 221, 221, 0.78);
  }
  .blockItemCheckedClass .checkbox {
    display: block
  }
  .checkbox {
    display: none;
  }
  .pics_item:hover .checkbox,
  .videos_item:hover .checkbox{
    display: block;
  }
</style>
