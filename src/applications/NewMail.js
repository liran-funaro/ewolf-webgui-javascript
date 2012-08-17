NEW_MAIL_DESCRIPTION_DAFAULTS = {
	TITLE : "New Mail",
	TO : "To",
	CONTENT : "Content",
	ATTACHMENT : "Attachment"
};

var NewMail = function(callerID,applicationFrame,options,		
		createRequestObj,handleResponseCategory,
		allowAttachment,sendTo,sendToQuery) {
	var self = this;
	var id = "__newmessage__"+callerID;
	
	Application.call(this,id,applicationFrame);
	
	var settings = $.extend({}, NEW_MAIL_DESCRIPTION_DAFAULTS, options);
		
	var request = new PostRequestHandler(id,"/json",0);
		
	var titleArea = new TitleArea(settings.TITLE).appendTo(this.frame);
	
	var base = $("<table/>").appendTo(this.frame);
	
	var queryRaw = $("<tr/>").appendTo(base);
	$("<td/>").attr("class","newMailAlt")
		.append(settings.TO+":")
		.appendTo(queryRaw);	
	var userIdCell = $("<td/>").appendTo(queryRaw);
	
	sendToQuery.appendTo(userIdCell);
	
	if(sendTo != null) {
		sendToQuery.addTagByQuery(sendTo,true);
	}
	
	var msgRaw = $("<tr/>").appendTo(base);
	$("<td/>").attr("class","newMailAlt")
		.append(settings.CONTENT+":")
		.appendTo(msgRaw);
	
	var height = 300;
	if(allowAttachment) {
		height = 100;
	}
	
	var messageText = $("<textarea/>").attr({
		"placeholder": "What is on your mind...",
		"style" : "min-width:300px !important;height:"+height+"px  !important"
	});
	
	$("<td/>").append(messageText).appendTo(msgRaw);
	
	var files = null;
	if(allowAttachment) {
		var attacheRaw = $("<tr/>").appendTo(base);
		$("<td/>").attr("class","newMailAlt")
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
	
	eWolf.bind("refresh",function(event,eventID) {
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
			titleArea.hideFunction("Send");
			titleArea.hideFunction("Cancel");
			operations.hideAll();
		} else if(sendToQuery.tagList.tagCount({markedError:true})) {
			titleArea.showFunction("Send");
			titleArea.showFunction("Cancel");
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
		var msg = messageText.val();
		var mailObject = {
				text: msg
		};
		
		sendToQuery.tagList.foreachTag({markedOK:false},function(destId) {
			if(allowAttachment && files) {
				files.uploadFile(destId, function(success, uploadedFiles) {
					if(success) {
						mailObject.attachment = uploadedFiles;
						self.sendTo(destId,JSON.stringify(mailObject));
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
		
	this.select = function() {
		eWolf.trigger("select",[id]);
	};
	
	this.cancel = function() {
		eWolf.trigger("select",[callerID]);
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
