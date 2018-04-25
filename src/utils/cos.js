import { get } from './fetch'

var Bucket = 'cross-send-1253259547';
var Region = 'ap-guangzhou';
var protocol = process.env.NODE_ENV === 'dev'? 'http:' : 'https:';
var url = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/';

async function getAuth() {
  var url = '/sts-auth' +
    // var url = '../server/sts-auth.js' +
        '?method=post' +
        '&pathname=' + encodeURIComponent('/');
    return await get(url)
}

export { getAuth, url}