var param = window.location.search;
var id = (function(){
	if(param!=undefined){
		id = param.substring(4, param.length);
		if(id==undefined || id.trim()==""){
			id = "index";
		}
		return id;
	}else{
		return "index";
	}
})();

var i = 0;

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
			var paper = '{"mode":5,"conditionType":'+ conditionType + '}';
			Server.socket.send(paper);
		}
		location.href = href;
	} else {
		mediaBox.setAttribute("style", "display: none !important;")
	}
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
		localStorage.fakeName = contactName;
		document.getElementById("name").innerHTML=localStorage.fakeName;
		return;
	}

	var paper = '{"mode":1,"paper":{"title":"' + title + '","content":"'
			+ content + '","contactName":"' + contactName + '","contactTel":"'
			+ contactTel + '","tag":"' + tag + '","imgUrl":"' + imgUrl
			+ '","linkUrl":"' + linkUrl + '"}}';
	Server.socket.send(paper);

	document.getElementById("title").value = "";
	document.getElementById("content").value = "";
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
function doLike(id,linkUrl,imgUrl) {
	var title = document.getElementById("t_"+id).innerHTML;
	var content = document.getElementById("c_"+id).innerHTML;

	if (localStorage == undefined || localStorage == "") {
		return;
	}
	/*if (localStorage.paperIds) {
		var ids = localStorage.paperIds.split(",");
		for (i in ids) {
			if (id == ids[i]) {
				alert("已投票");
				return;
			}
		}
		ids.push(paper.id);
		localStorage.paperIds = ids;
	} else {
		var ids = new Array();
		ids.push(paper.id);
		localStorage.paperIds = ids;
	}*/

	var likeCount = document.getElementById("u" + id + "").innerHTML;
	document.getElementById("u" + id + "").innerHTML = 1 + parseInt(likeCount);
	// var paper = '{"mode":2,"paperTrend":{"id":"' + id
	// 		+ '","type":"1","ip":""}}';
	var paperTrend = '{"mode":2,"paperTrend":{"id":"' + id+ '","type": 1 ,"title":"' + title + '","content":"'+ content + '","imgUrl":"' + imgUrl
			+ '","linkUrl":"' + linkUrl + '"}}';
	Server.socket.send(paperTrend);
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
	var paperTrend = '{"mode":2,"paperTrend":{"id":"' + id+ '","type": 0 ,"title":"' + title + '","content":"'+ content + '","imgUrl":"' + imgUrl
			+ '","linkUrl":"' + linkUrl + '"}}';
	Server.socket.send(paper);
}

