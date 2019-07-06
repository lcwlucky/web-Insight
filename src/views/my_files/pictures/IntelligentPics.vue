<template>
  <div class="intelligent_pics">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span  @click="intelOrder">智能分类</span>
      <span class="file_nav_intel" v-show="enterFolder"> > {{keyName}}</span>
      <el-popover
        popper-class="order_picker"
        placement="top"
        width="150">
        <p @click="intelOrder">智能分类</p>
        <p @click="timeLine">时光轴</p>
        <p @click="defaultOrder">默认排序</p>
        <span slot="reference" class="iconfont icon-order"></span>
        <!--<el-button >删除</el-button>-->
      </el-popover>
    </div>
    <div  v-if="!enterFolder" class="intelligence_order">
      <div v-for="(item, index) in intelPics" :key="'iop'+index"
           @click.stop="getClassPic(item.id, item.name)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-aFile"></use>
        </svg>
        <p>{{item.name}}</p>
      </div>
    </div>
    <div v-if="enterFolder" class="pics">
      <div class="pics_item" v-for="(item, index) in classPics" :key="index"
           :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
        <span class="checkbox iconfont icon-checked_circle" @click.stop="itemChecked(item)"></span>
        <div class="img_outer" @click="showInfo(item.id)" :style="{'background-image': 'url('+getPicUrl(item.url)+')'}">
          <!--          <img :src="getPicUrl(item.url)" alt="图片预览图">-->
        </div>
      </div>
    </div>
    <!-- 自定义归档目录 -->
<!--    <el-popover placement="top" width="160" popper-class="define_catalog_outer">-->
<!--      <p class="def_catalog" v-show="chooseDefineCatalog" v-for="item in defineFiles" @click="defCatalogOk(item.id)">-->
<!--        <svg v-show="item.id >= 0" class="icon" aria-hidden="true">-->
<!--          <use xlink:href="#icon-aFile"></use>-->
<!--        </svg>-->
<!--        {{item.name}}-->
<!--      </p>-->
<!--      <span slot="reference" v-show="isDefineFile" class="defBtn" @click="defineFile">-->
<!--        <svg class="icon" aria-hidden="true"><use xlink:href="#icon-define"></use></svg>归档于</span>-->
<!--    </el-popover>-->
<!--    <span v-show="isMerge" class="mergeBtn" @click="mergeImages">-->
<!--      <svg class="icon" aria-hidden="true"><use xlink:href="#icon-merge"></use></svg>合并图片</span>-->
<!--    <span v-show="isAlbum" class="albumBtn" @click="albumImages">-->
<!--      <svg class="icon" aria-hidden="true"><use xlink:href="#icon-album"></use></svg>合成影集</span>-->
    <!-- 新建自定义归档-->
<!--    <div v-show="createDefCatalog" class="newDef">-->
<!--      <svg class="icon" aria-hidden="true">-->
<!--        <use xlink:href="#icon-aFile"></use>-->
<!--      </svg>-->
<!--      <input type="text" v-model="defCatName" placeholder="请输入文件名">-->
<!--      <span class="iconfont icon-checked_circle" @click="newDefCatOk"></span>-->
<!--      <span class="iconfont icon-close" @click="cancelNewDefCat"></span>-->
<!--    </div>-->
  </div>
</template>

