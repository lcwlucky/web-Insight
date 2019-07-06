<template>
  <div class="task_list">
    <OperationBG :navContent="navContent"></OperationBG>
    <div class="block timeSelect">
      <span class="demonstration"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-importance2"></use></svg></span>
      <el-date-picker
        v-model="rangeTime"
        type="month"
        default-value
        placeholder="2019 年 05 月"
        format="yyyy 年 MM 月"
      >
      </el-date-picker>
    </div>
    <div class="clearFix">
      <div class="task_table" >
        <el-table id="table" ref="filterTable" :data="tasks" style="width: 100%" @select="selectItem" @row-click="clickRow" :row-class-name="getRowClassName">
          <el-table-column type="selection" width="55" @click="completed"></el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            width="180"
          >
            <!--show-overflow-tooltip="true"-->
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="日期"
            sortable
            width="180"
            column-key="createTime"
          >
          </el-table-column>
          <el-table-column
            prop="tag"
            label="优先级"
            width="100"
            :filters="[{ text: '重要紧急', value: '重要紧急' }, { text: '重要', value: '重要' }, { text: '紧急', value: '紧急' }, { text: '普通', value: '普通' }]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type=tagType(scope.row.tag)
                disable-transitions>{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            width="180">
          </el-table-column>
        </el-table>
      </div>
      <div class="task_info">
        <p><span class="close" @click="closes">&times;</span>详细信息</p>
        <button class="item_del_btn" @click="delItem">删除此任务</button>
        <p class="clearFix"><span class="info_title">内容</span><span class="item_content2" contenteditable="true">{{chosenItem.content}}</span></p>
        <p class="clearFix"><span class="info_title">创建时间</span><span class="item_tip_time2">{{chosenItem.createTime}}</span></p>
        <div class="remark_pic_info clearFix"><span class="info_title">评论</span>
          <span class="remark" v-for="(item,index) in chosenItem.comments" :key="index">{{item.content}}</span>
          <div class="input_outer">
            <input class="remark_input" type="text" v-model="newRemark" placeholder="新增评论"
                   v-on:keyup.enter="addRemark">
            <span class="iconfont icon-checked_circle ok_remark_input"
                  @click="addRemark"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import OperationBG from "../../components/OperationBG"
  import { mapState } from "vuex"
  import {getNowDay} from "../../publics/public";
  export default {
    components:{
      OperationBG: OperationBG
    },
    data() {
      return {
        navContent:{
          icon: '&#xe732;',
          text: '我的任务清单'
        },
        rangeTime:'',
        multipleSelection:[],
        chosenItem:{},
        nowIndex:0,
        completeIndex:'',
        newRemark:''
      }
    },
    mounted(){
      // 给state的tasks赋值
      this.$store.commit('getTasks')
      this.chosenItem = this.tasks[this.nowIndex]
    },
    computed:{
      ...mapState(['tasks']),
      tasks:{
        get(){
          return this.$store.state.tasks
        },
        set(val){
          this.$store.state.tasks = val
        }
      }
    },
    methods:{
      addRemark(){
        this.chosenItem.comments.push({content: this.newRemark, time: getNowDay()})
        this.tasks[this.nowIndex] = this.chosenItem
        this.newRemark = ''
      },
      getRowClassName({row}){
        const arr = [
          {
            key: 'completed',
            value: row.compeleted
          },
          {
            key: 'itemChecked',
            value: row.checked
          }
        ]
        const classNames = arr.filter(({value})=>value).map(({key})=>key).join(' ')
        return classNames

      },
      closes(){
      },
      tagType(tag){
        if(tag === '重要紧急') {
          return 'danger'
        }else if(tag === '重要') {
          return 'primary'
        }else if(tag === '紧急') {
          return 'success'
        }else if(tag === '普通') {
          return 'default'
        }
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      selectItem(selection, row){
        // 1.切换样式 2.更新属性
        row.compeleted=true;
        row.compeleted = selection.indexOf(row) > -1
      },
      clickRow(row, column, event){
        this.chosenItem = row
        this.tasks.forEach(task=>task.checked=false)
        row.checked = true
        const index = this.tasks.findIndex(el=>{ return el == row})
        this.nowIndex = index
      },
      delItem(){
        this.tasks.splice(this.nowIndex, 1)
        localStorage.setItem('tasks',JSON.stringify(this.tasks))
        // this.chosenItem = this.tasks[this.nowIndex]
        this.chosenItem = this.tasks[0]
      },
      completed(){
        console.log('111')
      }
    },
    watch(){
      tasks:{
        deep: true
        handler:{
          localStorage.setItem('tasks',JSON.stringify(this.tasks))
        }
      }
    },
    beforeDestroy() {
      // 关闭之前将不影响页面的值统一保存到本地，如state
      localStorage.setItem('tasks',JSON.stringify(this.tasks))
    }
  }
</script>

<style scoped>

  >>> .completed{
    color: rgba(177, 177, 177, 0.45);
  }
  >>> .itemChecked{
    background-color: #f5f7fa;
  }
  .task_list{
    position: relative;
    overflow: hidden;
    padding-left: 50px;
  }
  .task_table {
    float: left;
    width: 70%;
  }
  .task_info{
    background-color: white;
    border-radius:5px;
    box-shadow: 0px 0px 10px 0px lightgray;
    box-sizing: border-box;
    float: right;
    width: 28%;
    margin-bottom: 10px;
    margin-right: 20px;
  }
  .task_info .remark_input{
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 20px 2px 4px;
    font-size: 12px;
  }
  .task_info .ok_remark_input{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }
  .task_info .input_outer{
    position: relative;
    display: inline-block;
  }
  .task_info .close{
    font-size: 25px;
    margin-right: 10px;
    cursor: pointer;
  }
  .task_info .info_title{
    margin: 0px 10px;
    display: inline-block;
    width: 70px;
    float: left;
    color: gray;
  }
  .task_info>p,
  .task_info>div{
    margin: 10px;
    padding: 10px;
  }
  .item_del_btn{
    height: 32px;
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px 40px;
    color: #248dc7;
    border: 1px solid #248dc7;
    cursor: pointer;
    line-height: 30px;
    padding: 0px 25px;
    font-size: 14px;
  }
  .item_content2{
    display: inline-block;
    width: 210px;
  }
  .el-table__header-wrapper,.el-table__body-wrapper{
    /*display: inline-block;*/
    width: auto;
  }

</style>
