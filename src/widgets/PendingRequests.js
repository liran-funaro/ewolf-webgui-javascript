var PendingRequests = function (insideContext) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	var approved = [],
			approveMe = [],
			pendingApproval = [],
			requestApproval = [];
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.context = $("<div/>")
				.addClass("title-bar")
				.appendTo(insideContext);
	
	var pendingRequestImage = $("<img/>").attr({
		"src": "user-add.png",
	})	.css({
		"width" : "28px",
		"height" : "28px"
	})	.addClass("pendingNotificationImage")
			.appendTo(this.context);
	
	var blockedImage = $("<img/>").attr({
		"src": "user-blocking.png",
	})	.css({
		"width" : "32px",
		"height" : "28px"
	})	.addClass("pendingNotificationImage")
			.appendTo(this.context);
	
	var pendingCount = new Notification(this.context, pendingRequestImage, 6, 1)
					.setCounter(0);
	
	var blockingCount = new Notification(this.context, blockedImage, 6, 6)
					.setCounter(0);
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	this.handleApproved = function(response, textStatus, postData) {
		approved = [];
		$.each(response.membersList, function(i,userObj){
			eWolf.members.addKnownUsers(userObj.id,userObj.name);
			approved.push(userObj.id);
		});
	};
	
	this.handleApprovedMe = function(response, textStatus, postData) {
		approveMe = [];
		$.each(response.membersList, function(i,userObj){
			eWolf.members.addKnownUsers(userObj.id,userObj.name);
			approveMe.push(userObj.id);
		});
	};
	
	this.updateNotifications = function () {
		var res = compareMissingInArrays(approved, approveMe);
		
		pendingApproval = res.missingIn1;
		requestApproval = res.missingIn2;
		
		var pendingApprovalCount = pendingApproval.length,
				requestApprovalCount = requestApproval.length;
		
		if(pendingApprovalCount > 0 && pendingCount.getCounter() <= 0) {
			pendingRequestImage.animate({
				opacity : 0.7
			}, 300);
		} else if(pendingApprovalCount <= 0 && pendingCount.getCounter() > 0){
			pendingRequestImage.animate({
				opacity : 0.2
			}, 300);
		}
		
		if(requestApprovalCount > 0 && blockingCount.getCounter() <= 0) {
			blockedImage.animate({
				opacity : 0.7
			}, 300);
		} else if(requestApprovalCount <= 0 && blockingCount.getCounter() > 0){
			blockedImage.animate({
				opacity : 0.2
			}, 300);
		}

		pendingCount.setCounter(pendingApprovalCount);
		blockingCount.setCounter(requestApprovalCount);
		
		eWolf.notificationCount = pendingApprovalCount + requestApprovalCount;
		eWolf.updateTitle();
	};
	
	this.appendTo = function(somthing) {
		if(self.context) {
			self.context.appendTo(somthing);
		}
	};
	
	eWolf.serverRequest.bindRequest(eWolf.APPROVED_MEMBERS_REQUEST_NAME);
	
	eWolf.serverRequest.registerHandler(eWolf.APPROVED_MEMBERS_REQUEST_NAME,
			new ResponseHandler(
					eWolf.REQUEST_CATEGORY_WOLFPACK_MEMBERS_ALIAS1,
					["membersList"],
				this.handleApproved).getHandler());
	
	eWolf.serverRequest.registerHandler(eWolf.APPROVED_MEMBERS_REQUEST_NAME,
			new ResponseHandler(
					eWolf.REQUEST_CATEGORY_WOLFPACK_MEMBERS_ALIAS2,
					["membersList"],
				this.handleApprovedMe).getHandler());
	
	eWolf.serverRequest.addOnComplete(null,function(appID, response, status) {
		self.updateNotifications();
	});
	
	pendingRequestImage.click(function() {
		if(pendingApproval.length > 0) {
			var widget = new UserList(pendingApproval, 400,	"add >>", 
					function(userID) {
						return new AddToWolfpack(null, userID, 
								[eWolf.APPROVED_ME_WOLFPACK_NAME]).context;
					}, 200);
			new Popup(document.body, pendingRequestImage, "bottom-left", 
					null, {left: 0, top: 3})
						.append(widget.context)
						.start();
		}		
	});
	
	blockedImage.click(function() {
		if(requestApproval.length > 0) {
			var widget = new UserList(requestApproval, 400,	"send a message", 
					function(userID) {
						new NewMessage(eWolf.selectedApp,
								eWolf.applicationFrame,userID).select();
						return null;
					},0);
			new Popup(document.body, blockedImage, "bottom-left", 
					null, {left: 0, top: 3})
						.append(widget.context)
						.start();
		}		
	});
	
	return this;
};

function compareMissingInArrays (arr1, arr2) {
	arr1.sort();
	arr2.sort();
	
	var len1 = arr1.length,
			len2 = arr2.length,
			i = 0,
			j = 0,
			missingIn1 = [],
			missingIn2 = [];
	
	while(i < len1 && j < len2) {
		if(arr1[i] == arr2[j]) {
			i++;
			j++;
		} else if(arr1[i] < arr2[j]) {
			missingIn2.push(arr1[i]);
			i++;
		} else {
			missingIn1.push(arr2[j]);
			j++;
		}
	}
	
	if(i < len1) {
		missingIn2 = missingIn2.concat(arr1.slice(i,len1));
	}
	
	if(j < len2) {
		missingIn1 = missingIn1.concat(arr2.slice(j,len2));
	}
	
	return {
		missingIn1 : missingIn1,
		missingIn2 : missingIn2
	};
}