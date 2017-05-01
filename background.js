//objRegex=/o:\d+:"[a-z0-9\-_\\\/]+":\d+:{.*?}(.*?)$/i
objRegex=/o:\d+:"(.*?)":\d+:{.*?}(.*?)$/i
arrRegex=/a:\d+:{.*?}(.*?)$/i
pathRegex=/\/(.*?)(\.txt|\.php|\.asp|\.jpg|\.png|\.jpeg)/
base64Regex=/^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)$/

infoList=null
storage=chrome.storage.local

function updateCounter(){
  chrome.browserAction.setBadgeText({text: Object.keys(infoList).length.toString()});
}

//extract and TEST the params from a GET request
function splitGET(url){
  paramStr=url, k=paramStr.indexOf('?')
  k++
  while((j=paramStr.indexOf('='))!=-1){
    name=paramStr.substring(k,j)
    i=paramStr.indexOf('&')
    if(i==-1) {
      test(url,"GET",name,paramStr.substring(j+1))
      break
    }
    else {
      test(url,"GET",name,paramStr.substring(j+1,i))
    }
    paramStr=paramStr.substring(i+1)
    k=i+1
  }
}

function test(url, _method, _name, val){
  _base64=false, original=''
  val=decodeURIComponent(val)
  if(base64Regex.test(val)){
    original=val
    val=atob(val)
    _base64=true
  }
  if(objRegex.test(val) || arrRegex.test(val)){
    infoList[url]={method:_method, name:_name, value:val, vuln:'PHPObjInj', base64:_base64, base64String:original}
    storage.set({info:infoList})
    updateCounter()
  }
  /*if(pathRegex.test(val)){
    infoList[url]={method:method_,value:val,vuln:'path'}
    storage.set({info:infoList})
    updateCounter()
  }*/
}

function analyzeRequest(requestDetails) {
  url=requestDetails.url
  if(requestDetails.method=="GET"){
    splitGET(url)
  }
  else if(requestDetails.method=="POST"){
    if(requestDetails.requestBody.error)
      console.log("ERROR")
    else if(requestDetails.requestBody.formData!==null){
      data=requestDetails.requestBody.formData
      for(key in data){
        for(i=0;i<data[key].length;i++){
          var value=data[key][i]
          test(url,requestDetails.method,key,value)
        }
      }
    }
  }
  //console.log("Loading: " + requestDetails.url)
}

function analyzeCookie(changeInfo){
  val=changeInfo.cookie.value
  test(changeInfo.cookie.domain, 'COOKIE', changeInfo.cookie.name, val)
}

function messageHandler(msg, sender, sendResponse ){
  if(msg==null || msg==undefined)
    return false;
  if(msg.msg=='get'){
    sendResponse({msg: infoList})
  }
  else if(msg.msg=='clean'){
    infoList={}
    storage.set({info:infoList})
    chrome.browserAction.setBadgeText({text: ""});
  }
  return true;
}

function init(res){
  if(res.info!==undefined){
    infoList=res.info
  }
  else{
    infoList={}
    storage.set({info:infoList})
  }
  chrome.browserAction.setBadgeBackgroundColor({color: "#00cc00"});
  n=Object.keys(infoList).length
  if(n>0)
    chrome.browserAction.setBadgeText({text: n.toString()});
}

storage.get(null,init)
chrome.webRequest.onBeforeRequest.addListener(
  analyzeRequest,
  {urls: ["<all_urls>"]},
  ["requestBody"]
)
chrome.cookies.onChanged.addListener(analyzeCookie)
chrome.runtime.onMessage.addListener(messageHandler)
