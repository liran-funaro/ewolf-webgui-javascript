var GenericMailList = function(id,mailType,serverSettings,
		listClass,msgBoxClass,preMessageTitle,allowShrink) {
	var newestDate = null;
	var oldestDate = null;
	
	var lastItem = null;
	
	var request = new PostRequestHandler(id,"/json",handleNewData,null,60);	
	
	var frame = $("<span/>");
	
	var list = $("<ul/>").attr({
		"class" : "messageList"
	}).appendTo(frame);
	
	var showMore = new ShowMore(frame,function() {
		_updateFromServer(true);
	}).draw();
	
	eWolf.bind("refresh."+id,function(event,eventId) {
		if(id == eventId) {
			_updateFromServer(false);
		}
	});
	
	function handleNewData(data, parameters) {
		console.log(data);
		
		var item = data[mailType];

		if (item != null) {
			if(item.result == "success") {
				if(item.mailList != null) {
					$.each(item.mailList, function(j, mailItem) {
						_addItem(mailItem.senderID,mailItem.senderName,
								mailItem.timestamp, mailItem.mail);
					});
					
					if (parameters[mailType].newerThan == null &&
							item.mailList.length < parameters[mailType].maxMessages) {
						showMore.remove();
					}
					
				} else {
					console.log("No mailList parameter in response");
				}				
			} else {
				console.log(item.result);
			}
		} else {
			console.log("No " + mailType + " parameter in response");
		}
	}
	
	function _updateFromServer (getOlder) {		
		var data = {};
		$.extend(data,serverSettings);
		
		if(getOlder && newestDate != null && oldestDate != null) {
			data.olderThan = oldestDate-1;
		} else if(newestDate != null) {
			data.newerThan = newestDate+1;
		}		
		
		var postData = {};
		postData[mailType] = data;
		
		request.getData(postData);
	}
	
	function _addItem (senderID,senderName,timestamp,mail) {
		 var obj = new GenericItem(senderID,senderName,timestamp,mail,
				 listClass,msgBoxClass,preMessageTitle,allowShrink);
		 
		var appended = false;
		 
		if(oldestDate == null || timestamp - oldestDate < 0) {
			 oldestDate = timestamp;
			 obj.appendTo(list);
			 appended = true;
		}
		
		if(newestDate == null || timestamp - newestDate > 0) {
			newestDate = timestamp;
			if(!appended) {
				obj.prependTo(list);
				appended = true;
			}
		}
		
		if(!appended) {
			obj.insertAfter(lastItem.getListItem());
		}
		
		lastItem = obj;
		
		return obj;
	}
	
	return {
		appendTo: function (canvas) {
			frame.appendTo(canvas);
			return this;
		},
		addItem: function (senderID,senderName,timestamp,mail) {
			return _addItem (senderID,senderName,timestamp,mail);
		},
		getOldestTimestamp: function () {
			return oldestDate;
		},
		getNewestTimestamp: function () {
			return newestDate;
		},
		updateFromServer: function (getOlder) {		
			return _updateFromServer(getOlder);
		}
	};
};

var mailObject = {
		text: "hello liran",
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

var NewsFeedList = function (id, serverSettings) {
	$.extend(serverSettings,{maxMessages:15});
	
	var list = new GenericMailList(id,"newsFeed",serverSettings,
			"postListItem","postBox","",false);
	
	list.addItem("model","Model",null,JSON.stringify(mailObject));	
	list.addItem("cat","Cat",null,JSON.stringify(mailObject));
	
	return list;
};

var InboxList = function (id, serverSettings) {	
	$.extend(serverSettings,{maxMessages:20});
	
	return new GenericMailList(id,"inbox",serverSettings,
			"messageListItem","messageBox", ">> ",true);
};