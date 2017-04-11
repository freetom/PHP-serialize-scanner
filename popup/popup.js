var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml(string){
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

function get(msg){
  if(msg!==null && msg.msg!==null){
    for(key in msg.msg){
      document.getElementById('info').innerHTML+=escapeHtml('[ Potential '+msg.msg[key].vuln+' in '+msg.msg[key].method+']: URL = '+key)+'<br />'+escapeHtml(msg.msg[key].value)

      if(msg.msg[key].base64)
        document.getElementById('info').innerHTML+='<br />BASE64 -> '+msg.msg[key].base64String;
      document.getElementById('info').innerHTML+='<hr />'
    }
  }
}

function clean(){
  chrome.runtime.sendMessage({msg:'clean'});
  document.getElementById('info').innerHTML="";
}

function mapEvents(){
  document.getElementById("clean").addEventListener("click",clean);
}

document.addEventListener("DOMContentLoaded",mapEvents);
chrome.runtime.sendMessage({msg:'get'},get);
