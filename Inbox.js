var Inbox = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	var counter = 0;
	
	var eWolfJsonGetter = new JSonGetter(id,"/json?callBack=?",handleNewData,null,60);
	
	var newestDate = null;
	var oldestDate = null;
	
	$("<div/>").attr({
		"class" : "inboxListTitle",
		"id" : id+"Title"
	})	.append("Inbox")
		.appendTo(frame);
	
	$("<input/>").attr({
		"id": "newMessageBtn",
		"type": "button",
		"value": "New Message...",
		"class": "newMessageBotton"
	}).appendTo(frame).click(function() {
		new NewMessageBox("__newmessage__"+id,frame);
	});
	
	var inboxContainer = $("<div/>").appendTo(frame);

	var list = $("<ul/>").attr({
		"id" : id
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
		var olderThen,newerThen;
		
		if(getOlderItems && newestDate != null && oldestDate != null) {
			newerThen = "null";
			olderThen = oldestDate-1;
		} else {
			olderThen = "null";
			
			if(newestDate == null) {
				newerThen = "null";
			} else {
				newerThen = newestDate+1;
			}
		}
		
		var numberOfMessages = 10;
		var senderFilter = "null";
		
		getInboxData(numberOfMessages,olderThen,newerThen,senderFilter,getOlderItems);
	}
	
	function handleNewData(data,parameters) {
		  console.log(data);
		  
		  $.each(data,function(i,item){
			 if(item.key == "inbox") {
				 var lastItem = null;
				 $.each(item.data,function(j,inboxItem) {						 
					 lastItem = addItem(inboxItem.senderName,
							 			inboxItem.senderID,
							 			inboxItem.timestamp,
							 			inboxItem.message,
							 			lastItem,
							 			parameters.getOlderItems);
				 });
				 
				 if(parameters.getOlderItems &&
						 item.data.length < parameters.numberOfMessages) {
					 showMore.remove();
				 }
			 } 
		  }); 
	  }
	
	function getInboxData(numberOfMessages,olderThen,newerThen,senderFilter,getOlderItems) {
		/*!
		 * The parameters should be:
		 * 	0:	The amount of messages to retrieve.
		 * 	1:	Retrieve messages older from this date
		 * 	2:	Retrieve messages newer from this date
		 * 	3:	Retrieve messages from a specific sender (id)
		 */
		eWolfJsonGetter.getData({
		    inbox: numberOfMessages+","+olderThen+","+newerThen+","+senderFilter
		  }, {
			  getOlderItems:getOlderItems, numberOfMessages: numberOfMessages
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
