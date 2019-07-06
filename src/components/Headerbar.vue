<template>
  <div class="header clearFix">
    <!--搜索-->
    <div class="search">
      <input type="text" placeholder="搜索关键字" v-model="searchKey" @keyup.enter="search">
      <el-dropdown trigger="click" placement="top-start" >
        <span class="el-dropdown-link search_way_show" title="点击选择搜索方法">
          <span class="iconfont icon-filter_border"></span>
          <span class="show_word">{{nowSearchWay}}</span>
        </span>
        <el-dropdown-menu slot="dropdown" class="search_way">
          <el-dropdown-item @click.native="chooseSearchWay(1)">路径搜索</el-dropdown-item>
          <el-dropdown-item @click.native="chooseSearchWay(2)">内容检索</el-dropdown-item>
          <el-dropdown-item @click.native="chooseSearchWay(3)">关键词标签搜索</el-dropdown-item>
          <el-dropdown-item @click.native="chooseSearchWay(4)">评论搜索</el-dropdown-item>
          <el-dropdown-item @click.native="chooseSearchWay(5)">文件名搜索</el-dropdown-item>
          <el-dropdown-item @click.native="chooseSearchWay(6)">全部搜索</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="iconfont icon-search" @click="search"></span>
    </div>
    <!--通知和历史操作-->
    <div class="two_icon">
      <span class="iconfont icon-remind" title="点击查看通知"></span>
      <span class="iconfont icon-history" title="查看历史操作" @click="historyOpts"></span>
    </div>
    <!--个人信息-->
    <div class="person_info">
      <img :src="personInfo.headPhoto" alt="头像">
      <div class="pi_right">
        <div>
          <span class="username" >{{personInfo.username}}</span>
          <div class="vip">
            <span v-show="personInfo.vip">会员</span>
            <span v-show="!personInfo.vip">非会员</span>
            <!--会员icon默认是灰色的，表示非会员-->
            <span :class="{is_vip:personInfo.vip }" class="iconfont icon-vip"></span>
          </div>
        </div>
        <div>
          <div class="capacity">
            <div class="used"></div>
          </div>
          <span class="capacity_num">100/600GB</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import {inputIsEmpty} from "../publics/public";

  export default {
    inject: ['reload'],
    data() {
      return {
        personInfo:{
          headPhoto: require('../assets/img/head_photo.jpg'),
          username:'userA',
          vip:true,
          usedSize:'100',
          totalSize:'600'
        },
        nowSearchWay:'全部',
      }
    },
    computed:{
      ...mapState(['searchKey', 'searchWay']),
      searchKey:{
        get(){
          return this.$store.state.searchKey
        },
        set(val){
          this.$store.state.searchKey = val
        }
      },
      searchWay:{
        get(){
          return this.$store.state.searchWay
        },
        set(val){
          this.$store.state.searchWay = val
        }
      }
    },
    methods:{
      chooseSearchWay(wayId){
        switch (wayId) {
          case 1:
            this.nowSearchWay = '路径';
            this.searchWay = 1;
            break;
          case 2:
            this.nowSearchWay = '内容';
            this.searchWay = 2;
            break;
          case 3:
            this.nowSearchWay = '短语';
            this.searchWay = 3
            break;
          case 4:
            this.nowSearchWay = '评论';
            this.searchWay = 4;
            break;
          case 5:
            this.nowSearchWay = '名称';
            this.searchWay = 5;
            break;
          case 6:
            this.nowSearchWay = '全部';
            this.searchWay = 6;
            break;
        }
      },
      search(){
        if (!this.searchKey) {
          inputIsEmpty(this,'输入不能为空')
          return
        }
        switch (this.searchWay) {
          case 1: // 路径
            if (this.$route.path === '/main/folderResult') {
              this.reload()
              return
            }
            this.$router.push('/main/folderResult');
            break;
          case 2: // 内容
            if (this.$route.path === '/main/contentResult') {
              this.reload()
              return
            }
            this.$router.push('/main/contentResult');
            break;
          case 3: // 关键词标签
            if (this.$route.path === '/main/keywordTagResult') {
              this.reload()
              return
            }
            this.$router.push('/main/keywordTagResult');
            break;
          case 4: // 评论
            if (this.$route.path === '/main/remarkSearch') {
              this.reload()
              return
            }
            this.$router.push('/main/remarkSearch');
            break;
          case 5: // 文件名
            if (this.$route.path === '/main/nameResult') {
              this.reload()
              return
            }
            this.$router.push('/main/nameResult');
            break;
          case 6: // 全部
            if (this.$route.path === '/main/totalResult') {
              this.reload()
              return
            }
            this.$router.push('/main/totalResult');
            break;
        }
      },
      historyOpts(){
        this.$router.push('/main/historyOperations')
      }
    }
  }
</script>

<style scoped>

  .header{
    padding: 20px 0px 20px 50px;
    color: gray;
    width: 1225px;
  }
  .search{
    width: 700px;
    position: relative;
    float: left;
  }
  .search input{
    width: 90%;
    height: 40px;
    border-radius: 5px;
    border: 1px solid rgba(203, 203, 203, 0.27) ;
    background-color: rgba(203, 203, 203, 0.27);
    padding: 2px 15px 2px 65px;
    font-size: 15px;
  }
  .search input:hover, .search input:focus{
    border: 1px solid rgba(100, 100, 100, 0.27);
    outline: none;
  }
  .search span.icon-search, .search .search_way_show{
    position: absolute;
    cursor: pointer;
    top: 22%;
  }
  .search .search_way_show{
    top: -50px;
    left: 12px;
    color: cornflowerblue;
    width: 50px;
  }
  .search .search_way_show .show_word{
    top: 33%;
    font-size: 13px;
  }
  .search span.icon-search{
    right: 10px;
  }
  .two_icon{
    float: left;
    padding: 10px 30px;
  }
  .two_icon .icon-remind, .two_icon .icon-history{
    font-size: 25px;
    padding: 0px 10px;
    cursor: pointer;
  }
  .person_info{
    float: left;
    padding: 0px 30px;
  }
  .person_info img{
    width: 50px;
    height: 50px;
    border-radius: 50px;
    cursor: pointer;
    float: left;
  }
  .pi_right{
    float: left;
    padding:0px 20px;
  }
  .person_info .username{
    cursor: pointer;
    padding: 5px;
  }
  .person_info .vip {
    display: inline-block;
    padding: 5px 50px;

  }
  .is_vip{
    color: #c7a32d;
  }
  .capacity{
    width: 100px;
    background-color: rgba(199, 199, 199, 0.26);
    border-radius: 5px;
    height: 10px;
    display: inline-block;
  }
  .capacity .used{
    background-color: #248dc7;
    width: 20%;
    border-radius: 5px;
    height: 10px;
  }
  .capacity_num{
    font-size: 13px;

  }
</style>
