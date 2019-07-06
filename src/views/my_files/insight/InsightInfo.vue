<template>
  <div class="insight_info">
    <div class="bg"></div>
    <div class="file_nav">
      <span ><span @click="backupTo">{{getTitle()}}</span> > {{keyName}}</span>
    </div>
    <div class="six_info_outer">

      <!--左边显示图片和视频-->
      <div  class="bigger" :class="(fives.pics || fives.videos) ? 'float_left' : 'float_right'">
        <div class="pics_outer">
          <div class="title">图片 <span class="no_result" v-show="!fives.pics">暂无图片搜索结果</span></div>
          <div class="pics">
            <div class="pics_item" v-for="(item, index) in fives.pics"
                 :key="index" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
              <div class="img_outer" @click="openFile(item)"
                   :style="{'background-image': 'url('+getPicUrl(item.url) +')'}">
<!--                <img :src="getPicUrl(item.url)" alt="图片预览图">-->
              </div>
            </div>
          </div>
        </div>
        <div class="videos_outer">
          <div class="title">视频 <span class="no_result" v-show="!fives.videos || !fives.videos.length">暂无视频搜索结果</span></div>
          <div class="videos">
            <div class="videos_item" v-for="(item, index) in fives.videos"  :key="index" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
              <div class="img_outer" @click="openFile(item)">
                <img :src="getPicUrl(item.info.thumbUrl)" alt="视频预览图">
              </div>
              <p v-html="item.name"></p>
            </div>
          </div>
        </div>
      </div>
      <!--右边显示条形图和文档音频-->
      <div class="smaller" :class="(fives.pics || fives.videos) ? 'float_right' : 'float_left'">
        <div class="count_show">
          <div ref="fiveCount" class="count_box"></div>
        </div>
        <div class="docs_outer">
          <div class="title">文档 <span class="no_result" v-show="!fives.docs">暂无文档搜索结果</span></div>
          <p class="docs_item" v-for="item in fives.docs" @click.stop="itemCheck(item)" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(item.id)></use></svg>
            <span @click="openFile(item)" v-html="item.name"></span></p>
        </div>
        <div class="audios_outer">
          <div class="title">音频 <span class="no_result" v-show="!fives.audios">暂无音频搜索结果</span></div>
          <p class="audios_item" v-for="item in fives.audios" @click.stop="itemCheck(item)" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-file_mp3"></use></svg>
            <span v-html="item.name" @click="openFile(item)"></span></p>
        </div>
        <div class="others">
          <div class="title">其他 <span class="no_result" v-show="!fives.others">暂无其他</span></div>
          <p class="others_item" v-for="item in fives.others" @click.stop="itemCheck(item)" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(item.id)></use></svg>
            <span v-html="item.name" @click="openFile(item)"></span></p>
        </div>
      </div>
    </div>
    <!-- 自定义归档目录 -->
    <el-popover placement="top" width="160" popper-class="define_catalog_outer">
      <p class="def_catalog" v-show="chooseDefineCatalog" v-for="item in defineFiles" @click="defCatalogOk(item.id)">
        <svg v-show="item.id >= 0" class="icon" aria-hidden="true">
          <use xlink:href="#icon-aFile"></use>
        </svg>
        <span v-html="item.name"></span>
      </p>
      <span slot="reference" v-show="isDefineFile" class="defBtn" @click="defineFile">
        <svg class="icon" aria-hidden="true"><use xlink:href="#icon-define"></use></svg>归档于</span>
    </el-popover>
    <!-- 新建自定义归档-->
    <div v-show="createDefCatalog" class="newDef">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-aFile"></use>
      </svg>
      <input type="text" v-model="defCatName" placeholder="请输入文件名">
      <span class="iconfont icon-checked_circle" @click="newDefCatOk"></span>
      <span class="iconfont icon-close" @click="cancelNewDefCat"></span>
    </div>
  </div>
</template>

