var GenericMailList = function(mailType,request,serverSettings,
		listClass,msgBoxClass,preMessageTitle,allowShrink) {
	var newestDate = null;
	var oldestDate = null;
	
	var lastItem = null;

	request.register(getData,new ResonseHandler(mailType,
			["mailList"],handleNewData));	
	
	var frame = $("<span/>");
	
	var list = $("<ul/>").attr({
		"class" : "messageList"
	}).appendTo(frame);
	
	var showMore = new ShowMore(frame,function() {
		request.request(_updateFromServer (true),handleNewData);
	}).draw();
	
	function handleNewData(data, textStatus, parameters) {
		$.each(data.mailList, function(j, mailItem) {
			_addItem(mailItem.senderID,mailItem.senderName,
					mailItem.timestamp, mailItem.mail);
		});
		
		if (parameters[mailType].newerThan == null &&
				data.mailList.length < parameters[mailType].maxMessages) {
			showMore.remove();
		}		
	}
	
	function getData () {
		return _updateFromServer(false);
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
		
		return postData;
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
			request.requestAll();
			return this;
		}
	};
};

var NewsFeedList = function (request,serverSettings) {
	$.extend(serverSettings,{maxMessages:15});
	
	return new GenericMailList("newsFeed",request,serverSettings,
			"postListItem","postBox","",false);
};

var InboxList = function (request,serverSettings) {	
	$.extend(serverSettings,{maxMessages:20});
	
	return new GenericMailList("inbox",request,serverSettings,
			"messageListItem","messageBox", ">> ",true);
};