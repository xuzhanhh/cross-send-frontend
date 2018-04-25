function get(url){
  return fetch(url, {credentials: 'same-origin'}).then(res => { return res.json() }).then(data => { return data })
}
function send(url){
  return fetch(url)
}


// postData('/answer', {answer: 42})
//   .then(data => console.log(data)) // JSON from `response.json()` call
//   .catch(error => console.error(error))

function postData(url, data={}) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, same-origin, *omit
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'same-origin', // *manual, follow, error
    // referrer: 'no-referrer', // *client, no-referrer
    // credentials: ''
  })
  .then(response => response.json()) // parses response to JSON
}


export { get, postData, send }

