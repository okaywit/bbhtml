Server.connect("ws://"+host+":8001/open/index");//
var i = 0;

if (localStorage.fakeName != undefined && localStorage.fakeName.trim() != "") {
	document.getElementById("contactName").value=localStorage.fakeName;
}

function addMedia(obj) {
	var conditionType = obj.value;
	var href = "";
	var mediaBox = (function() {
		if (conditionType == 4) {
			href= "#media_yesterday_box";
			return document.getElementById("media_yesterday_box")
		}
		if (conditionType == 5) {
			href= "#media_top100_box";
			return document.getElementById("media_top100_box")
		}
		return null;
	})();

	if (obj.checked) {
		mediaBox.setAttribute("style", "border-left-color: #F1C40F;display: block !important;");
		if (mediaBox.childNodes.length <= 1) {
			var paper = '{"cId":5,"sId":"","data":{"type":"' + conditionType
					+ '"}}';
			Server.socket.send(paper);
		}
		location.href = href;
	} else {
		mediaBox.setAttribute("style", "display: none !important;")
	}
}

Server.socket.onmessage = function(message) {
	var data = eval('(' + message.data + ')');
	if (data["type"] == 0) {
		 showError(data["error"]);

	}else if (data["type"] == 6) {
		var dailyMain = document.getElementById("dailyMain");
		var a = document.createElement("a")
		a.setAttribute("href", data["data"]["linkUrl"]);
		var strong = document.createElement("strong");
		strong.appendChild(document.createTextNode(data["data"]["title"]));
		var br = document.createElement("br");
		var img =  document.createElement("img");
		img.setAttribute("src", data["data"]["imgUrl"]);
		
		a.appendChild(strong);
		a.appendChild(br);
		a.appendChild(img);
		dailyMain.appendChild(a);
		
		
	} else if (data["type"] == 7) {
		demoHost(data["data"]);
	} else if (data["type"] == 1 || data["type"] == 4 || data["type"] == 5) {
		var pa = new Paper();
		pa.id = data["data"]["id"]["$numberLong"];
		if (pa.id == undefined || pa.id == Object) {
			pa.id = data["data"]["id"];
		}
		pa.title = data["data"]["title"];
		pa.content = data["data"]["content"];
		pa.contactName = data["data"]["contactName"];
		pa.contactTel = data["data"]["contactTel"];
		pa.tag = data["data"]["tag"];
		pa.goodCount = data["data"]["goodCount"]["$numberLong"];
		if (pa.goodCount === undefined) {
			pa.goodCount = 0;
		}
		pa.badCount = data["data"]["badCount"]["$numberLong"];
		if (pa.badCount === undefined) {
			pa.badCount = 0;
		}
		pa.imgUrl = data["data"]["imgUrl"];
		pa.linkUrl = data["data"]["linkUrl"];
		
		if (data["type"] == 1) {
			pa.packIndex();
		} else if (data["type"] == 4) {
			pa.packYesterday();
		} else if (data["type"] == 5) {
			pa.packTop100();
		} else {
			pa.packIndex();
		}
		i++;
	}

};
function demoHost(data){
	var hostBox = document.getElementById("media_host_box")
	var hostButton = document.createElement("button");
	hostButton.setAttribute("class", "btn btn-primary btn-block");
	hostButton.setAttribute("onclick", "location.href='/host.html?id="+data["path"]+"'");
	if(data["type"]!=0){
		hostButton.setAttribute("disabled", "disabled");
		hostButton.appendChild(document.createTextNode(data["name"]+"(未启用)"))
	}else{
		hostButton.appendChild(document.createTextNode(data["name"]))
	}
	
	hostBox.appendChild(hostButton);
}
function goRelease() {
	var title = document.getElementById("title").value;
	var content = document.getElementById("content").value;
	var contactName = document.getElementById("contactName").value;
	var linkUrl = document.getElementById("linkUrl").value;
	var contactTel = "";
	var tag = "";
	var imgUrl = document.getElementById("imgUrl").value;
	if (title.replace(/^ +| +$/g, '') == '') {
		document.getElementById("title").focus();
		return;
	}
	if (content.replace(/^ +| +$/g, '') == '') {
		document.getElementById("content").focus();
		return;
	}
	if (contactName.replace(/^ +| +$/g, '') == '') {
		document.getElementById("contactName").focus();
		return;
	}

	var paper = '{"cId":1,"sId":"","data":{"title":"' + title + '","content":"'
			+ content + '","contactName":"' + contactName + '","contactTel":"'
			+ contactTel + '","tag":"' + tag + '","imgUrl":"' + imgUrl
			+ '","linkUrl":"' + linkUrl + '"}}';
	Server.socket.send(paper);

	localStorage.fakeName = contactName;

	document.getElementById("title").value = "";
	document.getElementById("content").value = "";
	document.getElementById("contactName").value = "";
	document.getElementById("imgUrl").value = "";

	$('#myModal').modal('hide')

	return false;
}

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
Paper.prototype.packIndex = function() {
	var mediaBox = document.getElementById("media_box");

	demo(mediaBox, this);

};
Paper.prototype.packYesterday = function() {
	var mediaBox = document.getElementById("media_yesterday_box");

	demo(mediaBox, this);

};
Paper.prototype.packTop100 = function() {
	var mediaBox = document.getElementById("media_top100_box");

	demo(mediaBox, this);

};
function doLike(id) {
	if (localStorage == undefined || localStorage == "") {
		return;
	}
	if (localStorage.paperIds) {
		var ids = localStorage.paperIds.split(",");
		for (i in ids) {
			if (id == ids[i]) {
				alert("已投票");
				return;
			}
		}
		ids.push(id);
		localStorage.paperIds = ids;
	} else {
		var ids = new Array();
		ids.push(id);
		localStorage.paperIds = ids;
	}

	var likeCount = document.getElementById("u" + id + "").innerHTML;
	document.getElementById("u" + id + "").innerHTML = 1 + parseInt(likeCount);
	var paper = '{"cId":2,"sId":"","data":{"id":"' + id
			+ '","type":"1","ip":""}}';
	Server.socket.send(paper);
}
function doNotLike(id) {
	if (localStorage == undefined || localStorage == "") {
		return;
	}
	if (localStorage.paperIds) {
		var ids = localStorage.paperIds.split(",");
		for (i in ids) {
			if (id == ids[i]) {
				alert("已投票");
				return;
			}
		}
		ids.push(id);
		localStorage.paperIds = ids;
	} else {
		var ids = new Array();
		ids.push(id);
		localStorage.paperIds = ids;
	}

	var unlikeCount = document.getElementById("d" + id + "").innerHTML;
	document.getElementById("d" + id + "").innerHTML = 1 + parseInt(unlikeCount);
	var paper = '{"cId":2,"sId":"","data":{"id":"' + id
			+ '","type":"0","ip":""}}';
	Server.socket.send(paper);
}