function demo(mediaBox, pa) {
	var media = document.createElement("div");
	media.setAttribute("class", "bs-callout bs-callout-info");
	media.setAttribute("style", "border-left-color: #1ABC9C;");

	var mediaDiv = document.createElement("div");
	mediaDiv.setAttribute("class", "row");
	mediaDiv.setAttribute("id", pa.id);

	var pic = "http://"+host+"/img/bbcow.png";
	if (pa.imgUrl != undefined && pa.imgUrl.trim() != "") {
		var imgDiv = document.createElement("div");
		imgDiv.setAttribute("class", "col-md-1 col-xs-12 text-center");
		var img = document.createElement("img");
		img.setAttribute("class", "col-md-12 col-xs-12 thumbnail");
		img.setAttribute("style", "height:64px; width: 100%; display: block;");
		img.setAttribute("src", pa.imgUrl);
		imgDiv.appendChild(img);

		mediaDiv.appendChild(imgDiv);
		pic = pa.imgUrl;
	}
	var button = document.createElement("div"); 
	button.setAttribute("class", "btn-group");
	
	var upLink = document.createElement("a"); 
	upLink.setAttribute("href", "javascript:void(0);");
	upLink.setAttribute("class", "btn btn-xs btn-success");
	upLink.setAttribute("onclick", "doLike(" + pa.id + ",'" + pa.linkUrl + "','" + pa.imgUrl + "')");
	var upI = document.createElement("i"); 
	upI.setAttribute("id", "u" + pa.id);
	upI.setAttribute("class", "fui-triangle-up");
	upI.appendChild(document.createTextNode(pa.goodCount));
	upLink.appendChild(upI);
	button.appendChild(upLink);
	
	var downLink = document.createElement("a"); 
	downLink.setAttribute("href", "javascript:void(0);");
	downLink.setAttribute("class", "btn btn-xs btn-warning ");
	downLink.setAttribute("onclick", "doNotLike(" + pa.id + ")");
	var downI = document.createElement("i"); 
	downI.setAttribute("id", "d" + pa.id);
	downI.setAttribute("class", "fui-triangle-down");
	downI.appendChild(document.createTextNode(pa.badCount));
	downLink.appendChild(downI);
	button.appendChild(downLink);
	
	var shareLink = document.createElement("a"); 
	var url = "http://"+host;
	if(pa.linkUrl != undefined && pa.linkUrl.trim() != ""){
		url = url+"/middle.html?url="+pa.linkUrl;
	}
	
	shareLink.setAttribute("href", "http://service.weibo.com/share/share.php?url="+encodeURIComponent(url)+"&type=button&language=zh_cn&appkey=4284001649&title="+pa.content+"&pic="+encodeURIComponent(pic)+"&searchPic=true&style=simple");
	shareLink.setAttribute("class", "btn btn-xs btn-danger ");
	shareLink.setAttribute("target", "_blank");
	var shareI = document.createElement("i"); 
	shareI.setAttribute("id", "s" + pa.id);
	shareI.setAttribute("class", "fui-heart");
	shareLink.appendChild(shareI);
	button.appendChild(shareLink);
	
	var conntentDiv = document.createElement("div");
	conntentDiv.setAttribute("class", "col-md-11 col-xs-12");
	var p = document.createElement("p");
	p.setAttribute("style", "text-overflow:ellipsis;white-space:nowrap;overflow:hidden");
	p.setAttribute("id", "c_"+pa.id);
	p.appendChild(document.createTextNode(pa.content));
	
	var footer = document.createElement("small");
	var strong = document.createElement("strong");
	strong.appendChild(document.createTextNode(pa.contactName))
	footer.appendChild(strong);
	footer.appendChild(document.createTextNode(" 发表于 "));
	var link = document.createElement("a");
	link.setAttribute("href", url);
	// link.setAttribute("target", "_blank");
	var cite = document.createElement("cite");
	cite.setAttribute("title", url);
	cite.setAttribute("id", "t_"+pa.id);
	cite.appendChild(document.createTextNode(pa.title+"  "));
	link.appendChild(cite);
	footer.appendChild(link);
	//footer.appendChild(document.createTextNode(" ("+pa.id+") "));
	footer.appendChild(button);
	conntentDiv.appendChild(p);
	conntentDiv.appendChild(footer);
	mediaDiv.appendChild(conntentDiv);

	media.appendChild(mediaDiv);

	mediaBox.appendChild(media);
}

Server.connect("ws://"+host+":8001/open/"+id+"");
Server.socket.onmessage = function(message) {
	var data = eval('(' + message.data + ')');
	var type = data["type"];
	if (type == 0) {
		alert(data["message"]);

	}else if (type == 6) {
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
		
		
	} else if (type == 8) {


	} else if (type == 1 || type == 4 || type == 5) {
		
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

		if (type == 1) {
			pa.packIndex();
		} else if (type == 4) {
			pa.packYesterday();
		} else if (type == 5) {
			pa.packTop100();
		} else {
			pa.packIndex();
		}
		i++;
	}

};

if (localStorage.fakeName != undefined) {
	document.getElementById("name").innerHTML=localStorage.fakeName;
	document.getElementById("contactName").value=localStorage.fakeName;
}