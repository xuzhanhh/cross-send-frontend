import openSocket from 'socket.io-client'
let socket = null
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function subscribeSend(uuid) {
  socket =await openSocket(`http://localhost:80/${uuid}`);
  // socket =await openSocket(`http://192.168.43.32:4000/${uuid}`);
  // socket.emit('clientInfo', navigator.userAgent)
  console.log('socket', socket)
  // await sleep(2000)
  socket.on('fileInfo', (fileInfo) => {
    console.log('fileInfo')
    // if (document.getElementById('download')) {
    //   document.getElementById('download').download = `${fileInfo.fileName}.${fileInfo.fileType ? fileInfo.fileType : ''}`
    // }
    // if (downloadInfo) {
    //   downloadInfo.innerHTML = `向您发送了：${fileInfo.fileName ? fileInfo.fileName : ''}.${fileInfo.fileType ? fileInfo.fileType : ''}   `
    // }
  })

  socket.on('binary', (data) => {
    console.log('[default] [binary]', data)
    // var blob = new Blob([data]);
    // var objectUrl = URL.createObjectURL(blob);
    // if (document.getElementById('download')) {
    // document.getElementById('download').href = objectUrl
    // document.getElementById('download').innerHTML = '现在可以下载了'
    // }
  });

}
function getFileInfo( fileName, fileType){
  socket.emit('getFileInfo', {
    fileName,
    fileType,
  })
}
export { subscribeSend, getFileInfo, socket }