
<template>
  <div class="define-files">
    <OperationBG :navContent="navContent"></OperationBG>
<!--    <div class="bg"></div>-->
    <div class="left_content">
      <div class="time_order">
        <div class="title"><span>时光簿</span></div>
        <div class="content">
          <div v-for="(item, index) in allTimeFiles" :key="index" @click="showInsightInfo(item, ' ', item, 1)">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
            <p>{{item}}</p>
          </div>
        </div>
      </div>
      <div class="owned_folders">
        <div class="title"><span>自定义归档</span></div>
        <div class="content">
          <div v-for="(item, index) in allDefinedFiles" :key="index" @click="showInsightInfo(item, item.id, item.name, 0)">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchList } from "../../../publics/public"
  import OperationBG from "../../../components/OperationBG"
  export default {
    components:{OperationBG},
    data() {
      return {
        navContent:{
          icon: '&#xe62b;',
          text: '归档'
        },
        nowChecked:[],
        allTimeFiles:[], //时光簿
        allDefinedFiles:[] //自定义归档
      }
    },
    mounted(){
      this.fetchTimeList()
      this.fetchDfnList()
    },
    methods:{
      fetchTimeList(){
        fetchList('/gettimeline ').then(data=>{
          this.allTimeFiles = data
        })
      },
      fetchDfnList(){
        fetchList('/getdefined').then(data=>{
          this.allDefinedFiles = data
        })
      },
      showInsightInfo(item, id, name, isTime){
        this.$router.push({
          name: 'InsightInfo',
          params:{
            fromInsight: true,
            isTime: isTime,// 1表示时光簿，0表示自定义归档
            id: id,
            name: name,
            item: item
          }
        })
        this.$store.commit('setIntelFileTime', Date.now())
      }
    }
  }
</script>

<style scoped>
  .define-files{
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
  /* owned_folders and owned_folders*/
  .left_content{
    width: 1100px;
    float: left;
  }
  .time_order,
  .owned_folders{
    overflow: auto;
    border: 1px solid lightgray;
    box-shadow: 0px 0px 4px 0px #b2b0b0;
    background-color: white;
    border-radius: 5px;
    margin: 10px 0px;
  }

  .time_order>.title,
  .owned_folders>.title{
    margin: 20px;
    font-size: 14px;
    height: 20px;
    color: cornflowerblue;
  }
  .time_order>.content>div,
  .owned_folders>.content>div{
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
  }
  .time_order>.content>div>svg,
  .owned_folders>.content>div>svg{
    font-size: 60px;
  }

</style>
