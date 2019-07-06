<template>
  <div class="insight">
    <OperationBG :navContent="navContent"></OperationBG>
<!--    <div class="bg"></div>-->
<!--    <div class="file-nav"><span class="iconfont icon-fangdajing"> 洞见</span></div>-->
    <div class="left_content">
      <el-tree :data="catalog" :props="defaultProps" :highlight-current="T" @current-change="nodeChange"></el-tree>
    </div>
    <div class="six_info_outer">
      <div class="">
        <div class="pics_outer">
          <div class="title">图片 <span class="no_result" v-show="!fives.pics || !fives.pics.length">暂无图片</span></div>
          <div class="pics">
            <div class="pics_item" v-for="(item, index) in fives.pics"
                 :key="index" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
              <div class="img_outer" @click="openFile(item)"
                   :style="{'background-image': 'url('+getPicUrl(item.url) +')'}"></div>
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
                <img :src="getPicUrl(item.info.thumbUrl)" alt="视频预览图">
              </div>
              <p v-html="item.name"></p>
            </div>
          </div>
        </div>
        <div class="docs_outer">
          <div class="title"> 文档 <span class="no_result" v-show="!fives.docs.length">暂无文档</span></div>
          <div class="docs_item" v-for="item in fives.docs" @click.stop="itemCheck(item)"
               :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true">
              <use :xlink:href=fileIconsOrOthers(item)></use>
            </svg>
            <span @click="openFile(item)" v-html="item.name"></span>
          </div>
        </div>
        <div class="audios_outer">
          <div class="title">音频 <span class="no_result" v-show="!fives.audios.length">暂无音频</span></div>
          <div v-for="item in fives.audios" @click.stop="itemCheck(item)"
               :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-mp3"></use>
            </svg>
            <span v-html="item.name" @click="openFile(item)"></span>
          </div>
        </div>
        <div class="others">
          <div class="title">其他 <span class="no_result" v-show="!fives.others.length">暂无其他</span></div>
          <p v-for="item in fives.others" @click.stop="itemCheck(item)"
             :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-others"></use>
            </svg>
            <span v-html="item.name"></span></p>
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
  import { fetchList,inputIsEmpty,uploadOrUpdate,toggleTip } from "../../../publics/public"
  import OperationBG from "../../../components/OperationBG"
  import { mapState } from "vuex"
  export default {
    components:{OperationBG},
    data() {
      return {
        navContent:{
          icon: '&#xe609;',
          text: '洞见'
        },
        nowChecked:[],
        allIntelFiles:[],
        catalog: [],
        defaultProps: {children: 'children', label: 'label'},
        T: true,
        fileLocation:'', //当前选中分类的id
        fileLocationShow:'',//当前选中分类的名称
        fives:{docs:[], pics: [], videos:[], audios: [], others: []},
        chooseDefineCatalog: false,
        defineFiles:[],
        isDefineFile:false,
        createDefCatalog:false,
        defCatName:'',
        checkedIds:[], //选中文件的id列表
        checkedCategory:[]//选中文件的类型列表
      }
    },
    mounted(){
      this.fetchIntelList()
      console.log('insight mounted')
    },
    destroyed(){
      console.log('insight destroy')

    },
    computed:{
      ...mapState(['file_icons'])
    },
    methods:{
      /*为每个父节点添加文件图标*/
      addFileIcon(){
        const spans = Array.from(document.querySelectorAll(".el-tree-node__label"))
        console.log(spans,777)
        spans.forEach(el=>{
          const oldText = el.innerHTML
          console.log(oldText,1111)
          el.innerHTML = `<svg class="icon" style="margin-right: 10px;" aria-hidden="true"> <use xlink:href="#icon-aFile"></use> </svg>` + oldText

        })
      },

      //获取文件层级列表
      fetchIntelList(){
        fetchList('/labeltree').then(data=>{
          //转化为eliment-Ui的配置
          this.getNode(this.catalog, data)
          if (this.catalog.length > 0){
            this.$nextTick(()=>{
              //添加文件夹图标
              this.addFileIcon()
            })

          }
        })
      },
      getNode(parent, nodes){
        nodes = nodes || []
        nodes.forEach((el, index)=>{
            parent.push({id: el.id, label: el.name, children:[]})
          if (el.nodes) {
            this.getNode(parent[index].children,el.nodes)
          }
        })
      },

      //选择左边的文件层级分类，右边会根据选择不同的分类动态展示不同的文件
      nodeChange(data, obj) {
        console.log(data,1111)
        if (data.children.length > 0) {
          return
        }
        this.fileLocation = data.id
        this.fileLocationShow = data.label
        this.getContent(data.id)
      },
      //获取某个分类下的所有文件信息
      getContent(id){
        fetchList('/filefiling/' + id).then(data=>{
            for (let key in data){
              data[key].forEach(el=> {
                el.itemChecked = false
                if (el.info) {
                  el.info = JSON.parse(el.info)
                }
                if (el.keyword) {
                  el.keyword = el.keyword.split('|')
                }
                if (el.tag) {
                  el.tag = el.tag.split('|')
                } else {
                  el.tag = []
                }
              })
            }
            this.fives.docs = data.DOCUMENT || []
            this.fives.pics = data.IMAGE || []
            this.fives.videos = data.VIDEO || []
            this.fives.audios = data.AUDIO || []
            this.fives.others = data.OTHER || []
        })
      },
      getPicUrl(url) {
        const baseUrl = window.baseUrl + "/testpreview/"
        return baseUrl + url
      },
      openFile(fileItem) {
        switch (fileItem.category) {
          // document
          case 1:
            this.$store.commit('setNowFile', fileItem)
            this.$router.push({
              name: 'ShowFile',
              params: {
                fromSearch: 3
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
      fileIconsOrOthers(item){
        const ext = item.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      itemCheck(item){
        item.itemChecked = !item.itemChecked
        const index = this.checkedIds.findIndex(el=>{el.id === item.id})
        if (item.itemChecked && index < 0){
          this.checkedIds.push(item.id)
          this.checkedCategory.push(item.category)
        }else{
          this.checkedIds.splice(index, 1)
          this.checkedCategory.splice(index, 1)
        }
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
    watch:{
      checkedIds(){
        if (this.checkedIds.length != 0) {
          this.isDefineFile = true
        } else {
          this.isDefineFile = false
        }
      }
    }
  }
</script>

<style scoped>
  .insight{
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

  /* catalog*/
  .left_content{
    width: 300px;
    float: left;
    border: 1px solid lightgray;
    border-radius: 5px;
    margin-right: 25px;
    box-shadow: 0px 0px 10px 0px lightgrey;
    padding: 20px;
    height: 480px;
    overflow: auto;
  }
  .el-tree{
    background: transparent;
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
  }
  .docs_outer .docs_item{
    padding: 5px 10px;
  }
  .six_info_outer .folders_outer .folder_item {
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
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
    width: 150px;
    height: 150px;
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
  }defaultProps
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
    top: 15px;
    left: 150px;
    padding: 5px 10px;
    border: 1px solid #efefef;
    border-radius: 5px;
    color: cornflowerblue;
    background-color: #ddd;
    cursor: pointer;
  }

  .newDef {
    position: fixed;
    top: 15px;
    left: 250px;
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

</style>
