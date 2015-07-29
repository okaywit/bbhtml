var Server = {};
var isGo = true;
Server.socket = null;
var host = window.location.host;
Server.connect = (function(host){
    Server.socket = new WebSocket(host);
    Server.socket.onopen=function(){   	};
    Server.socket.onmessage=function(message){};
    Server.socket.onclose=function(){ showError();};
    Server.socket.onerror=function(e){showError();};
});
window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;
function onbeforeunload_handler(){
    isGo = false;
}
function onunload_handler(){
    isGo = false;
}
function showError(){
    if(isGo){
        location.href='/error.html';
    }
}