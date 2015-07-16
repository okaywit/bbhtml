/**
 * Created by Administrator on 2015/6/18.
 */

function showMsg(message){
    var d = document.getElementById("demo");
    if(d!=null){
        console.log('----------');
        d.innerHTML=message.data;
    }
}

