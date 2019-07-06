<template>
  <div class="documents">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >全部文档</span>
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
      <tr v-for="(item, index) in allDocuments" :key="index" @click="clickItem(item)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click.stop="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.scale}`"></use></svg>
        </td>
        <td><div class="file_name" >
          <svg class="icon aFile" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(item.id)></use></svg>
          <span @click.stop="showFile(item.id)" title="点击查看详情" v-html="item.name"></span>
        </div></td>
        <td>{{unixChange(item.serverTime)}}</td>
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
  import FileOperation from "../../../components/FileOperation"
  import { mapState } from "vuex"
  import {
    toggleTip,
    toggleCollection,
    toggleAttention,
    unixChange,
    getFileSize,
    fetchList,
    uploadOrUpdate, inputIsEmpty
  } from "../../../publics/public"
  export default {
    components:{
      FileOperation: FileOperation
    },
    computed:{
      ...mapState(['file_icons'])
    },
    data() {
      return {
        checkedFiles:[],
        allDocuments:[],
      }
    },
    mounted(){
      this.fetchList()
      // 订阅一个事件
      window.EE.on('fetchDocuments', ()=>this.fetchList())
    },
    methods:{
      fetchList() {
        fetchList('/docuinfo').then(data=>{
          data = data || []
          data.forEach(el=>{
            if (!el.info){
              el.info = JSON.stringify({})
            }
            el.info = JSON.parse(el.info)
            el.itemChecked = false
            if (el.keyword) {
              el.keyword = el.keyword.split('|')
            }
            if (el.tag) {
              el.tag = el.tag.split('|')
            }else {
              el.tag = []
            }
          })
          this.allDocuments = data
        }).catch(error => {
          toggleTip(this,error)
        })
      },
      showFile(id){
        const nowFile = this.allDocuments.find(el=>{return el.id == id})
        this.$store.commit('setNowFile', nowFile)
        this.$router.push('/main/showFile')
      },
      unixChange (timestamp){
        return unixChange(timestamp)
      },
      getFileSize(size){
        return getFileSize(size)
      },
      fileIconsOrOthers(id){
        const nowFile = this.allDocuments.find(el=>{ return el.id == id})
        const ext = nowFile.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      clickItem(item){
        item.itemChecked = !item.itemChecked
        const index = this.checkedFiles.findIndex(el=>{return el.id === item.id})
        if (item.itemChecked && index < 0){
          this.checkedFiles.push({id: item.id, name: item.name, url:item.url})
        }else{
          this.checkedFiles.splice(index, 1)
        }
      },
      toggleCollection(item){
        toggleCollection(this, item)
      },
      toggleAttention(item){
        toggleAttention(this, item)
      }
    },
    watch:{
      checkedFiles(){
        if (this.checkedFiles.length != 0) {
          this.$store.commit('setCheckedFiles', this.checkedFiles)
        }
      }
    }
  }
</script>

<style scoped>
  .documents{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }

</style>