function demo(mediaBox, pa) {
	var media = document.createElement("div");
	media.setAttribute("class", "bs-callout bs-callout-info");
	media.setAttribute("style", "border-left-color: #1ABC9C;");

	var mediaDiv = document.createElement("div");
	mediaDiv.setAttribute("class", "row");
	mediaDiv.setAttribute("id", pa.id);

	if (this.imgUrl != undefined && pa.imgUrl.trim() != "") {
		var imgDiv = document.createElement("div");
		imgDiv.setAttribute("class", "col-md-1 col-xs-12 text-center");
		var img = document.createElement("img");
		img.setAttribute("class", "col-md-12 col-xs-12 thumbnail");
		img.setAttribute("style", "height:64px; width: 100%; display: block;");
		img.setAttribute("src", pa.imgUrl);
		imgDiv.appendChild(img);

		mediaDiv.appendChild(imgDiv);
	}
	var button = document.createElement("div"); 
	button.setAttribute("class", "btn-group");
	
	var upLink = document.createElement("a"); 
	upLink.setAttribute("href", "javascript:void(0);");
	upLink.setAttribute("class", "btn btn-xs btn-success");
	upLink.setAttribute("onclick", "doLike(" + pa.id + ")");
	var upI = document.createElement("i"); 
	upI.setAttribute("id", "u" + pa.id);
	upI.setAttribute("class", "fui-triangle-up");
	upI.appendChild(document.createTextNode(pa.goodCount));
	upLink.appendChild(upI);
	button.appendChild(upLink);
	
	var downLink = document.createElement("a"); 
	downLink.setAttribute("href", "javascript:void(0);");
	downLink.setAttribute("class", "btn btn-xs btn-warning ");
	downLink.setAttribute("onclick", "doLike(" + pa.id + ")");
	var downI = document.createElement("i"); 
	downI.setAttribute("id", "d" + pa.id);
	downI.setAttribute("class", "fui-triangle-down");
	downI.appendChild(document.createTextNode(pa.badCount));
	downLink.appendChild(downI);
	button.appendChild(downLink);
	
	var shareLink = document.createElement("a"); 
	shareLink.setAttribute("href", "http://service.weibo.com/share/share.php?url=http%3A%2F%2F"+host+"%2F&type=button&language=zh_cn&appkey=4284001649&title="+pa.content+"&pic=http%3A%2F%2F"+host+"%2Fimg%2Fbbcow.png&searchPic=true&style=simple");
	shareLink.setAttribute("class", "btn btn-xs btn-danger ");
	shareLink.setAttribute("target", "_blank");
	var shareI = document.createElement("i"); 
	shareI.setAttribute("id", "s" + pa.id);
	shareI.setAttribute("class", "fui-heart");
	shareLink.appendChild(shareI);
	button.appendChild(shareLink);
	
	
	/*var upLink = document.createElement("a");
	upLink.setAttribute("href", "javascript:void(0);");
	upLink.setAttribute("onclick", "doLike(" + pa.id + ")");
	var upSpan = document.createElement("span");
	upSpan.setAttribute("class","glyphicon glyphicon-thumbs-up badge");
	upSpan.setAttribute("id", "u" + pa.id);
	upSpan.appendChild(document.createTextNode(pa.goodCount));
	upLink.appendChild(upSpan);
	
	var downLink = document.createElement("a");
	downLink.setAttribute("href", "javascript:void(0);");
	downLink.setAttribute("onclick", "doNotLike(" + pa.id + ")");
	var downSpan = document.createElement("span");
	downSpan.setAttribute("class","glyphicon glyphicon-thumbs-down badge");
	downSpan.setAttribute("aria-hidden", "true");
	downSpan.setAttribute("id", "d" + pa.id);
	downSpan.appendChild(document.createTextNode(pa.badCount));
	downLink.appendChild(downSpan);*/
	//imgDiv.appendChild(upLink);
	//imgDiv.appendChild(document.createTextNode("  "));
	//imgDiv.appendChild(downLink);


	var conntentDiv = document.createElement("div");
	conntentDiv.setAttribute("class", "col-md-11 col-xs-12");
	var p = document.createElement("p");
	p.setAttribute("style", "text-overflow:ellipsis;white-space:nowrap;overflow:hidden");
	p.appendChild(document.createTextNode(pa.content));
	
	var footer = document.createElement("small");
	var strong = document.createElement("strong");
	strong.appendChild(document.createTextNode(pa.contactName))
	footer.appendChild(strong);
	footer.appendChild(document.createTextNode(" 发表于 "));
	var link = document.createElement("a");
	link.setAttribute("href", pa.linkUrl);
	link.setAttribute("target", "_blank");
	var cite = document.createElement("cite");
	cite.setAttribute("title", pa.linkUrl);
	cite.appendChild(document.createTextNode(pa.title));
	link.appendChild(cite);
	footer.appendChild(link);
	footer.appendChild(document.createTextNode(" ("+pa.id+") "));
	footer.appendChild(button);
	conntentDiv.appendChild(p);
	conntentDiv.appendChild(footer);
	mediaDiv.appendChild(conntentDiv);

	media.appendChild(mediaDiv);

	mediaBox.appendChild(media);
}
