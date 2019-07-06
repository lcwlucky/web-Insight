<template>
  <div>
    <div class="bg"></div>
    <div class="file_nav">
      <span class="iconfont theirIcon" v-html="navContent.icon"></span>
      {{navContent.text}}
<!--      <span class="iconfont icon-order"></span>-->
    </div>
  </div>
</template>

<script>
  export default {
    props:['navContent'],
    data() {
      return {}
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .bg{
    width: 100%;
    height: 200px;
    border-radius: 50px;
    box-shadow: 0px 0px 100px 10px #e3e3e3;
    position: absolute;
    top: -200px;
  }
  .file_nav{
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
    color: gray;
  }
  .theirIcon{
    margin-right: 10px;
  }
  .icon-order{
    margin-left: 80%;
  }
</style>
