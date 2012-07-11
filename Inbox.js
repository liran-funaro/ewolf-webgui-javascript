var Inbox = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	var counter = 0;
	
	var request = new RequestHandler(id,"/json",handleNewData,null,60);
	
	var newestDate = null;
	var oldestDate = null;
	
	var titleDiv = $("<div/>").attr({
		"class" : "eWolfTitle",
		"id" : id+"Title"
	})	.append("Inbox")
		.appendTo(frame);
	
	$("<input/>").attr({
		"id": "newMessageBtn",
		"type": "button",
		"value": "New Message...",
		"class": "newMessageBotton"
	}).appendTo(titleDiv).click(function() {
		new NewMessageBox("__newmessage__"+id,frame);
	});
	
	var inboxContainer = $("<div/>").appendTo(frame);

	var list = $("<ul/>").attr({
		"id" : id,
		"class" : "messageList"
	})	.appendTo(inboxContainer);
	
	var showMore = new ShowMore(frame,function() {
		updateFromServer(true);
	}).draw();
	
	function addItem(sender,senderId,timestamp,message,afterItem,olderItem) {
		 if(oldestDate == null || timestamp - oldestDate < 0) {
			 oldestDate = timestamp;
		}
		
		if(newestDate == null || timestamp - newestDate > 0) {
			newestDate = timestamp;
		}
		
		return drawItem(sender,senderId,timestamp,message,afterItem,olderItem);
	}
	
	function drawItem(sender,senderId,timestamp,message,afterItem,olderItem) {
		 var obj = new InboxItem("__inboxitem__"+counter,sender,senderId,timestamp,message);
		 counter++;		 
				
		if(afterItem == null) {
			if(olderItem) {
				obj.appendTo(list);
			} else {
				obj.prependTo(list);
			}
		} else {
			obj.insertAfter(afterItem.getListItem());
		}
		
		return obj;
	}
	

	function updateFromServer(getOlderItems) {		
		
		var data = {
			maxMessages: 10
		};
		
		if(getOlderItems && newestDate != null && oldestDate != null) {
			data.olderThan = oldestDate-1;
		} else if(newestDate != null) {
			data.newerThan = newestDate+1;
		}
		
		getInboxData(data,getOlderItems);
	}
	
	function handleNewData(data, parameters) {
		console.log(data);

		if (data.inbox != null) {
			if(data.inbox.result == "success") {
				if(data.inbox.messageList != null) {
					var lastItem = null;
					$.each(data.inbox.messageList, function(j, inboxItem) {
						lastItem = addItem(inboxItem.senderName, inboxItem.senderID,
								inboxItem.timestamp, inboxItem.message, lastItem,
								parameters.getOlderItems);
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
	
	function getInboxData(data,getOlderItems) {
		
		request.getData( {
			inbox:data
		} , {
			getOlderItems:getOlderItems,
			inbox:data
		});
	}
	
	eWolf.bind("refresh."+id,function(event,eventId) {
		updateFromServer(false);
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
