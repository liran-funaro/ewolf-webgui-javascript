var GenericMailList = function(mailType,request,serverSettings,
		listClass,msgBoxClass,preMessageTitle,allowShrink) {
	var obj = this;
	
	var newestDate = null;
	var oldestDate = null;
	
	var lastItem = null;
	
	var frame = $("<span/>");
	
	var list = $("<ul/>").attr({
		"class" : "messageList"
	}).appendTo(frame);
	
	this.updateFromServer = function (getOlder) {
		var data = {};
		$.extend(data,serverSettings);
		
		if(getOlder && newestDate != null && oldestDate != null) {
			data.olderThan = oldestDate-1;
		} else if(newestDate != null) {
			data.newerThan = newestDate+1;
		}		
		
		var postData = {};
		postData[mailType] = data;
		
		return postData;
	};
	
	this.addItem = function (senderID,senderName,timestamp,mail) {
		 var item = new GenericItem(senderID,senderName,timestamp,mail,
				 listClass,msgBoxClass,preMessageTitle,allowShrink);
		 
		var appended = false;
		 
		if(oldestDate == null || timestamp - oldestDate < 0) {
			 oldestDate = timestamp;
			 item.appendTo(list);
			 appended = true;
		}
		
		if(newestDate == null || timestamp - newestDate > 0) {
			newestDate = timestamp;
			if(!appended) {
				item.prependTo(list);
				appended = true;
			}
		}
		
		if(!appended) {
			item.insertAfter(lastItem.getListItem());
		}
		
		lastItem = item;
		
		return item;
	};
	
	this.appendTo = function (canvas) {
		frame.appendTo(canvas);
		return this;
	};

	var responseHandler = new ResponseHandler(mailType,
			["mailList"],handleNewData);
	request.register(this.updateFromServer ,responseHandler.getHandler());
	
	var showMore = new ShowMore(frame,function() {
		request.request(obj.updateFromServer (true),responseHandler.getHandler());
	}).draw();
	
	function handleNewData(data, textStatus, postData) {
		$.each(data.mailList, function(j, mailItem) {
			obj.addItem(mailItem.senderID,mailItem.senderName,
					mailItem.timestamp, mailItem.mail);
		});
		
		if (postData.newerThan == null &&
				data.mailList.length < postData.maxMessages) {
			showMore.remove();
		}
	}	
	
	return this;
};

var NewsFeedList = function (request,serverSettings) {
	$.extend(serverSettings,{maxMessages:2});
	
	return new GenericMailList("newsFeed",request,serverSettings,
			"postListItem","postBox","",false);
};

var InboxList = function (request,serverSettings) {	
	$.extend(serverSettings,{maxMessages:2});
	
	return new GenericMailList("inbox",request,serverSettings,
			"messageListItem","messageBox", ">> ",true);
};