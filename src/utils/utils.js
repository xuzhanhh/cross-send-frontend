function timestampToTime(timestamp) {
  let date = new Date(new Number(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return Y+M+D+h+m+s;
}
function fileSize(fileSize){
  // console.log(fileSize)
  let myFileSize = fileSize
  let suffix = ['B', 'KB', 'MB', 'GB'], i = 0
  for (i = 0; (myFileSize / 1024) > 1; i++) {
    myFileSize /= 1024
  }
  console.log(myFileSize)
  return myFileSize && Number(myFileSize).toFixed(1) + suffix[i]
}

export { timestampToTime, fileSize }