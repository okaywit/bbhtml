var i = 0;

function Paper() {
	this.id;
	this.title;
	this.content;
	this.contactName;
	this.contactTel;
	this.tag;
	this.imgUrl
	this.goodCount;
	this.badCount;
	this.linkUrl;
}

function demoHost(data){
	var hostBox = document.getElementById("media_host_box");
	// <li>
	//     <a href="button" class="btn btn-primary btn-sm col-md-12">Default<span class="navbar-new">10000</span></a>
	// </li>
	var li = document.createElement("li");
	var a = document.createElement("a");
	a.setAttribute("href","/host.html?id="+data["path"]+"");
	// a.setAttribute("target","_blank");
	a.setAttribute("class","btn btn-primary btn-sm col-md-12");

	if(data["status"]==0){
		a.setAttribute("disabled", "disabled");
		a.appendChild(document.createTextNode(data["name"]+"(未启用)"));
	}else{
		a.appendChild(document.createTextNode(data["name"]));
	}

	var span = document.createElement("span");
	span.setAttribute("class","navbar-new");
	span.appendChild(document.createTextNode(data["clickCount"]));
	
	a.appendChild(span);
	li.appendChild(a);
	hostBox.appendChild(li);
}
function demoLog(name,message){
	var media = document.getElementById("media_log");
	var count = document.getElementById("log_count");
	media.innerHTML = media.innerHTML + "<div  style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'><cite title='"+message+"'>"+ name+" ："+message+"</cite></div>";
	count.innerHTML = parseInt(count.innerHTML) + 1;
}
function demoIndex(data){
	var pa = new Paper();
	pa.id = data["data"]["_id"]["$numberLong"];
	if (pa.id == undefined || pa.id == Object) {
		pa.id = data["data"]["_id"];
	}
	pa.title = data["data"]["title"];
	pa.content = data["data"]["content"];
	pa.goodCount = data["data"]["total"];
	if (pa.goodCount === undefined) {
		pa.goodCount = data["data"]["goodCount"]["$numberLong"];
	}

	
	pa.imgUrl = data["data"]["imgUrl"];
	if(pa.imgUrl=="" || pa.imgUrl==null){
		pa.imgUrl = "img/bbcow.png";
	}
	pa.linkUrl = data["data"]["linkUrl"];
	// if(pa.linkUrl=="" || pa.linkUrl==null){
	// 	pa.linkUrl = "#";
	// }

	var media = document.getElementById("media_ol");
	var mediaLi = document.createElement("li");
	mediaLi.setAttribute("class","list-group-item");

	var s = document.createElement("span");
	s.setAttribute("class","navbar-new");
	s.appendChild(document.createTextNode(pa.goodCount));
	mediaLi.appendChild(s);

	var mediaDd = document.createElement("dd");
	var mediadiv = document.createElement("div");
	mediadiv.setAttribute("class","media");
	var medialeft = document.createElement("div");
	medialeft.setAttribute("class","media-left");
	var img = document.createElement("img");
	img.setAttribute("src",pa.imgUrl);
	img.setAttribute("width","64px");
	img.setAttribute("height","64px");
	medialeft.appendChild(img);
	mediadiv.appendChild(medialeft);
	var mediaright = document.createElement("div");
	mediaright.setAttribute("class","media-body");

	var link = document.createElement("a");
	link.setAttribute("href","/middle.html?url="+pa.linkUrl);
	link.setAttribute("class","text-info");
	var content = document.createElement("p");
	content.setAttribute("class","media-heading");
	content.appendChild(document.createTextNode(pa.content));
	link.appendChild(content);

	var hosta = document.createElement("a");
	hosta.setAttribute("class","text-muted");
	hosta.appendChild(document.createTextNode("《"+pa.title+"》"));
	hosta.appendChild(document.createTextNode("  分享自："));
	var hostcite = document.createElement("cite");
	if(data["data"]["path"]=="" || data["data"]["path"] == null){
		hosta.setAttribute("href","/host.html?id=bb");
		hostcite.appendChild(document.createTextNode("八牛号外"));
	}else{
		hosta.setAttribute("href","/host.html?id="+data["data"]["path"]);
		hostcite.appendChild(document.createTextNode(data["data"]["hostName"]));
	}
	
	hosta.appendChild(hostcite);
	if(pa.linkUrl==undefined || pa.linkUrl==null || pa.linkUrl ==""){
		mediaright.appendChild(content);
	}else{
		mediaright.appendChild(link);
	}
	
	mediaright.appendChild(hosta);
	mediadiv.appendChild(mediaright);
	mediaDd.appendChild(mediadiv);

	mediaLi.appendChild(mediaDd);
	media.appendChild(mediaLi);

}


Server.connect("ws://"+host+":8001/index");
Server.socket.onmessage = function(message) {
	var data = eval('(' + message.data + ')');
	if (data["type"] == 0) {
		 showError(data["message"]);
	} else if (data["type"] == 1 ) {
		demoIndex(data);
		i++;
	}  else if (data["type"] == 2) {
		demoLog(data["data"]["fakeName"],data["data"]["msg"]);
	} else if (data["type"] == 3) {
		demoLog(data["data"]["paper"]["contactName"],data["data"]["paper"]["title"]);
	} else if (data["type"] == 7) {
		demoHost(data["data"]);
	}

};