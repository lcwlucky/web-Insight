<template>
  <div class="sidebar">
    <div class="logo"><img src="../assets/img/logo.png" alt="logo"></div>
    <transition name="sidebarNav_left">
      <ul class="activities" v-show="!isMyFile">
        <li @click="toMyFile"><span class="iconfont icon-my-files"></span><span class="activity_name">我的文件</span></li>
        <router-link to="/main/useTimes"><li :class="{chosen: '/main/useTimes'=== $route.path}"><span class="iconfont icon-editor"></span><span class="activity_name">使用统计</span></li></router-link>
        <router-link to="/main/taskList"><li :class="{chosen:'/main/taskList' === $route.path}"><span class="iconfont icon-task"></span><span class="activity_name">任务清单</span></li></router-link>
        <router-link to="/main/myCollections"><li :class="{chosen:'/main/myCollections' === $route.path}"><span class="iconfont icon-my-collections"></span><span class="activity_name">我的收藏</span></li></router-link>
        <router-link to="/main/myLikes"><li :class="{chosen:'/main/myLikes' === $route.path}"><span class="iconfont icon-my-follows"></span><span class="activity_name">我的关注</span></li></router-link>
        <router-link to="/main/mail"><li :class="{chosen:'/main/mail' === $route.path}"><span class="iconfont icon-mail"></span><span class="activity_name">邮箱管理</span></li></router-link>
        <router-link to="/main/feedback"><li :class="{chosen:'/main/feedback' === $route.path}"><span class="iconfont icon-feedback"></span><span class="activity_name">意见反馈</span></li></router-link>
        <router-link to="/main/empty"><li :class="{chosen:'/main/empty' === $route.path}"><span class="iconfont icon-empty"></span><span class="activity_name">回收站</span></li></router-link>
        <router-link to="/main/setup"> <li :class="{chosen:$route.path==='/main/setup'  }"><span class="iconfont icon-setup"></span><span class="activity_name">设置</span></li></router-link>
      </ul>
    </transition>
    <transition name="sidebarNav_right">
      <ul class="activities_of_files" v-show="isMyFile">
        <li @click="toActivities"><span class="iconfont icon-undo"></span><span class="activity_name">返回</span></li>
        <router-link to="/main/localFiles"><li :class="{chosen: '/main/localFiles'=== $route.path}"><span class="iconfont icon-local" style="font-size: 15px;"></span><span class="activity_name">本地文件</span></li></router-link>
        <router-link to="/main/insight"><li :class="{chosen: '/main/insight'=== $route.path}"><span class="iconfont icon-fangdajing"></span><span class="activity_name">洞见</span></li></router-link>
        <router-link to="/main/defineFiles"><li :class="{chosen: '/main/defineFiles'=== $route.path}"><span class="iconfont icon-define"></span><span class="activity_name">归档</span></li></router-link>
        <router-link to="/main/allFiles"><li :class="{chosen: '/main/allFiles'=== $route.path}"><span class="iconfont icon-all-files"></span><span class="activity_name">全部文件</span></li></router-link>
        <router-link to="/main/pictures"><li :class="{chosen: '/main/pictures'=== $route.path}"><span class="iconfont icon-picture"></span><span class="activity_name">图片</span></li></router-link>
        <router-link to="/main/documents"><li :class="{chosen: '/main/documents'=== $route.path}"><span class="iconfont icon-documents"></span><span class="activity_name">文档</span></li></router-link>
        <router-link to="/main/audios"><li :class="{chosen: '/main/audios'=== $route.path}"><span class="iconfont icon-audios"></span><span class="activity_name">音频</span></li></router-link>
        <router-link to="/main/videos"><li :class="{chosen: '/main/videos'=== $route.path}"><span class="iconfont icon-video"></span><span class="activity_name">视频</span></li></router-link>
        <router-link to="/main/others"><li :class="{chosen: '/main/others'=== $route.path}"><span class="iconfont icon-others"></span><span class="activity_name">其他</span></li></router-link>
      </ul>
    </transition>
    <!-- 上传和操作操作入口   -->
    <div class="operations">
      <span class="iconfont icon-up-file up_file" title="点击上传文件" @click="upFile">&nbsp上传</span>
      <el-popover
        popper-class="new_folder"
        placement="top"
        width="150"
        trigger="click">

        <p @click="needNewFolder">新建文件夹</p>
        <p @click="needNewTask">新建任务</p>
        <el-button slot="reference"><span  class="iconfont icon-add new_file" title="点击新建文件" >&nbsp新建</span></el-button>
        <!--<el-button slot="reference"class="new_file"><span  class="iconfont icon-add " title="点击新建文件"  @click="newFile">&nbsp新建</span></el-button>-->
      </el-popover>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isMyFile: true
      }
    },
    methods:{
      toMyFile() {
        this.isMyFile = true
      },
      toActivities() {
        this.isMyFile = false
      },
      needNewTask(){
        this.$store.commit('toggleNewTask')

      },
      needNewFolder(){
        this.$store.commit('toggleNewFolder')

      },
      upFile() {
        this.$store.commit('toggleUpFile')

      },
    },
  }
