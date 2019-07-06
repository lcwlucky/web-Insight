//定义公共方法
import axios from "axios"
export const toggleTip = (obj, msg) =>{
  obj.$notify.info({
    title: '',
    message: msg,
    position: 'top-right',
    duration: 3000,
    offset: 80
  })
}

/*收藏或者取消收藏*/
export const toggleCollection =(obj, item)=>{
  let id = item.id
  let collect = item.collection ? 1 : 0
  let formData=new FormData()
  formData.append("id",id)
  formData.append("collect",collect);
  var url = window.baseUrl + "/collect"
  axios.post(url, formData).then( (response) => {
    if (response.data.success) {
      item.collection = !item.collection
      if(item.collection ) {
        toggleTip(obj, '已收藏')
      }else{
        toggleTip(obj, '已取消收藏')
      }
    }
  }).catch(function (error) {
    toggleTip(obj, error)
  })
}

/*关注或者取消关注*/
export const toggleAttention =(obj, item)=>{
  let id = item.id
  let attention = item.attention ? 1 : 0
  let formData=new FormData()
  formData.append("id",id)
  formData.append("attention",attention);
  var url = window.baseUrl + "/attention"
  axios.post(url, formData).then( (response) => {
    if (response.data.success) {
      item.attention = !item.attention
      if(item.attention ) {
        toggleTip(obj, '已关注')
      }else{
        toggleTip(obj, '已取消关注')
      }
    }
  }).catch(function (error) {
    toggleTip(obj, error)
  })
}

export const clickItem =(list, index, nowChecked)=>{
  list[index].itemChecked = !list[index].itemChecked
  if(list[index].itemChecked) {
    nowChecked.push(list[index])
  }else{
    nowChecked.splice(index, 1)
  }
  console.log('list[index].itemChecked:',list[index].itemChecked)
}
export const inputIsEmpty =(obj,msg)=> {
  obj.$alert(msg, '', {
    confirmButtonText: '确定',
    // callback: action => {
    //   obj.$message({
    //     type: 'info',
    //     message: `action: ${action}`
    //   });
    // }
  })
}

/*时间格式转换*/
export const unixChange = (timestamp)=>{
  if(!timestamp) {
    return "未知"
  }
  var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0'+ date.getHours(): date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0'+ date.getMinutes(): date.getMinutes());
  return Y+M+D+h+m;
}

/*文件大小格式转换*/
export const getFileSize = (size)=> {
  if (!size){
    return ""
  }
  var num = 1024.00; //byte
  if (size < num){
    return size + "B"
  }else if (size < Math.pow(num, 2)){
    return (size / num).toFixed(2) + "K"; //kb
  }else if (size < Math.pow(num, 3)){
    return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
  }else if (size < Math.pow(num, 4)){
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  }else {
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
  }
}
export const getNowDay = ()=>{
  var timeStamp = Date.now()
  return unixChange(timeStamp)
}

export const formatTime = (second = 0) =>{
  const h = parseInt(second / 60 / 60).toString().padStart(2,'0')
  const m = parseInt(second / 60 % 60).toString().padStart(2,'0')
  const s = parseInt(second % 60).toString().padStart(2,'0')
  return (h + ' : '+ m + ' : ' + s)
}
export const fetchList = (childUrl)=>{
  // 获取所有列表
  const url = window.baseUrl + childUrl
  axios.defaults.withCredentials=true;
  return axios.get(url).then(response => {
    if (response.status === 200){
      console.log('response:',response)
      return response.data
    }
  })
}
export const uploadOrUpdate = (childUrl, formData)=>{
  const url = window.baseUrl + childUrl
  axios.defaults.withCredentials=true;
  return axios.post(url, formData).then(response => {
    if (response.status === 200){
      return response.data
    }
  })
}
export const addTag = (id, newTag)=>{
  let formData = new FormData()
  formData.append('id', id)
  formData.append('name', newTag)
  const postUrl = window.baseUrl + '/addtag'
  return axios.post(postUrl,formData).then(response=>{
    if (response.status === 200 ){
      return response.data
    }
  })
}
export const delTag = (id ,name)=>{
  let formData = new FormData()
  formData.append('id', id)
  formData.append('name', name)
  const postUrl = window.baseUrl + '/deltag'
  return axios.post(postUrl,formData).then(response=>{
    if (response.status === 200 && response.data.success){
      return response.data
    }
  })
}

export const addRemark = (id, newRemark)=>{
  let formData = new FormData()
  formData.append('id', id)
  formData.append('content', newRemark)
  const postUrl = window.baseUrl + '/addcomment'
  return axios.post(postUrl,formData).then(response=>{
    if (response.status === 200 ){
      return response.data
    }
  })
}
export const delRemark = (cid)=>{
  let formData = new FormData()
  formData.append('cid', cid)
  const postUrl = window.baseUrl + '/delcomment'
  return axios.post(postUrl,formData).then(response=>{
    if (response.status === 200 && response.data.success){
      return response.data
    }
  })
}
