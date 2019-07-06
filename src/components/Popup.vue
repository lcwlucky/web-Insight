<template>
  <div>
    <!-- 上传文件  -->
    <transition name="alertTip">
      <div class="up_file_box" v-if="isUpFile" ref="upFile">
        <p class="box_title" ref="upFileHandle">上传文件</p>
        <div class="box_content">
          <p><span class="location_file">上传至</span><span @click="chooseFileLocation" class="location_file_input"
                                                         type="text">{{fileLocationShow}}</span></p>
          <p><span class="choose_file">选择文件</span><span class="choose_file_input" placeholder="点击选择"><span>{{curFile.name}}</span><input
            type="file" @change="getFile" title="点击选择文件"></span></p>
          <p><span class="tag_file">标签</span><input class="tag_file_input" type="text" v-model="newTag"
                                                    placeholder="以空格分隔"></p>
          <div class="importance_file"><span class="importance_title">标记</span>
            <input id="importance4" class="importance4" name="importance" type="radio" value=4
                   @click="getFolderImportance"><label for="importance4">非常重要</label>
            <input id="importance3" class="importance3" name="importance" type="radio" value=3
                   @click="getFolderImportance"><label for="importance3">比较重要</label>
            <input id="importance2" class="importance2" name="importance" type="radio" value=2
                   @click="getFolderImportance"><label for="importance2">重要</label>
            <input id="importance1" class="importance1" name="importance" type="radio" value=1
                   @click="getFolderImportance" checked><label for="importance1">一般</label>
          </div>
          <div class="buttons">
            <button type="button" class="yes" @click="submitFile">确定</button>
            <button type="button" class="cancel" @click="cancelUpFile">取消</button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 新建任务-->
    <transition name="alertTip">
      <div class="new_task_box" v-if="isNewTask" ref="newTask">
        <p class="box_title" ref="newTaskHandle">新建任务</p>
        <div class="box_content">
          <p class="new_task_content">内容 <textarea v-model="newTask.content"></textarea></p>
          <p class="new_task_content">备注 <textarea v-model="newTask.remark"></textarea></p>
          <p><span class="time">创建日期</span>{{getNowDay()}}</p>
          <!--          <div class="block ">-->
          <!--            <span class="demonstration tip_time">提醒时间</span>-->
          <!--            <el-date-picker-->
          <!--              v-model="newTask.tipTime"-->
          <!--              type="datetime"-->
          <!--              placeholder="选择时间">-->
          <!--            </el-date-picker>-->
          <!--          </div>-->
          <p><span class="tag_new_task">标签</span>
            <el-select class="" v-model="newTask.tag" placeholder="请选择">
              <el-option
                v-for="item in tag"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </p>
          <div class="buttons">
            <button type="button " class="yes" @click="createNewTask">确定</button>
            <button type="button " class="cancel" @click="cancelNewTask">取消</button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 新建文件夹-->
    <transition name="alertTip">
      <div class="new_folder_box" v-if="isNewFolder" ref="newFolder">
        <div class="box_content">
          <p class="box_title" ref="newFolderHandle">新建文件夹</p>
          <p><span class="location_file">上传至</span><span @click="chooseFileLocation" class="location_file_input"
                                                         type="text">{{fileLocationShow}}</span></p>
          <p><span class="name_folder">名称</span><input class="name_folder_input" v-model="newFolderUpload.name"
                                                       type="text"></p>
          <p><span class="time_folder">创建日期</span>{{getNowDay()}}</p>
          <!--          <div class="importance_folder"><span class="importance_title">标记</span>-->
          <!--            <input id="importance-1" class="importance-1" name="importance" type="radio" value=-1-->
          <!--                   @click="getFolderImportance"><label for="importance-1">重要</label>-->
          <!--            <input id="importance1" class="importance1" name="importance" type="radio" value=1-->
          <!--                   @click="getFolderImportance"><label for="importance1">重要吗</label>-->
          <!--            <input id="importance0" class="importance0" name="importance" type="radio" value=0-->
          <!--                   @click="getFolderImportance" checked="checked"><label for="importance0">一般</label>-->
          <!--          </div>-->
          <div class="buttons">
            <button type="button " class="yes" @click="createNewFolder">确定</button>
            <button type="button " class="cancel" @click="cancelNewFolder">取消</button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 音频播放 -->
    <div class="audios_play clearFix" v-if="isAudioPlay" ref="audiosPlay">
      <div class="header" ref="audioHandle">
        <span class="iconfont icon-audios">&nbsp&nbsp&nbsp{{nowAudio.name}}</span>
        <span class="close" @click="closeAudioPlay" title="点击关闭">&times</span>
      </div>
      <div class="body">
        <div>
          <div class="play" ref="wave"></div>
          <el-button @click="playOrPause">播放/暂停</el-button>
          <div id="Container " class="Container ">{{current}}/{{duration}}</div>
        </div>
        <div class="line"></div>
        <div class="info">
          <p><span>文件类型</span><span>{{getType(nowAudio.name)}}</span></p>
          <p><span>文件大小</span><span>{{getFileSize(nowAudio.size)}}</span></p>
          <p><span>上传时间</span><span>{{unixChange(nowAudio.serverTime)}}</span></p>
          <p><span>关键词</span><span class="keyword" v-for="item in nowAudio.keyword">{{item}}</span></p>
          <div class="tag_audio"><span>标签</span>
            <span class="tag" v-for="(item,index) in nowAudio.tag" :key="index">
          {{item}} <img @click="delOneTag(nowAudio.id, item, index)" src="../assets/img/close.png" alt="删除"
                        title="点击删除">
        </span>
            <div class="input_outer">
              <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签"
                     v-on:keyup.enter="addTag(nowAudio.id, index)"
                     :class="nowAudio.tag.length != 0 ? 'have_content': ''">
              <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag(nowAudio.id, index)"></span>
            </div>
          </div>
          <div class="remark_audio"><span>评论</span>
            <span class="remark" v-for="(item,index) in nowAudio.comments" :key="index">
          {{item.content}} <img @click="delOneRemark(item.id)" src="../assets/img/close.png" alt="删除" title="点击删除">
        </span>
            <div class="input_outer">
              <input class="remark_input" type="text" v-model="newRemark" placeholder="新增评论"
                     v-on:keyup.enter="addRemark(nowAudio.id, item.id)"
                     :class="Object.keys(nowAudio.comments).length != 0 ? 'have_content': ''">
              <span class="iconfont icon-checked_circle ok_remark_input"
                    @click="addRemark(nowAudio.id, item.id)"></span>
            </div>
          </div>
          <!--          <div class="remark_audio"><span>用户评价</span>-->
          <!--            <span v-show="!isModifyRemark" class="remarks">{{nowAudio.remark}}</span>-->
          <!--            <span v-show="!isModifyRemark" class="iconfont icon-brush" @click="modifyRemark"></span>-->
          <!--            <div class="input_outer" v-show="isModifyRemark">-->
          <!--              <input v-model="nowAudio.remark" class="remark_input" type="text" placeholder="评价"  v-on:keyup.enter="completeModifyRemark">-->
          <!--              <span class="iconfont icon-checked_circle ok_remark_input" @click="completeModifyRemark"></span>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
    <!-- 目录树形结构 -->
    <div class="catalog_tree" v-if="isCatalogTree">
      <div class="tree_title">选择路径</div>
      <div class="tree_content">
        <el-tree :data="catalog" :props="defaultProps" :highlight-current="T" @current-change="nodeChange"></el-tree>
        <div v-show="createFoldInUpload" class="new_folder_in_up">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-aFile"></use>
          </svg>
          <input type="text" v-model="newFolderUpload.name" placeholder="请输入文件名">
          <span class="iconfont icon-checked_circle" @click="newFoldUploadOk"></span>
          <span class="iconfont icon-close" @click="cancelNewFoldUpload"></span>
        </div>
        <div class="buttons">
          <button v-show="inUpFile" type="button" class="cancel" @click="newFolderInUpload">新建</button>
          <button type="button" class="yes" @click="chooseLocationOk">确定</button>
        </div>
      </div>
    </div>
    <!-- 发送邮件-->
    <div class="mail_box" ref="mailBox" v-if="isMail">
      <div class="header" ref="mailHandle">
        <span class="header_title">发送邮件</span>
        <span class="close" @click="closeMailBox" title="点击关闭">&times</span>
      </div>
      <div class="content">
        <div class="mail_title"><span>标题</span><input type="text" v-model="mailContent.title" placeholder="请输入标题"></div>
        <div class="mail_contact"><span>发送至</span>
          <input type="text" v-model="mailContent.contactName ? mailContent.contactName : mailContent.contact"
                 placeholder="添加联系人">
          <span @click="chooseContact" class="iconfont icon-add"></span>
        </div>
        <div class="mail_words"><span>内容</span>
          <div id="editor"></div>
        </div>
        <div class="checked_files">
          <span>已选附件</span>
          <span id="no_mail_files" v-if="checkedFiles.length === 0">暂无附件</span>
          <div class="checked_item" v-for="item in checkedFiles">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="fileIconsOrOthers(item.name)"></use>
            </svg>
            <p>{{item.name}}</p>
          </div>
        </div>
        <div>
          <button type="button" @click="sendMail">发送</button>
        </div>
      </div>
    </div>
    <!-- 联系人目录树-->
    <div class="contacts_tree" v-if="isContactTree">
      <el-tree :data="contacts" :props="defaultProps" @current-change="chooseContactOk"></el-tree>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import Draggable from "draggable"
  import WaveSurfer from 'wavesurfer.js'
  import Editor from 'wangeditor'

  window.Editor = Editor
  import {
    inputIsEmpty,
    uploadOrUpdate,
    getFileSize,
    toggleTip,
    formatTime,
    getNowDay,
    fetchList,
    addTag, delTag,
    addRemark, delRemark, unixChange
  } from "../publics/public"

  export default {
    name: "Popup",
    data() {
      return {
        isContactTree: false,
        inUpFile: false,
        T: true,
        file: '',
        curFile: {name: '点击选择', tag: ''},
        curType: '',
        tag: [{
          value: '重要紧急',
          label: '重要紧急'
        }, {
          value: '重要',
          label: '重要'
        }, {
          value: '紧急',
          label: '紧急'
        }, {
          value: '普通',
          label: '普通'
        }],
        newTask: {content: '', createTime: '', tag: '', tipTime: '', comments: [], remark: '', state: ''},
        newTag: '',
        fileLocationShow: '/全部文件',
        fileLocation: 1,
        newFolderUpload: {pid: 1, name: '', importance: -1},
        createFoldInUpload: false,
        audioUrl: 'https://src.fanmingfei.com/nigel.mp3',
        isOpacity: false,
        newRemark: '',
        duration: formatTime(),
        current: formatTime(),
        catalog: [],
        defaultProps: {children: 'children', label: 'label'},
        mailContent: {title: '', contactName: '', contact: '', content: ''},
        contacts: [{
          label: '所有联系人',
          children: []
        }]
      }
    },
    computed: {
      ...mapState(['isUpFile', 'checkedFiles', 'isNewTask', 'isNewFolder', 'isAudioPlay', 'nowAudio', 'isCatalogTree', 'isMail', 'checkedFiles', 'file_icons']),
      isAudioPlay: {
        get() {
          return this.$store.state.isAudioPlay
        },
        set(val) {
          this.$store.state.isAudioPlay = val
        }
      },
      isCatalogTree: {
        get() {
          return this.$store.state.isCatalogTree
        },
        set(val) {
          this.$store.state.isCatalogTree = val
        }
      }
    },
    mounted() {
      if (localStorage.getItem('tasks') === null) {
        localStorage.setItem('tasks', JSON.stringify(this.$store.state.tasks))
      }
    },
    methods: {
      unixChange(timeStamp){
        return unixChange(timeStamp)
      },
      chooseContactOk(data, obj) {
        console.log(data, '00000')
        this.mailContent.contactName = data.name
        this.mailContent.contact = data.mailAddr
        this.isContactTree = false
      },
      chooseContact() {
        this.isContactTree = true
        fetchList('/mailinfo').then(data => {
          let children = []
          data.contacts.forEach(el => {
            const label = el.remark + ' ' + el.email
            const child = {label: label, name: el.remark, mailAddr: el.email}
            children.push(child)
          })
          this.contacts[0].children = children
        })
      },
      sendMail() {
        let ids = []
        this.checkedFiles.forEach(el => {
          ids.push(el.id)
        })
        this.getEditorHtml()
        let formData = new FormData()
        formData.append('title', this.mailContent.title)
        formData.append('rec', this.mailContent.contact)
        formData.append('content', this.mailContent.content)
        formData.append('ids', ids)
        uploadOrUpdate('/sendmail', formData).then(data => {
          if (data.success) {
            toggleTip(this, '发送成功')
            this.$store.commit('closeMail')
            this.$store.commit('setCheckedFilesFull')
            this.mailContent = {title: '', contactName: '', contact: '', content: ''}
          } else {
            toggleTip(this, '发送失败，请检查')
            this.$store.commit('closeMail')
            // this.$store.commit('setCheckedFilesFull')
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      createEditor() {
        this.editor = new Editor("#editor")
        this.editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'table',  // 表格
          'undo',  // 撤销
          'redo'  // 重复
        ]
        this.editor.create()
      },
      getEditorHtml() {
        this.mailContent.content = this.editor.txt.html()
        console.log(this.mailContent.content, 'aaaaaaaaas')
      },
      closeMailBox() {
        this.isContactTree = false
        this.$store.commit('closeMail')
      },
      delOneTag(id, name, index) {
        delTag(id, name).then(data => {
          if (data.success) {
            this.nowAudio.tag.splice(index, 1)
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      delOneRemark(cid) {
        const index = this.nowAudio.comments.findIndex(el => {
          return el.id == cid
        })
        delRemark(cid).then(data => {
          if (data.success) {
            this.nowAudio.comments.splice(index, 1)
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      addTag(pid, index) {
        // 1.本地验证
        if (!this.newTag) {
          inputIsEmpty(this, '不能添加空标签')
          return
        }
        addTag(pid, this.newTag).then(data => {
          if (data.success) {
            this.nowAudio.tag.splice(index, 1)
            this.newTag = ''
          }

        }).catch(error => {
          toggleTip(this, error)
        })
      },
      addRemark(pid, id) {
        const index = this.nowAudio.comments.findIndex(el => {
          el.id == id
        })
        // 1.本地验证
        if (!this.newRemark) {
          inputIsEmpty(this, '不能添加空评论')
          return
        }
        addRemark(pid, this.newRemark).then(data => {
          if (data.success) {
            this.nowAudio.comments.splice(index, 1)
            this.newRemark = ''
          }
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      // 文件树形目录
      fetchNode() {
        this.catalog = []
        fetchList('/catalogtree').then(data => {
          // data表示最外层，全部文件
          this.catalog.push({id: data.id, label: data.name, children:[]})
          this.getNodes(this.catalog[0].children, data.nodes)
        })
      },
      getNodes(parent, nodes) {
        // parent和nodes平级
        nodes.forEach((el, index) => {
          parent.push({id: el.id, label: el.name, children:[]})
          if (el.nodes) {
            this.getNodes(parent[index].children, el.nodes)
          }
        })
      },
      nodeChange(data, obj) {
        this.fileLocation = data.id
        this.fileLocationShow = data.label
        this.newFolderUpload.pid = data.id
      },
      newFolderInUpload() {
        this.createFoldInUpload = true
      },
      chooseLocationOk() {
        // 如果在新建文件夹中，关闭目录树后直接返回
        if (!this.inUpFile) {
          this.isCatalogTree = false
          return
        }
        // 判断有没有在里面新建文件夹
        if (!this.newFolderUpload.name) {
          this.isCatalogTree = false
        } else {
          if (this.createFoldInUpload) {
            inputIsEmpty(this, '请先确认文件名！')
          } else {
            let formData = new FormData()
            formData.append('pid', this.newFolderUpload.pid)
            formData.append('name', this.newFolderUpload.name)
            uploadOrUpdate('/createcatalog', formData).then(data => {
              this.fileLocation = data.id
              this.fileLocationShow = this.newFolderUpload.name
            })
            this.isCatalogTree = false
          }
        }
      },
      newFoldUploadOk() {
        if (!this.newFolderUpload.name) {
          inputIsEmpty(this, '文件名不能为空！')
          return
        }
        this.createFoldInUpload = false
      },
      cancelNewFoldUpload() {
        this.newFolderUpload = {pid: 1, name: '', importance: -1}
        this.createFoldInUpload = false
      },
      // 上传或新建
      chooseFileLocation() {
        this.fetchNode()
        this.isCatalogTree = true
      },
      cancelUpFile() {
        this.curFile = {name: '点击选择', tag: ''}
        this.fileLocation = 1
        this.$store.commit('toggleUpFile')
        this.isCatalogTree = false
      },
      getFile() {
        // const {name, lastModified, size, collection, attention, itemChecked} = event.target.files[0]
        // this.curFile = {name, lastModified, size, collection, attention, itemChecked}
        this.curFile = event.target.files[0]
        this.curType = this.curFile.name.split('.').pop()
        if (['doc', 'docx', 'pdf', 'xls', 'txt', 'md'].indexOf(this.curType) >= 0) {
          this.curType = 'docu'
        } else if (['jpg', 'png', 'gif'].indexOf(this.curType) >= 0) {
          this.curType = 'image'
        } else if (['movie', 'mp4', 'avi'].indexOf(this.curType) >= 0) {
          this.curType = 'video'
        } else if (['mp3', 'wav'].indexOf(this.curType) >= 0) {
          this.curType = 'audio'
        } else {
          this.curType = 'others'
        }
      },
      submitFile() {
        // 1.本地验证输入
        if (!this.curFile) {
          inputIsEmpty(this, '请选择文件')
        }
        // this.curFile.tag = this.tag.split(" ")
        // this.curFile.collection = false
        // this.curFile.attention = false
        // this.curFile.itemChecked = false
        // 2.实例化一个表单数据对象，遍历curFile数组插入到表单数据对象中,这里只有一个文件，所以不需要遍历
        let formData = new FormData()
        formData.append("uploadfile", this.curFile)
        formData.append("tag", this.newTag)
        formData.append('filelocation', this.fileLocation)
        // 3.提交到后台，成功后显示消息
        uploadOrUpdate('/upload', formData).then(data => {
          if (data.success) {
            this.curFile = {name: '点击选择', tag: ''}
            this.fileLocation = 1
            toggleTip(this, '上传成功')
            // 执行/发布一个事件用来自动更新列表
            switch (this.curType) {
              case "docu":
                window.EE.emit('fetchDocuments');
                break;
              case "image":
                window.EE.emit('fetchListDefault');
                window.EE.emit('timeLine');
                window.EE.emit('intelOrder');
                break;
              case "video":
                window.EE.emit('fetchVideos');
                break;
              case "audio":
                window.EE.emit('fetchAudios');
                break;
              case "others":
                window.EE.emit('fetchOthers');
                break;
            }
            window.EE.emit('fetchAllFiles')
          }
        }).catch((error) => {
          toggleTip(this, error)
        })
        this.$store.commit('toggleUpFile')
      },
      cancelNewTask() {
        this.$store.commit('toggleNewTask')
      },
      createNewTask() {
        if (!this.newTask.content) {
          inputIsEmpty(this, '请填写内容')
          return
        }
        this.newTask.createTime = this.getNowDay()
        this.newTask.state = 0
        this.$store.commit('createNewTask', this.newTask)
        this.newTask = {content: '', createTime: '', tag: '', tipTime: '', comments: [], remark: '', state: ''}
        this.$store.commit('toggleNewTask')
      },
      getFolderImportance() {
        this.newFolderUpload.importance = event.target.value
      },
      cancelNewFolder() {
        this.newFolderUpload = {pid: 1, name: '', importance: -1}
        this.$store.commit('toggleNewFolder')
      },
      createNewFolder() {
        if (!this.newFolderUpload.name) {
          inputIsEmpty(this, '请输入文件名！')
        } else {
          let formData = new FormData()
          formData.append('pid', this.newFolderUpload.pid)
          formData.append('name', this.newFolderUpload.name)
          uploadOrUpdate('/createcatalog', formData).then(data => {
            this.$store.commit('toggleNewFolder')
            window.EE.emit('fetchAllFiles')

          })
        }
      },
      getNowDay() {
        return getNowDay()
      },
      getAudioUrl() {
        // this.audioUrl = window.baseUrl + '/testpreview/' + this.nowAudio.url
        return window.baseUrl + '/testpreview/' + this.nowAudio.url
      },
      // 音频操作
      createWaveSurfer() {
        this.wavesurfer = WaveSurfer.create({
          container: this.$refs.wave,
          waveColor: 'lightgray',
          progressColor: 'cornflowerblue',
          height: 100,
          mediaControls: true
        })
        // this.wavesurfer.load(this.getAudioUrl)
        this.wavesurfer.load(this.getAudioUrl())
        this.wavesurfer.on('audioprocess', () => {
          this.getCurrent()
        })
        this.wavesurfer.on('ready', () => {
          console.log('readyreayready')
          this.getDuration()
          // this.wavesurfer.play()
        })
      },
      playOrPause() {
        console.log('playpause')
        this.wavesurfer.playPause()
      },
      getCurrent() {
        const current = formatTime(this.wavesurfer.getCurrentTime())
        this.current = current
      },
      getDuration() {
        const duration = formatTime(this.wavesurfer.getDuration())
        this.duration = duration
      },
      closeAudioPlay() {
        // 1.停止播放 2.弹窗关闭
        this.isAudioPlay = false
        this.wavesurfer.pause()
      },
      getType(name) {
        const type = name.split('.').pop()
        return type
      },
      getFileSize(size) {
        return getFileSize(size)
      },
      fileIconsOrOthers(name) {
        const ext = name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
    },
    watch: {
      isAudioPlay() {
        if (this.isAudioPlay) {
          this.$nextTick(() => {
            this.createWaveSurfer()
            new Draggable(this.$refs.audiosPlay, {
              handle: this.$refs.audioHandle
            })
          })
        }
      },
      isMail() {
        if (this.isMail) {
          this.$nextTick(() => {
            this.createEditor()
            new Draggable(this.$refs.mailBox, {
              handle: this.$refs.mailHandle
            })
          })
        }
      },
      isUpFile() {
        if (this.isUpFile) {
          this.$nextTick(() => {
            this.inUpFile = true
            new Draggable(this.$refs.upFile, {
              handle: this.$refs.upFileHandle
            })
          })
        }
      },
      isNewTask() {
        if (this.isNewTask) {
          this.$nextTick(() => {
            new Draggable(this.$refs.newTask, {
              handle: this.$refs.newTaskHandle //设置拖动的句柄，如果没有，点击任何地方都可以拖动
            })
          })
        }
      },
      isNewFolder() {
        this.inUpFile = false
        if (this.isNewFolder) {
          this.$nextTick(() => {
            new Draggable(this.$refs.newFolder, {
              handle: this.$refs.newFolderHandle
            })
          })
        }
      }
    }
  }
</script>

<style scoped>
  /*邮件联系人目录树*/
  .contacts_tree {
    position: absolute;
    width: 265px;
    min-height: 50px;
    top: 50%;
    left: 40%;
    margin-top: -100px;
    margin-left: -25px;
    border: 1px solid #bcbcbc;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 1px #c5c5c5;
    padding: 10px;
    background-color: white;
  }

  /*发送邮件开始*/
  .mail_box {
    position: absolute;
    width: 600px;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -150px;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px #a4a2a2;
    background-color: #fff;
  }

  .mail_box > .header {
    height: 20px;
    background-color: rgba(1, 103, 241, 0.17);
    padding: 3px 8px;
    color: cornflowerblue;
  }

  .mail_box > .header > .header_title {
    font-size: 14px;
    margin-left: 10px;
  }

  .mail_box > .header > .close {
    float: right;
    cursor: pointer;
  }

  .mail_box > .content {
    padding: 15px;
  }

  .content .icon-add {
    display: inline;
  }

  .mail_box > .content > div {
    margin: 5px;
  }

  .mail_box > .content > .mail_title > span,
  .mail_box > .content > .mail_contact > span:first-child,
  .mail_box > .content > .mail_words > span,
  .mail_box > .content > .checked_files > span:first-child {
    color: cornflowerblue;
    display: inline-block;
    padding: 10px;
    width: 70px;
  }
  .mail_box span.icon-add{
    color: cornflowerblue;
    padding: 10px;

  }
  .content button {
    padding: 5px 20px;
    outline: none;
    border-radius: 5px;
    border: 1px solid cornflowerblue;
    background-color: cornflowerblue;
    color: white;
    cursor: pointer;
    margin-left: 450px;
  }

  .checked_files > span {
    vertical-align: top;
  }

  .checked_files > span#no_mail_files {
    color: gray;
  }

  .mail_box > .content input {
    outline: none;
    width: 400px;
    border: 1px solid #a9a9a9;
    border-radius: 5px;
    padding: 5px;
  }

  .mail_box > .content .checked_item {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    vertical-align: top;
  }

  .mail_box > .content .checked_item > svg {
    font-size: 45px;
  }

  .mail_box > .content .checked_item > p {
    font-size: 14px;
  }

  /*发送邮件结束*/
  /*目录树*/
  .catalog_tree {
    position: fixed;
    z-index: 999;
    width: 300px;
    overflow: auto;
    background-color: white;
    left: 44%;
    top: 20%;
    border-radius: 5px;
    border: 1px solid rgba(112, 112, 112, 0.63);
  }

  .catalog_tree > .tree_title {
    height: 15px;
    font-size: 13px;
    padding: 5px;
    background-color: rgba(95, 144, 228, 0.75);
  }

  .catalog_tree > .tree_content {
    padding: 10px;
  }

  .catalog_tree > .tree_content > .new_folder_in_up {
    text-align: center;
  }

  .catalog_tree > .tree_content > .new_folder_in_up > input {
    outline: none;
    border: 1px solid lightgray;
    padding: 5px;
    font-size: 13px;
    border-radius: 5px;
  }

  .el-tree {
    height: 280px;
    overflow: auto;
  }

  /*新建和上传文件框，以下通用*/
  .up_file_box, .new_task_box, .new_folder_box {
    width: 500px;
    height: auto !important;
    position: fixed !important;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -180px;
    box-shadow: 0 0 5px 1px #a4a2a2 !important;
    border-radius: 5px;
    background-color: #fff;
    z-index: 999;
    color: gray;
  }

  .box_content {
    padding: 20px 15px;
  }

  .new_task_box p, .new_task_box .block,
  .up_file_box p, .up_file_box .importance_file,
  .new_folder_box p,
  .new_folder_box .importance_folder {
    margin: 0px 10px 10px 5px;
  }

  .buttons {
    text-align: center;
  }

  .buttons > button {
    height: 30px;
    line-height: 30px;
    padding: 0px 25px;
    font-size: 14px;
    cursor: pointer;
    margin: 10px 25px;
    border-radius: 5px;
  }

  button.yes {
    background-color: #248dc7;
    border: 1px solid #248dc7;
    color: white;
  }

  button.cancel {
    background-color: white;
    color: #248dc7;
    border: 1px solid #248dc7;
  }

  .location_file, .choose_file, .tag_file,
  .time, .tip_time, .tag_new_task,
  .name_folder, .time_folder, .importance_title {
    display: inline-block;
    width: 70px;
    margin: 5px;
  }

  .up_file_box .location_file_input,
  .up_file_box .tag_file_input,
  .up_file_box .choose_file_input,
  .new_folder_box .name_folder_input,
  .new_folder_box .location_file_input {
    width: 325px;
    height: 25px;
    border-radius: 5px;
    outline: none;
    border: 1px solid rgba(112, 112, 112, 0.73);
    padding: 5px;
    display: inline-block;
    color: rgba(43, 43, 43, 0.86);
    font-size: 14px;
    line-height: 25px;
  }

  /*以下上传文件*/
  .choose_file_input {
    position: relative;
  }

  .choose_file_input > input {
    position: absolute;
    width: 100%;
    left: 0;
    opacity: 0;
  }

  /*以下新建任务*/
  .new_task_box textarea {
    margin-left: 45px;
    border-radius: 5px;
    vertical-align: top;
    resize: none;
    width: 315px;
    height: auto !important;
    padding: 5px;
    outline: none;
    border: 1px solid rgba(112, 112, 112, 0.73);
    color: #6a6a6a;
  }

  .new_task_box textarea:hover {
    border: 1px solid rgba(138, 138, 138, 0.62)
  }

  .new_task_box textarea:focus {
    border: 1px solid rgb(64, 158, 255)

  }

  .box_title {
    text-align: center;
    padding: 10px;
  }

  /*以下新建文件夹*/
  .importance_folder > input,
  .importance_file > input {
    opacity: 0;
  }

  .importance_folder > label,
  .importance_file > label {
    position: relative;
    margin-right: 20px;
  }

  .importance_folder > input + label:before,
  .importance_file > input + label:before {
    content: '';
    width: 18px;
    height: 18px;
    border-radius: 50px;
    cursor: pointer;
    display: inline-block;
    position: absolute;
    top: 2px;
    left: -20px;
  }


  .importance_folder > .importance1 + label:before,
  .importance_file > .importance1 + label:before {
    background-color: #bfbfbf;
  }

  .importance_folder > .importance2 + label:before,
  .importance_file > .importance2 + label:before {
    background-color: #1296db;
  }

  .importance_folder > .importance3 + label:before,
  .importance_file > .importance3 + label:before {
    background-color: #f4ea2a;
  }

  .importance_folder > .importance4 + label:before,
  .importance_file > .importance4 + label:before {
    background-color: #db0000;
  }

  input[type='radio']:checked + label:before {
    background-image: url('../assets/img/checked.png');
    background-position: center center;
  }

  /*audios_play*/
  .audios_play {
    position: fixed;
    z-index: 99;
    width: 350px;
    background: white;
    /*border:1px solid rgba(211, 211, 211, 0.65);*/
    left: 200px;
    top: 15px;
    height: auto !important;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 1px 2px 9px 0px #949292fa;;
  }

  .audios_play > .header {
    background: rgba(1, 103, 241, 0.17);
    padding: 3px 8px;
    color: cornflowerblue;
  }

  .audios_play > .header .icon-audios {
    font-size: 14px;
  }

  .audios_play > .header .close {
    float: right;
    cursor: pointer;
  }

  .audios_play > .body {
    padding: 10px;
  }

  .audios_play > .body div:first-child {
    text-align: center;
  }

  .audios_play > .body .play {
    text-align: center;
  }

  .audios_play > .body audio {
    width: 260px;
  }

  .audios_play .line {
    background-color: rgba(211, 211, 211, 0.65);
    height: 1px;
    margin: 10px 0px;
  }

  .audios_play > .body > .info > p > span:first-child,
  .audios_play > .body > .info > div > span:first-child {
    display: inline-block;
    width: 56px;
    margin: 5px 35px;
    color: cornflowerblue;
    font-size: 14px;
  }

  .audios_play .tag_audio,
  .audios_play .remark_audio {
    font-size: 0;
  }

  .audios_play .remark_audio span,
  .audios_play .tag_audio span {
    font-size: 14px;
  }

  .audios_play .tag_audio .tag,
  .audios_play .remark_audio .remark {
    font-size: 11px;
  }

  .audios_play .input_outer {
    position: relative;
    display: inline-block;
  }

  .audios_play .tag_input,
  .audios_play .remark_input {
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 17px 2px 4px;
    font-size: 12px;
  }

  .have_content {
    margin-left: 126px;
  }

  .audios_play .ok_tag_input,
  .audios_play .ok_remark_input {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }

  /*audios_play*/
</style>