</script>

<style scoped>
  .operations{
    position: absolute;
    bottom: 50px;
  }
  .el-popover>p {
    cursor: pointer;
    padding: 10px;
  }
  .el-popover>p:hover{
    background-color: rgba(175, 175, 175, 0.41);
    border-radius: 3px;
  }
  .sidebar .up_file{
    background-color: #248dc7;
    border-radius: 5px;
    border: 1px solid #248dc7;
    margin: 10px;
    color: white;
    line-height: 30px;
    padding: 0px 25px;
    font-size: 14px;
    cursor: pointer;
    display: inline-block;
  }

  .sidebar{
    position: fixed;
    height: 100%;
    width: 240px;
    background-color: rgb(240, 240, 240);
    z-index: 99;
  }
  .logo{
    margin: 20px auto;
    width: 150px;
    background-color: transparent;
    text-align: center;
  }
  .logo>img{
    width: 130px;
  }
  .activities,
  .activities_of_files{
    list-style: none;
    margin: 0;
    overflow: hidden;
    color: gray;
  }
  .activities li,
  .activities_of_files li{
    padding-left: 40px;
    text-align: left;
    color: #616161;
    cursor: pointer;
  }
  a{
    text-decoration: none;
    color: #616161;
  }
  .activities li .iconfont,
  .activities_of_files li .iconfont{
    font-size: 18px;
    margin-right: 20px;
    padding: 12px 0 12px 0;
  }
  .activities li .icon-my-files{
    font-size: 16px;
  }
  .activities li .activity_name,
  .activities_of_files li .activity_name{
    display: inline-block;
    font-size: 14px;
    padding: 12px 0 12px 10px;
  }
  .activities li:hover, .activities_of_files li:hover{
    color: black;
    background-color: rgba(207, 207, 207, 0.29);
    border-radius: 3px;
  }
  .router-link-exact-active, .router-link-active .chosen {
    color: black;
    background-color: rgba(207, 207, 207, 0.29);
    border-radius: 3px;
  }

  /*只有文字部分有样式*/
  /*.activities li .activity_name:hover,*/
  /*.activities li .activity_name:checked,*/
  /*.activities_of_files li .activity_name:hover,*/
  /*.activities_of_files li .activity_name:checked{*/
    /*background-color: rgba(183, 183, 183, 0.33);*/
    /*border-radius: 3px;*/
  .sidebarNav_left-enter {
    opacity: 0;
    transform: translate3d(-100%, 0,0);
  }
  .sidebarNav_left-enter-active,
  .sidebarNav_left-leave-active {
    transition: all .5s;
  }
  .sidebarNav_left-leave {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .sidebarNav_right-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .sidebarNav_right-enter-active,
  .sidebarNav_right-leave-active {
    transition: all .5s;
  }
  .sidebarNav_right-leave {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .operations .el-button {
    background-color: white;
    border-radius:5px;
    overflow: hidden;
    color: #248dc7;
    border: 1px solid #248dc7;
    cursor: pointer;
    line-height: 30px;
    padding:0px 25px;
    font-size: 14px;

  }
</style>
