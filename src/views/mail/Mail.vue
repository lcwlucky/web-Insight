<template>
  <div class="mail">
    <OperationBG :navContent="navContent"></OperationBG>
    <div class="left">
      <div class="self_mail">
        <p>个人邮箱</p>
        <div>
          <span class="title_self">邮箱</span>
          <span class="self_address" v-show="!modify.addr">{{selfMail.address}}</span><span v-show="!modify.addr" @click="modifySelf('addr')" class="iconfont icon-rename"></span>
          <div class="mail_input_outer">
            <input v-show="modify.addr" v-model="selfMail.address" type="text" @keyup.enter="modifySelfOk('addr')">
            <span v-show="modify.addr" @click="modifySelfOk('addr')" class="iconfont icon-checked_circle"></span>
          </div>
        </div>
        <div>
          <span class="title_self">SMTP服务器</span>
          <span class="self_address" v-show="!modify.smtp">{{selfMail.smtp}}</span><span v-show="!modify.smtp" @click="modifySelf('smtp')" class="iconfont icon-rename"></span>
          <div class="mail_input_outer">
            <input v-show="modify.smtp" v-model="selfMail.smtp" type="text" @keyup.enter="modifySelfOk('smtp')">
            <span v-show="modify.smtp" @click="modifySelfOk('smtp')" class="iconfont icon-checked_circle"></span>
          </div>
        </div>
        <div>
          <span class="title_self">授权码</span>
          <span class="self_address" v-show="!modify.pwd">{{selfMail.pwd}}</span><span v-show="!modify.pwd" @click="modifySelf('pwd')" class="iconfont icon-rename"></span>
          <div class="mail_input_outer">
            <input v-show="modify.pwd" v-model="selfMail.pwd" type="text" @keyup.enter="modifySelfOk('pwd')">
            <span v-show="modify.pwd" @click="modifySelfOk('pwd')" class="iconfont icon-checked_circle"></span>
          </div>
        </div>
      </div>
      <div class="contacts">
        <p>联系人</p>
        <div class="contacts_tree"><el-tree :data="contacts" :props="defaultProps"></el-tree></div>
        <div class="add_contact">
          <p><label for="addName">备注</label><input type="text" id="addName" v-model="newContact.name"></p>
          <p><label for="addMailAddr">邮箱地址</label><input @keyup.enter="addContact" type="text" id="addMailAddr" v-model="newContact.mailAddr">
          <button type="button" class="add_contact_btn" @click="addContact">添加</button></p>
        </div>
      </div>
    </div>
    <div class="right">
      <p>历史记录</p>
      <div class="history_mails" v-for="item in historyMails">
        <p><span>收件人</span>{{item.recipient}}</p>
        <p><span>主题</span>{{item.title}}</p>
        <p><span>发送时间</span>{{unixChange(item.time)}}</p>
        <p><span>内容</span><span class="hs_mail_content" v-html="item.content"></span></p>
      </div>
    </div>
  </div>
</template>

