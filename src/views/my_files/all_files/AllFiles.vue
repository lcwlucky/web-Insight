<template>
  <div class="all_files">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span @click="fetchList">全部文件 </span>
      <span class="catalog_view" v-for="(item, index) in catalog" :key="'catalog' + item.id" @click="openFolder(0, item.id, item.name)">
        <span v-show="index === 0">| {{item.name}}</span><span v-show="index > 0"> > {{item.name}}</span> </span>
    </div>
    <table>
      <thead>
        <tr>
          <td class="checked"></td>
          <td class="importance"></td>
          <td class="name">|文件名称</td>
          <td class="time">|修改日期</td>
          <td class="size">|大小</td>
          <td class="star">|标记</td>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in allFolders" :key="'folder' + item.id" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.scale}`"></use></svg>
        </td>
        <td><div class="file_name" @click.stop="openFolder(1, item.id, item.name)">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
          <span >{{item.name}}</span>
        </div></td>
        <td>\</td>
        <td>\</td>
        <td>\</td>
      </tr>
      <tr v-for="(item, index) in allFiles" :key="'file' + item.id" @click="clickItemFile(item)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.scale}`"></use></svg>
        </td>
        <td><div class="file_name" @click.stop="openFile(item)">
          <svg class="icon" aria-hidden="true"><use :xlink:href="fileIconsOrOthers(item.id)"></use></svg>
          <span >{{item.name}}</span>
        </div></td>
        <td v-show="item.info.createTime">{{unixChange(item.info.createTime)}}</td>
        <td v-show="!item.info.createTime">{{unixChange(item.uploadTime)}}</td>
        <td>{{getFileSize(item.size)}}</td>
        <td class="star"><svg class="icon" aria-hidden="true" @click.stop="toggleCollection(item)">
          <use v-show="!item.collection" xlink:href="#icon-collection"></use>
          <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
        </svg><svg class="icon" aria-hidden="true" @click.stop="toggleAttention(item)">
          <use v-show="!item.attention" xlink:href="#icon-like"></use>
          <use v-show="item.attention" xlink:href="#icon-like_fill"></use>
        </svg></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import FileOperation from "../../../components/FileOperation"
  import {
    toggleCollection,
    toggleAttention,
    clickItem,
    unixChange,
    getFileSize,
    fetchList,
    fetchListById
  } from "../../../publics/public"
  export default {
    data() {
      return {
        allFolders:[],
        allFiles:[],
        checkedFiles:[],
        isChild:false,
        catalog:[],
      }
    },
    computed:{
      ...mapState(['file_icons'])
    },
    components:{
      FileOperation: FileOperation
    },
    mounted(){
      this.fetchList()
      window.EE.on('fetchAllFiles',()=>this.fetchList())
    },
    methods:{
      //获取所有文件列表
      fetchList(){
        const root = sessionStorage.getItem('root')
        if (!root) { //如果本地没有存储用户的id，则要重新登录
          this.$router.replace('/login')
          return
        }
        const childUrl = '/catalogcontent?id=' + root
        fetchList(childUrl).then(data=>{
          data.files.forEach(el=>{
            el.itemChecked = false //为每个文件添加为选择的标识
            if (el.keyword) { //系统的关键词
              el.keyword = el.keyword.split('|')
            }
            if (el.tag) {  //用户自定义的标签
              el.tag = el.tag.split('|')
            }else {
              el.tag = []
            }
          })
          this.allFolders = data.catalogs
          this.allFiles = data.files
        })
        this.catalog = []
      },
      //打开某个文件夹
      openFolder(flag, id, name){
        // flag为0表示返回，为1表示继续
        const childUrl = '/catalogcontent?id=' + id
        fetchList(childUrl).then(data =>{
          data.files.forEach(el=>{
            el.itemChecked = false
            if (!el.info){
              el.info = {}
            }
            if (el.keyword) {
              el.keyword = el.keyword.split(',')
            }
            if (el.tag) {
              el.tag = el.tag.split(',')
            }else {
              el.tag = []
            }
          })
          this.allFolders = data.catalogs
          this.allFiles = data.files
          if (flag){
            this.catalog.push({id: id, name: name})
          } else{
            let index = this.catalog.findIndex(el=>{return el.id == id})
            this.catalog.splice(index + 1)
          }
        })
      },
      openFile(fileItem){
        switch (fileItem.category) {
          // document
          case 1:
            this.$store.commit('setNowFile', fileItem)
            this.$router.push('/main/showFile')
            break;
          // image
          case 2:
            let routeData = this.$router.resolve({
              path:'/picturesInfo',
              query:{ id: fileItem.id }
            });
            window.open(routeData.href, '_blank');
            break;
          // audio
          case 3:
            this.$store.commit('audioPlay',nowAudio);
            break;
          // video
          case 4:
            let routerData = this.$router.resolve({
              path:'/videoInfo',
              query:{
                id: fileItem.id
              }
            })
            window.open(routerData.href, '_blank');
            break;
          // others
          case 5: break;
        }
        this.isChild = true
      },
      fileIconsOrOthers(id){
        const file = this.allFiles.find(el=>{return el.id == id})
        const ext = file.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      clickItemFile(item){
        item.itemChecked = !item.itemChecked
        const index = this.checkedFiles.findIndex(el=>{return el.id == item.id})
        console.log(index,',index')
        if (item.itemChecked && index < 0){
          this.checkedFiles.push({id: item.id, name: item.name, url:item.url})
        }else{
          this.checkedFiles.splice(index, 1)
        }
        console.log(this.checkedFiles,2222)
        if (this.checkedFiles.length != 0){
          this.$store.commit('setCheckedFiles', this.checkedFiles)
        }
      },
      toggleCollection(item){
        toggleCollection(this, item)
      },
      toggleAttention(item){
        toggleAttention(this, item)
      },
      unixChange(timeStamp){
        return unixChange(timeStamp)
      },
      getFileSize(size){
        return getFileSize(size)
      },
      changeImportance(index){

      }
    }
  }
</script>

<style scoped>
  .all_files{
     overflow: hidden;
     position: relative;
     padding-left: 50px;
  }
  .file_name{
    display: inline-block;
  }
  .file_nav{
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
    color: #5c88d8;
  }
  .file_nav>.catalog_view{
    color: cornflowerblue;
  }
</style>
