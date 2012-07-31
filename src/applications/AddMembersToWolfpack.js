var AddMembersToWolfpack = function(fatherID,wolfpack, existingMemebers,
		onFinish,request) {
	var thisObj = this;
	this.frame = $("<span/>");
	
	var madeChanges = false;

	addMembersQuery = new FriendsSearchList(400).appendTo(this.frame);
	
	$.each(existingMemebers, function(i, item) {
		addMembersQuery.addTag(item,false);
	});
	
	var applyBtn = $("<input/>").attr({
		"type": "button",
		"value": "Apply"
	}).click(apply).appendTo(this.frame);
	
	var cancelBtn = $("<input/>").attr({
		"type": "button",
		"value": "Cancel"
	}).click(cancel).appendTo(this.frame);
	
	var errorMessage = $("<div/>").attr("class","errorArea").appendTo(this.frame);
	
	function apply() {
		if(addMembersQuery.removableTagCount() <= 0) {
			errorMessage.html("Please add new members...");
			return false;
		}
		
		applyBtn.hide(200);
		cancelBtn.hide(200);
		
		errorMessage.html("");
		
		var idsToAdd = [];
		
		addMembersQuery.foreachRemovableTag(function(term) {
			idsToAdd.push(term);
		});
		
		var responseHandler = new ResponseHandler("addWolfpackMember",[],null);
		
		responseHandler.success(function(data, textStatus, postData) {
			madeChanges = true;
			cancel();
		});
		
		responseHandler.error(function(data, textStatus, postData) {
			var errorMsg = null;
			
			if(data.wolfpacksResult == null) {
				console.log("No wolfpacksResult in response");
			} else if(data.wolfpacksResult[0] != "success") {
				errorMsg = "Error: " + data.wolfpacksResult[0];
				errorMessage.append(errorMsg+"<br>");
			}
			
			if(data.usersResult == null) {
				console.log("No usersResult in response");
			} else {
				$.each(data.usersResult, function(i, item) {
					if(item == "success") {
						madeChanges = true;
						sendToQuery.removeTag(postData.userID[i]);
					} else {
						var errorMsg = "Failed to add: " +
								postData.userID[i] +
								" with error: " + item;
						errorMessage.append(errorMsg+"<br>");
						
						sendToQuery.markTag(item,errorMsg);	
					}					
				});
			}
			
			if(errorMsg == null) {
				errorMessage.append("Unknown error...<br>");
			}			
		});
		
		responseHandler.complete(function (textStatus, postData) {
			if(madeChanges) {
				madeChanges = false;
				eWolf.trigger("needRefresh."+fatherID);
			}
			
			applyBtn.show(200);
			cancelBtn.show(200);
		});
		
		request.request({
			addWolfpackMember: {
				wolfpackName: [wolfpack],
				userID: idsToAdd
			}
		},responseHandler.getHandler());
	}
	
	function cancel() {
		if(onFinish != null) {
			onFinish();
		}
		
		thisObj.frame.remove();
		
		if(madeChanges) {
			eWolf.trigger("needRefresh."+fatherID);
		}
		
		delete thisObj;
	}
	
	return this;
};