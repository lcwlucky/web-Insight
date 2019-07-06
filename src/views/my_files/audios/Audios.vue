<template>
  <div class="audios">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >全部音频</span>
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
      <tr v-for="(item, index) in allAudios" :key="index" @click="clickItem(item)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click.stop="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.scale}`"></use></svg>
        </td>
        <td><div class="file_name" >
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-file_mp3"></use></svg>
          <span @click.stop="audioPlay(item.id)">{{item.name}}</span>
        </div></td>
        <td>{{unixChange(item.lastModified)}}</td>
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
    fetchList
  } from "../../../publics/public"
  export default {
    components:{
      FileOperation: FileOperation
    },
    data() {
      return {
        allAudios:[],
        checkedFiles:[]
      }
    },
    mounted(){
      this.fetchList()
      window.EE.on('fetchAudios',()=>{this.fetchList()})

    },
    methods:{
      fetchList(){
        fetchList('/audioinfo').then(data=>{
          data = data || []
          data.forEach(el=>{
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
          this.allAudios = data
        }).catch(error=>{
          toggleTip(this,error)
        })
      },
      audioPlay(id){
        let nowAudio = this.allAudios.find(el=>{return el.id == id})
        this.$store.commit('audioPlay',nowAudio)
      },
      clickItem(item){
        item.itemChecked = !item.itemChecked
        const index = this.checkedFiles.findIndex(el=>{return el.id === item.id})
        if (item.itemChecked && index < 0){
          this.checkedFiles.push({id: item.id, name: item.name, url:item.url})
        }else{
          this.checkedFiles.splice(index, 1)
        }
        console.log(this.checkedFiles,111)
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
      }
    },
    watch:{
      checkedFiles(){
        this.$store.commit('setCheckedFiles', this.checkedFiles)
      }
    }
  }
</script>

<style scoped>
  .audios{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }

</style>
