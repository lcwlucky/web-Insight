<template>
  <div class="history_operations">
    <OperationBG :navContent="navContent"></OperationBG>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="pages"
        @current-change="changePage">
      </el-pagination>
    </div>
    <table>
      <thead>
      <tr>
        <td class="opt_id">|编号</td>
        <td class="opt_time">|时间</td>
        <td class="opt_info">|操作</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in list" :key="index">
        <td>{{item.id}}</td>
        <td>{{unixChange(item.time)}}</td>
        <td v-html="item.record"></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import OperationBG from "../../components/OperationBG";
  import {fetchList, unixChange} from "../../publics/public";

  export default {
    components:{
      OperationBG: OperationBG
    },
    data() {
      return {
        navContent:{
          icon: '&#xe735;',
          text: '历史操作记录'
        },
        list:[],
        pages:'',
      }
    },
    mounted(){
      this.getOperations()
    },
    methods: {
      getOperations(nowPage){
        const temp = nowPage ? nowPage : 1
        const childUrl = '/gethistory/' + temp
        fetchList(childUrl).then(data=>{
          this.list = data.list
          this.pages = data.pages * 10
          console.log(this.pages,444)
        })
      },
      changePage(nowPage){
        this.getOperations(nowPage)
      },
      unixChange(timeStamp){
        return unixChange(timeStamp)
      }
    }
  }
</script>

<style scoped>
  .history_operations{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .opt_id{
    width: 100px;
  }
  .opt_time{
    width: 300px;
  }
  .opt_info{
    width: 800px;
  }
  tr>td{
    padding: 10px;
  }
  tbody>tr:hover{
    background: #e7e7e7;
  }
  /*.block{*/
  /*  text-align: center;*/
  /*}*/
</style>
