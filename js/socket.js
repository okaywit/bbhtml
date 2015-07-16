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

    };
    Server.socket.onerror=function(e){

    };
});

var host = window.location.host;


