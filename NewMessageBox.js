var NewMessageBox = function(id,container) {
	var eWolfJsonGetter = new JSonGetter(id,"/json?callBack=?",handleResponse,null,0);
	
	var box = $("<div/>").attr({
		"class": "newMessageBoxClass"
	}).appendTo(container);
	
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
	
	var btnRaw = $("<tr/>").appendTo(base);
	
	$("<td/>").appendTo(btnRaw);
	var btnBox = $("<td/>").appendTo(btnRaw);
	
	$("<input/>").attr({
		"id": "sendMessageBtn",
		"type": "button",
		"value": "Send"
	}).appendTo(btnBox).click(function() {
		/*!
		 * The parameters should be:
		 * 	0:	user id.
		 * 	1:	message
		 */
		eWolfJsonGetter.getData({
			sendMessage: userIdText.val()+","+messageText.val().replace(/\n/g,"<br>")
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
		$.each(data,function(i,item){
			if(item.key == "sendMessage") {
				if(item.data == "success") {
					destroySelf();
				} else {
					errorMessage.html(item.data);
				}
			}		
		});
	}
	
	function destroySelf() {
		if(box != null) {
			box.remove();
			box = null;
		}
		delete this;
	}

	return {
		destroy : function() {
			destroySelf();
		}
	};
};