<script>
  import OperationBG from "../../components/OperationBG";
  import {fetchList, inputIsEmpty, toggleTip, unixChange, uploadOrUpdate} from "../../publics/public";

  export default {
    components:{
      OperationBG: OperationBG
    },
    data() {
      return {
        navContent:{
          icon: '&#xe70a;',
          text: '邮箱管理'
        },
        modify: {addr: false,pwd: false,smtp: false},
        newContact:{name:'',mailAddr:''},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        historyMails:[],
        contacts:[{
          label: '所有联系人',
          children: [{label:''}]
        }],
        selfMail:{address: '',pwd:'', smtp:''}
      }
    },
    mounted(){
      this.getMailInfo()
    },
    methods:{
      getMailInfo(){
        fetchList('/mailinfo').then(data=>{
          this.historyMails = data.mails
          this.selfMail.address = data.acc
          this.selfMail.pwd = data.pwd
          this.selfMail.smtp = data.smtp
          let children = []
          data.contacts.forEach(el=>{
            const label = el.remark + ' ' + el.email
            const child = {label: label, name: el.remark, mailAddr: el.email}
            children.push(child)
          })
          this.contacts[0].children = children
          console.log(this.contacts,444)
        })
      },
      modifySelf(flag){
        switch (flag) {
          case "addr": this.modify.addr = true;break;
          case "smtp": this.modify.smtp = true;break;
          case "pwd": this.modify.pwd = true;break;
        }
      },
      modifySelfOk(flag){
        switch (flag) {
          case "addr": this.modify.addr = false;break;
          case "smtp": this.modify.smtp = false;break;
          case "pwd": this.modify.pwd = false;break;
        }
      },
      addContact(){
        if (!this.newContact.name || !this.newContact.mailAddr){
          inputIsEmpty(this, '输入不能为空')
          return
        }
        const mailRule = /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/
        if (!mailRule.test(this.newContact.mailAddr)){
          inputIsEmpty(this, '请输入正确格式的邮箱地址')
          return
        }
        const label = this.newContact.name +  '   ' + this.newContact.mailAddr
        let formData = new FormData()
        formData.append('name',this.newContact.name)
        formData.append('email',this.newContact.mailAddr)
        uploadOrUpdate('/addcontact',formData).then(data=>{
          if (data.success){
            toggleTip(this, '添加成功')
            this.contacts[0].children.push({label: label, name: this.newContact.name, mailAddr: this.newContact.mailAddr})
          }
        })
        this.newContact = { name:'',mailAddr:''}
      },
      unixChange(timeStamp){
        return unixChange(timeStamp)
      }
    }
  }
</script>

<style scoped>
  .mail{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .left,.right{
    border: 1px solid lightgray;
    box-shadow: 0px 0px 4px 0px #b2b0b0;
    background-color: white;
    border-radius: 5px;
    float: left;
    padding: 10px;
  }
  .left{
    width:390px;
    height: 510px;
  }
  .right{
    width: 720px;
    margin-left: 30px;
    height: 510px;
    overflow: auto;
  }
  /*历史发送记录*/
  .right>p{
    margin: 10px;
    font-weight: bold;
  }
  .right .history_mails{
    padding: 5px 10px;
    min-height: 50px;
    background-color: #f7f7f7;
    border-radius: 5px;
    margin: 10px;
  }
  .right .history_mails>p{
    margin-top: 5px;
  }
  .right .history_mails>p>span:first-child{
    color: gray;
    display: inline-block;
    width: 70px;
    font-size: 14px;
    max-height: 80px;
    vertical-align: top;
  }
  .history_mails .hs_mail_content{
    display: inline-block;
    width: 200px;
    overflow: hidden;
    vertical-align: top;
  }
  /*自身邮箱信息*/
  .self_mail .title_self{
    width: 100px;
    display: inline-block;
    color: #777777;
    padding: 5px 15px 5px 10px;
  }
  .self_mail>p{
    margin: 10px;
    font-weight: bold;
  }
  .self_mail .self_address{
    font-size: 14px;
  }
  .self_mail .icon-rename{
    color: cornflowerblue;
    margin-left: 10px;
    font-size: 12px;
  }
  .mail_input_outer{
    position: relative;
    display: inline-block;
  }
  .self_mail input{
    width: 200px;
    outline: none;
    border: 1px solid gray;
    padding: 2px 5px;
    border-radius: 5px;
  }
  .self_mail .icon-checked_circle{
    color: #162134;
    position: absolute;
    right: 4px;
    top: 3px;
  }
  .self_mail>div{
    margin-bottom: 10px;
  }
/*  联系人*/
  .contacts>p{
    margin: 10px;
    font-weight: bold;
  }
  .contacts_tree{
    height: 220px;
    overflow: auto;
  }
/*  新添联系人*/
  .add_contact label{
    font-size: 14px;
    color: gray;
    margin: 10px;
    display: inline-block;
    width: 60px;
  }
  .add_contact input{
    outline: none;
    border: 1px solid gray;
    padding: 5px;
    border-radius: 5px;
    height: 15px;
    width: 200px;
  }
  .add_contact button{
    padding: 5px 20px;
    border: 1px solid cornflowerblue;
    border-radius: 5px;
    outline: none;
    background-color: white;
    color: cornflowerblue;
    margin-left: 20px;
    cursor: pointer;
  }
</style>
