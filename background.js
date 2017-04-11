//objRegex=/o:\d+:"[a-z0-9\-_\\\/]+":\d+:{.*?}(.*?)$/i
objRegex=/o:\d+:"(.*?)":\d+:{.*?}(.*?)$/i
arrRegex=/a:\d+:{.*?}(.*?)$/i
pathRegex=/\/(.*?)(\.txt|\.php|\.asp|\.jpg|\.png|\.jpeg)/
infoList=null
storage=chrome.storage.local

function updateCounter(){
  chrome.browserAction.setBadgeText({text: Object.keys(infoList).length.toString()});
}

function test(url, method_, val){
  if(objRegex.test(val) || arrRegex.test(val)){
    infoList[url]={method:method_,value:val,vuln:'PHPObjInj'}
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
  dURI=decodeURIComponent(url)
  if(requestDetails.method=="GET"){
    test(url,requestDetails.method,dURI)
  }
  else if(requestDetails.method=="POST"){
    if(requestDetails.requestBody.error)
      console.log("ERROR")
    else if(requestDetails.requestBody.formData!==null){
      data=requestDetails.requestBody.formData
      for(key in data){
        //console.log(key+" "+data[key])
        for(i=0;i<data[key].length;i++){
          var val=decodeURIComponent(data[key][i])
          //console.log(val)
          test(url,requestDetails.method,val)
        }
      }
    }
  }
  //console.log("Loading: " + requestDetails.url)
}

function analyzeCookie(changeInfo){
  val=changeInfo.cookie.value
  test(changeInfo.cookie.domain,'COOKIE',val)
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
