Server.connect("ws://"+host+"/open/62616e697568616f77616902");

if (localStorage.fakeName == undefined) {
	localStorage.fakeName = prompt("请输入一个屌炸天的名称", "");
	if (localStorage.fakeName == null || localStorage.fakeName.trim() == "") {
		localStorage.fakeName = "无名氏";
	}
}

Server.socket.onmessage = function(message) {
	var data = eval('(' + message.data + ')');
	if (data["type"] == 0) {
		alert(data["error"]);
	}
	if (data["type"] == 2) {
		showMsg(data["data"]["msg"], data["data"]["fakeName"]);
	}
	if (data["type"] == 3) {
		showAd(data["data"]["title"],data["data"]["content"], data["data"]["linkUrl"],
				data["data"]["imgUrl"]);
	}
};
function openAd(title, linkUrl) {
	window
			.open(
					linkUrl,
					title,
					'height=400,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
}
function showAd(title,content, linkUrl, imgUrl) {
	var ads = document.getElementsByName("ad_log");
	var div = document.getElementById("ad_box");

	var innerDiv = document.createElement("div");
	innerDiv.setAttribute("class", "col-md-12 col-xs-12 alert");
	innerDiv.setAttribute("role", "alert");
	innerDiv.setAttribute("name", "ad_log");
	var titleArea = document.createElement("strong");

	if (imgUrl != undefined && imgUrl.trim() != "") {
		innerDiv.setAttribute("style", "background:url('" + imgUrl
				+ "') repeat-x");
		innerDiv.setAttribute("onclick", "openAd(\'" + title + "\',\'"
				+ imgUrl + "')");
		titleArea.appendChild(document.createTextNode(title));
	} else {
		innerDiv.setAttribute("class", "alert alert-warning");
		titleArea.appendChild(document.createTextNode(content));
	}

	
	innerDiv.appendChild(titleArea);
	if (linkUrl != undefined && linkUrl.trim() != "") {
		innerDiv.setAttribute("onclick", "openAd(\'" + title + "\',\'"
				+ linkUrl + "')");
	}

	if (ads.length > 1) {
		div.removeChild(ads[0]);
	}

	div.appendChild(innerDiv);
}
function showMsg(msg, fakeName) {
	var div = document.getElementById("chat_log");
	var innerDiv = document.createElement("div");
	innerDiv.setAttribute("class", "row");
	innerDiv.setAttribute("name", "word_log");
	//innerDiv.appendChild(document.createTextNode(fakeName + ": "));
	
	var name = document.createElement("div");
	name.setAttribute("class", "col-md-3 col-xs-3 text-warning");
	name.appendChild(document.createTextNode(fakeName + " ： "));
	
	/*var content = document.createElement("h4");
	content.appendChild(document.createTextNode(fakeName + ": "));*/
	var content = document.createElement("div");
	content.setAttribute("class", "col-md-9 col-xs-9 text-info");
	

	var imgReg = /^\S*.(bmp|jpg|tiff|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw){1}$/;
	var videoReg = /^\S*.(mp4|mpge4|webm|avi){1}$/;
	var audioReg = /^\S*.(mp3|ogg|aac){1}$/;
	var changeName = /^@\S*$/;

	

	innerDiv.appendChild(name);
	if (imgReg.test(msg)) {
		content.appendChild(demoImg(msg));
	} else if (videoReg.test(msg)) {
		content.appendChild(demoVideo(msg));
	} else if (audioReg.test(msg)) {
		content.appendChild(demoAudio(msg));
	} else if (changeName.test(msg)) {
		localStorage.fakeName = msg.substring(1, msg.length);
		return;
	} else {
		var small = document.createElement("p");
		small.appendChild(document.createTextNode(msg));
		content.appendChild(small);
	}
	innerDiv.appendChild(content);

	var w = document.getElementsByName("word_log")[0];
	if (w == undefined) {
		div.appendChild(innerDiv);
	} else {
		div.insertBefore(innerDiv, w);
	}

}
function sendText() {
	var msg = document.getElementById("message").value.trim();
	if (msg == '') {
		return;
	}
	var ad = /^#{2}\S*$/;
	if (ad.test(msg)) {
		var paper = '{"cId":4,"sId":"","data":{"fakeName":"'
				+ localStorage.fakeName + '","paperId":"' + msg + '"}}';
		Server.socket.send(paper);
		return;
	}

	var paper = '{"cId":3,"sId":"","data":{"fakeName":"' + localStorage.fakeName + '","msg":"' + msg + '"}}';
	Server.socket.send(paper);

}
function demoImg(msg) {
	var imgDiv = document.createElement("div");
	var img = document.createElement("img");
	img.setAttribute("src", msg);
	img.setAttribute("class", "media-object");
	img.setAttribute("data-src", "holder.js/100x100");
	img.setAttribute("data-holder-rendered", "true");
	img.setAttribute("style", "width: 100px; height: 100px;");

	var a = document.createElement("a");
	a.setAttribute("href", msg);
	a.setAttribute("target", "_blank");
	a.appendChild(document.createTextNode("点击查看大图"));

	imgDiv.appendChild(img);
	imgDiv.appendChild(a);
	return imgDiv;
}
function demoVideo(msg) {
	var video = document.createElement("video");
	video.setAttribute("src", msg);
	video.setAttribute("controls", "controls");
	video.setAttribute("width", "col-md-6 col-xs-12");
	return video;
}
function demoAudio(msg) {
	var video = document.createElement("audio");
	video.setAttribute("src", msg);
	video.setAttribute("controls", "controls");
	video.setAttribute("width", "col-md-6 col-xs-12");
	return video;
}
function checkCode(e) {
	if (e.keyCode == 13) {
		sendText();
		document.getElementById("message").blur();
		document.getElementById("message").value = "";
	}
}