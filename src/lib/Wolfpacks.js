WOLFPACK_CONSTANTS = {
	WOLFPACK_APP_PREFIX : "wolfpack:"
};

var Wolfpacks = function (menuList,applicationFrame) {
	var self = this;
	$.extend(this,WOLFPACK_CONSTANTS);
	
	var request = new PostRequestHandler("eWolf","/json",0);
	
	var wolfpacksApps = {},
		knownUsersMapByID = {},
		UID = 100;
	
	this.wolfpacksArray = [];
	this.knownUsersFullDescriptionArray = [];
	this.knownUsersIDArray = [];
	
	request.register(function() {
		return {
			 wolfpacks:{}
		};
	},new ResponseHandler("wolfpacks",["wolfpacksList"],handleWolfpacks).getHandler());
	
	request.register(function() {
		return {
			wolfpackMembers:{}
		};
	},new ResponseHandler("wolfpackMembers",["membersList"],handleMembers).getHandler());
	
	function handleWolfpacks(data, textStatus, postData) {
		$.each(data.wolfpacksList, function(i,pack){
			self.addWolfpack(pack);
		});
	}
	
	function handleMembers(data, textStatus, postData) {
		$.each(data.membersList, function(i,userObj){
			self.addKnownUsers(userObj.id,userObj.name);
		});
	}
	
	this.addWolfpack = function (pack) {
		if(wolfpacksApps[pack] == null) {
			var packID = self.WOLFPACK_APP_PREFIX + pack + "_" + UID;
			UID += 1;
			packID = packID.replace(/[^a-zA-Z0-9_:]/g,'_');
			menuList.addMenuItem(packID,pack);			
			var app = new WolfpackPage(packID,pack,applicationFrame);			
			
			wolfpacksApps[pack] = app;
			self.wolfpacksArray.push(pack);
		}
		
		return self;
	};
	
	this.getWolfpackAppID = function(pack) {
		var app = wolfpacksApps[pack];
		if(app) {
			return app.getId();
		} else {
			return null;
		}
	};
	
	this.removeWolfpack = function(pack) {
		if(wolfpacksApps[pack] != null) {
			menuList.removeMenuItem("__pack__"+pack);
			wolfpacksApps[pack].destroy();
			wolfpacksApps[pack] = null;
			
			var idx = wolfpacksArray.indexOf(pack);
			if(idx != -1){
				wolfpacksArray.splice(idx, 1);
			}
		}
		
		return self;
	};
	
	this.addKnownUsers = function(userID,userName) {
		if(knownUsersMapByID[userID] == null) {
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
			var request = new PostRequestHandler(userID,"/json",0).request({
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
	
	this.requestWolfpacks = function(onReady) {
		request.complete(onReady);
		request.requestAll();
	};	
	
	return this;
};



