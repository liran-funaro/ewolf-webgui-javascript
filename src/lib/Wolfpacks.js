var Wolfpacks = function (menuList,request,applicationFrame) {
	var self = this;
	
	var wolfpacksApps = {},
		friendsMapByName = {},
		friendsMapByID = {};
	
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
		
	this.addWolfpack = function (pack) {
		if(wolfpacksApps[pack] == null) {		
			menuList.addMenuItem("__pack__"+pack,pack);			
			var app = new WolfpackPage("__pack__"+pack,pack,applicationFrame);			
			
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
	
	return this;
};