<script>
  import FileOperation from "../../../components/FileOperation"
  import {
    toggleTip,
    fetchList,
    uploadOrUpdate,
    inputIsEmpty
  } from "../../../publics/public"
  export default {
    components: {
      FileOperation: FileOperation
    },
    data(){
      return{
        intelPics: {},
        checkedIds: [],
        checkedCategory: [],
        enterFolder: false,
        keyName:'',
        classPics:[],
        defineFiles:[],
        isDefineFile:false,
        chooseDefineCatalog:false,
        createDefCatalog: false,
        defCatName:'',
        checkedFiles:[],
        isMerge: false,
        isAlbum: false
      }
    },
    mounted(){
      this.intelOrder()
      window.EE.on('intelOrder', () => {this.intelOrder()})

    },
    methods:{
      getClassPic(id, name) {
        this.enterFolder = true
        this.keyName = name
        const childUrl = '/filefiling/' + id
        fetchList(childUrl).then(data => {
          for (let key in data) {
            data[key].forEach(el => {
              if (el.info) {
                el.info = JSON.parse(el.info)
              }
              el.itemChecked = false
            })
          }
          this.classPics = data.IMAGE
        })
      },
      mergeImages(){
        let urls = []
        this.checkedFiles.forEach(el=>{
          urls.push(el.url)
        })
        let formData = new FormData()
        formData.append('urls', urls)
        uploadOrUpdate(window.mergeUrl, formData).then(data=>{
          if (data.success){
            this.intelOrder()
            toggleTip(this, '合并图片成功，已保存至“处理文件”中')
          }
        })
      },
      albumImages(){
        let urls = []
        this.checkedFiles.forEach(el=>{
          urls.push(el.url)
        })
        console.log(urls,222)
        let formData = new FormData()
        formData.append('urls', urls)
        uploadOrUpdate('/imgalbum', formData).then(data=>{
          if (data.success){
            toggleTip(this, '合成影集成功，已保存至“处理文件”中')
          }
        })
      },
      defaultOrder() {
        this.$router.push('/main/pictures')
      },
      timeLine() {
        this.$router.push('/main/timeLinePics')
      },
      intelOrder() {
        this.enterFolder = false
        // 从后台请求数据
        fetchList('/getimageinsight').then(data => {
          this.intelPics = data
        }).catch((error) => {
          toggleTip(this, error)
        })
      },
      showInfo(id) {
        let routeData = this.$router.resolve({
          name: 'PicturesInfo',
          query: {id: id}
        });
        window.open(routeData.href, '_blank');
      },
      itemChecked(item) {
        item.itemChecked = !item.itemChecked
        const index = this.checkedIds.findIndex(el=>{return el.id === item.id})
        if (item.itemChecked && index < 0){
          this.checkedIds.push(item.id)
          this.checkedCategory.push(item.category)
          this.checkedFiles.push({id: item.id, name: item.name, url:item.url})
        }else{
          this.checkedIds.splice(index, 1)
          this.checkedCategory.splice(index, 1)
          this.checkedFiles.splice(index, 1)
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
      getPicUrl(url) {
        const baseUrl = window.baseUrl + "/testpreview/"
        return baseUrl + url
      },
    },
    watch:{
      checkedIds(){
        if (this.checkedIds.length != 0) {
          this.isDefineFile = true
          this.isMerge = true
          this.isAlbum = true
          this.$store.commit('setCheckedFiles', this.checkedFiles)
        } else {
          this.isDefineFile = false
          this.isMerge = false
          this.isAlbum = false
        }
      }
    }
  }
</script>

<style scoped>
  .intelligent_pics {
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .mergeBtn{
    left: 200px;
  }
  .albumBtn{
    left: 320px;
  }
  .file_nav_intel {
    color: cornflowerblue;
  }
  .intelligence_order>div{
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
    font-size:12px;
  }
  .intelligence_order>div>svg{
    font-size: 55px;
  }
  .order_picker>p{
    padding: 5px;
  }
  .order_picker > p:hover {
    background-color: rgba(211, 211, 211, 0.64);
    border-radius: 5px;
    cursor: pointer;
  }
  .icon-order {
    margin-left: 85%;
  }
  /*pics*/
  .pics .icon-checked_circle{
    cursor: pointer;
    position: absolute;
    font-size: 17px;
  }
  .pics>.pics_item{
    display: inline-block;
    padding: 10px;
    margin: 10px;
    position: relative;
  }
  .pics>.pics_item>.img_outer{
    width: 150px;
    height: 150px;
    display: inline-block;
    background-size: cover;
    cursor: pointer;
  }
  .pics>.pics_item>.img_outer>img{
    width: 150px;
    display: inline-block;
  }
  .pics>.pics_item:hover{
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
  .pics_item:hover .checkbox {
    display: block;
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
    top: 55px;
    left: 440px;
    padding: 5px 10px;
    border: 1px solid #efefef;
    border-radius: 5px;
    color: cornflowerblue;
    background-color: #efefef;
    cursor: pointer;
  }

  .newDef {
    position: fixed;
    top: 160px;
    left: 770px;
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
