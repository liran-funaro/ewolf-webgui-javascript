var NewMail = function(id,applicationFrame,title,
		createRequestObj,handleResponse,
		allowAttachment,to,toReplacment) {
	var obj = this;
	var thisID = "__newmessage__"+id;
	
	var appContainer = new AppContainer(thisID,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(thisID,"/json",0);
		
	new TitleArea(title)
		.appendTo(frame)
		.addFunction("Send", send)
		.addFunction("Cancel",cancel);
	
	var base = $("<table/>").appendTo(frame);
	
	var idRaw = $("<tr/>").appendTo(base);
	$("<td/>").attr("style","text-align:right;").append("To:").appendTo(idRaw);
	
	var userIdText = $("<input/>").attr({
		"type": "text",
		"placeholder": "To...",
		"style": "min-width:300px !important;"
	});
	
	var userIdCell = $("<td/>").append(userIdText).appendTo(idRaw);
	
	var msgRaw = $("<tr/>").appendTo(base);
	$("<td/>").attr("style","vertical-align:text-top;text-align:right;").append("Content:").appendTo(msgRaw);
	
	var messageText = $("<textarea/>").attr({
		"id": "textileMessage",
		"placeholder": "What is on your mind...",
		"style": "min-width:300px !important;height:300px  !important;"
	});
	
	$("<td/>").append(messageText).appendTo(msgRaw);
	
	if(allowAttachment) {
		var attacheRaw = $("<tr/>").appendTo(base);
		$("<td/>").attr("style","vertical-align:text-top;text-align:right;").append("Attachment:").appendTo(attacheRaw);
		
		var uploaderArea = $("<td/>").appendTo(attacheRaw);
		/*var files = */new filedrag(uploaderArea);
	}	

	var btnRaw = $("<tr/>").appendTo(base);
	
	$("<td/>").appendTo(btnRaw);
	var btnBox = $("<td/>").appendTo(btnRaw);
	
	$("<input/>").attr({
		"id": "sendMessageBtn",
		"type": "button",
		"value": "Send"
	}).appendTo(btnBox).click(send);
	
	btnBox.append("&nbsp;");
	
	$("<input/>").attr({
		"id": "sabortBtn",
		"type": "button",
		"value": "Cancel"
	}).appendTo(btnBox).click(cancel);
	
	var errorRaw = $("<tr/>").appendTo(base);
	
	$("<td/>").appendTo(errorRaw);
	var errorBox = $("<td/>").appendTo(errorRaw);
	
	var errorMessage = $("<span/>").attr({
		"style": "color:red;"
	}).appendTo(errorBox);
		
	function cancel() {
		obj.destroy();
	}
	
	handleResponse.success(function(data, textStatus, postData) {
		obj.destroy();
	}).error(function(error, textStatus, postData) {
		errorMessage.html(error);
	});
	
	function send() {		
//		var uploader = new qq.FileUploaderBasic({
//		    // path to server-side upload script
//		    action: '/sfsupload',
//		    params: {
//		    	wolfpacks: "someWolfpack"
//		    }
//		});
//		
//		uploader._uploadFileList(files.getFiles());
		
		var msg = messageText.val().replace(/\n/g,"<br>");
		var mailObject = {
				text: msg,
				attachment: [{
					filename: "testfile.doc",
					contentType: "document",
					path: "http://www.google.com"
				},
				{
					filename: "image.jpg",
					contentType: "image/jpeg",
					path: "https://www.cia.gov/library/publications/the-world-factbook/graphics/flags/large/is-lgflag.gif"					
				}]
		};
				
		request.request(
				createRequestObj(userIdText.val(),JSON.stringify(mailObject)),
				handleResponse.getHandler());
	}
	
	eWolf.bind("refresh",function(event,eventID) {
		if(eventID == thisID) {
			if(to != null) {
				userIdText.attr("value",to);
				
				if(toReplacment != null) {
					userIdText.hide();
					userIdCell.append(toReplacment);
				}
				
				window.setTimeout(function () {
					messageText.focus();
				}, 0);				
			} else {
				window.setTimeout(function () {
					userIdText.focus();
				}, 0);
			}
		}
	});
	
	eWolf.bind("select."+id,function(event,eventId) {
		if(eventId != thisID) {
			appContainer.destroy();
			delete obj;
		}
	});
	
	this.select = function() {
		eWolf.trigger("select",[thisID]);
	};
	
	this.destroy = function() {
		eWolf.trigger("select",[id]);
	};

	return this;
};

var NewMessage = function(id,applicationFrame,sendToID,sendToName) {
	var replacement = null;
	if(sendToID && sendToName) {
		replacement = new User(sendToID,sendToName);
	}
	
	function createNewMessageRequestObj(to,msg) {
		return {
			sendMessage: {
				userID: to,
				message: msg
			}
		  };
	}
	
	var responseHandler = new ResponseHandler("sendMessage",[],null);
	
	return new NewMail(id,applicationFrame,"New Message",
			createNewMessageRequestObj,responseHandler,true,sendToID,replacement);
};

var NewPost = function(id,applicationFrame,wolfpack) {	
	var replacement = null;
	if(wolfpack) {
		replacement = new Wolfpack(wolfpack);
	}
	
	function createNewPostRequestObj(to,content) {
		return {
			post: {
				wolfpackName: to,
				post: content
			}
		  };
	}	
	
	var responseHandler = new ResponseHandler("post",[],null);
	
	return new NewMail(id,applicationFrame,"New Post",
			createNewPostRequestObj,responseHandler,true,wolfpack,replacement);
};
