var GenericMailList = function(mailType,appID,
		extraDataToSend, maxOlderMessagesFetch,
		listClass,msgBoxClass,preMessageTitle,allowShrink) {
	var self = this;
	
	var newsFeedRequestName = appID + "__newsfeed_request_name__";
	
	var newestDate = null;
	var oldestDate = null;
	
	var lastItem = null;
	
	this.frame = $("<span/>");
	
	var list = $("<ul/>").attr({
		"class" : "messageList"
	}).appendTo(this.frame);
	
	this.updateFromServer = function (getOlder) {
		var data = {};
		$.extend(data,extraDataToSend);
		
		if(getOlder && newestDate != null && oldestDate != null) {
			data.olderThan = oldestDate-1;
		} else if(newestDate != null) {
			data.newerThan = newestDate+1;
		}
		
		if(!data.newerThan) {
			data.maxMessages = maxOlderMessagesFetch;			
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
	
	var responseHandler = new ResponseHandler(mailType,
			["mailList"],handleNewData);
	
	eWolf.serverRequest.registerRequest(newsFeedRequestName,this.updateFromServer);
	eWolf.serverRequest.registerHandler(newsFeedRequestName,responseHandler.getHandler());
	eWolf.serverRequest.bindRequest(newsFeedRequestName,appID);
	
	var showMore = new ShowMore(function() {
		eWolf.serverRequest.request(appID,self.updateFromServer (true),
				responseHandler.getHandler());
	}).appendTo(this.frame);
	
	function handleNewData(data, textStatus, postData) {
		$.each(data.mailList, function(j, mailItem) {
			self.addItem(mailItem.senderID,mailItem.senderName,
					mailItem.timestamp, mailItem.mail);
		});
		
		if ( (!postData.newerThan) &&
				data.mailList.length < postData.maxMessages) {
			showMore.hide();
		} else if( (!postData.newerThan) && (!postData.olderThan)
				&& data.mailList.length >= postData.maxMessages) {
			showMore.show();
		}
	}
	
	this.appendTo = function (canvas) {
		self.frame.appendTo(canvas);
		return self;
	};
	
	this.destroy = function() {
		self.frame.remove();
		delete self;
	};
	
	return this;
};

var NewsFeedList = function (appID,serverSettings) {
	var pow = "<img src='wolf-paw.svg' height='18px' style='padding-right:5px;'></img>";
	GenericMailList.call(this,"newsFeed",appID,serverSettings,
			eWolf.NEWSFEED_MAX_OLDER_MESSAGES_FETCH,
			"postListItem","postBox",pow,false);
	
	return this;
};

var WolfpackNewsFeedList = function (appID,wolfpack) {
	var newsFeedRequestObj = {
		newsOf:"wolfpack"
	};
	
	if(wolfpack != null) {
		newsFeedRequestObj.wolfpackName = wolfpack;
	}
	
	NewsFeedList.call(this,appID,newsFeedRequestObj);
	
	return this;
};

var ProfileNewsFeedList = function (appID,profileID) {
	var newsFeedRequestObj = {
		newsOf:"user"
	};
	
	if(profileID != eWolf.profile.getID()) {
		newsFeedRequestObj.userID = profileID;
	}
	
	NewsFeedList.call(this,appID,newsFeedRequestObj);
	
	return this;
};

var InboxList = function (appID) {	
	
	GenericMailList.call(this,"inbox",appID,{},
			eWolf.INBOX_MAX_OLDER_MESSAGES_FETCH,
			"messageListItem","messageBox", ">> ",true);
	
	return this;
};