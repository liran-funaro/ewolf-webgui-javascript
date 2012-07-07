var NewMessageBox = function(id,container) {
	var request = new RequestHandler(id,"/json",handleResponse,null,0);
	
	var box = $("<div/>").attr({
		"class": "newMessageBoxClass"
	}).appendTo(container).animate({
		opacity : 0.9
	}, 350, function() {
		// Animation complete.
	});;
	
	var base = $("<table/>").appendTo(box);
	
	var idRaw = $("<tr/>").appendTo(base);
	$("<td/>").append("Send to:").appendTo(idRaw);
	
	var userIdText = $("<input/>").attr({
		"id": "sendToId",
		"type": "text",
		"placeholder": "Send to (user id)",
		"style": "width:300px !important;"
	});
	
	$("<td/>").append(userIdText).appendTo(idRaw);
	
	var msgRaw = $("<tr/>").appendTo(base);
	$("<td/>").attr("style","vertical-align:text-top;").append("Message:").appendTo(msgRaw);
	
	var messageText = $("<textarea/>").attr({
		"id": "textileMessage",
		"placeholder": "Your message",
		"style": "width:300px !important;height:300px  !important;"
	});
	
	$("<td/>").append(messageText).appendTo(msgRaw);
	
	var attacheRaw = $("<tr/>").appendTo(base);
	$("<td/>").attr("style","vertical-align:text-top;").append("Attachment:").appendTo(attacheRaw);
	
	var uploaderArea = $("<td/>").appendTo(attacheRaw);
	
	var files = new filedrag(uploaderArea);

	var btnRaw = $("<tr/>").appendTo(base);
	
	$("<td/>").appendTo(btnRaw);
	var btnBox = $("<td/>").appendTo(btnRaw);
	
	$("<input/>").attr({
		"id": "sendMessageBtn",
		"type": "button",
		"value": "Send"
	}).appendTo(btnBox).click(function() {
		
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
		
		console.log(JSON.stringify(mailObject));
		
		request.getData({
			sendMessage: {
				userID: userIdText.val(),
				message: JSON.stringify(mailObject)
			}
		  }, {
			  // No data to pass to handler
		  });
	});
	
	btnBox.append("&nbsp;");
	
	$("<input/>").attr({
		"id": "sabortBtn",
		"type": "button",
		"value": "Cancel"
	}).appendTo(btnBox).click(function() {
		destroySelf();
	});
	
	var errorRaw = $("<tr/>").appendTo(base);
	
	$("<td/>").appendTo(errorRaw);
	var errorBox = $("<td/>").appendTo(errorRaw);
	
	var errorMessage = $("<span/>").attr({
		"style": "color:red;"
	}).appendTo(errorBox);
	
	function handleResponse(data,parameters) {
		console.log(data);
		if (data.sendMessage != null) {
			if(data.sendMessage.result == "success") {
				destroySelf();
			} else {
				errorMessage.html(data.sendMessage.result);
			}
		} else {
			console.log("No sendMessage parameter in response");
		}		
	}
	
	function destroySelf() {
		if(box != null) {
			box.animate({
				opacity : 0
			}, 350, function() {
				box.remove();
				box = null;
				delete this;
			});;			
		} else {
			delete this;
		}
		
	}

	return {
		destroy : function() {
			destroySelf();
		}
	};
};

