var Members = function() {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	this.knownUsersFullDescriptionArray = [];
	this.knownUsersIDArray = [];
	var knownUsersMapByID = {};
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	var membersResponseHandler = new ResponseHandler("wolfpackMembers",
			["membersList"],handleMembers);
	
	eWolf.serverRequest.registerRequest(eWolf.MEMBERS_REQUEST_NAME,
			function() {
				return { wolfpackMembers : {}	};
			});
	
	eWolf.serverRequest.registerHandler(eWolf.MEMBERS_REQUEST_NAME,
			membersResponseHandler.getHandler());
	
	eWolf.serverRequest.bindRequest(eWolf.MEMBERS_REQUEST_NAME,
			eWolf.FIRST_EWOLF_LOGIN_REQUEST_ID);
	
	function handleMembers(data, textStatus, postData) {
		$.each(data.membersList, function(i,userObj){
			self.addKnownUsers(userObj.id,userObj.name);
		});
	}
	
	this.addKnownUsers = function(userID,userName) {
		if(!knownUsersMapByID[userID]) {
			knownUsersMapByID[userID] = userName;
			var fullDesc = userName+" ("+userID+")";
			self.knownUsersFullDescriptionArray.push(fullDesc);
			self.knownUsersIDArray.push(userID);
			
			eWolf.trigger("foundNewUser",[userID,userName,fullDesc]);
		}		
		
		return self;
	};
	
	this.getUserFromFullDescription = function (fullDescription) {
		var idx = self.knownUsersFullDescriptionArray.indexOf(fullDescription);
		if(idx != -1){
			return self.knownUsersIDArray[idx];
		} else {
			return null;
		}
	};
	
	this.getUserName = function (userID, onReady) {
		var itsName = knownUsersMapByID[userID];
		if(!itsName && onReady) {
			eWolf.serverRequest.request(null,{
						profile: {
							userID: userID
						}
					  },
					new ResponseHandler("profile",["name"],
							function(data, textStatus, postData) {
						self.addKnownUsers(userID,data.name);
						onReady(data.name);
					}).getHandler());
		}
		
		return itsName;
	};
	
	return this;
};