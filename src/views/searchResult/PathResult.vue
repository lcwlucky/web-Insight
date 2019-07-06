<template>
  <div class="path_result">
    <div class="bg"></div>
    <div v-show="noResult" class="result_null">暂无搜索结果</div>
    <div class="file_nav" v-show="!searchResult">
      <span @click="backupResult">全部搜索结果 </span>
      <span class="catalog_view" v-for="(item, index) in catalog" :key="'catalog' + item.id"
            @click="openFolder(0, item.id, item.name)">
        <span v-show="index === 0" v-html="'|' + item.name"> </span><span v-show="index > 0" v-html="'>' + item.name"></span>
      </span>
    </div>
    <div class="folder_outer" v-show="searchResult">
      <div v-for="(item, index) in allFolderResult" :key="index" @click.stop="openFolder(1, item.id, item.name)">
        <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
        <p v-html="item.name"></p>
      </div>
    </div>
    <table v-show="!searchResult">
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
      <tr v-for="(item, index) in folders" :key="'folder' + item.id" @click="clickItem(index)"
          :class="{item_checked:item.itemChecked}">
        <td><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true">
            <use :xlink:href="`#icon-importance${item.importance}`"></use>
          </svg>
        </td>
        <td>
          <div class="file_name" @click.stop="openFolder(1, item.id, item.name)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-aFile"></use>
            </svg>
            <span>{{item.name}}</span>
          </div>
        </td>
        <td>\</td>
        <td>\</td>
        <td class="star">
          <svg class="icon" aria-hidden="true" @click="toggleCollection(index)">
            <use v-show="!item.collection" xlink:href="#icon-collection"></use>
            <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="toggleAttention(index)">
            <use v-show="!item.like" xlink:href="#icon-like"></use>
            <use v-show="item.like" xlink:href="#icon-like_fill"></use>
          </svg>
        </td>
      </tr>
      <tr v-for="(item, index) in files" :key="'file' + item.id" @click="clickItem(index)"
          :class="{item_checked:item.itemChecked}">
        <td><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true">
            <use :xlink:href="`#icon-importance${item.importance}`"></use>
          </svg>
        </td>
        <td>
          <div class="file_name" @click.stop="openFile(item)">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="fileIconsOrOthers(item.id)"></use>
            </svg>
            <span>{{item.name}}</span>
          </div>
        </td>
        <td v-show="item.info.createTime">{{unixChange(item.info.createTime)}}</td>
        <td v-show="!item.info.createTime">{{unixChange(item.uploadTime)}}</td>
        <td>{{getFileSize(item.size)}}</td>
        <td class="star">
          <svg class="icon" aria-hidden="true" @click="toggleCollection(index)">
            <use v-show="!item.collection" xlink:href="#icon-collection"></use>
            <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="toggleAttention(index)">
            <use v-show="!item.like" xlink:href="#icon-like"></use>
            <use v-show="item.like" xlink:href="#icon-like_fill"></use>
          </svg>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import {
    fetchList,
    clickItem,
    toggleCollection,
    toggleAttention,
    unixChange,
    getFileSize,
    uploadOrUpdate
  } from "../../publics/public"

  export default {
    name: "FolderResult",
    data() {
      return {
        allFolderResult: [],
        folders: [],
        files: [],
        catalog: [],
        searchResult:true,
        noResult:false
      }
    },
    computed:{
      ...mapState(['searchWay','searchKey','file_icons'])
    },
    mounted(){
      this.searchByPath()
    },
    methods: {
      searchByPath(){
        const childUrl = '/search'
        let formData = new FormData()
        formData.append('way',this.searchWay)
        formData.append('text',this.searchKey)
        uploadOrUpdate(childUrl, formData).then(data=>{
          this.allFolderResult =[...data.CATALOG,...data.INSIGHT]
          if (this.allFolderResult.length == 0){
            this.noResult = true
          }
        })
      },
      openFolder(flag, id, name) {
        // flag为0表示返回，为1表示继续
        const childUrl = '/catalogcontent' + '?id=' + id
        fetchList(childUrl).then(data => {
          data.files.forEach(el => {
            el.itemChecked = false
            if (el.keyword) {
              el.keyword = el.keyword.split('|')
            }
            if (el.tag) {
              el.tag = el.tag.split('|')
            } else {
              el.tag = []
            }
          })
          this.folders = data.catalogs
          this.files = data.files
          if (flag){
            this.catalog.push({id: id, name: name})
          } else{
            let index = this.catalog.findIndex(el=>{return el.id == id})
            this.catalog.splice(index + 1)
          }
          if (!this.catalog){
            this.searchResult = true
          } else{
            this.searchResult = false
          }
        })
      },
      openFile(fileItem) {
        switch (fileItem.category) {
          // document
          case 1:
            this.$store.commit('setNowFile', fileItem)
            this.$router.push({
              name: 'ShowFile',
              params: {
                fromSearch: 1
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
      backupResult(){
        this.searchResult = true
        this.catalog = []
      },
      fileIconsOrOthers(id) {
        const file = this.files.find(el => {
          return el.id == id
        })
        const ext = file.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      clickItem(index) {
        clickItem(this.allFiles, index, this.nowChecked)
      },
      toggleCollection(index) {
        toggleCollection(this, this.allFiles, index)
      },
      toggleAttention(index) {
        toggleAttention(this, this.allFiles, index)
      },
      unixChange(timeStamp) {
        return unixChange(timeStamp)
      },
      getFileSize(size) {
        return getFileSize(size)
      },
    }
  }
</script>

<style scoped>
  .path_result {
    overflow: hidden;
    position: relative;
    padding-left: 50px;
    min-height: 200px;
  }
  .bg {
    width: 100%;
    height: 200px;
    border-radius: 50px;
    box-shadow: 0px 0px 100px 10px #e3e3e3;
    position: absolute;
    top: -200px;
  }
  .result_null{
    margin: 20px;
    color: gray;
  }
  .path_result > .file_nav span{
    color: cornflowerblue;
  }
  .path_result > .folder_outer{
    margin-top: 60px;
  }
  .path_result > .folder_outer >div {
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
  }

  .path_result > .folder_outer >div> svg {
    font-size: 60px;
  }
</style>
