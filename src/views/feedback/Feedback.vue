<template>
  <div class="feedback">
    <OperationBG :navContent="navContent"></OperationBG>
    <div class="outer">
      <textarea v-model="content" cols="30" rows="10"></textarea>
      <br>
      <button type="button" @click="submitFeedback">提交</button>
    </div>
  </div>
</template>

<script>
  import OperationBG from "../../components/OperationBG";
  import {toggleTip, uploadOrUpdate} from "../../publics/public";
  export default {
    components:{
      OperationBG: OperationBG
    },
    data() {
      return {
          navContent:{
            icon: '&#xe67e;',
            text: '意见反馈'
          },
          content:''
      }
    },
    methods:{
      submitFeedback(){
        uploadOrUpdate('/').then(data=>{
          if (data.success){
            this.content = ''
            toggleTip(this,'提交成功')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .feedback{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .outer{
    text-align: right;
    width: 1000px;
  }
  .outer>textarea{
    width: 1000px;
    height: 200px;
    border-radius: 5px;
    outline: none;
    border: 1px solid #dadada;
    box-shadow: 0px 0px 10px 0px #dadada;
    padding: 10px;
  }
  .outer>button{
    margin: 10px;
    padding: 10px 40px;
    outline: none;
    color: white;
    background: -webkit-gradient(linear, left top, left bottom, from(cornflowerblue), color-stop(rgba(100, 149, 237, 0.81)),to(cornflowerblue));
    background: linear-gradient(cornflowerblue, rgba(100, 149, 237, 0.81),cornflowerblue);
    border: 1px solid cornflowerblue;
    border-radius: 5px;

  }
</style>
