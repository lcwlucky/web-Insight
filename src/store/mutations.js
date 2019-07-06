// 包含多个直接更新state函数的对象
export default {
  toggleUpFile(state){
    state.isUpFile = !state.isUpFile
  },
  toggleNewTask(state){
    state.isNewTask = !state.isNewTask
  },
  toggleNewFolder(state){
    state.isNewFolder = !state.isNewFolder
  },
  getTasks(state){
    state.tasks = JSON.parse(localStorage.getItem('tasks') || [])
  },
  createNewTask(state,newTask){
    state.tasks = JSON.parse(localStorage.getItem('tasks') || [])
    state.tasks.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
  },
  setNowFile(state,nowFile){
    state.nowFile = nowFile
  },
  audioPlay(state,nowAudio){
    state.isAudioPlay = true
    state.nowAudio = nowAudio
  },
  setIntelFileTime(state,intelFileTime){
    state.intelFileTime = intelFileTime
  },
  openMail(state){
    state.isMail = true
  },
  closeMail(state){
    state.isMail = false
  },
  setCheckedFiles(state,checkedFiles){
    state.checkedFiles = checkedFiles
    console.log(state.checkedFiles,888888)
  },
  setCheckedFilesFull(state){
    state.checkedFiles.forEach(el=>{
      el.itemChecked = false
    })
    state.checkedFiles = []
  }
}
