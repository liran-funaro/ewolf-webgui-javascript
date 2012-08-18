NEWMAIL_CONSTANTS = {
	NEWMAIL_APP_ID_PREFIX : "mailto:",
	NEW_MAIL_DAFAULTS : {
			TITLE : "New Mail",
			TO : "To",
			CONTENT : "Content",
			ATTACHMENT : "Attachment"
		}
};

var NewMail = function(callerID,applicationFrame,options,		
		createRequestObj,handleResponseCategory,
		allowAttachment,sendTo,sendToQuery) {
	var self = this;
	$.extend(this,NEWMAIL_CONSTANTS);
	
	var id = self.NEWMAIL_APP_ID_PREFIX+callerID;
	
	Application.call(this,id,applicationFrame);
	
	var settings = $.extend({}, self.NEW_MAIL_DAFAULTS, options);
		
	var request = new PostRequestHandler(id,"/json",0);
		
	var titleArea = new TitleArea(settings.TITLE).appendTo(this.frame);
	
	var base = $("<table/>")
		.addClass("newMainTable")
		.appendTo(this.frame);
	
	var queryRaw = $("<tr/>").appendTo(base);
	$("<td/>")
		.addClass("newMailAlt")
		.append(settings.TO+":")
		.appendTo(queryRaw);	
	var userIdCell = $("<td/>").appendTo(queryRaw);
	
	sendToQuery.appendTo(userIdCell);
	
	if(sendTo != null) {
		sendToQuery.addTagByQuery(sendTo,true);
	}
	
	var msgRaw = $("<tr/>").appendTo(base);
	$("<td/>")
		.addClass("newMailAlt")
		.append(settings.CONTENT+":")
		.appendTo(msgRaw);
	
	var height = 350;
	if(allowAttachment) {
		height = 200;
	}
	
	var messageText = $("<div/>")
		.addClass("textarea-div")
		.attr({
//		"placeholder": "What is on your mind...",
		"style" : "min-height:"+height+"px;",
		"contentEditable" : "true"
	});
	
	$("<td/>").append(messageText)
		.appendTo(msgRaw);
	
	var files = null;
	if(allowAttachment) {
		var attacheRaw = $("<tr/>").appendTo(base);
		$("<td/>")
			.addClass("newMailAlt")
			.append(settings.ATTACHMENT+":")
			.appendTo(attacheRaw);
		
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
	
	eWolf.bind("refresh."+id,function(event,eventID) {
		if(eventID == id) {
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
	
	eWolf.bind("select."+callerID,function(event,eventId) {
		if(eventId != id) {
			self.destroy();
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
					self.send(event,true);
				},
				"Resend to all": function() {
					$( this ).dialog( "close" );
					sendToQuery.tagList.unmarkTags();
					self.send(event,true);
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	
	this.updateSend = function() {
		if(sendToQuery.tagList.tagCount({markedError:false,markedOK:false}) > 0) {
			titleArea.hideAll();
			operations.hideAll();
		} else if(sendToQuery.tagList.tagCount({markedError:true})) {
			titleArea.showAll();
			operations.showAll();
		} else {			
			eWolf.trigger("needRefresh."+callerID.replace("+","\\+"),[callerID]);
			this.cancel();
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
		self.updateSend();		
		errorMessage.html("");		
		
		self.sendToAll();
	};
	
	this.sendToAll = function () {		
		var msg = messageText.html();

		var mailObject = {
				text: msg
		};
		
		sendToQuery.tagList.foreachTag({markedOK:false},function(destId) {
			if(allowAttachment && files) {
				files.uploadAllFiles(destId, function(success, uploadedFiles) {
					if(success) {
						mailObject.attachment = uploadedFiles;
						self.sendTo(destId,JSON.stringify(mailObject));
					} else {
						errorMessage.html("Some of the files failed to upload...<br>Message did not sent.");
						titleArea.showAll();
						operations.showAll();
					}
				});			
			} else {
				self.sendTo(destId,JSON.stringify(mailObject));
			}			
		});	
	};
	
	this.sendTo = function(destId,data) {
		var responseHandler = new ResponseHandler(handleResponseCategory,[],null);
		
		responseHandler.success(function(data, textStatus, postData) {
			sendToQuery.tagList.markTagOK(destId);				
			self.updateSend();
		}).error(function(data, textStatus, postData) {
			var errorMsg = "Failed to arrive at destination: " +
			destId + " with error: " + data.result;
			errorMessage.append(errorMsg+"<br>");
			
			sendToQuery.tagList.markTagError(destId,errorMsg);
			self.updateSend();
		});
		
		request.request(
				createRequestObj(destId,data),
				responseHandler.getHandler());
	};
	
	this.cancel = function() {
		eWolf.selectApp(callerID);
	};
	
	titleArea
		.addFunction("Send", this.send)
		.addFunction("Cancel",this.cancel);
	operations
		.addFunction("Send", this.send)
		.addFunction("Cancel", this.cancel);

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
	
	NewMail.call(this,id,applicationFrame,{
			TITLE : "New Message"
		},createNewMessageRequestObj,"sendMessage",false,
		sendToName,new FriendsQueryTagList(300));
	
	return this;
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
	
	NewMail.call(this,id,applicationFrame,{
			TITLE : "New Post",
			TO : "Post to",
			CONTENT: "Post"
		},createNewPostRequestObj,"post",true,
			wolfpack,new WolfpackQueryTagList(300));
	
	return this;
};
