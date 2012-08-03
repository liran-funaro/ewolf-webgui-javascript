var NewMail = function(id,applicationFrame,title,
		createRequestObj,handleResponseCategory,
		allowAttachment,sendTo,sendToQuery) {
	var obj = this;
	var thisID = "__newmessage__"+id;
	
	var appContainer = new AppContainer(thisID,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(thisID,"/json",0);
		
	var titleArea = new TitleArea(title)
		.appendTo(frame)
		.addFunction("Send", send)
		.addFunction("Cancel",cancel);
	
	var base = $("<table/>").appendTo(frame);
	
	var queryRaw = $("<tr/>").appendTo(base);
	$("<td/>").attr("class","newMailAlt").append("To:").appendTo(queryRaw);	
	var userIdCell = $("<td/>").appendTo(queryRaw);
	
	sendToQuery.appendTo(userIdCell);
	
	if(sendTo != null) {
		sendToQuery.addTagByQuery(sendTo,true);
	}
	
	var msgRaw = $("<tr/>").appendTo(base);
	$("<td/>").attr("class","newMailAlt").append("Content:").appendTo(msgRaw);
	
	var messageText = $("<textarea/>").attr({
		"id": "textileMessage",
		"placeholder": "What is on your mind...",
		"style": "min-width:300px !important;height:100px  !important;"
	});
	
	$("<td/>").append(messageText).appendTo(msgRaw);
	
	var files = null;
	if(allowAttachment) {
		var attacheRaw = $("<tr/>").appendTo(base);
		$("<td/>").attr("class","newMailAlt").append("Attachment:").appendTo(attacheRaw);
		
		var uploaderArea = $("<td/>").appendTo(attacheRaw);
		files = new FilesBox(uploaderArea);
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
		"class": "errorArea"
	}).appendTo(errorBox);
		
	function cancel() {
		obj.destroy();
	}
	
	function send() {
		if(sendToQuery.tagList.isEmpty()) {
			errorMessage.html("Please select a destination(s)");
			return false;
		}
		
		sendToQuery.tagList.unmarkAll();
		
		function updateSend() {
			if(sendToQuery.tagList.unmarkedTagCount() > 0) {
				titleArea.removeFunction("Send");
				titleArea.removeFunction("Cancel");
				btnBox.hide();
			} else {
				titleArea.addFunction("Send",send);
				titleArea.addFunction("Cancel",cancel);
				btnBox.show();
			}
			
			if(sendToQuery.tagList.isEmpty()) {
				eWolf.trigger("needRefresh."+id,[id]);
				obj.destroy();
			}
		}
		
		updateSend();
		
		var msg = messageText.val();
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
		
		var mailString = JSON.stringify(mailObject);
		
		errorMessage.html("");
		
		sendToQuery.tagList.foreachTag(function(term) {			
			var responseHandler = new ResponseHandler(handleResponseCategory,[],null);
			
			responseHandler.success(function(data, textStatus, postData) {
				sendToQuery.tagList.removeTag(term);				
				updateSend();
			}).error(function(data, textStatus, postData) {
				var errorMsg = "Failed to arrive at destination: " +
						term + " with error: " + data.result;
				errorMessage.append(errorMsg+"<br>");
				
				sendToQuery.tagList.markTag(term,errorMsg);				
				updateSend();
			});
			
//			request.request(
//					createRequestObj(term,mailString),
//					responseHandler.getHandler());
			if(files) {
				files.uploadFile(term);
			}

		});		
	}
	
	eWolf.bind("refresh",function(event,eventID) {
		if(eventID == thisID) {
//			if(sendTo != null) {				
//				window.setTimeout(function () {
//					messageText.focus();
//				}, 0);				
//			} else {
//				window.setTimeout(function () {
//					sendToQuery.focus();
//				}, 0);
//			}
			
			window.setTimeout(function () {
				messageText.focus();
			}, 0);
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
	function createNewMessageRequestObj(to,msg) {
		return {
			sendMessage: {
				userID: to,
				message: msg
			}
		  };
	}
	
	return new NewMail(id,applicationFrame,"New Message",
			createNewMessageRequestObj,"sendMessage",false,
			sendToName,new FriendsQueryTagList(300));
};

var NewPost = function(id,applicationFrame,wolfpack) {	
	function createNewPostRequestObj(to,content) {
		return {
			post: {
				wolfpackName: to,
				post: content
			}
		  };
	}	
	
	return new NewMail(id,applicationFrame,"New Post",
			createNewPostRequestObj,"post",true,
			wolfpack,new WolfpackQueryTagList(300));
};
