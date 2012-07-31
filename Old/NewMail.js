var NewMail = function(id,applicationFrame,title,
		createRequestObj,handleResponse,
		allowAttachment,sendTo,availableTo,sendToFuncReplace) {
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
	$("<td/>").attr("style","text-align:right;").append("To:").appendTo(queryRaw);	
	var userIdCell = $("<td/>").appendTo(queryRaw);
	
	var sendToQuery = $("<input/>").attr({
		"type": "text",
		"placeholder": "To...",
		"style": "min-width:300px !important;"
	}).appendTo(userIdCell);
	
	var addBtn = $("<input/>").attr({
		"type": "button",
		"value": "Add"
	}).click(function() {
		onSelectSendTo();
	}).appendTo(userIdCell).hide();
	
	sendToQuery.autocomplete({
		source: availableTo,
		select: onSelectSendTo
	}).keyup(function(event) {
	    if(event.keyCode == 13 && sendToQuery.val() != ""){
	    	onSelectSendTo();
	    }
	    
	    if(sendToQuery.val() == "") {
	    	addBtn.hide(200);
	    } else {
	    	addBtn.show(200);
	    }
	});
	
	var sendToRaw = $("<tr/>").appendTo(base);
	$("<td/>").appendTo(sendToRaw);	
	var sendToCell = $("<td/>").appendTo(sendToRaw);	
	var sendToTerms = [];
	var sendToBoxs = [];
	
	function onSelectSendTo(event,ui) {
		var query;
		if(ui != null && ui.item != null) {
			query = ui.item.label;
		} else {
			query = sendToQuery.val();
		}
		
		var res = sendToFuncReplace(query);
		if(res == null) {
			return false;
		}
		
		var idx = sendToTerms.indexOf(res.sendToTerm);
		if(idx != -1) {
			return false;
		}		
		sendToTerms.push(res.sendToTerm);
		
		var box = new Tag(res.sendToTerm,function(term) {
				var idx = sendToTerms.indexOf(term);
				if(idx != -1){
					sendToTerms.splice(idx, 1);
					sendToBoxs.splice(idx, 1);
				}
			}).append(res.sendToReplacement);
		
		sendToCell.append(box);
		sendToBoxs.push(box);
		
		sendToQuery.val("");
		addBtn.hide(200);
		return false;
	}
	
	if(sendTo != null) {
		sendToQuery.val(sendTo);
		onSelectSendTo();
	}
	
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
	
	function send() {
		var sendCount = sendToTerms.length;
		if(sendCount <= 0) {
			errorMessage.html("Please select a destination(s)");
			return false;
		}
		
		function updateSend() {
			if(sendCount > 0) {
				titleArea.removeFunction("Send");
				titleArea.removeFunction("Cancel");
				btnBox.hide();
			} else {
				titleArea.addFunction("Send",send);
				titleArea.addFunction("Cancel",cancel);
				btnBox.show();
			}
		}
		
		updateSend();
		
//		var uploader = new qq.FileUploaderBasic({
//		    // path to server-side upload script
//		    action: '/sfsupload',
//		    params: {
//		    	wolfpacks: "someWolfpack"
//		    }
//		});
//		
//		uploader._uploadFileList(files.getFiles());
		
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
		
		$.each(sendToTerms, function(i,term) {			
			var responseHandler = new ResponseHandler(handleResponse,[],null);
			
			responseHandler.success(function(data, textStatus, postData) {
				console.log("success: "+term);
				var idx = sendToTerms.indexOf(term);
				if(idx != -1){
					sendToTerms.splice(idx, 1);
					sendToBoxs[idx].remove();
					sendToBoxs.splice(idx, 1);
				}
				
				sendCount = sendCount - 1;
								
				if(sendToTerms.length <= 0) {
					eWolf.trigger("needRefresh."+id,[id]);
					obj.destroy();
				}
				
				updateSend();
			}).error(function(data, textStatus, postData) {
				errorMessage.append("Failed to arrive at destination: " +
						term + " with error: " + data.result+"<br>");
				sendCount = sendCount - 1;
				
				updateSend();
			});
			
			request.request(
					createRequestObj(term,mailString),
					responseHandler.getHandler());
		});		
	}
	
	eWolf.bind("refresh",function(event,eventID) {
		if(eventID == thisID) {
			if(sendTo != null) {				
				window.setTimeout(function () {
					messageText.focus();
				}, 0);				
			} else {
				window.setTimeout(function () {
					sendToQuery.focus();
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
	function sendToFuncReplace(query) {
		var id = eWolf.wolfpacks.getFriendID(query);
		
		if(id == null) {
			id = query;
			query = null;
		}
		
		return {
			sendToTerm: id,
			sendToReplacement: new User(id,query)
		};
	}
	
	function createNewMessageRequestObj(to,msg) {
		return {
			sendMessage: {
				userID: to,
				message: msg
			}
		  };
	}
	
	return new NewMail(id,applicationFrame,"New Message",
			createNewMessageRequestObj,"sendMessage",true,
			sendToName,eWolf.wolfpacks.friendsNameArray,sendToFuncReplace);
};

var NewPost = function(id,applicationFrame,wolfpack) {	
	function sendToFuncReplace(pack) {
		var idx = eWolf.wolfpacks.wolfpacksArray.indexOf(pack);
		if(idx != -1) {
			return {
				sendToTerm: pack,
				sendToReplacement: new Wolfpack(pack)
			};
		} else {
			return null;
		}		
	}
	
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
			wolfpack,eWolf.wolfpacks.wolfpacksArray,sendToFuncReplace);
};
