<!--collection为true的文件-->
<template>
  <div class="my_likes">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >我的关注</span>
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
      <tr v-for="(item, index) in myLikes" :key="index" @click="clickItem(item)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.scale}`"></use></svg>
        </td>
        <td><div class="file_name">
          <svg class="icon aFile" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(item.id)></use></svg>
          <span >{{item.name}}</span>
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
  import { mapState } from "vuex"
  import FileOperation from "../../components/FileOperation"
  import { toggleCollection,toggleAttention,unixChange,fetchList, getFileSize } from "../../publics/public"
  export default {
    components:{
      FileOperation: FileOperation
    },
    data() {
      return {
        myLikes: [],
        checkedFiles: []
      }
    },
    computed:{
      ...mapState(['file_icons'])
    },
    mounted(){
      this.getAttentions()
    },
    methods:{
      getFileSize(size){
        return getFileSize(size)
      },
      fileIconsOrOthers(id){
        const nowFile = this.myLikes.find(el=>{ return el.id == id})
        const ext = nowFile.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      getAttentions(){
        fetchList('/getattentions').then(data=>{
          data.forEach(el=>{
            el.itemChecked = false
          })
          this.myLikes = data
        })
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
      },
      unixChange(timeStamp){
        return unixChange(timeStamp)
      },
      changeImportance(index){

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
  .my_likes{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .file_nav{
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
  }
</style>
