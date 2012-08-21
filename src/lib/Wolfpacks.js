WOLFPACK_CONSTANTS = {
	WOLFPACK_APP_PREFIX : "wolfpack:"
};

var Wolfpacks = function (menuList,applicationFrame) {
	var self = this;
	$.extend(this,WOLFPACK_CONSTANTS);
	
	var request = new PostRequestHandler("eWolf","/json",0);
	
	var wolfpacksApps = {},
		friendsMapByName = {},
		friendsMapByID = {},
		UID = 100;
	
	this.wolfpacksArray = [];
	this.friendsNameArray = [];
	
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
			self.addFriend(userObj.id,userObj.name);
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
	
	this.addFriend = function(userID,userName) {
		if(friendsMapByName[userName] == null) {
			friendsMapByName[userName] = userID;
			friendsMapByID[userID] = userName;
			self.friendsNameArray.push(userName);
		}		
		
		return self;
	};
	
	this.removeFriend = function(userID,userName) {
		friendsMapByName[userName] = null;
		friendsMapByID[userID] = null;
		
		var idx = self.friendsNameArray.indexOf(userName);
		if(idx != -1){
			self.friendsNameArray.splice(idx, 1);
		}
		
		return self;
	};
	
	this.getFriendID = function (userName) {
		return friendsMapByName[userName];
	};
	
	this.getFriendName = function (userID) {
		return friendsMapByID[userID];
	};
	
	this.requestWolfpacks = function(onReady) {
		request.complete(onReady);
		request.requestAll();
	};	
	
	return this;
};



