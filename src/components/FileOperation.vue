<template>
  <div>
    <div class="bg"></div>
    <div class="file_operation">
<!--      v-show="!isSingleFile"-->
      <span class="iconfont icon-download" @click="downloadFile" ><span class="font">下载</span></span>
<!--      <a :href="singleUrl" download=""  v-show="isSingleFile" >-->
<!--        <span class="iconfont icon-download"><span class="font">下载</span></span>-->
<!--      </a>-->
      <span class="iconfont icon-share-nocircle"><span class="font">分享</span></span>
      <span class="iconfont icon-delete"><span class="font">删除</span></span>
      <span class="iconfont icon-moveto"><span class="font">移动到</span></span>
      <span class="iconfont icon-rename"><span class="font">重命名</span></span>
      <span class="iconfont icon-mail" @click="mail"><span class="font">发送邮件</span></span>
      <span class="iconfont icon-refresh" @click="refresh"><span class="font">刷新</span></span>
    </div>
  </div>

</template>

<script>
  import { mapState } from "vuex"
  import JSZIP from "jszip"
  import axios from "axios"
  //实现浏览器文件导出
  import FileSaver from "file-saver"
  export default {
    inject: ['reload'],
    data() {
      return {
        singleUrl:'',
        fileName:'',
        isSingleFile: true
      }
    },
    computed:{
      ...mapState(['checkedFiles'])
    },
    watch:{
      // checkedFiles(){
      //   deep:true
      //   handles:{
      //     if (this.checkedFiles.length == 1){
      //       console.log(this.checkedFiles, '000')
      //       this.singleUrl = window.baseUrl + "/testpreview/" + this.checkedFiles[0].url;
      //       this.fileName = this.checkedFiles[0].name;
      //       console.log(this.singleUrl, '111')
      //       console.log(this.fileName, '22')
      //       return
      //     }
      //     this.isSingleFile = false
      //   }
      // }
    },
    methods:{
      refresh(){
        this.reload()
      },
      mail(){
        this.$store.commit('openMail')
      },
      downloadFile(){
        let urls = []
        const baseUrl = window.baseUrl + "/testpreview/"
        this.checkedFiles.forEach(el=>{
          // urls.push('/api/testpreview/' + el.url)
          urls.push(baseUrl + el.url)
        })
        let zip = new JSZIP()
        let cache = {}
        let promises = []
        urls.forEach(el=>{
          const promise = this.getArrayBuffers(el).then(data=>{
            console.log(el,1111111)
            const arr_name = el.split("/")
            const file_name = arr_name[arr_name.length - 1] // 获取文件名
            zip.file(file_name, data, { binary: true }) // 逐个添加文件
            cache[file_name] = data
          })
          promises.push(promise)
        })
        Promise.all(promises).then(()=>{
          //使用.generateAsync可以生成一个zip文件（不是一个真实的文件，而是在内存中的表示）,返回的是promise对象
          zip.generateAsync({type:"blob"}).then(content =>{
            FileSaver.saveAs(content, "打包下载.zip")
            /*下载完毕之后把之前选中的文件取消选中*/
            this.$store.commit('setCheckedFilesFull')
          })
        })
      },

      //下载单个文件
      getArrayBuffers(url){
        console.log('sssssssssss')
        return axios.get(url,{responseType:'arraybuffer'}).then(response=>{
          if (response.status == 200){
            return response.data
          }
        })
      }
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
  .file_operation{
    margin-top: 20px;
  }
  .file_operation>span,
  .file_operation>a{
    margin-right: 30px;
    cursor: pointer;
    font-size: 16px;
    color: rgba(5, 5, 5, 0.77);
  }
  .file_operation span:hover{
    color: #5783d0;
  }
  .file_operation .font{
    font-size: 14px;
    padding-left: 5px;
  }
  a{
    text-decoration: none;
  }
  .file_nav{
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
  }
  .icon-order{
    margin-left: 80%;
  }

</style>
