/**
 * Created by Administrator on 2015/6/18.
 */
var Server = {};
Server.socket = null;

Server.connect = (function(host){

    Server.socket = new WebSocket(host);
    Server.socket.onopen=function(){
    	
    };
    Server.socket.onmessage=function(message){
        //showMsg(message);
    };
    Server.socket.onclose=function(){
         showError("服务器断开，请刷新页面");
    };
    Server.socket.onerror=function(e){
        showError("出现异常，请刷新页面");
    };
});

var host = window.location.host;

function showError(error){
    location.href='/error.html';
}