<script>
  import { mapState } from  "vuex";
  import { fetchList, uploadOrUpdate, toggleTip, inputIsEmpty } from "../../../publics/public";
  import echarts from "echarts"

  export default {
    name: "InsightInfo",
    data() {
      return {
        keyName:'',
        fives:{docs:[], pics: [], videos:[], audios: [], others: []},
        checkedIds:[],
        checkedCategory:[],
        fromInsight: false,
        defineFiles:[],
        chooseDefineCatalog:false,
        createDefCatalog: false,
        defCatName:'',
        checkedFiles:[],
        isDefineFile:false,
        isTime:1
      }
    },
    computed:{
      ...mapState(['file_icons','intelFileTime'])
    },
    mounted(){
      this.createEcharts()
      this.fetchNowTelFile()
    },
    methods:{
      //创建该分类各种文件数量的条形图
      createEcharts(){
        this.echarts = echarts.init(this.$refs.fiveCount)
        this.echarts.setOption({
          grid:{show:false},
          title: {
            text: ''
          },
          tooltip: {},
          backgroundColor: 'white',
          barWidth: 15,
          splitLine:{show: false},
          xAxis:{
            axisLine: {show: false},
            data:["文档","图片","视频","音频", '其他']
          },
          yAxis: {show:false},
          series: [{
            name: '统计',
            type: 'bar',
            itemStyle:{ normal: {color: 'cornflowerblue',label:{show: true,position:'top'}}},
            barGap: 30,
            barMaxHeight: 40
          }]
        })
      },
      backupTo(){
        this.$router.push('/main/defineFiles')
      },
      fetchNowTelFile(){
        this.keyName = this.$route.params.name
        const id = this.$route.params.id
        this.isTime = this.$route.params.isTime
        const item = this.$route.params.item
        let childUrl
        if (this.isTime) { //如果是时光轴归档
          childUrl = '/gettimefile?time=' + item
        }else{ //自定义归档
          childUrl = '/filefiling/' + id
        }
        fetchList(childUrl).then(data=>{
          for (let key in data){
            data[key].forEach(el=> {
              el.itemChecked = false
              if (el.info) {
                el.info = JSON.parse(el.info)
              }
              if (el.keyword) {
                el.keyword = el.keyword.split(' ')
              }
              if (el.tag) {
                el.tag = el.tag.split(' ')
              } else {
                el.tag = []
              }
            })
          }
          this.fives.docs = data.DOCUMENT
          this.fives.pics = data.IMAGE
          this.fives.videos = data.VIDEO
          this.fives.audios = data.AUDIO
          this.fives.others = data.OTHER
          const dataCount = []  //echart制图的数据
          for (let key in this.fives){
            const len = this.fives[key] ? this.fives[key].length : 0
            dataCount.push(len)
          }
          this.echarts.setOption({
            series:{
              name: '统计',
              data: dataCount
            }
          })
        })
      },
      getTitle(){
        return  this.isTime ?"时光簿":"自定义归档"
      },
      openFile(fileItem) {
        switch (fileItem.category) {
          // document
          case 1:
            this.$store.commit('setNowFile', fileItem)
            this.$router.push({
              name: 'ShowFile',
              params: {
                fromSearch: 5
              }
            })
            break;
          // image
          case 2:
            let routeData = this.$router.resolve({
              path: '/picturesInfo',
              query: {id: fileItem.id}
            });
            window.open(routeData.href, '_blank');
            break;
          // audio
          case 3:
            this.$store.commit('audioPlay', nowAudio);
            break;
          // video
          case 4:
            let routerData = this.$router.resolve({
              path: '/videoInfo',
              query: {
                id: fileItem.id
              }
            })
            window.open(routerData.href, '_blank');
            break;
          // others
          case 5:
            break;
        }
      },
      getPicUrl(url){
        var baseUrl = window.baseUrl +  "/testpreview/"
        return baseUrl + url
      },
      itemCheck(item){
        item.itemChecked = !item.itemChecked
        const index = this.checkedIds.findIndex(el=>{return el.id === item.id})
        if (item.itemChecked && index < 0){
          this.checkedIds.push(item.id)
          this.checkedCategory.push(item.category)
          this.checkedFiles.push({id: item.id, name: item.name, url: item.url})
        }else{
          this.checkedIds.splice(index, 1)
          this.checkedCategory.splice(index, 1)
          this.checkedFiles.splice(index, 1)
        }
        if (this.checkedIds.length != 0){
          this.isDefineFile = true
          this.$store.commit('setCheckedFiles', this.checkedFiles)
        } else{
          this.isDefineFile = false
        }
      },
      fileIconsOrOthers(id){
        const nowFile = this.fives.docs.find(el=>{ return el.id == id}) || this.fives.others.find(el=>{ return el.id == id})
        const ext = nowFile.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      defCatalogOk(id) {
        // id>=0 表示归档到已有，id<0 表示新建
        if (id >= 0) {
          const childUrl = '/movedefined'
          let formData = new FormData()
          formData.append('id', id)
          formData.append('ids', this.checkedIds)
          formData.append('category', this.checkedCategory)
          uploadOrUpdate(childUrl, formData).then(data => {
            if (data.success) {
              toggleTip(this, '归档成功')
            }
          })
          this.chooseDefineCatalog = false
          this.isDefineFile = false
        } else {
          this.createDefCatalog = true
        }
      },
      newDefCatOk() {
        if (!this.defCatName) {
          inputIsEmpty(this, '文件名不能为空')
          return
        }
        const childUrl = '/createdefined'
        let formData = new FormData()
        formData.append('name', this.defCatName)
        formData.append('ids', this.checkedIds)
        formData.append('category', this.checkedCategory)
        uploadOrUpdate(childUrl, formData).then(data => {
          if (data.success) {
            toggleTip(this, '归档成功')
          }
        })
        this.createDefCatalog = false
        this.chooseDefineCatalog = false
        this.isDefineFile = false
      },
      cancelNewDefCat() {
        this.defCatName = ''
        this.createDefCatalog = false
      },
      defineFile() {
        this.chooseDefineCatalog = true
        fetchList('/getdefined').then(data => {
          this.defineFiles = data
          this.defineFiles.push({id: -1, name: '新建目录'})
        })
      },
    },
    watch: {
      intelFileTime() {
          this.fetchNowTelFile()
      }
    }
  }
</script>

<style scoped>
  .insight_info{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .bg{
    width: 100%;
    height: 200px;
    border-radius: 50px;
    box-shadow: 0px 0px 100px 10px #e3e3e3;
    position: absolute;
    top: -200px;
  }
  .file_nav{
    font-size: 14px;
    color: cornflowerblue;
  }
  /*自定义归档*/
  .def_catalog {
    padding: 5px;
    cursor: pointer;
  }

  .def_catalog:hover {
    background-color: #efefef;
    border-radius: 5px;
  }

  .defBtn {
    position: absolute;
    top: 12px;
    left: 250px;
    padding: 5px 10px;
    border: 1px solid #efefef;
    border-radius: 5px;
    color: cornflowerblue;
    background-color: #dddddd;
    cursor: pointer;
  }

  .newDef {
    position: fixed;
    top: 120px;
    left: 565px;
    padding: 5px 10px;
    color: cornflowerblue;
  }

  .newDef > svg {
    font-size: 20px;
  }

  .newDef > input {
    padding: 5px;
    font-size: 13px;
    border: 1px solid #efefef;
    border-radius: 5px;
    outline: none;
  }

  /*  six_info */
  .pics_outer,.videos_outer,.count_show,
  .docs_outer,.audios_outer,.others{
    border: 1px solid lightgray;
    box-shadow: 0px 0px 4px 0px #b2b0b0;
    background-color: white;
    border-radius: 5px;
    margin: 10px 0px;
  }
  .six_info_outer .no_result{
    color: gray;
    font-size: 13px;
  }
  .six_info_outer .left{
    display: inline-block;
    width: 800px;
  }
  .six_info_outer .right{
    display: inline-block;
    width: 400px;
    margin-left: 10px;
  }
  .six_info_outer .title{
    margin: 10px 20px;
    color: cornflowerblue;
  }
  .six_info_outer .icon-checked_circle{
    cursor: pointer;
    position: absolute;
    font-size: 17px;
  }
  /*pics*/
  .six_info_outer .pics>.pics_item{
     display: inline-block;
     padding: 10px;
     margin: 10px;
     position: relative;
  }
  .six_info_outer .pics>.pics_item>.img_outer{
    width: 150px;
    height: 150px;
    display: inline-block;
    background-size: cover;
    /*transition: opacity linear .15s;*/
    /*background-position: center center;*/
    /*background-repeat: no-repeat;*/
    cursor: pointer;
  }
  .six_info_outer .pics>.pics_item>.img_outer>img{
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
/* right*/
  .six_info_outer>.right p{
    padding:5px 0px 5px 20px;
    cursor: pointer;
  }
  .six_info_outer>.right p>svg{
    font-size: 25px;
  }
  .six_info_outer>.right p>span{
    padding-left: 5px;
  }
</style>
