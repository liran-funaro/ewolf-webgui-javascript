var NewMail = function(id,applicationFrame,title,
		createRequestObj,handleResponseCategory,
		allowAttachment,sendTo,sendToQuery) {
	var thisObj = this;
	var thisID = "__newmessage__"+id;
	
	var appContainer = new AppContainer(thisID,applicationFrame);
	this.frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(thisID,"/json",0);
		
	var titleArea = new TitleArea(title).appendTo(this.frame);
	
	var base = $("<table/>").appendTo(this.frame);
	
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
	
	var operations = new FunctionsArea().appendTo(btnBox);
	
	var errorRaw = $("<tr/>").appendTo(base);
	
	$("<td/>").appendTo(errorRaw);
	var errorBox = $("<td/>").appendTo(errorRaw);
	
	var errorMessage = $("<span/>").attr({
		"class": "errorArea"
	}).appendTo(errorBox);
	
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
			delete thisObj;
		}
	});
		
	function showDeleteSuccessfulDialog(event) {
		var diag = $("<div/>").attr({
			"id" : "dialog-confirm",
			"title" : "Resend to all destinations?"
		}).addClass("DialogClass");
		
		$("<p/>").appendTo(diag).append(
				"You are reseding the message after its failed to arraive to some of its destinations.<br>" + 
				"The message already arrived to some of its destinations.");
		$("<p/>").appendTo(diag).append(
				"<b>Do you want to resend the message to these destinations?</b>");
		
		diag.dialog({
			resizable: true,
			modal: true,
			width: 550,
			buttons: {
				"Send only to failed": function() {
					$( this ).dialog( "close" );
					thisObj.send(event,true);
				},
				"Resend to all": function() {
					$( this ).dialog( "close" );
					sendToQuery.tagList.unmarkTags();
					thisObj.send(event,true);
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	
	this.updateSend = function() {
		if(sendToQuery.tagList.tagCount({markedError:false,markedOK:false}) > 0) {
			titleArea.hideFunction("Send");
			titleArea.hideFunction("Cancel");
			operations.hideAll();
		} else if(sendToQuery.tagList.tagCount({markedError:true})) {
			titleArea.showFunction("Send");
			titleArea.showFunction("Cancel");
			operations.showAll();
		} else {			
			eWolf.trigger("needRefresh."+id,[id]);
			this.destroy();
		}		
	};
	
	this.send = function (event,resend) {
		if(sendToQuery.tagList.isEmpty()) {
			errorMessage.html("Please select a destination(s)");
			return false;
		}

		if(!resend) {
			if(sendToQuery.tagList.match({markedOK:true}).count() > 0) {
				showDeleteSuccessfulDialog(event);
				return false;
			}
		}
			
		sendToQuery.tagList.unmarkTags({markedError:true});		
		thisObj.updateSend();		
		errorMessage.html("");		
		
		thisObj.sendToAll();
		
//		mailObject.attachment.push({
//			filename: "testfile.doc",
//			contentType: "document",
//			path: "http://www.google.com"
//		});		
//		mailObject.attachment.push({
//			filename: "image.jpg",
//			contentType: "image/jpeg",
//			path: "https://www.cia.gov/library/publications/the-world-factbook/graphics/flags/large/is-lgflag.gif"					
//		});	
	};
	
	this.sendToAll = function () {		
		var msg = messageText.val();
		var mailObject = {
				text: msg
		};
		
		sendToQuery.tagList.foreachTag({markedOK:false},function(destId) {
			if(allowAttachment && files) {
				files.uploadFile(destId, function(success, uploadedFiles) {
					if(success) {
						mailObject.attachment = uploadedFiles;
						thisObj.sendTo(destId,JSON.stringify(mailObject));
					}		
				});			
			} else {
				thisObj.sendTo(destId,JSON.stringify(mailObject));
			}			
		});	
	};
	
	this.sendTo = function(destId,data) {
		var responseHandler = new ResponseHandler(handleResponseCategory,[],null);
		
		responseHandler.success(function(data, textStatus, postData) {
			sendToQuery.tagList.markTagOK(destId);				
			thisObj.updateSend();
		}).error(function(data, textStatus, postData) {
			var errorMsg = "Failed to arrive at destination: " +
			destId + " with error: " + data.result;
			errorMessage.append(errorMsg+"<br>");
			
			sendToQuery.tagList.markTagError(destId,errorMsg);
			thisObj.updateSend();
		});
		
		request.request(
				createRequestObj(destId,data),
				responseHandler.getHandler());
	};
		
	this.select = function() {
		eWolf.trigger("select",[thisID]);
	};
	
	this.destroy = function() {
		eWolf.trigger("select",[id]);
	};
	
	titleArea
		.addFunction("Send", this.send)
		.addFunction("Cancel",this.destroy);
	operations
		.addFunction("Send", this.send)
		.addFunction("Cancel", this.destroy);

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
