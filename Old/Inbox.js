var Inbox = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(id,"/json",handleNewData,null,60);
	
	var titleDiv = $("<div/>").attr({
		"class" : "eWolfTitle"
	})	.append("Inbox")
		.appendTo(frame);
	
	$("<input/>").attr({
		"type": "button",
		"value": "New Message...",
		"class": "newMessageBotton"
	}).appendTo(titleDiv).click(function() {
		new NewMessageBox("__newmessage__"+id,frame);
	});
	
	var inboxContainer = $("<div/>").appendTo(frame);
	var list = new GenericMailList("messageListItem","messageBox",
				 ">> ",true).appendTo(inboxContainer);
	
	var showMore = new ShowMore(frame,function() {
		updateFromServer(true);
	}).draw();	

	function handleNewData(data, parameters) {
		console.log(data);

		if (data.inbox != null) {
			if(data.inbox.result == "success") {
				if(data.inbox.messageList != null) {
					$.each(data.inbox.messageList, function(j, inboxItem) {
						list.addItem(inboxItem.senderID,inboxItem.senderName,
								inboxItem.timestamp, inboxItem.message);
					});
					
					if (parameters.getOlderItems
							&& data.inbox.messageList.length < parameters.inbox.maxMessages) {
						showMore.remove();
					}
					
				} else {
					console.log("No messageList parameter in response");
				}				
			} else {
				console.log(data.inbox.result);
			}
		} else {
			console.log("No inbox parameter in response");
		}
	}
	
	function updateFromServer(getOlderItems) {		
		
		var data = {
			maxMessages: 10
		};
		
		if(getOlderItems && list.getNewestTimestamp() != null 
				&& list.getOldestTimestamp() != null) {
			data.olderThan = list.getOldestTimestamp()-1;
		} else if(list.getNewestTimestamp() != null) {
			data.newerThan = list.getNewestTimestamp()+1;
		}
		
		getInboxData(data,getOlderItems);
	}
	
	function getInboxData(data,getOlderItems) {
		
		request.getData( {
			inbox:data
		} , {
			getOlderItems:getOlderItems,
			inbox:data
		});
	}
	
	eWolf.bind("refresh."+id,function(event,eventId) {
		if(id == eventId) {
			updateFromServer(false);
		}
	});
	
	return {
		getId : function() {
			return id;
		},
		isSelected : function() {
			return appContainer.isSelected();
		},
		destroy : function() {
			eWolf.unbind("refresh."+id);
			appContainer.destroy();
			delete this;
		}
	};
};
