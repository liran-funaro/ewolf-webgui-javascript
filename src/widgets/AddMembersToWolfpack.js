var AddMembersToWolfpack = function(fatherID,wolfpack, 
		existingMemebers,	onFinish) {
	var self = this;
	this.frame = $("<span/>");
	
	madeChanges = false;	

	addMembersQuery = new FriendsQueryTagList(400).appendTo(this.frame);
	
	$.each(existingMemebers, function(i, item) {
		addMembersQuery.addTagByQuery(item,false);
	});
	
	applyBtn = $("<input/>").attr({
		"type": "button",
		"value": "Apply"
	}).appendTo(this.frame);
	
	cancelBtn = $("<input/>").attr({
		"type": "button",
		"value": "Cancel"
	}).appendTo(this.frame);
	
	errorMessage = $("<div/>").addClass("errorArea").appendTo(this.frame);
	
	responseHandler = new ResponseHandler("addWolfpackMember",[],null);
	
	this.apply = function() {
		var itemsToAdd = addMembersQuery.tagList.match({removable:true});
		
		if(!addMembersQuery.isMissingField(true, "Please add new members...")) {
			applyBtn.hide(200);
			cancelBtn.hide(200);
			
			errorMessage.html("");
			
			eWolf.serverRequest.request(fatherID,{
				addWolfpackMember: {
					wolfpackNames: [wolfpack],
					userIDs: itemsToAdd.getData()
				}
			},responseHandler.getHandler());
		}		
		
		return self;
	};
	
	this.cancel = function() {
		if(onFinish != null) {
			onFinish();
		}
		
		self.frame.remove();
		
		if(madeChanges) {
			madeChanges = false;
			eWolf.serverRequest.requestAll(fatherID,true);
		}
		
		delete self;
	};
	
	this.success = function(data, textStatus, postData) {
		madeChanges = true;
		self.cancel();
	};
	
	this.wolfpackError = function(pos, response, textStatus, postData) {
		errorMessage.append(response.toString()+"<br>");
	};
	
	this.userSuccess = function(pos, response, textStatus, postData) {
		var itemID = postData.userIDs[pos];
		var item = addMembersQuery.tagList.match({id:itemID});
		
		madeChanges = true;
		item.unremovable().markOK();			
	};
	
	this.userError = function(pos, response, textStatus, postData) {
		var itemID = postData.userIDs[pos];
		var item = addMembersQuery.tagList.match({id:itemID});
		
		var errorMsg = "Failed to add: " + itemID +
					" with error: " + response.toString();
		errorMessage.append(errorMsg+"<br>");
			
		item.markError(errorMsg);
	};
	
	this.error = function(response, textStatus, postData) {		
		if(!response.isSuccess() && !response.isGeneralError()) {
			errorMessage.append("Unknown error...<br>");
		}
	};
	
	this.complete = function (textStatus, postData) {
		if(madeChanges) {
			madeChanges = false;
			eWolf.serverRequest.requestAll(fatherID,true);
		}
		
		applyBtn.show(200);
		cancelBtn.show(200);
	};
	
	applyBtn.click(this.apply);	
	cancelBtn.click(this.cancel);
	
	responseHandler
		.success(this.success)	
		.error(this.error)	
		.complete(this.complete)
		.addResponseArray("wolfpacksResult",
				RESPONSE_ARRAY_CONDITION_GENRAL_ERROR,
				null,this.wolfpackError)
		.addResponseArray("usersResult",
				RESPONSE_ARRAY_CONDITION_GENRAL_ERROR,
				this.userSuccess, this.userError);
	
	return this;
};