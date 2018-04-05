function get(url){
  return fetch(url).then(res => { return res.json() }).then(data => { return data })
}
export { get }

